-- AlterTable
ALTER TABLE "students" ADD COLUMN     "baptism" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "firstCommunion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" TEXT NOT NULL DEFAULT '';
