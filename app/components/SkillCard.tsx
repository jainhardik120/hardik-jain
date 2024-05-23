interface SkillCardProps {
    title : string;
    skills : string[]
}

const SkillCard : React.FC<SkillCardProps> = ({ title, skills }) => {
  return (
    <div className="rounded-lg p-6 border-2">
      <h3 className="subheading text-xl font-semibold mb-4">{title}</h3>
      <ul className="list-disc pl-5">
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default SkillCard;