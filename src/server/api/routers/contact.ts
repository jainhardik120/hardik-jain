import { z } from 'zod';

import { createTRPCRouter, permissionCheckProcedure, publicProcedure } from '@/server/api/trpc';

export const contactRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(
      z.object({
        subject: z.string(),
        email: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.message.create({
        data: {
          subject: input.subject,
          email: input.email,
          message: input.message,
        },
      });
    }),
  listMessages: permissionCheckProcedure('messages', 'list').query(async ({ ctx }) => {
    return await ctx.db.message.findMany({
      where: {
        ...(ctx.permission.whereInput ? { AND: ctx.permission.whereInput } : {}),
      },
    });
  }),
});
