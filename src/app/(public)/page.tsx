import { getProjectsGroupedByCategory, getSkills, getAllPosts } from '@/actions/portfolio';
import AboutSection from '@/components/portfolio/AboutSection';
import BlogSection from '@/components/portfolio/BlogSection';
import ContactSection from '@/components/portfolio/ContactSection';
import ProfileSection from '@/components/portfolio/ProfileSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import SkillsSection from '@/components/portfolio/Skills';

export default async function Home() {
  const { categories, projectsByCategory } = await getProjectsGroupedByCategory();
  const skills = await getSkills();
  const blogs = await getAllPosts();

  return (
    <main>
      <ProfileSection />
      <AboutSection />
      <SkillsSection skills={skills} />
      <ProjectsSection
        categories={categories}
        projectsByCategory={projectsByCategory}
        initialCategory={categories.length > 0 ? (categories[0] ?? '') : ''}
      />
      <BlogSection blogs={blogs} />
      <ContactSection />
    </main>
  );
}
