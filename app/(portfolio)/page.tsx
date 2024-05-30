import AboutSection from "./sections/About";
import BlogSection from "./sections/Blog";
import ContactSection from "./sections/Contact";
import ProfileSection from "./sections/Profile";
import ProjectsSection from "./sections/Projects";
import SkillsSection from "./sections/Skills";

export default function Home() {
  return (
    <>
      <div className="container mx-auto px-2 sm:px-12 py-4">
        <ProfileSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <BlogSection />
        <ContactSection />
      </div>
    </>
  );
}