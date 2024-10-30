/* eslint-disable @next/next/no-img-element */
"use client"

import { IProject } from '@/models/Project';
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from 'react';
import { DataTable } from '../../../../../components/DataTable';

const columns: ColumnDef<IProject>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
  },
  {
    id: 'githubLink',
    header: 'GitHub Link',
    accessorKey: 'githubLink',
    cell: (context) => {
      const value = context.getValue() as string;
      return <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>;
    },
  },
  {
    id: 'demoLink',
    header: 'Demo Link',
    accessorKey: 'demoLink',
    cell: (context) => {
      const value = context.getValue() as string;
      return <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>;
    },
  },
  {
    id: 'category',
    header: 'Category',
    accessorKey: 'category',
  },
  {
    id: 'imageUrl',
    header: 'Image',
    accessorKey: 'imageUrl',
    cell: (context) => {
      const value = context.getValue() as string;
      return (
        <img
          src={value}
          alt="Project"
          style={{
            maxHeight: '50px',
            maxWidth: '100px',
            objectFit: 'contain'
          }}
        />
      );
    },
  },
  {
    id: 'edit',
    header: 'Edit',
    cell: (context) => {
      const projectId = context.row.original._id;
      return (
        <button onClick={() => window.location.href = `/admin/project/${projectId}`}>
          Edit
        </button>
      );
    },
  },
];

const ProjectsPage = () => {
  const [projects, setProjects] = useState<IProject[]>([]);
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
    <div className="w-full">
      <DataTable columns={columns} data={projects} CreateButton={
        <>

        </>
      } filterOn='name' name='Projects' />
    </div>
  );
};

export default ProjectsPage;
