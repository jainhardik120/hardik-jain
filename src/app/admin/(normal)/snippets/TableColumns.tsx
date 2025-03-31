'use client';

import { Badge } from '@/components/ui/badge';

import { DeleteSnippetDialog } from './DeleteSnippetDialog';
import { EditSnippetDialog } from './EditSnippetDialog';

import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<{
  id: string;
  title: string;
  description: string;
  language: string;
  tags: string[];
  createdAt: Date;
}>[] = [
  {
    id: 'title',
    header: 'Title',
    accessorKey: 'title',
    cell: ({ row }) => (
      <div className="font-medium">{row.original.title || 'Untitled Snippet'}</div>
    ),
  },
  {
    id: 'language',
    header: 'Language',
    accessorKey: 'language',
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.language}
      </Badge>
    ),
  },
  {
    id: 'tags',
    header: 'Tags',
    accessorKey: 'tags',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: 'createdAt',
    header: 'Created',
    accessorKey: 'createdAt',
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString();
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <EditSnippetDialog snippetId={row.original.id} />
          <DeleteSnippetDialog snippetId={row.original.id} />
        </div>
      );
    },
  },
];
