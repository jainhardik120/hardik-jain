'use client';

import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useState, useMemo } from 'react';
import type { Project } from '@prisma/client';
import { DialogTitle } from '@radix-ui/react-dialog';

export const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const { name, githubLink, demoLink, imageUrl } = project;

  const memoizedImage1 = useMemo(
    () => (
      <Image
        src={imageUrl.length > 0 ? imageUrl : '/images/project-default-image.jpg'}
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
        src={project.imageUrl.length > 0 ? project.imageUrl : '/images/project-default-image.jpg'}
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
          <h5 className="text-4xl font-semibold text-white mb-4">{name}</h5>
        </div>
      </div>
      <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
        <DialogTitle />
        <DialogContent className="max-w-4xl">
          <div className="grid gap-4 items-start">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-2xl font-bold">{project.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">{project.shortDescription}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((techStack, index) => (
                  <div key={index}>{techStack}</div>
                ))}
              </div>
            </div>
            <div className="max-h-[50vh] overflow-y-auto">
              <div className="w-full mb-4 flex items-center justify-center sm:w-auto sm:inline-block overflow-hidden sm:float-end sm:ml-4 sm:mb-1">
                {memoizedImage2}
              </div>
              <p className="text-justify text-gray-500 dark:text-gray-400">{project.content}</p>
            </div>
            <div className="flex gap-4">
              {githubLink.length > 0 && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                >
                  Github
                </a>
              )}
              {demoLink.length > 0 && (
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200  bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                >
                  Preview
                </a>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
