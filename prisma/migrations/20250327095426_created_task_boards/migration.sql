/*
  Warnings:

  - You are about to drop the column `assignee` on the `Task` table. All the data in the column will be lost.
  - The `status` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `columnId` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskColumnId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "assignee",
ADD COLUMN     "columnId" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "taskColumnId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'TODO';

-- CreateTable
CREATE TABLE "TaskBoard" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskColumn" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "taskBoardId" TEXT NOT NULL,

    CONSTRAINT "TaskColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TaskBoardMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaskBoardMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TaskBoardMembers_B_index" ON "_TaskBoardMembers"("B");

-- AddForeignKey
ALTER TABLE "TaskBoard" ADD CONSTRAINT "TaskBoard_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskColumn" ADD CONSTRAINT "TaskColumn_taskBoardId_fkey" FOREIGN KEY ("taskBoardId") REFERENCES "TaskBoard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_taskColumnId_fkey" FOREIGN KEY ("taskColumnId") REFERENCES "TaskColumn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskBoardMembers" ADD CONSTRAINT "_TaskBoardMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "TaskBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskBoardMembers" ADD CONSTRAINT "_TaskBoardMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
