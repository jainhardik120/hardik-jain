/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";

type Project = {
  _id: string,
  name: string,
  githubLink: string,
  demoLink: string,
  category: string,
  imageUrl: string
}


const ProjectTag: React.FC<{ name: string, onClick: (name: string) => void, isSelected: boolean }> = ({ name, onClick, isSelected }) => {
  const buttonStyles = isSelected
    ? "border-primary-500 dark:border-primary-300"
    : "border-slate-600 hover:border-black dark:text-[#6B7280] dark:border-gray-500 dark:hover:border-gray-300";

  return (
    <button
      type="button"
      className={`${buttonStyles} rounded-full border-2 px-6 py-3 text-xl cursor-pointer`}
      onClick={() => onClick(name)}
    >
      {name}
    </button>
  );
};


const ProjectCard: React.FC<{ imgUrl: string, title: string, description: string, gitUrl: string, previewUrl: string }> = ({ imgUrl, title, description, gitUrl, previewUrl }) => {
  return (
    <div className="relative md:h-[196px] md:w-[350px] overflow-hidden flex items-end rounded-lg group">
      <img
        src={imgUrl}
        alt={title}
        className="transition-transform duration-300 group-hover:scale-110 w-full h-full object-cover"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h5 className="text-4xl font-semibold text-white mb-4">{title}</h5>
        <div className="flex justify-center space-x-8">
          <a
            href={gitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 text-gray-400 group-hover:text-white flex items-center justify-center underline underline-offset-2"
          >
            Github
          </a>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 w-10 text-gray-400 group-hover:text-white flex items-center justify-center underline underline-offset-2"
          >
            Preview
          </a>
        </div>
      </div>
    </div>
  );
};


const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    async function fetchProjects() {
      const fProjects: Project[] = await (await fetch("/api/projects")).json();
      setProjects(fProjects);
      const uniqueCategories = Array.from(new Set(fProjects.map(project => project.category)));
      setCategories(uniqueCategories);
      setCategory(uniqueCategories[0])
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = projects.filter(project => project.category === category);
    setFilteredProjects(filtered);
  }, [category, projects]);

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
              onClick={handleCategoryChange}
              name={tcategory}
              isSelected={category === tcategory}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              title={project.name}
              description={""}
              imgUrl={project.imageUrl}
              gitUrl={project.githubLink}
              previewUrl={project.demoLink}
            />
          ))}
        </div>
      </section>
    </>
  )
}

export default ProjectsSection;
