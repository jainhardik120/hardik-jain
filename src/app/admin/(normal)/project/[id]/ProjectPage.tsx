'use client';

import React from 'react';

import { toast } from 'sonner';

import RenderedForm from '@/components/form';
import ImageUpload from '@/components/ImageUpload';
import { useRouter } from '@/components/top-loader-router';
import { api } from '@/server/api/react';
import { projectSchema } from '@/types/schemas';

import type { Project } from '@prisma/client';
import type { z } from 'zod';

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function ProjectPage({ data }: { data: Project }): JSX.Element {
  const router = useRouter();

  const createProjectMutation = api.portfolio.createProject.useMutation();
  const updateProjectMutation = api.portfolio.updateProject.useMutation();

  const onSubmit = async (values: ProjectFormValues): Promise<void> => {
    try {
      if (data?.id === 'new') {
        await createProjectMutation.mutateAsync(values);
        toast.success('Project created successfully!');
      } else {
        await updateProjectMutation.mutateAsync({
          id: data?.id,
          data: values,
        });
        toast.success('Project updated successfully!');
      }
      router.back();
    } catch {
      toast.error('Failed to submit project. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 mt-1 gap-2">
      <RenderedForm
        schema={projectSchema}
        onSubmit={onSubmit}
        defaultValues={{
          ...data,
          techStack: data.techStack.length > 0 ? (data.techStack as [string, ...string[]]) : [''],
        }}
        fields={[
          {
            name: 'name',
            label: 'Name',
            type: 'input',
            placeholder: 'Enter project name',
          },
          {
            name: 'githubLink',
            label: 'GitHub Link',
            type: 'input',
            placeholder: 'Enter GitHub repository link',
          },
          {
            name: 'demoLink',
            label: 'Demo Link',
            type: 'input',
            placeholder: 'Enter live demo link',
          },
          {
            name: 'category',
            label: 'Category',
            type: 'input',
            placeholder: 'Enter project category',
          },
          {
            name: 'imageUrl',
            label: 'Image',
            type: 'custom',
            placeholder: 'Enter image URL',
            render: (field) => (
              <ImageUpload imageUrl={field.value as string} setImageUrl={field.onChange} />
            ),
          },
          {
            name: 'content',
            label: 'Content',
            type: 'textarea',
            placeholder: 'Enter project description',
          },
          {
            name: 'shortDescription',
            label: 'Short Description',
            type: 'input',
            placeholder: 'Enter short description',
          },
          {
            name: 'techStack',
            label: 'Tech Stack',
            type: 'stringArray',
            placeholder: 'Enter tech stack (comma separated)',
          },
        ]}
      />
    </div>
  );
}
