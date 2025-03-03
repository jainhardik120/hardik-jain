import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const userRouter = createTRPCRouter({
  listUsers: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany();
  }),
});
