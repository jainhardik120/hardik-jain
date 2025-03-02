'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { EditSkillDialog } from './EditSkillDialog';
import { NewSkillDialog } from './NewSkillDialog';
import type { SkillWithSubSkills } from '@/types';
import { api } from '@/server/api/react';

export default function SkillsPage() {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [editDialogOpened, setEditDialogOpened] = useState(false);
  const [skills, setSkills] = useState<SkillWithSubSkills[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillWithSubSkills | null>(null);

  const { data } = api.portfolio.getSkills.useQuery();

  useEffect(() => {
    if (data) {
      setSkills(data);
    }
  }, [data]);

  const addSkill = (newSkill: SkillWithSubSkills): void => {
    setSkills((prevSkills) => [...prevSkills, newSkill]);
  };

  const updateSkill = (updatedSkill: SkillWithSubSkills): void => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) => (skill.id === updatedSkill.id ? updatedSkill : skill)),
    );
  };

  const deleteSkill = (id: string): void => {
    setSkills((prevSkills) => prevSkills.filter((skill) => skill.id !== id));
  };

  return (
    <div className="flex w-full justify-center flex-row">
      <div className="flex flex-col gap-4 m-4 items-end w-full max-w-2xl">
        <Accordion type="single" collapsible className="w-full">
          {skills.length > 0 &&
            skills.map((skill) => {
              return (
                <AccordionItem key={skill.id} value={skill.id}>
                  <div className="flex flex-row w-full justify-between px-4 items-center">
                    <AccordionTrigger>
                      <p>{skill.name}</p>
                    </AccordionTrigger>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedSkill(skill);
                        setEditDialogOpened(true);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                  <AccordionContent>
                    <div className="px-4 flex flex-col gap-2">
                      {skill.skills.length > 0 &&
                        skill.skills.map((subskill, index) => (
                          <div key={index} className="flex flex-row justify-between">
                            <span>{subskill.name}</span>
                            <span>{subskill.level}</span>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
        </Accordion>
        <Button onClick={() => setDialogOpened(true)}>Create new skillset</Button>
        <NewSkillDialog
          dialogOpened={dialogOpened}
          setDialogOpened={setDialogOpened}
          addSkill={addSkill}
        />
        <EditSkillDialog
          dialogOpened={editDialogOpened}
          setDialogOpened={setEditDialogOpened}
          skill={selectedSkill}
          updateSkill={updateSkill}
          deleteSkill={deleteSkill}
        />
      </div>
    </div>
  );
}
