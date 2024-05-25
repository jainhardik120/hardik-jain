import SkillCard from "./SkillCard";
import { useEffect, useState } from "react";

export type SubSkill = {
  name: string,
  level: string
}

export type Skill = {
  name: string,
  skills: SubSkill[]
}

const SkillsSection: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  useEffect(() => {
    async function fetchSkills() {
      const fSkills: Skill[] = await (await fetch("/api/skills")).json();
      setSkills(fSkills);
    }
    fetchSkills();
  }, []);

  return (
    <section id="skills">
      <h2 className="text-center text-4xl font-bold mt-4 mb-8 md:mb-12">
        Skills
      </h2>
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 ">
          {skills.map((skillSet, index) => (
            <SkillCard key={index} title={skillSet.name} skills={skillSet.skills} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;