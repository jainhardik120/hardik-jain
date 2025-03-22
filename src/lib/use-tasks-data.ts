'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { Task } from '@prisma/client';
import { getTasks } from '@/actions/tasks';

export function useTasksData() {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const filters = {
          search: searchParams?.get('search') ?? undefined,
          priority: searchParams?.get('priority') ?? undefined,
          assignee: searchParams?.get('assignee') ?? undefined,
          status: searchParams?.get('status') ?? undefined,
        };

        const data = await getTasks(filters);
        setTasks(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
      } finally {
        setIsLoading(false);
      }
    };

    void fetchTasks();
  }, [searchParams]);

  return { tasks, isLoading, error };
}
