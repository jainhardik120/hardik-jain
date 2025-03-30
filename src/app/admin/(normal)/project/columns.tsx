'use client';

import { Button } from '@/components/ui/button';
import type { Project } from '@prisma/client';
import type { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';

export const columns: ColumnDef<Project>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
  },
  {
    id: 'githubLink',
    header: 'GitHub Link',
    accessorKey: 'githubLink',
    cell: (context): JSX.Element => {
      const value = context.getValue() as string;

      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value.substring(0, 20)}...
        </a>
      );
    },
  },
  {
    id: 'demoLink',
    header: 'Demo Link',
    accessorKey: 'demoLink',
    cell: (context): JSX.Element => {
      const value = context.getValue() as string;

      return value !== '' ? (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value.substring(0, 20)}...
        </a>
      ) : (
        <span>-</span>
      );
    },
  },
  {
    id: 'category',
    header: 'Category',
    accessorKey: 'category',
  },
  {
    id: 'imageUrl',
    header: 'Image',
    accessorKey: 'imageUrl',
    cell: (context): JSX.Element => {
      const value = context.getValue() as string;

      return (
        <Image
          src={value}
          alt="Project"
          style={{
            maxHeight: '50px',
            maxWidth: '100px',
            objectFit: 'contain',
          }}
          width={100}
          height={50}
        />
      );
    },
  },
  {
    id: 'edit',
    header: 'Edit',
    cell: (context): JSX.Element => {
      const projectId = context.row.original.id;

      return (
        <Link href={`/admin/project/${projectId}`}>
          <Button>Edit</Button>
        </Link>
      );
    },
  },
];
