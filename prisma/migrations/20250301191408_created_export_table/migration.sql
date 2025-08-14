-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('CANVA', 'EXCALIDRAW');

-- CreateTable
CREATE TABLE "ExportedImages" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "imageType" "ImageType" NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExportedImages_pkey" PRIMARY KEY ("id")
);
