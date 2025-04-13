import { notFound } from 'next/navigation';

import { api } from '@/server/api/server';

import ProjectPage from './ProjectPage';

import type { Project } from '@prisma/client';

const defaultProject: Project = {
  id: 'new',
  name: '',
  githubLink: '',
  demoLink: '',
  category: '',
  imageUrl: '',
  content: '',
  shortDescription: '',
  techStack: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const projectDetails: Project | null =
    (await params).id !== 'new'
      ? await api.portfolio.getProjectById({ id: (await params).id })
      : defaultProject;
  if (!projectDetails) {
    notFound();
  }
  return <ProjectPage data={projectDetails} />;
}
