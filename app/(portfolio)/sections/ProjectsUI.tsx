/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectTag } from "./ProjectTag";
import { IProject } from "@/models/Project";

interface ProjectGroup {
  _id: string;
  projects: IProject[];
}

interface UIProps {
  categories: string[];
  projectsByCategory: ProjectGroup[];
  initialCategory: string;
}

export const UI: React.FC<UIProps> = ({ categories, projectsByCategory, initialCategory }) => {
  const [category, setCategory] = useState<string>(initialCategory);

  const handleCategoryChange = (tcategory: string) => {
    setCategory(tcategory);
  };

  return (
    <>
      <section id="projects">
        <h2 className="text-center text-4xl font-bold mt-4 mb-8 md:mb-12">
          My Projects
        </h2>
        <div className="flex flex-row justify-center items-center gap-4 mb-8 md:mb-12">
          {categories.map(tcategory => (
            <ProjectTag
              key={tcategory}
              onClick={() => handleCategoryChange(tcategory)}
              name={tcategory}
              isSelected={category === tcategory}
            />
          ))}
        </div>
        {projectsByCategory.map(group => (
          <div key={group._id} style={{ display: category === group._id ? 'block' : 'none' }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {group.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.name}
                  description={""}
                  imgUrl={project.imageUrl}
                  gitUrl={project.githubLink}
                  previewUrl={project.demoLink}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
};