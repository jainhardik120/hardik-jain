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

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    async function fetchProjects() {
      const fProjects: Project[] = await (await fetch("/api/projects")).json();
      setProjects(fProjects);
      setFilteredProjects(fProjects); // Initially, display all projects
      const uniqueCategories = Array.from(new Set(fProjects.map(project => project.category)));
      setCategories(uniqueCategories);
    }
    fetchProjects();
  }, []);
  const handleCategoryFilter = (category: string) => {
    if (category === "All") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => project.category === category);
      setFilteredProjects(filtered);
    }
  };
  return (
    <>
      <section id="projects">
        <p className="section_header">Projects</p>
        <div className="max-w-3xl">
          <div className="category-buttons">
            <button type="button" onClick={() => handleCategoryFilter("All")}>All</button>
            {categories.map(category => (
              <button type="button" key={category} onClick={() => handleCategoryFilter(category)}>
                {category}
              </button>
            ))}
          </div>
          <div className="card-layout">
            {filteredProjects.map(project => (
              <div key={project._id} className="card">
                <h3>{project.name}</h3>
                <p>Category: {project.category}</p>
                <img src={project.imageUrl} alt={project.name} />
                <a href={project.githubLink}>Github Link</a>
                <a href={project.demoLink}>Demo Link</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ProjectsSection;
