/*
  Warnings:

  - You are about to drop the column `buildComplete` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `buildError` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `buildProgress` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `buildStart` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "buildComplete",
DROP COLUMN "buildError",
DROP COLUMN "buildProgress",
DROP COLUMN "buildStart",
ADD COLUMN     "building" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "creatingFiles" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "finalzing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "generatingCode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "planning" BOOLEAN NOT NULL DEFAULT false;
