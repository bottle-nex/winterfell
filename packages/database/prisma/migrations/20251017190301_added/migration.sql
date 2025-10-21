/*
  Warnings:

  - You are about to drop the column `systemData` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `systemType` on the `Message` table. All the data in the column will be lost.
  - Added the required column `buildComplete` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildError` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildProgress` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buildStart` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "systemData",
DROP COLUMN "systemType",
ADD COLUMN     "buildComplete" BOOLEAN NOT NULL,
ADD COLUMN     "buildError" BOOLEAN NOT NULL,
ADD COLUMN     "buildProgress" BOOLEAN NOT NULL,
ADD COLUMN     "buildStart" BOOLEAN NOT NULL;
