"use client"

import Navbar from "./components/Navbar";
import AboutSection from "./components/sections/About";
import BlogSection from "./components/sections/Blog";
import ContactSection from "./components/sections/Contact";
import ProfileSection from "./components/sections/Profile";
import ProjectsSection from "./components/sections/Projects";
import SkillsSection from "./components/sections/Skills";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col">
        <Navbar />
        <div className="container mx-auto px-12 py-4">
          <ProfileSection />
          <AboutSection />
          <SkillsSection />
          <ProjectsSection />
          <BlogSection />
          <ContactSection />
        </div>
      </main>
    </>
  );
}