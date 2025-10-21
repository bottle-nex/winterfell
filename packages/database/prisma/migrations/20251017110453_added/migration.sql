-- CreateEnum
CREATE TYPE "SystemMessageType" AS ENUM ('BUILD_START', 'BUILD_PROGRESS', 'BUILD_COMPLETE', 'BUILD_ERROR');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "systemData" JSONB,
ADD COLUMN     "systemType" "SystemMessageType";
