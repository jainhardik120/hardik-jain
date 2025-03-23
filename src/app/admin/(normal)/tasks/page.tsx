'use client';

import { Suspense } from 'react';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ViewToggle } from '@/components/task-manager/view-toggle';
import { TaskFilters } from '@/components/task-manager/task-filters';
import { KanbanBoard } from '@/components/task-manager/kanban-board';
import { TaskTable } from '@/components/task-manager/task-table';
import { useQueryState } from '@/lib/use-query-state';
import Link from 'next/link';

export default function TasksPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks and track progress</p>
        </div>
        <Button asChild>
          <Link href="/admin/tasks/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Task
          </Link>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Suspense fallback={<div className="h-10 w-[200px] bg-muted animate-pulse rounded-md" />}>
          <TaskFilters />
        </Suspense>
        <Suspense fallback={<div className="h-10 w-[100px] bg-muted animate-pulse rounded-md" />}>
          <ViewToggle />
        </Suspense>
      </div>

      <Suspense fallback={<div className="h-[500px] w-full bg-muted animate-pulse rounded-md" />}>
        <TasksView />
      </Suspense>
    </div>
  );
}

function TasksView() {
  const [view] = useQueryState('view', {
    defaultValue: 'kanban',
    parse: (value) => (value === 'table' ? 'table' : 'kanban'),
  });

  return view === 'kanban' ? <KanbanBoard /> : <TaskTable />;
}
