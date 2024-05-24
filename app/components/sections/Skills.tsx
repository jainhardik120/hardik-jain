import SkillCard from "../SkillCard";
import { useEffect, useState } from "react";

export type SubSkill = {
  name: string,
  level: string
}

export type Skill = {
  name: string,
  skills: SubSkill[]
}

async function getSkills() {
  const fSkills: Skill[] = await (await fetch("/api/skills")).json();
  return fSkills;
}

const SkillsSection: React.FC = async () => {
  const skills = await getSkills();
  return (
    <section id="skills">
      <p className="section_header">Skills</p>
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ">
          {skills.map((skillSet, index) => (
            <SkillCard key={index} title={skillSet.name} skills={skillSet.skills} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
