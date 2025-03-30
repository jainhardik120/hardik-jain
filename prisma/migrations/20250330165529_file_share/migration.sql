-- CreateTable
CREATE TABLE "FileShare" (
    "id" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FileShare_fileKey_idx" ON "FileShare"("fileKey");

-- CreateIndex
CREATE INDEX "FileShare_expiresAt_idx" ON "FileShare"("expiresAt");
