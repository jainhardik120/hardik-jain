import { createTRPCRouter, permissionCheckProcedure, protectedProcedure } from '@/server/api/trpc';
import { AccountDetailsSchema } from '@/types/schemas';

export const userRouter = createTRPCRouter({
  listUsers: permissionCheckProcedure('users', 'list').query(async ({ ctx }) => {
    return ctx.db.user.findMany();
  }),
  updateAccountDetails: protectedProcedure
    .input(AccountDetailsSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      await ctx.db.user.update({
        where: {
          id: userId,
        },
        data: {
          ...input,
        },
      });
    }),
  getUserDetails: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = await ctx.db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        image: true,
        bio: true,
        twitter: true,
        linkedin: true,
        website: true,
      },
    });
    return user;
  }),
});
