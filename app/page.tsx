"use client"

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AboutSection from "./components/sections/About";
import AchievementsSection from "./components/sections/Achievements";
import BlogSection from "./components/sections/Blog";
import ContactSection from "./components/sections/Contact";
import ProfileSection from "./components/sections/Profile";
import ProjectsSection from "./components/sections/Projects";
import SkillsSection from "./components/sections/Skills";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col bg-[#121212]">
        <Navbar />
        <div className="container mt-24 mx-auto px-12 py-4">
          <ProfileSection />
          <AchievementsSection/>
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
