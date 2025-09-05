import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession, sendAccessGrantedNotification } from '@/lib/auth';
import { updateUserAccess } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    
    if (!session || !session.user || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, accessAllowed } = body;

    if (!email || typeof accessAllowed !== 'boolean') {
      return NextResponse.json(
        { error: 'Email and accessAllowed are required' }, 
        { status: 400 }
      );
    }

    const result = await updateUserAccess(email, accessAllowed);
    
    // Send access granted notification if access was granted
    if (accessAllowed && result.success) {
      // Send notification asynchronously to avoid blocking the response
      sendAccessGrantedNotification(email).catch(error => {
        console.error('[API] Error sending access granted notification:', error);
      });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating user access:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
