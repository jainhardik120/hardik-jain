'use client';

import React, { useState, useCallback } from 'react';

import type { LinkProps } from 'next/link';
import Link from 'next/link';

import { Button } from '@repo/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@repo/ui/drawer';

import { cn } from '@/lib/utils';
import type { MainNavItem } from '@/types';

export function MobileNav({ links }: { links: MainNavItem[] }) {
  const [open, setOpen] = useState(false);

  const onOpenChange = useCallback((open: boolean) => {
    setOpen(open);
  }, []);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="-ml-2 mr-2 h-8 w-8 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="!size-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[60svh] p-0">
        <div className="overflow-auto p-6">
          <div className="flex flex-col space-y-3">
            {links.map((item) => (
              <MobileLink key={item.href} href={item.href} onOpenChange={setOpen}>
                {item.title}
              </MobileLink>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

interface MobileLinkProps<T extends string> extends LinkProps<T> {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink<T extends string>({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps<T>) {
  return (
    <Link
      href={href}
      onClick={() => {
        onOpenChange?.(false);
      }}
      className={cn('text-base', className)}
      {...props}
    >
      {children}
    </Link>
  );
}
