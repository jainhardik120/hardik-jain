'use server';
import { prisma as db } from '@/lib/prisma';
import type { SkillWithSubSkills } from '@/types';

export async function getProjectsGroupedByCategory() {
  const projectsGroupedByCategory = await db.project.groupBy({
    by: ['category'],
    _count: {
      category: true,
    },
  });

  const projects = await db.project.findMany();
  const groupedData = projectsGroupedByCategory.map((group) => ({
    id: group.category,
    projects: projects.filter((project) => project.category === group.category),
  }));

  const uniqueCategories = groupedData.map((group) => group.id);

  return {
    categories: uniqueCategories,
    projectsByCategory: groupedData,
  };
}

export async function getAllPosts() {
  const posts = await db.post.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      slug: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return posts;
}

export async function getSkills(): Promise<SkillWithSubSkills[]> {
  const skills = await db.skill.findMany({
    include: {
      skills: true,
    },
  });

  return skills;
}
