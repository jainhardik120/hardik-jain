/* eslint-disable @next/next/no-img-element */
"use client";

import { DataTable } from "@/components/DataTable";
import { Project } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

const columns: ColumnDef<Project>[] = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
  },
  {
    id: "githubLink",
    header: "GitHub Link",
    accessorKey: "githubLink",
    cell: (context) => {
      const value = context.getValue() as string;
      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      );
    },
  },
  {
    id: "demoLink",
    header: "Demo Link",
    accessorKey: "demoLink",
    cell: (context) => {
      const value = context.getValue() as string;
      return (
        <a href={value} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      );
    },
  },
  {
    id: "category",
    header: "Category",
    accessorKey: "category",
  },
  {
    id: "imageUrl",
    header: "Image",
    accessorKey: "imageUrl",
    cell: (context) => {
      const value = context.getValue() as string;
      return (
        <img
          src={value}
          alt="Project"
          style={{
            maxHeight: "50px",
            maxWidth: "100px",
            objectFit: "contain",
          }}
        />
      );
    },
  },
  {
    id: "edit",
    header: "Edit",
    cell: (context) => {
      const projectId = context.row.original.id;
      return (
        <button
          onClick={() => (window.location.href = `/admin/project/${projectId}`)}
        >
          Edit
        </button>
      );
    },
  },
];

const ProjectsPage = () => {
  const [projects] = useState<Project[]>([]);
  useEffect(() => {}, []);

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={projects}
        CreateButton={<></>}
        filterOn="name"
        name="Projects"
      />
    </div>
  );
};

export default ProjectsPage;
