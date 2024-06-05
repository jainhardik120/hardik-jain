import { getSkills } from "@/lib/actions/getSkills";
import SkillCard from "./SkillCard";

export default async function SkillsSection() {
  const skills = await getSkills();
  return (
    <section id="skills" className="container mx-auto px-12 py-20">
      <h2 className="text-center text-4xl font-bold mb-8 md:mb-12">
        Skills
      </h2>
      <div className="mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 ">
          {skills.map((skillSet, index) => (
            <SkillCard key={index} skill={skillSet} />
          ))}
        </div>
      </div>
    </section>
  );
};