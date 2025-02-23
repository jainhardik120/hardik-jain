/*
  Warnings:

  - Made the column `githubLink` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `demoLink` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "githubLink" SET NOT NULL,
ALTER COLUMN "demoLink" SET NOT NULL;
