import type { AppRouter } from '@/server/api/root';
import { getBaseUrl } from '@/lib/getBaseUrl';
import { createTRPCNext } from '@trpc/next';
import { loggerLink, unstable_httpBatchStreamLink } from '@trpc/client';
import SuperJSON from 'superjson';

export const links = [
  loggerLink({
    enabled: (op) =>
      process.env.NODE_ENV === 'development' ||
      (op.direction === 'down' && op.result instanceof Error),
  }),
  unstable_httpBatchStreamLink({
    transformer: SuperJSON,
    url: getBaseUrl() + '/api/trpc',
    headers: () => {
      const headers = new Headers();
      headers.set('x-trpc-source', 'nextjs-react');

      return headers;
    },
  }),
];

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: links,
    };
  },
  ssr: false,
  transformer: SuperJSON,
});
