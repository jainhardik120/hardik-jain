"use client"

import Navbar from "./components/Navbar";
import AboutSection from "./components/About";
import BlogSection from "./components/Blog";
import ContactSection from "./components/Contact";
import ProfileSection from "./components/Profile";
import ProjectsSection from "./components/Projects";
import SkillsSection from "./components/Skills";

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