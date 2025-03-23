'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import type { SkillWithSubSkills } from '@/types';
import { api } from '@/server/api/react';

export const NewSkillDialog: React.FC<{
  dialogOpened: boolean;
  setDialogOpened: (state: boolean) => void;
  addSkill: (skill: SkillWithSubSkills) => void;
}> = ({ dialogOpened, setDialogOpened, addSkill }) => {
  const [newSkillName, setNewSkillName] = useState('');

  const createSkillMutation = api.portfolio.createSkill.useMutation();
  const onButtonClick = async () => {
    const data = await createSkillMutation.mutateAsync({ name: newSkillName });
    const newSkill: SkillWithSubSkills = {
      ...data,
      skills: [],
    };
    addSkill(newSkill);
    setDialogOpened(false);
  };

  useEffect(() => {
    setNewSkillName('');
  }, [dialogOpened]);

  return (
    <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New skill set</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onButtonClick}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
