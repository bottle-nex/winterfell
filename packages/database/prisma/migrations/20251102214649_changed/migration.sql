/*
  Warnings:

  - The values [ANCHOR_BUILD,ANCHOR_TEST,ANCHOR_DEPLOY] on the enum `Command` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Command_new" AS ENUM ('WINTERFELL_BUILD', 'WINTERFELL_TEST', 'WINTERFELL_DEPLOY_DEVNET', 'WINTERFELL_DEPLOY_MAINNET', 'WINTERFELL_VERIFY');
ALTER TABLE "BuildJob" ALTER COLUMN "command" TYPE "Command_new" USING ("command"::text::"Command_new");
ALTER TYPE "Command" RENAME TO "Command_old";
ALTER TYPE "Command_new" RENAME TO "Command";
DROP TYPE "public"."Command_old";
COMMIT;
