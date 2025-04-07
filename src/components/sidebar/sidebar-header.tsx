'use client';

import React from 'react';

import AppBreadcrumb from '@/components/AppBreadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTextStore } from '@/hooks/useTextStore';

export default function Header() {
  const text = useTextStore((state) => state.text);
  return (
    <header className="sticky shrink-0 w-full z-[40] top-0 flex h-16 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex w-full flex-row justify-between items-center">
        <AppBreadcrumb />
        <p>{text}</p>
      </div>
    </header>
  );
}
