import { postRouter } from '@/server/api/routers/post';
import { createTRPCRouter } from '@/server/api/trpc';
import { createCallerFactory } from '@/server/api/trpc';
import { authRouter } from '@/server/api/routers/auth';
import { canvaRouter } from '@/server/api/routers/canva';
import { excalidrawRouter } from '@/server/api/routers/excalidraw';
import { filesRouter } from '@/server/api/routers/files';
import { contactRouter } from '@/server/api/routers/contact';
import { portfolioRouter } from '@/server/api/routers/portfolio';
import { userRouter } from './routers/user';
import { snippetRouter } from './routers/snippet';

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  canva: canvaRouter,
  contact: contactRouter,
  excalidraw: excalidrawRouter,
  files: filesRouter,
  portfolio: portfolioRouter,
  user: userRouter,
  snippet: snippetRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
