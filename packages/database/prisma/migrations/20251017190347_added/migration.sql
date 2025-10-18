-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "buildComplete" SET DEFAULT false,
ALTER COLUMN "buildError" SET DEFAULT false,
ALTER COLUMN "buildProgress" SET DEFAULT false,
ALTER COLUMN "buildStart" SET DEFAULT false;
