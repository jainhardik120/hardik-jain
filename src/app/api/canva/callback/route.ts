import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { OauthService } from '@/canva-client';
import { getBasicAuthClient } from '@/lib/canva';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (code === null || state === null) {
    return NextResponse.json({ error: 'Invalid callback parameters' }, { status: 400 });
  }
  const session = await prisma.canvaSessionState.findUnique({
    where: { sessionId: state },
  });
  if (!session || session.expires < new Date()) {
    return NextResponse.json({ error: 'Invalid session state' }, { status: 400 });
  }
  const userId = session.userId;
  const { codeVerifier } = session;
  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code_verifier: codeVerifier,
      code: code,
    });
    const result = await OauthService.exchangeAccessToken({
      client: getBasicAuthClient(),
      body: params,
      bodySerializer: (params: URLSearchParams) => params.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (result.error !== undefined) {
      return Response.json(result.error, { status: result.response.status });
    }
    const tokens = result.data;
    if (!tokens) {
      throw new Error(
        'No token returned when exchanging oauth code for token, but no error was returned either.',
      );
    }
    await prisma.canvaUserToken.create({
      data: {
        userId: userId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      },
    });
    await prisma.canvaSessionState.delete({ where: { sessionId: state } });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
  redirect('/admin/media/images');
}
