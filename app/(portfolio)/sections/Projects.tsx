import { getProjectsGroupedByCategory } from "@/app/actions";
import { UI } from "./ProjectsUI";

export default async function ProjectSection() {
  const { categories, projectsByCategory } = await getProjectsGroupedByCategory();
  return (
    <UI categories={categories} projectsByCategory={projectsByCategory} initialCategory={(categories && categories.length > 0) ? categories[0] : ""} />
  );
}
