'use server';

import { prisma as db } from '@/lib/prisma';
import type { Prisma, Task } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function getTasks(filters?: {
  search?: string | undefined;
  priority?: string | undefined;
  assignee?: string | undefined;
  status?: string | undefined;
}) {
  try {
    const where: Prisma.TaskWhereInput = {};

    if (filters?.search !== null && filters?.search !== undefined && filters.search !== '') {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.priority !== null && filters?.priority !== undefined && filters.priority !== '') {
      where.priority = filters.priority;
    }

    if (filters?.assignee !== null && filters?.assignee !== undefined && filters.assignee !== '') {
      where.assignee = filters.assignee;
    }

    if (filters?.status !== null && filters?.status !== undefined && filters.status !== '') {
      where.status = filters.status;
    }

    const tasks = await db.task.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return tasks as Task[];
  } catch {
    throw new Error('Failed to fetch tasks');
  }
}

export async function getTask(id: string) {
  try {
    const task = await db.task.findUnique({
      where: { id },
    });

    return task as Task | null;
  } catch {
    throw new Error(`Failed to fetch task with ID ${id}`);
  }
}
const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().default('todo'),
  priority: z.string().default('medium'),
  assignee: z.string().optional(),
  dueDate: z.date().optional().nullable(),
});

export async function createTask(formData: z.infer<typeof taskSchema>) {
  try {
    const validatedData = taskSchema.parse(formData);

    const task = await db.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description ?? '',
        status: validatedData.status,
        priority: validatedData.priority,
        assignee: validatedData.assignee ?? null,
        dueDate: validatedData.dueDate || null,
      },
    });

    revalidatePath('/');
    return task.id;
  } catch {
    throw new Error('Failed to create task');
  }
}

export async function updateTask(id: string, formData: z.infer<typeof taskSchema>) {
  try {
    const validatedData = taskSchema.parse(formData);

    await db.task.update({
      where: { id },
      data: {
        title: validatedData.title,
        description: validatedData.description ?? '',
        status: validatedData.status,
        priority: validatedData.priority,
        assignee: validatedData.assignee ?? null,
        dueDate: validatedData.dueDate || null,
      },
    });

    revalidatePath('/');
    revalidatePath(`/tasks/${id}`);
  } catch {
    throw new Error(`Failed to update task with ID ${id}`);
  }
}

export async function updateTaskStatus(id: string, status: string) {
  try {
    await db.task.update({
      where: { id },
      data: { status },
    });

    revalidatePath('/');
  } catch {
    throw new Error(`Failed to update status for task with ID ${id}`);
  }
}

export async function deleteTask(id: string) {
  try {
    await db.task.delete({
      where: { id },
    });

    revalidatePath('/');
  } catch {
    throw new Error(`Failed to delete task with ID ${id}`);
  }
}
