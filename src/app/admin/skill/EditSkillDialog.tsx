'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SubSkill } from '@prisma/client';
import type { SkillWithSubSkills } from '@/types';
import { api } from '@/server/api/react';

export const EditSkillDialog: React.FC<{
  skill: SkillWithSubSkills | null;
  dialogOpened: boolean;
  setDialogOpened: (state: boolean) => void;
  updateSkill: (updatedSkill: SkillWithSubSkills) => void;
  deleteSkill: (id: string) => void;
}> = ({ skill, dialogOpened, setDialogOpened, updateSkill, deleteSkill }) => {
  const [skillName, setSkillName] = useState(skill?.name ?? '');
  const [subskills, setSubskills] = useState<SubSkill[]>(skill?.skills || []);

  useEffect(() => {
    if (skill) {
      setSkillName(skill.name);
      setSubskills(skill.skills);
    }
  }, [skill]);

  const updateSkillMutation = api.portfolio.updateSkill.useMutation();
  const deleteSkillMutation = api.portfolio.deleteSkill.useMutation();

  const handleSave = async () => {
    if (!skill) {
      return;
    }
    const updatedSkill = {
      id: skill.id,
      name: skillName,
      subskills: subskills.map(({ id, name, level }) => ({
        id: id || undefined,
        name,
        level,
      })),
    };
    const response = await updateSkillMutation.mutateAsync(updatedSkill);
    if (response) {
      updateSkill(response);
    }
    setDialogOpened(false);
  };

  const handleDelete = async () => {
    if (!skill) {
      return;
    }
    await deleteSkillMutation.mutateAsync({ id: skill.id });
    deleteSkill(skill.id);
    setDialogOpened(false);
  };

  const addSubskill = () => {
    setSubskills([...subskills, { id: '', name: '', level: '', skillId: skill?.id ?? '' }]);
  };

  const updateSubskill = (index: number, key: keyof SubSkill, value: string) => {
    const updatedSubskills = subskills.map((subskill, i) =>
      i === index ? { ...subskill, [key]: value } : subskill,
    );
    setSubskills(updatedSubskills);
  };

  const deleteSubskill = (index: number) => {
    setSubskills(subskills.filter((_, i) => i !== index));
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
              onChange={(e) => setSkillName(e.target.value)}
            />
          </div>
          {subskills.map((subskill, index) => (
            <div key={index} className="grid grid-cols-5 items-center gap-4">
              <div className="col-span-2">
                <Input
                  id={`subskill-name-${index}`}
                  className="col-span-2"
                  value={subskill.name}
                  onChange={(e) => updateSubskill(index, 'name', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Select
                  value={subskill.level}
                  onValueChange={(value) => updateSubskill(index, 'level', value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a level" />
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
              <Button variant="destructive" onClick={() => deleteSubskill(index)}>
                Delete
              </Button>
            </div>
          ))}
          <div className="flex flex-row">
            <Button onClick={addSubskill}>Add Subskill</Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} disabled={updateSkillMutation.isPending}>
            {updateSkillMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteSkillMutation.isPending}
          >
            {deleteSkillMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
