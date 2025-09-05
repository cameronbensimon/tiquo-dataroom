import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await signOut();

    return NextResponse.json(
      { success: true, message: 'Signed out successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('[API] Sign out error:', error);
    return NextResponse.json(
      { error: 'An error occurred during sign out.' },
      { status: 500 }
    );
  }
}
