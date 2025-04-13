import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc';

import { authRouter } from './auth';
import { canvaRouter } from './canva';
import { contactRouter } from './contact';
import { EmailRouter } from './email';
import { excalidrawRouter } from './excalidraw';
import { filesRouter } from './files';
import { portfolioRouter } from './portfolio';
import { postRouter } from './post';
import { sharesRouter } from './shares';
import { snippetRouter } from './snippet';
import { tasksRouter } from './tasks';
import { userRouter } from './user';

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
