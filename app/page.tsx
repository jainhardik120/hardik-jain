"use client"

import SkillsSection from "./components/sections/Skills";
import AboutSection from "./components/sections/About";
import ProfileSection from "./components/sections/Profile";
import ProjectsSection from "./components/sections/Projects";
import BlogSection from "./components/sections/Blog";
import ContactSection from "./components/sections/Contact";
import NavBar from "./components/Navbar";

export default function Home() {
  return (
    <>
      <NavBar />
      <ProfileSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
