'use client';

import Link from 'next/link';

import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<{
  id: string;
  title: string;
}>[] = [
  {
    id: 'title',
    header: 'Title',
    accessorKey: 'title',
  },
  {
    id: 'edit',
    cell: (context) => {
      const templateId = context.row.original.id;
      return (
        <Link href={`/admin/email/${templateId}`} className="text-center w-full block">
          Edit
        </Link>
      );
    },
  },
];
