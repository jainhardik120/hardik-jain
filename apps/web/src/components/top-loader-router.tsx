'use client';
import { useCallback, useEffect } from 'react';

import type {
  AppRouterInstance,
  NavigateOptions,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter as useNextRouter, usePathname } from 'next/navigation';

import { done, start } from 'nprogress';

import type { Route } from 'next';

export const useRouter = (): AppRouterInstance => {
  const router = useNextRouter();
  const pathname = usePathname();
  useEffect(() => {
    done();
  }, [pathname]);
  const replace = useCallback(
    (href: Route, options?: NavigateOptions) => {
      if (href !== pathname) {
        start();
      }
      router.replace(href, options);
    },
    [router, pathname],
  );

  const push = useCallback(
    (href: Route, options?: NavigateOptions) => {
      if (href !== pathname) {
        start();
      }
      router.push(href, options);
    },
    [router, pathname],
  );

  return {
    ...router,
    replace,
    push,
  };
};
