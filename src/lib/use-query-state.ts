'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';

interface UseQueryStateOptions<T> {
  defaultValue?: T;
  parse?: (value: string) => T;
  serialize?: (value: T) => string;
}

export function useQueryState<T = string>(
  key: string,
  options: UseQueryStateOptions<T> = {},
): [T | null, (value: T | null) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<T | null>(() => {
    const paramValue = searchParams?.get(key);
    if (paramValue === null || paramValue === undefined) {
      return options.defaultValue ?? null;
    }
    return options.parse ? options.parse(paramValue) : (paramValue as unknown as T);
  });

  useEffect(() => {
    const paramValue = searchParams?.get(key);
    if (paramValue === null || paramValue === undefined) {
      setValue(options.defaultValue ?? null);
    } else {
      setValue(options.parse ? options.parse(paramValue) : (paramValue as unknown as T));
    }
  }, [searchParams, key, options]);

  const setQueryValue = useCallback(
    (newValue: T | null) => {
      setValue(newValue);

      const newSearchParams = new URLSearchParams(searchParams?.toString());

      if (newValue === null) {
        newSearchParams.delete(key);
      } else {
        const serialized = options.serialize ? options.serialize(newValue) : String(newValue);
        newSearchParams.set(key, serialized);
      }

      const search = newSearchParams.toString();
      const query = search ? `?${search}` : '';

      router.push(`${pathname}${query}` as Route);
    },
    [key, options, pathname, router, searchParams],
  );

  return [value, setQueryValue];
}
