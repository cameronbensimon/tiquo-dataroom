import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';
import { Resend } from 'resend';

const resend = new Resend(process.env.AUTH_RESEND_KEY!);

// Get client IP for logging
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIP || 'unknown';
}

// Send admin notification when access is requested
async function sendAdminAccessNotification(requestingEmail: string, clientIP: string): Promise<void> {
  const adminEmails = ['josh@tiquo.co', 'cameron@tiquo.co'];
  
  try {
    await resend.emails.send({
      from: 'Tiquo DataRoom <noreply@tiquo.app>',
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
    
    console.log(`[API] Admin notification sent for access request: ${requestingEmail}`);
  } catch (error) {
    console.error('[API] Failed to send admin notification:', error);
  }
}

// Send confirmation to user that access request was received
async function sendAccessRequestConfirmation(requestingEmail: string): Promise<void> {
  try {
    await resend.emails.send({
      from: 'Tiquo DataRoom <noreply@tiquo.app>',
      to: [requestingEmail],
      subject: 'DataRoom Access Request Received',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://dataroom.tiquo.co/tiquo%20logo.svg" alt="Tiquo Logo" style="width: 80px; height: 80px;" />
          </div>
          <h2 style="color: #2563EB; margin-bottom: 20px; text-align: center;">Access Request Received</h2>
          
          <p style="font-size: 16px; margin-bottom: 20px; text-align: center; color: #1F2937;">
            Thank you for your interest in accessing the Tiquo DataRoom.
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
      text: `Access Request Received\n\nThank you for your interest in accessing the Tiquo DataRoom.\n\nWhat happens next?\n- Your access request has been forwarded to our team\n- We will review your request within 1-2 business days\n- You'll receive an email notification once access is granted\n- If approved, you'll be able to access the DataRoom immediately\n\nRequest Details:\nEmail: ${requestingEmail}\nDate: ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC\n\nIf you have questions, contact us at hello@tiquo.co`,
    });
    
    console.log(`[API] Access request confirmation sent to: ${requestingEmail}`);
  } catch (error) {
    console.error('[API] Failed to send access request confirmation:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if user already has access
    if (session.user.accessAllowed) {
      return NextResponse.json(
        { error: 'You already have access to the DataRoom' },
        { status: 400 }
      );
    }

    const clientIP = getClientIP(request);
    const userEmail = session.user.email;

    console.log(`[API] Processing access request from: ${userEmail} (IP: ${clientIP})`);

    // Send notifications asynchronously
    Promise.all([
      sendAdminAccessNotification(userEmail, clientIP),
      sendAccessRequestConfirmation(userEmail)
    ]).catch(error => {
      console.error('[API] Error sending access request notifications:', error);
    });

    return NextResponse.json({
      success: true,
      message: 'Access request submitted successfully. You will receive a confirmation email shortly.',
      email: userEmail
    });

  } catch (error) {
    console.error('[API] Access request error:', error);
    return NextResponse.json(
      { error: 'An error occurred processing your request. Please try again.' },
      { status: 500 }
    );
  }
}
