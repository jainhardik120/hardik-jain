"use server"

import { getSkills } from "../../actions";
import SkillCard from "./components/SkillCard";

export default async function SkillsSection() {
  const skills = await getSkills();
  return (
    <section id="skills">
      <h2 className="text-center text-4xl font-bold mt-4 mb-8 md:mb-12">
        Skills
      </h2>
      <div className="mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 ">
          {skills.map((skillSet, index) => (
            <SkillCard key={index} skill={skillSet} />
          ))}
        </div>
      </div>
    </section>
  );
};