"use client";

import React, { useState } from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectTag } from "./ProjectTag";
import { IProject } from "@/models/Project";
import { cn } from "@/lib/utils";

interface ProjectGroup {
  _id: string;
  projects: IProject[];
}

interface UIProps {
  categories: string[];
  projectsByCategory: ProjectGroup[];
  initialCategory: string;
}

const ProjectsSection: React.FC<UIProps> = ({ categories, projectsByCategory, initialCategory }) => {
  const [category, setCategory] = useState<string>(initialCategory);
  const handleCategoryChange = (tcategory: string) => {
    setCategory(tcategory);
  };
  return (
    <>
      <section id="projects" className="px-12">
        <h2 className="text-center text-4xl font-bold mt-4 mb-8 md:mb-12">
          My Projects
        </h2>
        <div className={cn(`grid grid-cols-1 md:grid-cols-${categories.length}  justify-center items-center gap-4 mb-8 md:mb-12`)}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ">
              {group.projects.map((project, index) => (
                <>
                  <div
                    key={index}>
                    <ProjectCard
                      title={project.name}
                      description={""}
                      imgUrl={project.imageUrl}
                      gitUrl={project.githubLink}
                      previewUrl={project.demoLink}
                    />
                  </div>
                </>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default ProjectsSection;