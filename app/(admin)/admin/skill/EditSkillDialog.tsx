"use client";

import {
  Dialog,
  DialogContent, DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { SubSkill } from "@/models/Skill";
import { ISkill } from "./page";


import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const EditSkillDialog: React.FC<{ skill: ISkill | null; dialogOpened: boolean; setDialogOpened: (state: boolean) => void; updateSkill: (updatedSkill: ISkill) => void; deleteSkill: (id: string) => void; }> = ({ skill, dialogOpened, setDialogOpened, updateSkill, deleteSkill }) => {
  const [skillName, setSkillName] = useState(skill?.name || "");
  const [subskills, setSubskills] = useState<SubSkill[]>(skill?.skills || []);

  useEffect(() => {
    if (skill) {
      setSkillName(skill.name);
      setSubskills(skill.skills);
    }
  }, [skill]);

  const handleSave = async () => {
    const updatedSkill = { ...skill, name: skillName, skills: subskills };
    const response = await fetch(`/api/skills/${skill?._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedSkill)
    });
    if (response.ok) {
      updateSkill((await response.json()).skill);
      setDialogOpened(false);
    }
  };

  const handleDelete = async () => {
    const response = await fetch(`/api/skills/${skill?._id}`, {
      method: "DELETE"
    });
    if (response.ok) {
      deleteSkill(skill?._id as string);
      setDialogOpened(false);
    }
  };

  const addSubskill = () => {
    setSubskills([...subskills, { name: "", level: "" }]);
  };

  const updateSubskill = (index: number, key: keyof SubSkill, value: string) => {
    const updatedSubskills = subskills.map((subskill, i) => (i === index ? { ...subskill, [key]: value } : subskill));
    setSubskills(updatedSubskills);
  };

  const deleteSubskill = (index: number) => {
    const updatedSubskills = subskills.filter((_, i) => i !== index);
    setSubskills(updatedSubskills);
  };

  return (
    <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
      <DialogContent className="w-xl">
        <DialogHeader>
          <DialogTitle>Edit Skill</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Input
              id="name"
              className="col-span-3"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)} />
          </div>
          {subskills.map((subskill, index) => (
            <div key={index} className="grid grid-cols-5 items-center gap-4">
              <div className="col-span-2">
                <Input
                  id={`subskill-name-${index}`}
                  className="col-span-2"
                  value={subskill.name}
                  onChange={(e) => updateSubskill(index, "name", e.target.value)} />
              </div>
              <div className="col-span-2">
                <Select value={subskill.level}
                  onValueChange={(value) => updateSubskill(index, "level", value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a fruit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Level</SelectLabel>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="destructive" onClick={() => deleteSubskill(index)}>Delete</Button>
            </div>
          ))}
          <div className="flex flex-row">
            <Button onClick={addSubskill}>Add Subskill</Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
