'use client';

import React from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import type { Route } from 'next';

const AppBreadcrumb = ({ pathname }: { pathname?: string | null }) => {
  const path = usePathname();
  if (pathname === undefined || pathname === null) {
    pathname = path;
  }
  const getBreadcrumbItems = (): { label: string; href: Route }[] => {
    const items: { label: string; href: Route }[] = [];
    let path = '';

    items.push({ label: 'Home', href: '/' });
    const segments = pathname?.split('/').filter(Boolean);
    segments?.forEach((segment) => {
      path += `/${segment}`;
      items.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replaceAll('-', ' '),
        href: path as Route,
      });
    });
    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
