-- AlterEnum
ALTER TYPE "CreationStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "Unit" ALTER COLUMN "questionAudio" DROP NOT NULL,
ALTER COLUMN "answerAudio" DROP NOT NULL;
