import { getProjectsGroupedByCategory } from "../../lib/actions/getProjectsGroupedByCategory";
import AboutSection from "../../components/sections/AboutSection";
import BlogSection from "../../components/sections/BlogSection";
import ContactSection from "../../components/sections/ContactSection";
import ProfileSection from "../../components/sections/ProfileSection";
import ProjectsSection from "../../components/sections/ProjectsSection";
import SkillsSection from "../../components/sections/Skills";

export default async function Home() {
  const { categories, projectsByCategory } = await getProjectsGroupedByCategory();
  return (
    <div className="h-screen">
      <ProfileSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection categories={categories} projectsByCategory={projectsByCategory} initialCategory={(categories && categories.length > 0) ? categories[0] : ""} />
      <BlogSection />
      <ContactSection />
    </div>
  );
}