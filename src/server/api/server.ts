import 'server-only';

import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { headers } from 'next/headers';
import { cache } from 'react';

import { createCaller, type AppRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';
import { createQueryClient } from './query-client';

const createStaticContext = () => {
  return createTRPCContext({
    headers: new Headers(),
  });
};

const staticCaller = createCaller(createStaticContext);
const getStaticQueryClient = cache(createQueryClient);
export const { trpc: api } = createHydrationHelpers<AppRouter>(staticCaller, getStaticQueryClient);

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set('x-trpc-source', 'rsc');

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: dynamicApi } = createHydrationHelpers<AppRouter>(caller, getQueryClient);
