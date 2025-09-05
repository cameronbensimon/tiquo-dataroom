import { NextRequest, NextResponse } from 'next/server';
import { verifyCodeAndCreateSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Validate input
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Verification code is required' },
        { status: 400 }
      );
    }

    // Verify code must be exactly 6 digits
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Invalid verification code format' },
        { status: 400 }
      );
    }

    const result = await verifyCodeAndCreateSession(email, code, request);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Set secure session cookie
    await setSessionCookie(result.sessionToken!);

    return NextResponse.json(
      { success: true, message: 'Authentication successful' },
      { status: 200 }
    );

  } catch (error) {
    console.error('[API] Verify code error:', error);
    return NextResponse.json(
      { error: 'An error occurred during verification.' },
      { status: 500 }
    );
  }
}
