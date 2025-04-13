-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "coverImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "readingTime" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "website" TEXT;
