'use client';

import type React from 'react';
import { createContext, useContext, useState } from 'react';

import { type Task, type TaskColumn } from '@prisma/client';

export type TaskColumnWithTasks = TaskColumn & {
  tasks: Task[];
};

type KanbanContextType = {
  taskBoardId: string;
  columns: TaskColumnWithTasks[];
  setColumns: React.Dispatch<React.SetStateAction<TaskColumnWithTasks[]>>;
  filters: {
    tags: string[];
    dueDate: 'all' | 'overdue' | 'today' | 'upcoming';
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      tags: string[];
      dueDate: 'all' | 'overdue' | 'today' | 'upcoming';
    }>
  >;
  filteredColumns: TaskColumnWithTasks[];
};

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function KanbanProvider({
  children,
  initialData,
  taskBoardId,
}: {
  children: React.ReactNode;
  initialData: TaskColumnWithTasks[];
  taskBoardId: string;
}) {
  const [columns, setColumns] = useState<TaskColumnWithTasks[]>(initialData);
  const [filters, setFilters] = useState({
    tags: [] as string[],
    dueDate: 'all' as 'all' | 'overdue' | 'today' | 'upcoming',
  });

  const filteredColumns = columns.map((column) => {
    const filteredTasks = column.tasks.filter((task) => {
      let dueDateMatch = true;
      if (filters.dueDate !== 'all' && task.dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);

        if (filters.dueDate === 'overdue') {
          dueDateMatch = taskDate < today;
        } else if (filters.dueDate === 'today') {
          dueDateMatch = taskDate.getTime() === today.getTime();
        } else if (filters.dueDate === 'upcoming') {
          dueDateMatch = taskDate >= today;
        }
      }

      return dueDateMatch;
    });

    return {
      ...column,
      tasks: filteredTasks,
    };
  });

  return (
    <KanbanContext.Provider
      value={{
        columns,
        setColumns,
        filters,
        setFilters,
        filteredColumns,
        taskBoardId,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban() {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}
