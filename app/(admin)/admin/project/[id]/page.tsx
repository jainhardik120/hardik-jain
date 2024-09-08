/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import onUpload from '@/lib/ImageUpload';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  githubLink: z.string(),
  demoLink:  z.string(),
  category: z.string().min(1, 'Category is required'),
  imageUrl:  z.string(),
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
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema)
  });


  useEffect(() => {
    if (techStack) {
      const techStackArray = techStack.split(",").map(item => item.trim()).filter(item => item !== "");
      if (techStackArray.length > 0) {
        setValue("techStack", techStackArray as [string, ...string[]]);
      } else {
        setValue("techStack", [""]);
      }
    }
  }, [techStack, setValue]);

  useEffect(() => {
    if (projectId === "new") return;
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        const data = await response.json();
        Object.keys(data).forEach(key => setValue(key as keyof ProjectFormValues, data[key]));
        setTechStack(data.techStack.join(', '));
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [projectId, setValue]);

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
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
    <Card className="max-w-2xl lg:w-full mx-auto lg:max-w-5xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>{projectId === "new" ? "Create New Project" : "Edit Project Details"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className='grid gap-4 lg:grid-cols-2'>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Enter project name"
                  />
                  {errors.name && <span className="text-red-600">{errors.name.message}</span>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="githubLink">GitHub Link</Label>
                  <Input
                    id="githubLink"
                    {...register('githubLink')}
                    placeholder="Enter GitHub repository link"
                  />
                  {errors.githubLink && <span className="text-red-600">{errors.githubLink.message}</span>}
                </div>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="demoLink">Demo Link</Label>
                  <Input
                    id="demoLink"
                    {...register('demoLink')}
                    placeholder="Enter live demo link"
                  />
                  {errors.demoLink && <span className="text-red-600">{errors.demoLink.message}</span>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    {...register('category')}
                    placeholder="Enter project category"
                  />
                  {errors.category && <span className="text-red-600">{errors.category.message}</span>}
                </div>
              </div>
            </div>
            <div className='grid gap-4 lg:grid-cols-2'>
              <div className="flex h-full flex-col gap-2">
                <Label htmlFor="content">Content</Label>
                <div className="flex-1 min-h-0">
                  <Textarea
                    className="w-full h-full max-h-[400px]"
                    id="content"
                    {...register('content')}
                    placeholder="Enter project description"
                  />
                  {errors.content && <span className="text-red-600">{errors.content.message}</span>}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image</Label>
                {watch('imageUrl') && (
                  <img
                    src={watch('imageUrl')}
                    alt="Uploaded"
                    style={{ maxWidth: '100%' }}
                  />
                )}
                <div className="flex items-center gap-2">
                  <Input id="image" type="file" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(e.target.files[0]);
                    }
                  }} />
                  <Button variant="outline" type="button" onClick={async () => {
                    if (image) {
                      const url = await onUpload(image);
                      setValue('imageUrl', url);
                    }
                  }}>Upload</Button>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                {...register('shortDescription')}
                placeholder="Enter short description"
              />
              {errors.shortDescription && <span className="text-red-600">{errors.shortDescription.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="techStack">Tech Stack</Label>
              <Textarea
                id="techStack"
                placeholder="Enter tech stack (comma separated)"
                value={techStack}
                onChange={(e) => {
                  setTechStack(e.target.value);
                }}
              />
              {errors.techStack && <span className="text-red-600">{errors.techStack.message}</span>}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.back()} variant="ghost">Cancel</Button>
          <Button type="submit" className="ml-auto">{projectId === "new" ? "Create Project" : "Save Changes"}</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EditProjectPage;
