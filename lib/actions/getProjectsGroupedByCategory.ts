"use server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";

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
            shortDescription: "$shortDescription", 
            techStack: "$techStack",
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
