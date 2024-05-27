/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CardTitle, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import onUpload from '@/lib/ImageUpload';

const EditProjectPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const router = useRouter();
  const projectId = params.id;

  const [project, setProject] = useState({
    name: '',
    githubLink: '',
    demoLink: '',
    category: '',
    imageUrl: '',
    content: ''
  });

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        const data = await response.json();
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        body: JSON.stringify(project),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if(response.ok){
        router.back();
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const [image, setImage] = useState<File | undefined>();

  return (
    <Card className="max-w-2xl lg:w-full mx-auto lg:max-w-5xl">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Edit Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className='grid gap-4 lg:grid-cols-2'>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={project.name}
                    onChange={handleChange}
                    placeholder="Enter project name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="githubLink">GitHub Link</Label>
                  <Input
                    id="githubLink"
                    name="githubLink"
                    value={project.githubLink}
                    onChange={handleChange}
                    placeholder="Enter GitHub repository link"
                  />
                </div>
              </div>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="demoLink">Demo Link</Label>
                  <Input
                    id="demoLink"
                    name="demoLink"
                    value={project.demoLink}
                    onChange={handleChange}
                    placeholder="Enter live demo link"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={project.category}
                    onChange={handleChange}
                    placeholder="Enter project category"
                  />
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
                    name="content"
                    value={project.content}
                    onChange={handleChange}
                    placeholder="Enter project description"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Image</Label>
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt="Uploaded"
                    style={{ maxWidth: '100%' }}
                  />
                )}
                <div className="flex items-center gap-2">
                  <Input id="image" type="file" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImage(e.target.files[0])
                    }
                  }} />
                  <Button variant="outline" type="button" onClick={
                    async () => {
                      if (image) {
                        const url = await onUpload(image);
                        setProject(prevState => ({
                          ...prevState,
                          ["imageUrl"]: url
                        }));
                      }
                    }
                  }>Upload</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.back()} variant="ghost">Cancel</Button>
          <Button type="submit" className="ml-auto">Save Changes</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EditProjectPage;
