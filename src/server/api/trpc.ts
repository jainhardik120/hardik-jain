import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { auth } from '@/server/auth';
import { prisma as db } from '@/lib/prisma';
import { type Permissions, withPermission } from '../auth/permissions-helper';
import { type ExtendedUser } from '@/types/next-auth';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();
  const result = await next();
  const end = Date.now();
  // eslint-disable-next-line no-console
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

export const publicProcedure = t.procedure.use(timingMiddleware).use(async ({ ctx, next }) => {
  return next({
    ctx: {
      ...ctx,
    },
  });
});

export const protectedProcedure = t.procedure.use(timingMiddleware).use(async ({ ctx, next }) => {
  const session = await auth();

  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      session: { ...session, user: session.user },
    },
  });
});

export const permissionCheckProcedure = <Resource extends keyof Permissions>(
  resource: Resource,
  action: Permissions[Resource]['action'],
) => {
  return protectedProcedure.use(async ({ ctx, next }) => {
    const { hasPermission, whereInput } = withPermission(
      ctx.session.user as ExtendedUser,
      resource,
      action,
    );
    if (!hasPermission && whereInput === undefined) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You don't have permission to ${action} this ${String(resource)}`,
      });
    }
    return next({
      ctx: {
        ...ctx,
        permission: {
          whereInput,
        },
      },
    });
  });
};
