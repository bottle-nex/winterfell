-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- AlterTable
ALTER TABLE "ContractEMbedding" ADD COLUMN     "embedding" vector(1536);
