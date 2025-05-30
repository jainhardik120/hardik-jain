'use client';

import React, { useState, useCallback } from 'react';

import { cn } from '@/lib/utils';

import { ProjectCard } from './ProjectCard';
import { ProjectTag } from './ProjectTag';

import type { Project } from '@prisma/client';

interface ProjectGroup {
  id: string;
  projects: Project[];
}

interface UIProps {
  categories: string[];
  projectsByCategory: ProjectGroup[];
  initialCategory: string;
}

const ProjectsSection: React.FC<UIProps> = ({
  categories,
  projectsByCategory,
  initialCategory,
}) => {
  const [category, setCategory] = useState<string>(initialCategory);

  const handleCategoryChange = useCallback((tcategory: string): void => {
    setCategory(tcategory);
  }, []);

  return (
    <section id="projects" className="mx-auto container px-12 py-20 flex flex-col items-center">
      <h2 className="text-center mb-12">My Projects</h2>
      <div className={cn('grid md:grid-cols-3 justify-center items-center gap-4 mb-12')}>
        {categories.map((tcategory) => (
          <ProjectTag
            key={tcategory}
            onClick={() => handleCategoryChange(tcategory)}
            name={tcategory}
            isSelected={category === tcategory}
          />
        ))}
      </div>
      {projectsByCategory.map((group) => {
        return (
          <div key={group.id} className={cn(`${category === group.id ? 'block' : 'hidden'}`)}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {group.projects.map((project, index) => (
                <div key={index}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ProjectsSection;
