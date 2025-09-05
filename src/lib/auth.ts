import { cookies } from 'next/headers';
import { Resend } from 'resend';
import crypto from 'crypto';
import { db } from './db';
import * as schema from './db/schema';
import { eq, lt } from 'drizzle-orm';

const resend = new Resend(process.env.AUTH_RESEND_KEY!);

// Security configurations
const SECURITY_CONFIG = {
  // Verification codes expire in 15 minutes
  CODE_EXPIRY_MS: 15 * 60 * 1000,
  // Sessions last 4 hours
  SESSION_EXPIRY_MS: 4 * 60 * 60 * 1000,
  // Rate limiting: 5 attempts per 15 minutes per IP
  RATE_LIMIT_ATTEMPTS: 5,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
  // Admin emails
  ADMIN_EMAILS: ['josh@tiquo.co', 'cameron@tiquo.co'],
};

// Types
export interface User {
  id: string;
  email: string;
  accessAllowed: boolean;
  isAdmin?: boolean;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  userId: string;
  sessionToken: string;
  expires: Date;
  user: User;
}


// Generate 6-digit numeric code for email verification
function generateVerificationCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Generate secure session token
function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Hash sensitive data (like session tokens for storage)
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { attempts: number; resetTime: number }>();

// Rate limiting check
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const key = identifier;
  const limit = rateLimitStore.get(key);

  if (!limit) {
    rateLimitStore.set(key, { attempts: 1, resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (now > limit.resetTime) {
    rateLimitStore.set(key, { attempts: 1, resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (limit.attempts >= SECURITY_CONFIG.RATE_LIMIT_ATTEMPTS) {
    return false;
  }

  limit.attempts++;
  return true;
}

// Clean up expired rate limits
setInterval(() => {
  const now = Date.now();
  for (const [key, limit] of rateLimitStore.entries()) {
    if (now > limit.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

// Get client IP for rate limiting
function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIP || 'unknown';
}

// Send admin notification when access is requested
async function sendAdminAccessNotification(requestingEmail: string, clientIP: string): Promise<void> {
  const adminEmails = SECURITY_CONFIG.ADMIN_EMAILS;
  
  try {
    await resend.emails.send({
      from: 'Tiquo Data Room <noreply@tiquo.app>',
      to: adminEmails,
      subject: `DataRoom Access Request from ${requestingEmail}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://dataroom.tiquo.co/tiquo%20logo.svg" alt="Tiquo Logo" style="width: 80px; height: 80px;" />
          </div>
          <h2 style="color: #DC2626; margin-bottom: 20px; text-align: center;">New DataRoom Access Request</h2>
          
          <div style="background: #FEF2F2; border: 1px solid #FECACA; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; margin-bottom: 10px; color: #1F2937;">
              <strong>Requesting Email:</strong> ${requestingEmail}
            </p>
            <p style="font-size: 16px; margin-bottom: 10px; color: #1F2937;">
              <strong>Request Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC
            </p>
            <p style="font-size: 16px; margin-bottom: 10px; color: #1F2937;">
              <strong>IP Address:</strong> ${clientIP}
            </p>
            <p style="font-size: 16px; margin: 0; color: #1F2937;">
              <strong>Status:</strong> Pending Admin Review
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://dataroom.tiquo.co/admin" 
               style="display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
              Review & Manage Access
            </a>
          </div>
          
          <div style="background: #F3F4F6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="font-size: 14px; margin: 0; color: #6B7280; text-align: center;">
              This is an automated security notification. Please review and approve/deny access through the admin panel.
            </p>
          </div>
        </div>
      `,
      text: `New DataRoom Access Request\n\nRequesting Email: ${requestingEmail}\nRequest Time: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC\nIP Address: ${clientIP}\n\nPlease review and manage access at: https://dataroom.tiquo.co/admin`,
    });
    
    console.log(`[AUTH] Admin notification sent for access request: ${requestingEmail}`);
  } catch (error) {
    console.error('[AUTH] Failed to send admin notification:', error);
  }
}

// Send confirmation to user that access request was received
async function sendAccessRequestConfirmation(requestingEmail: string): Promise<void> {
  try {
    await resend.emails.send({
      from: 'Tiquo Data Room <noreply@tiquo.app>',
      to: [requestingEmail],
      subject: 'DataRoom Access Request Received',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://dataroom.tiquo.co/tiquo%20logo.svg" alt="Tiquo Logo" style="width: 80px; height: 80px;" />
          </div>
          <h2 style="color: #2563EB; margin-bottom: 20px; text-align: center;">Access Request Received</h2>
          
          <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #1F2937;">
            Thank you for your interest in accessing the Tiquo Data Room.
          </p>
          
          <div style="background: #EFF6FF; border: 1px solid #BFDBFE; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1E40AF; margin-top: 0;">What happens next?</h3>
            <ul style="color: #374151; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Your access request has been forwarded to our team</li>
              <li style="margin-bottom: 8px;">We will review your request within 1-2 business days</li>
              <li style="margin-bottom: 8px;">You'll receive an email notification once access is granted</li>
              <li>If approved, you'll be able to access the DataRoom immediately</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              <strong>Request Details:</strong><br/>
              Email: ${requestingEmail}<br/>
              Date: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC
            </p>
          </div>
          
          <div style="background: #F3F4F6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="font-size: 14px; margin: 0; color: #6B7280; text-align: center;">
              If you have any questions, please contact us at <a href="mailto:hello@tiquo.co" style="color: #2563EB;">hello@tiquo.co</a>
            </p>
          </div>
        </div>
      `,
      text: `Access Request Received\n\nThank you for your interest in accessing the Tiquo Data Room.\n\nWhat happens next?\n- Your access request has been forwarded to our team\n- We will review your request within 1-2 business days\n- You'll receive an email notification once access is granted\n- If approved, you'll be able to access the DataRoom immediately\n\nRequest Details:\nEmail: ${requestingEmail}\nDate: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC\n\nIf you have questions, contact us at hello@tiquo.co`,
    });
    
    console.log(`[AUTH] Access request confirmation sent to: ${requestingEmail}`);
  } catch (error) {
    console.error('[AUTH] Failed to send access request confirmation:', error);
  }
}

// Send secure verification email
export async function sendVerificationEmail(email: string, request: Request): Promise<{ success: boolean; error?: string }> {
  try {
    const clientIP = getClientIP(request);
    
    // Rate limiting
    if (!checkRateLimit(`email:${email}`)) {
      console.warn(`[SECURITY] Rate limit exceeded for email: ${email}`);
      return { success: false, error: 'Too many requests. Please wait before trying again.' };
    }
    
    if (!checkRateLimit(`ip:${clientIP}`)) {
      console.warn(`[SECURITY] Rate limit exceeded for IP: ${clientIP}`);
      return { success: false, error: 'Too many requests. Please wait before trying again.' };
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return { success: false, error: 'Invalid email format.' };
    }

    const verificationCode = generateVerificationCode();
    const hashedCode = hashToken(verificationCode);
    const expiresAt = new Date(Date.now() + SECURITY_CONFIG.CODE_EXPIRY_MS);

    // Store verification code in database (delete existing tokens first)
    await db.delete(schema.verificationTokens)
      .where(eq(schema.verificationTokens.identifier, normalizedEmail));
    
    await db.insert(schema.verificationTokens).values({
      identifier: normalizedEmail,
      token: hashedCode,
      expires: expiresAt,
    });

    // Check if user is admin for auto-approval
    const isAdmin = SECURITY_CONFIG.ADMIN_EMAILS.includes(normalizedEmail);

    // Send verification email
    const { error } = await resend.emails.send({
      from: 'Tiquo Data Room <noreply@tiquo.app>',
      to: [normalizedEmail],
                  subject: 'Your Secure DataRoom Access Code',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://dataroom.tiquo.co/tiquo%20logo.svg" alt="Tiquo Logo" style="width: 80px; height: 80px;" />
          </div>
                          <h2 style="color: #DC2626; margin-bottom: 20px; text-align: center;">Secure Access Code</h2>
          <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #1F2937;">
            Enter this code to securely access the Tiquo Data Room:
          </p>
          <div style="background: #FEF2F2; border: 2px solid #DC2626; padding: 25px; border-radius: 10px; text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #DC2626; font-family: monospace;">${verificationCode}</span>
          </div>
          <div style="background: #FEF2F2; padding: 15px; border-radius: 6px; margin: 20px 0;">
                              <p style="font-size: 14px; margin: 0; color: #991B1B; text-align: center;">
                    <strong>Security Notice:</strong> This code expires in 15 minutes. Never share this code with anyone.
                  </p>
          </div>
          <div style="background: #F3F4F6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="font-size: 12px; margin: 0; color: #6B7280; text-align: center;">
              Request from IP: ${clientIP}<br/>
              Time: ${new Date().toISOString()}<br/>
              If you didn't request access, please ignore this email and report to security@tiquo.co
            </p>
          </div>
        </div>
      `,
                  text: `Tiquo Data Room Access Code: ${verificationCode}\n\nSECURITY NOTICE:\n- This code expires in 15 minutes\n- Never share this code with anyone\n- Request from IP: ${clientIP}\n- If you didn't request this, report to security@tiquo.co\n\nEnter this code at: https://dataroom.tiquo.co/auth`,
    });

    if (error) {
      console.error('[AUTH] Failed to send email:', error);
      return { success: false, error: 'Failed to send verification email.' };
    }

    console.log(`[AUTH] Verification email sent to: ${normalizedEmail} (Admin: ${isAdmin})`);
    return { success: true };

  } catch (error) {
    console.error('[AUTH] Send verification email error:', error);
    return { success: false, error: 'An error occurred. Please try again.' };
  }
}

// Verify code and create session
export async function verifyCodeAndCreateSession(email: string, code: string, request: Request): Promise<{ success: boolean; sessionToken?: string; error?: string }> {
  try {
    const clientIP = getClientIP(request);
    
    // Rate limiting
    if (!checkRateLimit(`verify:${email}`)) {
      console.warn(`[SECURITY] Verify rate limit exceeded for: ${email}`);
      return { success: false, error: 'Too many verification attempts. Please wait.' };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedCode = hashToken(code);

    // Find and validate verification token
    const verificationToken = await db.query.verificationTokens.findFirst({
      where: eq(schema.verificationTokens.identifier, normalizedEmail),
    });

    if (!verificationToken) {
      console.warn(`[SECURITY] No verification token found for: ${normalizedEmail}`);
      return { success: false, error: 'Invalid or expired verification code.' };
    }

    // Check if token is expired
    if (new Date() > verificationToken.expires) {
      console.warn(`[SECURITY] Expired verification token for: ${normalizedEmail}`);
      // Clean up expired token
      await db.delete(schema.verificationTokens)
        .where(eq(schema.verificationTokens.identifier, normalizedEmail));
      return { success: false, error: 'Verification code has expired. Please request a new one.' };
    }

    // Verify the code
    if (verificationToken.token !== hashedCode) {
      console.warn(`[SECURITY] Invalid verification code for: ${normalizedEmail} from IP: ${clientIP}`);
      return { success: false, error: 'Invalid verification code.' };
    }

    // Check if user is admin
    const isAdmin = SECURITY_CONFIG.ADMIN_EMAILS.includes(normalizedEmail);

    // Find or create user
    let user = await db.query.users.findFirst({
      where: eq(schema.users.email, normalizedEmail),
    });

    if (!user) {
      // Create new user
      const [newUser] = await db.insert(schema.users).values({
        id: crypto.randomUUID(),
        email: normalizedEmail,
        accessAllowed: isAdmin, // Auto-approve admins
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }).returning();
      user = newUser;
      console.log(`[AUTH] Created new user: ${normalizedEmail} (Admin: ${isAdmin})`);
      
      // Send access request notifications for non-admin users
      if (!isAdmin) {
        console.log(`[AUTH] Sending access request notifications for: ${normalizedEmail}`);
        // Send notifications asynchronously to avoid blocking the response
        Promise.all([
          sendAdminAccessNotification(normalizedEmail, clientIP),
          sendAccessRequestConfirmation(normalizedEmail)
        ]).catch(error => {
          console.error('[AUTH] Error sending access request notifications:', error);
        });
      }
    } else {
      // Update existing user
      const wasAlreadyVerified = user.emailVerified !== null;
      
      await db.update(schema.users)
        .set({
          emailVerified: new Date(),
          accessAllowed: isAdmin ? true : user.accessAllowed, // Auto-approve admins
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, user.id));
      
      user.emailVerified = new Date();
      user.accessAllowed = isAdmin ? true : user.accessAllowed;
      console.log(`[AUTH] Updated user: ${normalizedEmail} (Admin: ${isAdmin}, Access: ${user.accessAllowed})`);
      
      // Send access request notifications for non-admin users who weren't previously verified
      if (!isAdmin && !wasAlreadyVerified && !user.accessAllowed) {
        console.log(`[AUTH] Sending access request notifications for returning user: ${normalizedEmail}`);
        // Send notifications asynchronously to avoid blocking the response
        Promise.all([
          sendAdminAccessNotification(normalizedEmail, clientIP),
          sendAccessRequestConfirmation(normalizedEmail)
        ]).catch(error => {
          console.error('[AUTH] Error sending access request notifications:', error);
        });
      }
    }

    // Clean up verification token
    await db.delete(schema.verificationTokens)
      .where(eq(schema.verificationTokens.identifier, normalizedEmail));

    // Create session
    const sessionToken = generateSessionToken();
    const hashedSessionToken = hashToken(sessionToken);
    const sessionExpires = new Date(Date.now() + SECURITY_CONFIG.SESSION_EXPIRY_MS);

    await db.insert(schema.sessions).values({
      sessionToken: hashedSessionToken,
      userId: user.id,
      expires: sessionExpires,
    });

    console.log(`[AUTH] Session created for: ${normalizedEmail} (IP: ${clientIP})`);
    return { success: true, sessionToken };

  } catch (error) {
    console.error('[AUTH] Verify code error:', error);
    return { success: false, error: 'An error occurred during verification.' };
  }
}

// Get session from token
export async function getSession(sessionToken: string): Promise<Session | null> {
  try {
    if (!sessionToken) return null;

    const hashedToken = hashToken(sessionToken);
    
    // Get session first
    const session = await db.query.sessions.findFirst({
      where: eq(schema.sessions.sessionToken, hashedToken),
    });

    if (!session) return null;

    // Check if session is expired
    if (new Date() > session.expires) {
      // Clean up expired session
      await db.delete(schema.sessions)
        .where(eq(schema.sessions.sessionToken, hashedToken));
      return null;
    }

    // Get user separately to avoid relationship issues
    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, session.userId),
    });

    if (!user?.email) return null;

    // Add isAdmin flag to user
    const userWithAdmin = {
      ...user,
      isAdmin: SECURITY_CONFIG.ADMIN_EMAILS.includes(user.email.toLowerCase()),
    } as User;

    return {
      ...session,
      user: userWithAdmin,
    };

  } catch (error) {
    console.error('[AUTH] Get session error:', error);
    return null;
  }
}

// Set secure session cookie
export async function setSessionCookie(sessionToken: string) {
  const cookieStore = await cookies();
  
  cookieStore.set('session-token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SECURITY_CONFIG.SESSION_EXPIRY_MS / 1000, // Convert to seconds
    path: '/',
  });
}

// Clear session cookie
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  
  cookieStore.set('session-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

// Get current session from cookies
export async function getCurrentSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session-token')?.value;
    
    if (!sessionToken) return null;
    
    return await getSession(sessionToken);
  } catch (error) {
    console.error('[AUTH] Get current session error:', error);
    return null;
  }
}

// Sign out (destroy session)
export async function signOut(sessionToken?: string): Promise<void> {
  try {
    let token = sessionToken;
    
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('session-token')?.value;
    }
    
    if (token) {
      const hashedToken = hashToken(token);
      await db.delete(schema.sessions)
        .where(eq(schema.sessions.sessionToken, hashedToken));
    }
    
    await clearSessionCookie();
    console.log('[AUTH] User signed out');
  } catch (error) {
    console.error('[AUTH] Sign out error:', error);
  }
}

// Send access granted notification to user
export async function sendAccessGrantedNotification(userEmail: string): Promise<void> {
  try {
    await resend.emails.send({
      from: 'Tiquo Data Room <noreply@tiquo.app>',
      to: [userEmail],
      subject: 'DataRoom Access Granted!',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://dataroom.tiquo.co/tiquo%20logo.svg" alt="Tiquo Logo" style="width: 80px; height: 80px;" />
          </div>
          <h2 style="color: #059669; margin-bottom: 20px; text-align: center;">Access Granted!</h2>
          
          <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #1F2937;">
            Great news! Your access to the Tiquo Data Room has been approved.
          </p>
          
          <div style="background: #ECFDF5; border: 1px solid #BBF7D0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #065F46; margin-top: 0;">You now have access to:</h3>
            <ul style="color: #374151; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Investor presentation deck</li>
              <li style="margin-bottom: 8px;">Company documents & cap table</li>
              <li style="margin-bottom: 8px;">Product & technology roadmap</li>
              <li>Brand guidelines & strategy materials</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://dataroom.tiquo.co/dashboard" 
               style="display: inline-block; background: #059669; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Access DataRoom Now
            </a>
          </div>
          
          <div style="background: #F3F4F6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="font-size: 14px; margin: 0; color: #6B7280; text-align: center;">
              Welcome to Tiquo! If you have any questions, contact us at <a href="mailto:hello@tiquo.co" style="color: #059669;">hello@tiquo.co</a>
            </p>
          </div>
        </div>
      `,
      text: `Access Granted!\n\nGreat news! Your access to the Tiquo Data Room has been approved.\n\nYou now have access to:\n- Investor presentation deck\n- Company documents & cap table\n- Product & technology roadmap\n- Brand guidelines & strategy materials\n\nAccess DataRoom: https://dataroom.tiquo.co/dashboard\n\nWelcome to Tiquo! Questions? Contact hello@tiquo.co`,
    });
    
    console.log(`[AUTH] Access granted notification sent to: ${userEmail}`);
  } catch (error) {
    console.error('[AUTH] Failed to send access granted notification:', error);
  }
}

// Clean up expired sessions and tokens (call periodically)
export async function cleanupExpiredData(): Promise<void> {
  try {
    const now = new Date();
    
    // Delete expired sessions
    await db.delete(schema.sessions)
      .where(lt(schema.sessions.expires, now));
    
    // Delete expired verification tokens
    await db.delete(schema.verificationTokens)
      .where(lt(schema.verificationTokens.expires, now));
    
    console.log('[AUTH] Cleaned up expired data');
  } catch (error) {
    console.error('[AUTH] Cleanup error:', error);
  }
}
