import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        { user: null, isAuthenticated: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        user: {
          id: session.user.id,
          email: session.user.email,
          accessAllowed: session.user.accessAllowed,
          isAdmin: session.user.isAdmin,
          emailVerified: session.user.emailVerified,
        },
        isAuthenticated: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[API] Get session error:', error);
    return NextResponse.json(
      { user: null, isAuthenticated: false },
      { status: 200 }
    );
  }
}
