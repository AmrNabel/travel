import { NextRequest, NextResponse } from 'next/server';

import { adminAuth } from '@/lib/firebase-admin';

const SESSION_COOKIE_NAME = 'session';
const TWO_WEEKS_IN_MS = 1000 * 60 * 60 * 24 * 14;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const idToken = body?.idToken as string | undefined;

    if (!idToken) {
      return NextResponse.json(
        { error: 'Missing idToken in request body' },
        { status: 400 },
      );
    }

    const expiresIn = TWO_WEEKS_IN_MS;

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn / 1000,
    });

    return response;
  } catch (error) {
    console.error('Error creating session cookie:', error);

    return NextResponse.json(
      { error: 'Unable to create session cookie' },
      { status: 500 },
    );
  }
}

