/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import onUpload from '@/lib/ImageUpload';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  githubLink: z.string(),
  demoLink: z.string(),
  category: z.string().min(1, 'Category is required'),
  imageUrl: z.string(),
  content: z.string().min(1, 'Content is required'),
  shortDescription: z.string().min(1, 'Short description is required'),
  techStack: z.array(z.string()).nonempty('At least one tech stack item is required')
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const EditProjectPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const router = useRouter();
  const projectId = params.id;
  const [image, setImage] = useState<File | undefined>();
  const [techStack, setTechStack] = useState("");

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
      const techStackArray = techStack.split(",").map(item => item.trim()).filter(item => item !== "");
      if (techStackArray.length > 0) {
        form.setValue("techStack", techStackArray as [string, ...string[]]);
      } else {
        form.setValue("techStack", [""]);
      }
    }
  }, [techStack, form]);

  useEffect(() => {
    if (projectId === "new") return;
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        const data = await response.json();
        Object.keys(data).forEach(key => form.setValue(key as keyof ProjectFormValues, data[key]));
        setTechStack(data.techStack.join(', '));
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [projectId, form]);

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const method = projectId === "new" ? "POST" : "PUT";
      const url = projectId === "new" ? `/api/projects` : `/api/projects/${projectId}`;

      const response = await fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        router.back();
      }
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  return (
    <div className='container mx-auto px-4 mt-1'>
      <h1 className='text-2xl'>
        {projectId === "new" ? "Create New Project" : "Edit Project Details"}
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className='grid gap-4 lg:grid-cols-2'>
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
            <div className='grid gap-4 lg:grid-cols-2'>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full h-full max-h-[400px]"
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
                      <>
                        {field.value && (
                          <img
                            src={field.value}
                            alt="Uploaded"
                            style={{ maxWidth: '100%' }}
                          />
                        )}
                        <div className="flex items-center gap-2">
                          <Input
                            id="image"
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
                                const url = await onUpload(image);
                                field.onChange(url);
                              }
                            }}
                          >
                            Upload
                          </Button>
                        </div>
                      </>
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
                        field.onChange(e.target.value.split(',').map(item => item.trim()));
                      }}
                    />
                  </FormControl>
                  <FormDescription>Enter technologies separated by commas</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditProjectPage;