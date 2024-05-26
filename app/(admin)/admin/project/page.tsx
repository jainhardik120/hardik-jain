// pages/projects.js
"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IProject } from '@/models/Project';
import { TableHeader, TableRow, TableCell, Table, TableHead, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';


const ProjectsPage = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const data: IProject[] = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Github Link</TableHead>
            <TableHead>Demo Link</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody >
          {projects.map((project) => (
            <TableRow key={project._id as string}>
              <TableCell>{project.name}</TableCell>
              <TableCell><a href={project.githubLink} target="_blank" rel="noopener noreferrer">{project.githubLink}</a></TableCell>
              <TableCell><a href={project.demoLink} target="_blank" rel="noopener noreferrer">{project.demoLink}</a></TableCell>
              <TableCell>{project.category}</TableCell>
              <TableCell>
                <Button onClick={() => router.push(`/admin/project/${project._id}`)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div >
  );
};

export default ProjectsPage;
