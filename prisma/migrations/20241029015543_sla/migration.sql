/*
  Warnings:

  - You are about to drop the column `indice` on the `Investimento` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Investimento" DROP COLUMN "indice",
ADD COLUMN     "indicesId_indice" TEXT;

-- AddForeignKey
ALTER TABLE "Investimento" ADD CONSTRAINT "Investimento_indicesId_indice_fkey" FOREIGN KEY ("indicesId_indice") REFERENCES "Indices"("id_indice") ON DELETE SET NULL ON UPDATE CASCADE;
