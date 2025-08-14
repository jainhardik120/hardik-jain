/*
  Warnings:

  - You are about to drop the `ExportedImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `CanvaExportJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `ExcalidrawDiagrams` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "CanvaExportJob" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExcalidrawDiagrams" ADD COLUMN     "creatorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ExportedImages";

-- DropTable
DROP TABLE "Session";

-- AddForeignKey
ALTER TABLE "CanvaExportJob" ADD CONSTRAINT "CanvaExportJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExcalidrawDiagrams" ADD CONSTRAINT "ExcalidrawDiagrams_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
