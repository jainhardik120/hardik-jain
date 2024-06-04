import { ISkill } from "@/models/Skill";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BadgeCheck } from "lucide-react";


const SkillCard: React.FC<{ skill: ISkill }> = ({ skill }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">{skill.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {skill.skills.map((skill, index) => {
          return (
            <div key={index} className="flex items-center my-2">
              <BadgeCheck className="w-6 h-6 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">{skill.name}</h3>
                <span className="text-sm text-tsecondary-light dark:text-tsecondary-dark">{skill.level}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card >
  );
};

export default SkillCard;