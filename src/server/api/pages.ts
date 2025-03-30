import { links } from '@/server/api';
import { createTRPCNext } from '@trpc/next';
import SuperJSON from 'superjson';
import { type AppRouter } from '@/server/api/routers';

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: links,
    };
  },
  ssr: false,
  transformer: SuperJSON,
});
