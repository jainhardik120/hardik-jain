import { prisma } from '@/lib/prisma';

import type { RefreshToken } from '@prisma/client';
import type { JWT } from 'next-auth/jwt';

const REFRESH_TOKEN_EXPIRY = 1000 * 60 * 60 * 24 * 7;
export const ACCESS_TOKEN_AGE = 1000 * 60 * 10;

async function generateRefreshToken(userId: string): Promise<RefreshToken> {
  return await prisma.refreshToken.create({
    data: {
      userId: userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    },
  });
}

async function extendRefreshToken(tokenId: string): Promise<RefreshToken> {
  return await prisma.refreshToken.update({
    where: {
      id: tokenId,
    },
    data: {
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY),
    },
  });
}

export async function obtainRefreshTokenForUser(userId: string): Promise<RefreshToken> {
  const existingToken = await prisma.refreshToken.findFirst({
    where: {
      userId: userId,
    },
  });
  if (existingToken === null) {
    return await generateRefreshToken(userId);
  }
  return extendRefreshToken(existingToken.id);
}

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: {
      id: token.refreshToken,
    },
  });
  if (refreshToken === null) {
    throw new Error('Refresh token not found');
  }
  if (new Date() > refreshToken.expiresAt) {
    throw new Error('Refresh token expired');
  }
  const updatedUser = await prisma.user.findUnique({
    where: {
      id: refreshToken.userId,
    },
  });
  if (updatedUser === null) {
    throw new Error('User not found');
  }
  const newToken = {
    ...token,
    expiresAt: new Date(Date.now() + ACCESS_TOKEN_AGE),
    role: updatedUser.role,
  };
  return newToken;
}
