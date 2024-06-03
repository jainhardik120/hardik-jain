"use server";
import dbConnect from "@/lib/dbConnect";
import Skill, { ISkill } from "@/models/Skill";




export const getSkills = async () => {
  await dbConnect();
  const skills: ISkill[] = await Skill.find({});
  return skills;
};
