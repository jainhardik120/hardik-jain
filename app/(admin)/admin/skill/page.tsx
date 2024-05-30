"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";


import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react"
import { SubSkill } from "@/models/Skill";
import { EditSkillDialog } from "./EditSkillDialog";
import { NewSkillDialog } from "./NewSkillDialog";

export interface ISkill {
  _id: string;
  name: string;
  skills: SubSkill[];
}

export default function SkillsPage() {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [editDialogOpened, setEditDialogOpened] = useState(false);
  const [skills, setSkills] = useState<ISkill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<ISkill | null>(null);

  useEffect(() => {
    const getSkills = async () => {
      const response = await fetch("/api/skills");
      setSkills((await response.json()));
    }
    getSkills();
  }, []);

  const addSkill = (newSkill: ISkill) => {
    setSkills(prevSkills => [...prevSkills, newSkill]);
  }


  const updateSkill = (updatedSkill: ISkill) => {
    setSkills(prevSkills => prevSkills.map(skill => skill._id === updatedSkill._id ? updatedSkill : skill));
  };

  const deleteSkill = (id: string) => {
    setSkills(prevSkills => prevSkills.filter(skill => skill._id !== id));
  };

  return (
    <>
      <div className="flex w-full justify-center flex-row">
        <div className="flex flex-col gap-4 m-4 items-end w-full max-w-2xl">
          <Accordion type="single" collapsible className="w-full">
            {skills.length > 0 && (
              skills.map((skill, index) => {
                return (<>
                  <AccordionItem key={skill._id} value={skill._id}>
                    <AccordionTrigger>
                      <div className="flex flex-row w-full justify-between px-4 items-center">
                        <p>
                          {skill.name}
                        </p>
                        <Button variant="secondary" onClick={() => { setSelectedSkill(skill); setEditDialogOpened(true); }}>Edit</Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-4 flex flex-col gap-2">
                        {skill.skills.length > 0 && (
                          skill.skills.map((subskill, index) => (
                            <div key={index} className="flex flex-row justify-between">
                              <span>
                                {subskill.name}
                              </span>
                              <span>
                                {subskill.level}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </>)
              })
            )}
          </Accordion>
          <Button onClick={() => setDialogOpened(true)}>
            Create new skillset
          </Button>
          <NewSkillDialog dialogOpened={dialogOpened} setDialogOpened={setDialogOpened} addSkill={addSkill} />
          <EditSkillDialog dialogOpened={editDialogOpened} setDialogOpened={setEditDialogOpened} skill={selectedSkill} updateSkill={updateSkill} deleteSkill={deleteSkill} />
        </div>
      </div>
    </>
  )
}