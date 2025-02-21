/*
  Warnings:

  - A unique constraint covering the columns `[sub]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sub` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role",
ADD COLUMN     "sub" TEXT;

UPDATE "User" SET "role" = 'USER', "sub" = id WHERE "role" IS NULL;

ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'USER',
ALTER COLUMN "sub" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_sub_key" ON "User"("sub");

-- CreateIndex
CREATE INDEX "User_sub_idx" ON "User"("sub");
