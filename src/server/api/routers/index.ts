import { postRouter } from './post';
import { authRouter } from './auth';
import { canvaRouter } from './canva';
import { excalidrawRouter } from './excalidraw';
import { filesRouter } from './files';
import { contactRouter } from './contact';
import { portfolioRouter } from './portfolio';
import { userRouter } from './user';
import { snippetRouter } from './snippet';
import { EmailRouter } from './email';
import { tasksRouter } from './tasks';
import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';
import { sharesRouter } from './shares';

export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  canva: canvaRouter,
  contact: contactRouter,
  email: EmailRouter,
  excalidraw: excalidrawRouter,
  files: filesRouter,
  portfolio: portfolioRouter,
  user: userRouter,
  snippet: snippetRouter,
  tasks: tasksRouter,
  shares: sharesRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
