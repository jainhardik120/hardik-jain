import AboutSection from "./sections/About";
import BlogSection from "./sections/Blog";
import ContactSection from "./sections/Contact";
import ProfileSection from "./sections/Profile";
import ProjectsSection from "./sections/Projects";
import SkillsSection from "./sections/Skills";

export default function Home() {
  return (
    <>
      <ProfileSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}