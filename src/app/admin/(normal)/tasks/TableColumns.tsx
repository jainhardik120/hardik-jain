'use client';

import { type TaskBoard } from '@prisma/client';
import { type ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const columns: ColumnDef<TaskBoard>[] = [
  {
    id: 'title',
    header: 'Title',
    accessorKey: 'title',
  },
  {
    id: 'edit',
    header: 'Edit',
    accessorKey: 'edit',
    cell: (context) => {
      const taskBoardId = context.row.original.id;
      return (
        <Link href={`/admin/tasks/${taskBoardId}`} className="text-center w-full block">
          Edit
        </Link>
      );
    },
  },
];
