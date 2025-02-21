/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `Subscription` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Subscription_stripeSubscriptionId_idx";

-- DropIndex
DROP INDEX "Subscription_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubscriptionId";
