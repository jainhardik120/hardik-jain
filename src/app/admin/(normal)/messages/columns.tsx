'use client';

import type { Message } from '@prisma/client';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Message>[] = [
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
  },
  {
    id: 'subject',
    header: 'Subject',
    accessorKey: 'subject',
  },
  {
    id: 'message',
    header: 'Message',
    accessorKey: 'message',
  },
];
