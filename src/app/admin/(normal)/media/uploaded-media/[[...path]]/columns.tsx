'use client';

import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { env } from '@/env';

import type { _Object } from '@aws-sdk/client-s3';
import type { ColumnDef } from '@tanstack/react-table';

const isImage = (url: string) => {
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url);
};

export const columns: ColumnDef<_Object>[] = [
  {
    id: 'Key',
    header: 'Key',
    accessorKey: 'Key',
    cell: (context): JSX.Element => {
      const value = context.getValue() as string;
      let userId = '';
      const getItems = (value: string): { label: string; href: string }[] => {
        const items: { label: string; href: string }[] = [];
        let path = '';
        const segments = value.split('/').filter(Boolean);
        userId = segments[1] ?? '';
        segments.forEach((segment, index) => {
          if (index <= 1) {
            return;
          }
          path += `${segment}`;
          if (index !== segments.length - 1) {
            path += '/';
          }
          items.push({
            label: segment,
            href: path,
          });
        });
        return items;
      };
      const items = getItems(value);
      return (
        <Breadcrumb>
          <BreadcrumbList className="gap-1 sm:gap-1">
            {items.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    {index !== items.length - 1 ? (
                      <Link href={`/admin/media/uploaded-media/${item.href}`}>{item.label}</Link>
                    ) : (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <a
                            href={`${env.NEXT_PUBLIC_FILE_STORAGE_HOST}/${userId}/${item.href}`}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {item.label}
                          </a>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-48">
                          {isImage(item.href) ? (
                            <Image
                              src={`${env.NEXT_PUBLIC_FILE_STORAGE_HOST}/${userId}/${item.href}`}
                              alt="Preview"
                              className="w-full h-auto"
                              height={180}
                              width={320}
                            />
                          ) : (
                            <span>No preview available</span>
                          )}
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < items.length - 1 && <>/</>}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      );
    },
  },
  {
    id: 'Size',
    header: 'Size',
    accessorKey: 'Size',
  },
  {
    id: 'LastModified',
    header: 'Last Modified',
    accessorKey: 'LastModified',
  },
];
