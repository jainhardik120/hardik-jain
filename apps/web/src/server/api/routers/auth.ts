import { TRPCError } from '@trpc/server';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { string, object } from 'zod';

import ResetPasswordMail from '@/emails/reset-password';
import VerifyMailEmail from '@/emails/verify-email';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { prisma as db } from '@/lib/prisma';
import { sendSESEmail } from '@/lib/sendMail';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { auth } from '@/server/auth';
import { NewPasswordSchema, RegisterSchema, ResetSchema } from '@/types/schemas';

const appUrl = getBaseUrl();

const generateVerificationToken = async (email: string) => {
  const existingToken = await db.emailVerificationToken.findFirst({
    where: { email },
  });
  if (existingToken) {
    await db.emailVerificationToken.delete({
      where: { id: existingToken.id },
    });
  }
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  await db.emailVerificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  const confirmLink = `${appUrl}/auth/new-verification?token=${token}`;
  await sendSESEmail([email], 'Verify your email', VerifyMailEmail({ resetLink: confirmLink }));
};

const generatePasswordResetToken = async (email: string) => {
  const existingToken = await db.passwordResetToken.findFirst({
    where: {
      email,
    },
  });
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  const resetLink = `${appUrl}/auth/new-password?token=${token}`;
  await sendSESEmail([email], 'Reset your password', ResetPasswordMail({ resetLink }));
};

export const authRouter = createTRPCRouter({
  sessionDetails: publicProcedure.query(async () => {
    const session = await auth();

    return session;
  }),
  register: publicProcedure.input(RegisterSchema).mutation(async ({ ctx, input }) => {
    const validatedFields = RegisterSchema.safeParse(input);
    if (!validatedFields.success) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid fields!',
      });
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await hash(password, 10);
    let existingUser;
    try {
      existingUser = await ctx.db.user.findUnique({ where: { email } });
    } catch {
      existingUser = null;
    }
    if (existingUser) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Email already in use!',
      });
    }
    await ctx.db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    await generateVerificationToken(email);

    return { success: 'Confirmation email sent!' };
  }),
  sendVerificationEmail: publicProcedure.input(string()).mutation(async ({ ctx, input }) => {
    const email = input;
    const existingUser = await ctx.db.user.findUnique({ where: { email } });
    if (!existingUser) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Email does not exist!',
      });
    }
    if (existingUser.emailVerified) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Email already verified!',
      });
    }
    await generateVerificationToken(email);

    return { success: 'Confirmation email sent!' };
  }),
  verifyEmail: publicProcedure
    .input(object({ token: string() }))
    .mutation(async ({ ctx, input }) => {
      const { token } = input;
      const existingToken = await ctx.db.emailVerificationToken.findUnique({
        where: { token },
      });
      if (!existingToken) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Token does not exist.',
        });
      }
      const hasExpired = new Date(existingToken.expires) < new Date();
      if (hasExpired) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Token has expired.',
        });
      }
      const existingUser = await ctx.db.user.findUnique({
        where: { email: existingToken.email },
      });
      if (!existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Email does not exist.',
        });
      }
      await ctx.db.user.update({
        where: { id: existingUser.id },
        data: {
          emailVerified: new Date(),
          email: existingToken.email,
        },
      });
      await ctx.db.emailVerificationToken.delete({
        where: { id: existingToken.id },
      });

      return { success: 'Email verified!' };
    }),
  resetPassword: publicProcedure.input(ResetSchema).mutation(async ({ ctx, input }) => {
    const { email } = input;

    const existingUser = await ctx.db.user.findUnique({ where: { email } });
    if (!existingUser) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Email not found!',
      });
    }
    try {
      await generatePasswordResetToken(email);

      return { success: 'Reset password email sent' };
    } catch {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to send reset email. Please try again later.',
      });
    }
  }),
  newPassword: publicProcedure
    .input(
      NewPasswordSchema.extend({
        token: string().min(1, 'Missing or invalid token!'),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { password, token } = input;

      const existingToken = await ctx.db.passwordResetToken.findUnique({
        where: {
          token,
        },
      });
      if (!existingToken) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Invalid or expired token!',
        });
      }
      const hasExpired = new Date(existingToken.expires) < new Date();
      if (hasExpired) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Token has expired!',
        });
      }
      const existingUser = await ctx.db.user.findUnique({
        where: { email: existingToken.email },
      });
      if (!existingUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found!',
        });
      }
      const hashedPassword = await hash(password, 10);
      await ctx.db.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword },
      });
      await ctx.db.passwordResetToken.delete({
        where: { id: existingToken.id },
      });

      return { success: 'Password updated successfully!' };
    }),
});
