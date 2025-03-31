import { createClient } from '@hey-api/client-fetch';
import { decodeJwt } from 'jose';

import { OauthService } from '@/canva-client';
import { env } from '@/env';

import type { PrismaClient } from '@prisma/client';

export async function getAccessTokenForUser(id: string, prisma: PrismaClient): Promise<string> {
  const storedToken = await prisma.canvaUserToken.findFirst({
    where: {
      userId: id,
    },
  });
  if (!storedToken) {
    throw new Error('No token found for user');
  }
  const claims = decodeJwt(storedToken.accessToken);
  const refreshBufferSeconds = 60 * 10;
  if (claims.exp !== undefined) {
    const aBitBeforeExpirationSeconds = claims.exp - refreshBufferSeconds;
    const nowSeconds = Date.now() / 1000;
    if (nowSeconds < aBitBeforeExpirationSeconds) {
      return storedToken.accessToken;
    }
  }
  const refreshToken = storedToken.refreshToken;

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const result = await OauthService.exchangeAccessToken({
    client: getBasicAuthClient(),
    body: params,
    bodySerializer: (params: URLSearchParams) => params.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    baseUrl: env.BASE_CANVA_CONNECT_API_URL,
  });

  if (result.error !== undefined) {
    throw new Error(`Failed to refresh token ${result.error}`);
  }
  if (!result.data) {
    throw new Error(
      'No data returned when exchanging oauth code for token, but no error was returned either.',
    );
  }
  const refreshedToken = result.data;
  await prisma.canvaUserToken.updateMany({
    where: {
      userId: id,
    },
    data: {
      accessToken: refreshedToken.access_token,
      refreshToken: refreshedToken.refresh_token,
    },
  });

  return refreshedToken.access_token;
}

export function getUserClient(token: string) {
  const localClient = createClient({
    global: false,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    baseUrl: env.BASE_CANVA_CONNECT_API_URL,
  });

  return localClient;
}

export function getBasicAuthClient() {
  const credentials = `${env.CANVA_CLIENT_ID}:${env.CANVA_CLIENT_SECRET}`;
  const localClient = createClient({
    global: false,
    headers: {
      Authorization: `Basic ${Buffer.from(credentials).toString('base64')}`,
    },
    baseUrl: env.BASE_CANVA_CONNECT_API_URL,
  });

  return localClient;
}
