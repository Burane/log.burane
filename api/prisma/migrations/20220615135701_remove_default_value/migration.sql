-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "discordWebhookUrl" DROP DEFAULT,
ALTER COLUMN "webhookSecret" DROP DEFAULT,
ALTER COLUMN "webhookToken" DROP DEFAULT;
