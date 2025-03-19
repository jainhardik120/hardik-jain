'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/components/top-loader-router';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { api } from '@/server/api/react';
import { projectSchema } from '@/types/schemas';
import type { Project } from '@prisma/client';
import ImageUpload from './ImageUpload';

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function ProjectPage({ data }: { data: Project }): JSX.Element {
  const router = useRouter();
  const [techStack, setTechStack] = useState(data?.techStack?.join(', '));

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: data.name,
      githubLink: data.githubLink,
      demoLink: data.demoLink,
      category: data.category,
      imageUrl: data.imageUrl,
      content: data.content,
      shortDescription: data.shortDescription,
    },
  });

  useEffect(() => {
    if (techStack) {
      const techStackArray = techStack
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '');
      if (techStackArray.length > 0) {
        form.setValue('techStack', techStackArray as [string, ...string[]]);
      } else {
        form.setValue('techStack', ['']);
      }
    }
  }, [techStack, form]);

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="githubLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter GitHub repository link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="demoLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Demo Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter live demo link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project category" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full max-h-[400px]"
                        placeholder="Enter project description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <ImageUpload imageUrl={field.value} setImageUrl={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter short description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter tech stack (comma separated)"
                      value={techStack}
                      onChange={(e) => {
                        setTechStack(e.target.value);
                        field.onChange(e.target.value.split(',').map((item) => item.trim()));
                      }}
                    />
                  </FormControl>
                  <FormDescription>Enter technologies separated by commas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
