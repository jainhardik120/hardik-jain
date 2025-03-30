'use client';

import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState, useMemo } from 'react';
import type { Project } from '@prisma/client';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Button } from '../ui/button';

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const { name, githubLink, demoLink, imageUrl } = project;

  const memoizedImage1 = useMemo(
    () => (
      <Image
        src={imageUrl}
        alt={name}
        className="transition-transform duration-300 group-hover:scale-110 w-full h-full object-cover"
        width={600}
        height={400}
      />
    ),
    [imageUrl, name],
  );

  const memoizedImage2 = useMemo(
    () => (
      <Image
        src={project.imageUrl}
        width="400"
        height="400"
        alt="Project Screenshot"
        className="rounded-lg"
      />
    ),
    [project.imageUrl],
  );

  return (
    <>
      <div
        className="relative md:h-[196px] max-w-[350px] overflow-hidden flex items-end rounded-lg group cursor-pointer"
        onClick={() => {
          setDialogOpened(true);
        }}
      >
        {memoizedImage1}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h3 className="text-white mb-4">{name}</h3>
        </div>
      </div>
      <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
        <DialogTitle />
        <DialogContent className="max-w-4xl">
          <div className="grid gap-4 items-start">
            <div className="flex flex-col gap-4">
              <div>
                <h2>{project.name}</h2>
                <p className="text-muted-foreground">{project.shortDescription}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((techStack, index) => (
                  <span key={index} className="text-sm text-muted-foreground">
                    {techStack}
                  </span>
                ))}
              </div>
            </div>
            <div className="max-h-[50vh] overflow-y-auto">
              <div className="w-full mb-4 flex items-center justify-center sm:w-auto sm:inline-block overflow-hidden sm:float-end sm:ml-4 sm:mb-1">
                {memoizedImage2}
              </div>
              <p className="text-justify text-secondary-foreground">{project.content}</p>
            </div>
            <div className="flex gap-4">
              {githubLink.length > 0 && (
                <a href={githubLink} target="_blank" rel="noopener noreferrer">
                  <Button>Github</Button>
                </a>
              )}
              {demoLink.length > 0 && (
                <a href={demoLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary">Demo</Button>
                </a>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
