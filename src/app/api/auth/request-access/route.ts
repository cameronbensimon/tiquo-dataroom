import { NextResponse } from 'next/server';
import { getCurrentSession, sendAccessRequestNotifications } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Get the current session
    const session = await getCurrentSession();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // User is requesting access - log this for admin review
    console.log(`[ACCESS REQUEST] User ${session.user.email} requested access at ${new Date().toISOString()}`);
    
    // Send email notifications to admins and requester
    await sendAccessRequestNotifications(session.user.email);
    
    return NextResponse.json({
      success: true,
      message: 'Your access request has been submitted and is being reviewed. You will receive a confirmation email shortly.'
    });
    
  } catch (error) {
    console.error('[REQUEST ACCESS ERROR]:', error);
    return NextResponse.json(
      { error: 'Failed to process access request' },
      { status: 500 }
    );
  }
}
