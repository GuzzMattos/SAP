/*
  Warnings:

  - Added the required column `ativo` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ativo` to the `Investimento` table without a default value. This is not possible if the table is not empty.
  - Made the column `id_indice` on table `Investimento` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Investimento" DROP CONSTRAINT "Investimento_id_indice_fkey";

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "ativo" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Investimento" ADD COLUMN     "ativo" BOOLEAN NOT NULL,
ALTER COLUMN "id_indice" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Investimento" ADD CONSTRAINT "Investimento_id_indice_fkey" FOREIGN KEY ("id_indice") REFERENCES "Indice"("id_indice") ON DELETE RESTRICT ON UPDATE CASCADE;
