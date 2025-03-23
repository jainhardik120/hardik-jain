import { createTRPCRouter, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().default('todo'),
  priority: z.string().default('medium'),
  assignee: z.string().optional(),
  dueDate: z.date().optional().nullable(),
});

export const tasksRouter = createTRPCRouter({
  getTasks: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.task.findMany();
  }),
  getTaskById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findUnique({
        where: { id: input.id },
      });
    }),
  createTask: protectedProcedure.input(taskSchema).mutation(async ({ ctx, input }) => {
    const task = await ctx.db.task.create({
      data: {
        title: input.title,
        description: input.description ?? '',
        status: input.status,
        priority: input.priority,
        assignee: input.assignee ?? null,
        dueDate: input.dueDate || null,
      },
    });
    return task.id;
  }),
  updateTask: protectedProcedure
    .input(z.object({ id: z.string(), data: taskSchema }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.update({
        where: { id: input.id },
        data: {
          title: input.data.title,
          description: input.data.description ?? '',
          status: input.data.status,
          priority: input.data.priority,
          assignee: input.data.assignee ?? null,
          dueDate: input.data.dueDate || null,
        },
      });
      return task;
    }),
  updateTaskStatus: protectedProcedure
    .input(z.object({ id: z.string(), status: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.task.update({
        where: { id: input.id },
        data: { status: input.status },
      });
      return input.id;
    }),
  deleteTask: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.task.delete({
        where: { id: input.id },
      });
      return input.id;
    }),
});
