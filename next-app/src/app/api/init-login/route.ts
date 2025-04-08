import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the Endaoment OAuth URL from environment variables
    const endaomentApiUrl = process.env.NEXT_PUBLIC_ENDAOMENT_API_URL;
    const redirectUri = process.env.NEXT_PUBLIC_ENDAOMENT_REDIRECT_URI;

    if (!endaomentApiUrl || !redirectUri) {
      throw new Error('Missing required environment variables');
    }

    // Construct the OAuth URL
    const oauthUrl = `${endaomentApiUrl}/oauth/authorize?` + new URLSearchParams({
      client_id: process.env.ENDAOMENT_CLIENT_ID || '',
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'read write',
    });

    // Redirect to Endaoment's OAuth page
    return NextResponse.redirect(oauthUrl);
  } catch (error) {
    console.error('Error initializing login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 