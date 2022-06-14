/*
  Warnings:

  - The `level` column on the `LogMessage` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "LogLevels" AS ENUM ('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "discordWebhookUrl" TEXT,
ADD COLUMN     "webhookSecret" TEXT,
ADD COLUMN     "webhookToken" TEXT;

-- AlterTable
ALTER TABLE "LogMessage" DROP COLUMN "level",
ADD COLUMN     "level" "LogLevels" NOT NULL DEFAULT E'INFO';

-- DropEnum
DROP TYPE "LogLevel";
