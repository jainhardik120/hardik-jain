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

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const projectDetails: Project =
    (await params).id !== 'new'
      ? ((await api.portfolio.getProjectById({ id: (await params).id })) ?? defaultProject)
      : defaultProject;
  return <ProjectPage data={projectDetails} />;
}
