/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline";
import { motion, useInView } from "framer-motion";

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
    ? "text-white border-primary-500"
    : "text-[#ADB7BE] border-slate-600 hover:border-white";
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
    <div>
      <div
        className="h-52 md:h-72 rounded-t-xl relative group"
        style={{ background: `url(${imgUrl})`, backgroundSize: "cover" }}
      >
        <div className="overlay items-center justify-center absolute top-0 left-0 w-full h-full bg-[#181818] bg-opacity-0 hidden group-hover:flex group-hover:bg-opacity-80 transition-all duration-500 ">
          <Link
            href={gitUrl}
            className="h-14 w-14 mr-2 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link"
          >
            <CodeBracketIcon className="h-10 w-10 text-[#ADB7BE] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  cursor-pointer group-hover/link:text-white" />
          </Link>
          <Link
            href={previewUrl}
            className="h-14 w-14 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link"
          >
            <EyeIcon className="h-10 w-10 text-[#ADB7BE] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  cursor-pointer group-hover/link:text-white" />
          </Link>
        </div>
      </div>
      <div className="text-white rounded-b-xl mt-3 bg-[#181818]py-6 px-4">
        <h5 className="text-xl font-semibold mb-2">{title}</h5>
        <p className="text-[#ADB7BE]">{description}</p>
      </div>
    </div>
  );
};


const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    async function fetchProjects() {
      const fProjects: Project[] = await (await fetch("/api/projects")).json();
      setProjects(fProjects);
      setFilteredProjects(fProjects);
      const uniqueCategories = Array.from(new Set(fProjects.map(project => project.category)));
      setCategories(uniqueCategories);
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    if (category === "All") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => project.category === category);
      setFilteredProjects(filtered);
    }
  }, [category, projects]);

  const handleCategoryChange = (tcategory: string) => {
    setCategory(tcategory);
  };

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <>
      <section id="projects">
        <h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
          My Projects
        </h2>
        <div className="text-white flex flex-row justify-center items-center gap-2 py-6">
          <ProjectTag
            onClick={handleCategoryChange}
            name="All"
            isSelected={category === "All"}
          />
          {categories.map(tcategory => (
            <ProjectTag
              key={tcategory}
              onClick={handleCategoryChange}
              name={tcategory}
              isSelected={category === tcategory}
            />
          ))}
        </div>
        <ul ref={ref} className="grid md:grid-cols-3 gap-8 md:gap-12">
          {filteredProjects.map((project, index) => (
            <motion.li
              key={index}
              variants={cardVariants}
              initial="initial"
              animate={isInView ? "animate" : "initial"}
              transition={{ duration: 0.3, delay: index * 0.4 }}
            >
              <ProjectCard
                key={project._id}
                title={project.name}
                description={""}
                imgUrl={project.imageUrl}
                gitUrl={project.githubLink}
                previewUrl={project.demoLink}
              />
            </motion.li>
          ))}
        </ul>
      </section>
    </>
  )
}

export default ProjectsSection;
