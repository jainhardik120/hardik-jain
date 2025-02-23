'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { onUpload } from '@/components/editor/image-upload';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/server/api/react';
import { projectSchema } from '@/types/schemas';
import Image from 'next/image';

type ProjectFormValues = z.infer<typeof projectSchema>;

export default function Page() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projectId = params?.id ?? 'new';
  const [image, setImage] = useState<File | undefined>();
  const [techStack, setTechStack] = useState('');

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      githubLink: '',
      demoLink: '',
      category: '',
      imageUrl: '',
      content: '',
      shortDescription: '',
      techStack: [''],
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

  const { data, refetch } = api.portfolio.getProjectById.useQuery(
    {
      id: projectId,
    },
    { enabled: false },
  );

  useEffect(() => {
    if (projectId && projectId !== 'new') {
      refetch();
    }
  }, [projectId, refetch]);

  useEffect(() => {
    if (data) {
      form.setValue('name', data.name);
      form.setValue('githubLink', data.githubLink);
      form.setValue('demoLink', data.demoLink);
      form.setValue('category', data.category);
      form.setValue('imageUrl', data.imageUrl);
      form.setValue('content', data.content);
      form.setValue('shortDescription', data.shortDescription);
      setTechStack(data.techStack.join(', '));
    }
  }, [data, form]);

  const createProjectMutation = api.portfolio.createProject.useMutation();
  const updateProjectMutation = api.portfolio.updateProject.useMutation();

  const onSubmit = async (values: ProjectFormValues) => {
    try {
      if (projectId === 'new') {
        await createProjectMutation.mutateAsync(values);
        toast.success('Project created successfully!');
      } else {
        await updateProjectMutation.mutateAsync({
          id: projectId,
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
      <h2 className="text-3xl">
        {projectId === 'new' ? 'Create New Project' : 'Edit Project Details'}
      </h2>
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
                      <div>
                        {field.value && (
                          <Image
                            src={field.value}
                            alt="Uploaded"
                            style={{ maxWidth: '100%' }}
                            width={320}
                            height={180}
                          />
                        )}
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setImage(e.target.files[0]);
                              }
                            }}
                          />
                          <Button
                            variant="outline"
                            type="button"
                            onClick={async () => {
                              if (image) {
                                try {
                                  const url = await onUpload(image);
                                  field.onChange(url);
                                } catch (error) {
                                  toast.error(
                                    (error as Error).message ||
                                      'Error occured while uploading image',
                                  );
                                }
                              }
                            }}
                          >
                            Upload
                          </Button>
                        </div>
                      </div>
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
