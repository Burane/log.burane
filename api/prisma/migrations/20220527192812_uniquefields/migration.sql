/*
  Warnings:

  - A unique constraint covering the columns `[id,userId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id,applicationId]` on the table `LogMessage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Application_id_userId_key" ON "Application"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "LogMessage_id_applicationId_key" ON "LogMessage"("id", "applicationId");
