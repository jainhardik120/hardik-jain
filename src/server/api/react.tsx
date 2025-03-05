'use client';

import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { createTRPCClient } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server';

import { type AppRouter } from '@/server/api/root';
import { createQueryClient } from './query-client';
import { links } from './pages';

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = (): QueryClient => {
  if (typeof window === 'undefined') {
    return createQueryClient();
  }

  return (clientQueryClientSingleton ??= createQueryClient());
};

export const api = createTRPCReact<AppRouter>();

const config = {
  links: links,
};

export const client = createTRPCClient<AppRouter>(config);

export function TRPCReactProvider(props: { children: React.ReactNode }): JSX.Element {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() => api.createClient(config));

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
