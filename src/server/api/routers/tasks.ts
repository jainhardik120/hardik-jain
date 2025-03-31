import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

export const tasksRouter = createTRPCRouter({
  createTaskBoard: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const taskBoard = await ctx.db.taskBoard.create({
      data: {
        title: input,
        creatorId: ctx.session.user.id,
      },
    });

    return taskBoard.id;
  }),
  getAllTaskBoards: protectedProcedure.query(async ({ ctx }) => {
    const taskBoards = await ctx.db.taskBoard.findMany({
      where: {
        creatorId: ctx.session.user.id,
      },
    });
    return taskBoards;
  }),
  deleteTaskBoard: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const taskBoard = await ctx.db.taskBoard.delete({
      where: {
        id: input,
        creatorId: ctx.session.user.id,
      },
    });
    return taskBoard;
  }),
  updateTaskBoard: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const taskBoard = await ctx.db.taskBoard.update({
        where: {
          id: input.id,
          creatorId: ctx.session.user.id,
        },
        data: {
          title: input.title,
        },
      });
      return taskBoard;
    }),
  updateColumnTitle: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const updatedColumn = await ctx.db.taskColumn.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
        },
      });
      return updatedColumn;
    }),
  addTask: protectedProcedure
    .input(z.object({ columnId: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newTask = await ctx.db.task.create({
        data: {
          title: input.title,
          taskColumnId: input.columnId,
          order: 0,
        },
      });
      return newTask;
    }),
  getKanbanData: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const kanbanData = await ctx.db.taskBoard.findUnique({
      where: {
        id: input,
      },
      include: {
        columns: {
          orderBy: {
            order: 'asc',
          },
          include: {
            tasks: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });
    return kanbanData;
  }),
  deleteColumn: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.db.taskColumn.delete({
      where: {
        id: input,
      },
    });
  }),
  getAllTags: protectedProcedure.query(async ({ ctx }) => {
    const tags = await ctx.db.tag.findMany();
    return tags;
  }),
  addColumn: protectedProcedure
    .input(z.object({ taskBoardId: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newColumn = await ctx.db.taskColumn.create({
        data: {
          title: input.title,
          taskBoardId: input.taskBoardId,
          order: 0,
        },
      });
      return newColumn;
    }),
  updateTaskDetails: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        dueDate: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedTask = await ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description ?? null,
          dueDate: input.dueDate ?? null,
        },
      });
      return updatedTask;
    }),
  deleteTask: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.db.task.delete({
      where: {
        id: input,
      },
    });
  }),
  updateTaskStatus: protectedProcedure
    .input(z.object({ id: z.string(), columnId: z.string(), order: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const updatedTask = await ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          taskColumnId: input.columnId,
          order: input.order,
        },
      });
      return updatedTask;
    }),
});
