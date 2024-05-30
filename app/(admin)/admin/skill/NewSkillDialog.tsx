"use client";
import {
  Dialog,
  DialogContent, DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { ISkill } from "./page";

export const NewSkillDialog: React.FC<{ dialogOpened: boolean; setDialogOpened: (state: boolean) => void; addSkill: (skill: ISkill) => void; }> = ({ dialogOpened, setDialogOpened, addSkill }) => {
  const [newSkillName, setNewSkillName] = useState("");

  const onButtonClick = async () => {
    const response = await fetch("/api/skills", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: newSkillName })
    });
    if (response.ok) {
      const result = await response.json();
      addSkill({ _id: result.id, name: newSkillName, skills: [] });
      setDialogOpened(false);
    }
  };

  useEffect(() => {
    setNewSkillName("");
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
              onChange={(e) => setNewSkillName(e.target.value)} />
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
