// eslint-disable-next-line
import 'server-only';

import { cache } from 'react';

import { headers } from 'next/headers';

import { createHydrationHelpers } from '@trpc/react-query/rsc';

import { createQueryClient } from '@/server/api';
import { createCaller, type AppRouter } from '@/server/api/routers';
import { createTRPCContext } from '@/server/api/trpc';

const createStaticContext = () => {
  return createTRPCContext({
    headers: new Headers(),
  });
};

const staticCaller = createCaller(createStaticContext);
const getStaticQueryClient = cache(createQueryClient);

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set('x-trpc-source', 'rsc');

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api } = createHydrationHelpers<AppRouter>(staticCaller, getStaticQueryClient);

export const { trpc: dynamicApi } = createHydrationHelpers<AppRouter>(caller, getQueryClient);
