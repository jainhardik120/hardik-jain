'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ViewToggle } from '@/components/task-manager/view-toggle';
import { KanbanBoard } from '@/components/task-manager/kanban-board';
import { TaskTable } from '@/components/task-manager/task-table';
import Link from 'next/link';
import { api } from '@/server/api/react';

export default function TasksPage() {
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const tasks = api.tasks.getTasks.useQuery();
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
        <ViewToggle view={view} setView={setView} />
      </div>
      {view === 'kanban' ? (
        <KanbanBoard tasks={tasks.data ?? []} />
      ) : (
        <TaskTable tasks={tasks.data ?? []} />
      )}
    </div>
  );
}
