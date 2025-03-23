'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Calendar, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Task } from '@prisma/client';
import { api } from '@/server/api/react';
import { DataTable } from '../DataTable';
import Link from 'next/link';

const columns: ColumnDef<Task>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Title',
  },
  {
    id: 'priority',
    accessorKey: 'priority',
    header: 'Priority',
    cell: ({ row }) => {
      const priority = row.getValue('priority') as string;
      const colorMap: Record<string, string> = {
        high: 'bg-destructive text-destructive-foreground',
        medium: 'bg-warning text-warning-foreground',
        low: 'bg-secondary text-secondary-foreground',
      };

      return (
        <Badge className={colorMap[priority.toLowerCase()] ?? 'bg-secondary'}>{priority}</Badge>
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = {
        todo: 'To Do',
        'in-progress': 'In Progress',
        review: 'Review',
        done: 'Done',
      };

      return <div>{statusMap[status] ?? status}</div>;
    },
  },
  {
    accessorKey: 'assignee',
    header: 'Assignee',
    cell: ({ row }) => {
      const assignee = row.getValue('assignee') as string;

      return assignee ? (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={'/placeholder.svg?height=32&width=32'} alt={assignee} />
            <AvatarFallback>{assignee.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span>{assignee}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">Unassigned</span>
      );
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Due Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dueDate = row.getValue('dueDate') as string;

      return dueDate ? (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(dueDate).toLocaleDateString()}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">No due date</span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const task = row.original;
      const deleteMutation = api.tasks.deleteTask.useMutation();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/tasks/${task.id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/tasks/${task.id}/edit`}>Edit</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={async () => {
                await deleteMutation.mutateAsync({ id: task.id });
              }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TaskTable({ tasks }: { tasks: Task[] }) {
  return (
    <DataTable columns={columns} CreateButton={<></>} data={tasks} name="tasks" filterOn="title" />
  );
}
