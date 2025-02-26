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
    cell: (context) => {
      const value = context.getValue() as string;

      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      );
    },
  },
  {
    id: 'demoLink',
    header: 'Demo Link',
    accessorKey: 'demoLink',
    cell: (context) => {
      const value = context.getValue() as string;

      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
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
    cell: (context) => {
      const value = context.getValue() as string;

      return (
        <Image
          src={value.length > 0 ? value : '/images/project-default-image.jpg'}
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
    cell: (context) => {
      const projectId = context.row.original.id;

      return (
        <Link href={`/admin/project/${projectId}`}>
          <Button>Edit</Button>
        </Link>
      );
    },
  },
];
