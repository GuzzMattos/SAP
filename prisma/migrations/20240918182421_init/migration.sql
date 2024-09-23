/*
  Warnings:

  - You are about to drop the column `prazo` on the `Investimento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Investimento" DROP COLUMN "prazo",
ALTER COLUMN "classe" SET DATA TYPE VARCHAR(50);
