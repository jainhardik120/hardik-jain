import { prisma } from '@/lib/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { sendSESEmail } from '@/lib/sendMail';
import { default as LoginRequestMail } from '@/emails/login-request';
import { LoginSchema } from '@/types/schemas';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import type { Session } from 'next-auth';
import { CredentialsSignin, type NextAuthConfig } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { ACCESS_TOKEN_AGE, obtainRefreshTokenForUser, refreshAccessToken } from './token';

export enum ErrorCode {
  INVALID_CREDENTIALS = 'invalid_credentials',
  USER_NOT_FOUND = 'user_not_found',
  EMAIL_NOT_VERIFIED = 'email_not_verified',
  INVALID_REQUEST = 'invalid_request',
}

class CustomError extends CredentialsSignin {
  public override code: ErrorCode;
  public constructor(code: ErrorCode, message?: string) {
    super(message ?? 'An error occurred during the sign-in process');
    this.code = code;
    this.name = 'CustomError';
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: 'email',
      name: 'Email',
      type: 'email',
      maxAge: 60 * 60 * 24,
      sendVerificationRequest: async (props): Promise<void> => {
        await sendSESEmail(
          [props.identifier],
          'New login request',
          LoginRequestMail({ resetLink: props.url }),
        );
      },
    },
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'jsmith@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          throw new CustomError(ErrorCode.INVALID_REQUEST);
        }
        const { email, password } = validatedFields.data;
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        if (!existingUser || !existingUser.email) {
          throw new CustomError(ErrorCode.USER_NOT_FOUND);
        }
        if (existingUser.password === undefined || existingUser.password === null) {
          throw new CustomError(ErrorCode.INVALID_CREDENTIALS);
        }
        if (!existingUser.emailVerified) {
          throw new CustomError(ErrorCode.EMAIL_NOT_VERIFIED);
        }
        const passwordsMatch = await bcrypt.compare(password, existingUser.password);
        if (passwordsMatch) {
          return existingUser;
        }
        throw new CustomError(ErrorCode.INVALID_CREDENTIALS);
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
  session: {
    strategy: 'jwt',
  },
  events: {
    linkAccount: async ({ user }): Promise<void> => {
      await prisma.user.update({
        where: { id: user.id ?? '', email: user.email ?? '' },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    signIn: async ({ user, account }): Promise<boolean> => {
      if (account?.provider !== 'credentials') {
        return true;
      }
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id as string },
      });
      if (!existingUser?.emailVerified) {
        return false;
      }

      return true;
    },
    jwt: async ({ token, user }): Promise<JWT> => {
      if (user !== undefined) {
        const userId = token.sub as string;
        const existingUser = await prisma.user.findUnique({
          where: { id: userId },
        });
        if (!existingUser) {
          return token;
        }
        const existingAccount = await prisma.account.findFirst({
          where: { userId: existingUser.id },
        });
        token.role = existingUser.role;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.refreshToken = (await obtainRefreshTokenForUser(userId)).id;
        token['expiresAt'] = new Date(Date.now() + ACCESS_TOKEN_AGE);
        token.isOAuth = !!existingAccount;
      }
      const expiresAt = token['expiresAt'] as Date;
      if (expiresAt < new Date()) {
        return token;
      }
      return refreshAccessToken(token);
    },
    session: async ({ token, session }): Promise<Session> => {
      if (token.sub !== null && token.sub !== undefined) {
        session.user.id = token.sub;
      }
      if (token.role !== null && token.role !== undefined) {
        session.user.role = token.role;
      }
      if (token.name !== null && token.name !== undefined) {
        session.user.name = token.name;
      }
      session.user.email = token.email as string;
      return session;
    },
  },
} satisfies NextAuthConfig;
