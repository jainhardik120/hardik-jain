// pages/projects.js
"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IProject } from '@/models/Project';

const ProjectsPage = () => {
  const [projects, setProjects] = useState<IProject[]>([]);

  useEffect(() => {
    // Fetch projects data from your API endpoint
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
      <h1>Projects</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Github Link</th>
            <th>Demo Link</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td><a href={project.githubLink} target="_blank" rel="noopener noreferrer">{project.githubLink}</a></td>
              <td><a href={project.demoLink} target="_blank" rel="noopener noreferrer">{project.demoLink}</a></td>
              <td>{project.category}</td>
              <td>
                <Link href={`/admin/project/${project.id}`}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsPage;
