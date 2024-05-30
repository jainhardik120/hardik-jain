/* eslint-disable @next/next/no-img-element */

import { ISkill } from "@/models/Skill";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


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
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAV1JREFUSEu1lY1tAjEMhc0msEmZhDIJ7SS0k7SblE2AD8WnF2M3qdSLdCLcOe/Zzz/Z2MprszK+zRJszezVzA7NoW8ze7+/u4wcnCEA/GxmLwEM8P2IpCJQj9mz8PrY9k7oEZQRZQQA/iSh78TbzCaNKCPAO/RWjwHkvy5sPu6PSogNsi0rI8B7DmEYQaucekREQaQlgYaukoyKhe/XZtSd0whitVCGbwUytlQVErHYf7V9lwslUO07HQOJOqJO6HuIHxWnBK59Jg2RuLdaop3eLXfgLLlQAkIk1JhcwE/tEAexeUpmItUDWwkUSDuU0CH3hqvAhxJFIDR0WfwbTkVZsiQvNrEPfitTvlXDTc91mP/VaFqmQwJPtg4wxkLsiWxULOXppV0NO02q284Mu6f8/HVc+yWj9wN5+ay6fvbCySKqyrVr/BkCDlAlNBu/PKXHcXbNEsxM09RmdYIbrgthGVoXaB8AAAAASUVORK5CYII="
                alt="badge"
                className="w-6 h-6 mr-4 dark:filter dark:invert"
              />
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