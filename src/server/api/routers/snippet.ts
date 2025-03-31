// src/server/api/routers/snippet.ts
import { revalidatePath } from 'next/cache';

import { z } from 'zod';

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

import type { Prisma } from '@prisma/client';

export const snippetRouter = createTRPCRouter({
  getAllSnippets: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.snippet.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }),

  getSnippetById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.snippet.findUnique({
        where: { id: input.id },
      });
    }),

  createSnippet: protectedProcedure.mutation(async ({ ctx }) => {
    const snippet = await ctx.db.snippet.create({
      data: {
        authorId: ctx.session.user.id,
        title: '',
        description: '',
        code: '',
        language: 'javascript',
        tags: [],
      },
    });
    revalidatePath('/snippets');
    return snippet.id;
  }),

  updateSnippet: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        code: z.string(),
        language: z.string(),
        tags: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const snippet = await ctx.db.snippet.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          code: input.code,
          language: input.language,
          tags: input.tags,
        },
      });
      revalidatePath('/snippets');
      return snippet;
    }),

  deleteSnippet: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.snippet.delete({
        where: { id: input.id },
      });
      revalidatePath('/snippets');
    }),
  searchSnippets: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        language: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { query, language, tags } = input;

      const where: Prisma.SnippetWhereInput = {};

      if (query !== null && query !== undefined) {
        where.OR = [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
        ];
      }

      if (language !== null && language !== undefined) {
        where.language = language;
      }

      if (tags && tags.length > 0) {
        where.tags = { hasEvery: tags };
      }

      return ctx.db.snippet.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
      });
    }),
});
