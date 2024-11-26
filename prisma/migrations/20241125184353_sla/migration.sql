/*
  Warnings:

  - A unique constraint covering the columns `[id_log]` on the table `LogInvestimento` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LogInvestimento_id_log_key" ON "LogInvestimento"("id_log");
