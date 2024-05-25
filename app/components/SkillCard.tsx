/* eslint-disable @next/next/no-img-element */
import { SubSkill } from "./Skills";
interface SkillCardProps {
  title: string;
  skills: SubSkill[]
}

const SkillCard: React.FC<SkillCardProps> = ({ title, skills }) => {
  return (
    <div className="border-[1px] border-black dark:border-white rounded-lg w-[350px] py-4">
      <h3 className="text-2xl text-center mb-4">{title}</h3>
      <div className="px-4 ms-4">
        {skills.map((skill, index) => {
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
      </div>
    </div>

  );
};

export default SkillCard;