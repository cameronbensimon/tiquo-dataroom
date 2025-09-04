import { Email } from "@convex-dev/auth/providers/Email";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
 
export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };
 
    const alphabet = "0123456789";
    const length = 6;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    // Use Resend REST API directly to avoid bundling issues
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Tiquo <noreply@tiquo.app>",
        to: [email],
        subject: "Your DataRoom Login Code",
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://dataroom.tiquo.co/tiquo%20logo.svg" alt="Tiquo Logo" style="width: 80px; height: 80px;" />
            </div>
            <h2 style="color: #4F46E5; margin-bottom: 20px; text-align: center;">Your Login Code</h2>
            <p style="font-size: 16px; margin-bottom: 20px; text-align: center;">
              Use this code to sign in to your DataRoom account:
            </p>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1F2937;">${token}</span>
            </div>
            <p style="font-size: 14px; color: #6B7280; text-align: center;">
              This code will expire in 15 minutes. If you didn't request this, please ignore this email.
            </p>
          </div>
        `,
        text: `Your DataRoom login code is: ${token}. This code will expire in 15 minutes.`,
      }),
    });
 
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }
  },
});
