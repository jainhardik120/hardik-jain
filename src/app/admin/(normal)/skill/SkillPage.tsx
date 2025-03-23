'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { EditSkillDialog } from './EditSkillDialog';
import { NewSkillDialog } from './NewSkillDialog';
import type { SkillWithSubSkills } from '@/types';
import { DataTable } from '@/components/DataTable';

export default function SkillsPage({ data }: { data: SkillWithSubSkills[] }) {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [editDialogOpened, setEditDialogOpened] = useState(false);
  const [skills, setSkills] = useState<SkillWithSubSkills[]>(data);
  const [selectedSkill, setSelectedSkill] = useState<SkillWithSubSkills | null>(null);

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
    <>
      <DataTable
        columns={[
          {
            id: 'name',
            header: 'Name',
            accessorKey: 'name',
          },
          {
            id: 'edit',
            cell: (context) => {
              const skillId = context.row.original.id;
              return (
                <div className="w-full flex flex-row items-center justify-center">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedSkill(skills.find((skill) => skill.id === skillId) ?? null);
                      setEditDialogOpened(true);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              );
            },
          },
        ]}
        data={skills}
        CreateButton={<Button onClick={() => setDialogOpened(true)}>Create new skillset</Button>}
        filterOn="name"
        name="Skills"
      />
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
    </>
  );
}
