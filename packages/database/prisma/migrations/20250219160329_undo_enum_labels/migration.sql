/*
  Warnings:

  - You are about to drop the column `creationStatusLabel` on the `List` table. All the data in the column will be lost.
  - You are about to drop the column `difficultyLabel` on the `List` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "List" DROP COLUMN "creationStatusLabel",
DROP COLUMN "difficultyLabel";
