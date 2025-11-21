/*
  Warnings:

  - You are about to drop the `ContractEMbedding` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `s3_url` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contract" ADD COLUMN     "s3_url" TEXT NOT NULL;

-- DropTable
DROP TABLE "ContractEMbedding";
