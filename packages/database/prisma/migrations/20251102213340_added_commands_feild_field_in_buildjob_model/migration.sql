/*
  Warnings:

  - Added the required column `command` to the `BuildJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastBuildStatus` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Command" AS ENUM ('ANCHOR_BUILD', 'ANCHOR_TEST', 'ANCHOR_DEPLOY');

-- AlterTable
ALTER TABLE "BuildJob" ADD COLUMN     "command" "Command" NOT NULL;

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "lastBuildStatus" "BuildStatus" NOT NULL;
