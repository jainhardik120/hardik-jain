import { createTRPCRouter, permissionCheckProcedure } from '@/server/api/trpc';

export const userRouter = createTRPCRouter({
  listUsers: permissionCheckProcedure('users', 'list').query(async ({ ctx }) => {
    return ctx.db.user.findMany();
  }),
});
