import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect('/?error=no_code');
    }

    // Exchange the code for an access token
    const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_ENDAOMENT_API_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.ENDAOMENT_CLIENT_ID,
        client_secret: process.env.ENDAOMENT_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_ENDAOMENT_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    // Set the access token in a secure cookie
    const response = NextResponse.redirect('/');
    response.cookies.set('session', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    return NextResponse.redirect('/?error=auth_failed');
  }
} 