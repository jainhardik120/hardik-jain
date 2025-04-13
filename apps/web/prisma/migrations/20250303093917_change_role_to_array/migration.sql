/*
  Warnings:

  - Changed the column `role` on the `User` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterTable
-- Step 1: Create a new column with the correct data type
ALTER TABLE "User" ADD COLUMN "role_temp" "UserRole"[] DEFAULT ARRAY['USER']::"UserRole"[];

-- Step 2: Migrate existing values (assuming they were single values before)
UPDATE "User" SET "role_temp" = ARRAY["role"];

-- Step 3: Drop the old column
ALTER TABLE "User" DROP COLUMN "role";

-- Step 4: Rename the new column to replace the old one
ALTER TABLE "User" RENAME COLUMN "role_temp" TO "role";

ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT ARRAY['USER']::"UserRole"[],
ALTER COLUMN "role" SET DATA TYPE "UserRole"[];
