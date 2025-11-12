-- CreateTable
CREATE TABLE "ContractEMbedding" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileContent" TEXT NOT NULL,
    "chunkIndex" INTEGER NOT NULL,

    CONSTRAINT "ContractEMbedding_pkey" PRIMARY KEY ("id")
);
