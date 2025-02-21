/*
  Warnings:

  - Added the required column `answer` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Result" ADD COLUMN "answer" TEXT;
UPDATE "Result" SET "answer" = '';
ALTER TABLE "Result" ALTER COLUMN "answer" SET NOT NULL;
