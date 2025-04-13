'use client';

import Link from 'next/link';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/alert-dialog';
import { Button } from '@repo/ui/button';

import { api } from '@/server/api/react';

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
      const postId = context.row.original.id;

      return (
        <Link href={`/admin/post/${postId}`} className="text-center w-full block">
          Edit
        </Link>
      );
    },
  },
  {
    id: 'delete',
    cell: (context) => {
      const postId = context.row.original.id;
      const mutation = api.post.deletePost.useMutation();
      return (
        <div className="flex items-center justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await mutation.mutateAsync({ id: postId });
                    window.location.reload();
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
