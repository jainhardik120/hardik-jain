"use client"

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useState } from "react";
import { IProject } from "@/models/Project";

export const ProjectCard: React.FC<{ project: IProject }> = ({ project }) => {
  const [dialogOpened, setDialogOpened] = useState(false);
  const {
    name,
    githubLink,
    demoLink,
    imageUrl,
    content,
    shortDescription,
    techStack
  } = project;

  return (
    <>
      <div className="relative md:h-[196px] max-w-[350px] overflow-hidden flex items-end rounded-lg group cursor-pointer" onClick={() => { setDialogOpened(true) }}>
        <Image
          src={imageUrl}
          alt={name}
          className="transition-transform duration-300 group-hover:scale-110 w-full h-full object-cover"
          width={600}
          height={400}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h5 className="text-4xl font-semibold text-white mb-4">{name}</h5>
        </div>
      </div>
      <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {name}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p>{shortDescription}</p>
            <div className="mt-4">
              <h6 className="font-semibold">Tech Stack:</h6>
              <ul className="list-disc list-inside">
                {techStack.map((tech, index) => (
                  <li key={index}>{tech}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h6 className="font-semibold">Description:</h6>
              <p className="max-h-[50vh] overflow-y-auto">{content}</p>
            </div>
          </div>
          <DialogFooter>
            <div className="flex flex-row gap-4">
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  Github
                </a>
              )}
              {demoLink && (
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600"
                >
                  Preview
                </a>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
