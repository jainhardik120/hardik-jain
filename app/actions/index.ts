"use server"

import dbConnect from "@/lib/dbConnect"
import Project, { IProject } from "@/models/Project";
import Skill, { ISkill } from "@/models/Skill";

export const getSkills = async () => {
  await dbConnect();
  const skills: ISkill[] = await Skill.find({});
  return skills;
}

export const getProjectsGroupedByCategory = async () => {
  await dbConnect();
  const projectsGroupedByCategory = await Project.aggregate([
    {
      $group: {
        _id: "$category",
        projects: {
          $push: {
            _id: { $toString: "$_id" }, 
            name: "$name",
            githubLink: "$githubLink",
            demoLink: "$demoLink",
            imageUrl: "$imageUrl",
            content: "$content",
            createdAt: "$createdAt",
            updatedAt: "$updatedAt"
          }
        }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  const uniqueCategories = projectsGroupedByCategory.map(group => group._id);
  return {
    categories: uniqueCategories,
    projectsByCategory: projectsGroupedByCategory
  };
};