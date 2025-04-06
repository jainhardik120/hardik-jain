import { getProjectsGroupedByCategory, getSkills, getAllPosts } from '@/actions/portfolio';
import AboutSection from '@/components/portfolio/AboutSection';
import BlogSection from '@/components/portfolio/BlogSection';
import ContactSection from '@/components/portfolio/ContactSection';
import ProfileSection from '@/components/portfolio/ProfileSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import SkillsSection from '@/components/portfolio/Skills';
import Footer from '@/components/site/site-footer';

import type { WebSite, WithContext } from 'schema-dts';

export default async function Home() {
  const { categories, projectsByCategory } = await getProjectsGroupedByCategory();
  const skills = await getSkills();
  const blogs = await getAllPosts();
  const jsonLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hardik Jain',
    url: 'https://hardikja.in',
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
      <Footer />
    </>
  );
}
