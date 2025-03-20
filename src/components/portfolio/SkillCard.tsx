import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SkillWithSubSkills } from '@/types';
import { BadgeCheck } from 'lucide-react';

const SkillCard: React.FC<{ skill: SkillWithSubSkills }> = ({ skill }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          <h3>{skill.name}</h3>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {skill.skills.map((subskill, index) => {
          return (
            <div key={index} className="flex items-center my-2">
              <BadgeCheck className="w-6 h-6 mr-4" />
              <div>
                <p className="text-secondary-foreground">{subskill.name}</p>
                <span className="text-muted-foreground">{subskill.level}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default SkillCard;
