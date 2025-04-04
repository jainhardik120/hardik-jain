import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';
import { CredentialsSignin, type NextAuthConfig, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import LoginRequestMail from '@/emails/login-request';
import { env } from '@/env';
import { prisma } from '@/lib/prisma';
import { sendSESEmail } from '@/lib/sendMail';
import { LoginSchema } from '@/types/schemas';

import { ErrorCode } from './ErrorCode';

import type { JWT } from 'next-auth/jwt';

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
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
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
        const passwordsMatch = await compare(password, existingUser.password);
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
    jwt: async ({ token }): Promise<JWT> => {
      if (token.sub === null || token.sub === undefined) {
        return token;
      }
      if (token.role !== undefined && token.role !== null && token.role.length > 0) {
        return token;
      }
      const existingUser = await prisma.user.findUnique({
        where: { id: token.sub },
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
      token.isOAuth = !!existingAccount;

      return token;
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
