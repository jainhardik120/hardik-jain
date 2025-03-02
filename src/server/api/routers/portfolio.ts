import { projectSchema } from '@/types/schemas';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export const portfolioRouter = createTRPCRouter({
  getAllProjects: protectedProcedure.query(({ ctx }) => {
    return ctx.db.project.findMany();
  }),
  getProjectById: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.db.project.findUnique({
      where: {
        id: input.id,
      },
    });
  }),
  createProject: protectedProcedure.input(projectSchema).mutation(({ ctx, input }) => {
    const project = ctx.db.project.create({
      data: input,
    });
    revalidatePath('/');
    return project;
  }),
  updateProject: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: projectSchema,
      }),
    )
    .mutation(({ ctx, input }) => {
      const project = ctx.db.project.update({
        where: {
          id: input.id,
        },
        data: input.data,
      });
      revalidatePath('/');
      return project;
    }),
  getSkills: protectedProcedure.query(({ ctx }) => {
    return ctx.db.skill.findMany({
      include: {
        skills: true,
      },
    });
  }),
  createSkill: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const skill = ctx.db.skill.create({
        data: input,
      });
      revalidatePath('/');
      return skill;
    }),
  updateSkill: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        subskills: z.array(
          z.object({
            id: z.string().optional(),
            name: z.string(),
            level: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, subskills } = input;

      await ctx.db.skill.update({
        where: { id },
        data: {
          name,
          skills: {
            deleteMany: {},
            create: subskills.map((subskill) => ({
              name: subskill.name,
              level: subskill.level,
            })),
          },
        },
      });
      revalidatePath('/');
      return ctx.db.skill.findUnique({
        where: { id },
        include: { skills: true },
      });
    }),
  deleteSkill: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.skill.delete({ where: { id: input.id } });
      revalidatePath('/');
      return { success: true };
    }),
});
