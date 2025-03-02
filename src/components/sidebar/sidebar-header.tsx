'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import React from 'react';
import AppBreadcrumb from '@/app/admin/AppBreadcrumb';
import { useTextStore } from './useTextStore';

export default function Header(): JSX.Element {
  const text = useTextStore((state) => state.text);
  return (
    <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex w-full flex-row justify-between items-center">
        <AppBreadcrumb />
        <p>{text}</p>
      </div>
    </header>
  );
}
