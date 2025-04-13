'use server';
import { prisma as db } from '@/lib/prisma';

export async function getPostSlugs() {
  const slugs = await db.post.findMany({
    select: {
      slug: true,
    },
  });

  return slugs;
}

export async function getPageCount() {
  const count = await db.post.count();

  return Math.ceil(count / 10);
}
