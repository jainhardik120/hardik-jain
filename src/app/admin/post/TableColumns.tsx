'use client';

import type { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

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
    header: 'Edit',
    cell: (context) => {
      const postId = context.row.original.id;

      return <Link href={`/admin/post/${postId}`}>Edit</Link>;
    },
  },
  {
    id: 'delete',
    header: 'Delete',
    cell: (context) => {
      const postId = context.row.original.id;

      return (
        <button
          onClick={async () => {
            const response = await fetch(`/api/posts/${postId}`, {
              method: 'DELETE',
            });
            if (response.ok) {
              window.location.reload();
            }
          }}
        >
          Delete
        </button>
      );
    },
  },
];
