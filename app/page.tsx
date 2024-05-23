"use client"

import Image from "next/image";

export default function Home() {
  return (
    <>
      <section id="profile">
        <div className="w-full flex justify-center items-center">
          {/* <Image src={about_pic} height={400} width={400} alt="Profile Pic" /> */}
          <div className="ml-8">
            <p className="text-xl">Hello, I&apos;m</p>
            <p className="text-6xl font-medium">Hardik Jain</p>
            <p className="text-3xl">Software Developer</p>
            <div className="mt-4">
              <button type="button" onClick={() => {

              }}>
                Download CV
              </button>
            </div>
          </div>
        </div>
      </section>
      <section id="about">
        <p className="section_header">About Me</p>
        <div className="max-w-3xl pt-20">

          <div className="section-content">
            <h3 className="subheading">Education</h3>
            <p>
              I am currently pursuing a Bachelor&apos;s degree in <span className="important-text"> Computer Science</span> at<span className="important-text"> Jaypee Institute of Information Technology</span>, where I have maintained a GPA of <span className="important-text">9.1</span>.
            </p>
          </div>
          <div className="section-content">
            <h3 className="subheading">Knowledge</h3>
            <ul className="list">
              <li>Data Structures and Algorithms (DSA)</li>
              <li>Object-Oriented Programming (OOP)</li>
              <li>Computer Networks</li>
              <li>Database Management Systems (DBMS)</li>
              <li>Operating Systems (OS)</li>
              <li>Other core Computer Science subjects</li>
            </ul>
          </div>
          <div className="section-content">
            <h3 className="subheading">Development Experience</h3>
            <p>
              I am an experienced Android and web developer with several published applications that have been downloaded thousands of times.
            </p>
          </div>
          <div className="section-content">
            <h3 className="subheading">Achievements</h3>
            <p>
              I have solved over <span className="important-text">500 problems</span> on LeetCode, showcasing my strong problem-solving abilities.
            </p>
            <p>
              My android application <span className="important-text">JIIT Buddy</span> has reached a total of <span className="important-text">5000+</span> downloads on Play Store
            </p>
          </div>
        </div>
      </section>
      <section id="skills">
        <p className="section_header">Skills</p>
      </section>
      <section id="projects">
        <p className="section_header">Projects</p>
      </section>
      <section id="blog">
        <p className="section_header">Blog</p>
      </section>
      <section id="contact">
        <p className="section_header">Contact Me</p>
      </section>
    </>
  );
}
