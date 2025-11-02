-- CreateEnum
CREATE TYPE "BuildStatus" AS ENUM ('NEVER_BUILT', 'PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "BuildJob" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "status" "BuildStatus" NOT NULL,
    "podName" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "output" JSONB NOT NULL,
    "error" TEXT NOT NULL,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetry" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuildJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BuildJob_contractId_status_idx" ON "BuildJob"("contractId", "status");

-- CreateIndex
CREATE INDEX "BuildJob_jobId_idx" ON "BuildJob"("jobId");

-- CreateIndex
CREATE INDEX "BuildJob_status_createdAt_idx" ON "BuildJob"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "BuildJob" ADD CONSTRAINT "BuildJob_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
