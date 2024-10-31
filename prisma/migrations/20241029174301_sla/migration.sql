/*
  Warnings:

  - You are about to drop the column `indicesId_indice` on the `Investimento` table. All the data in the column will be lost.
  - You are about to drop the `Indices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Investimento" DROP CONSTRAINT "Investimento_indicesId_indice_fkey";

-- AlterTable
ALTER TABLE "Investimento" DROP COLUMN "indicesId_indice",
ADD COLUMN     "id_indice" TEXT;

-- DropTable
DROP TABLE "Indices";

-- CreateTable
CREATE TABLE "Indice" (
    "id_indice" CHAR(36) NOT NULL,
    "nome" VARCHAR(30) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Indice_pkey" PRIMARY KEY ("id_indice")
);

-- CreateIndex
CREATE UNIQUE INDEX "Indice_id_indice_key" ON "Indice"("id_indice");

-- CreateIndex
CREATE UNIQUE INDEX "Indice_nome_key" ON "Indice"("nome");

-- AddForeignKey
ALTER TABLE "Investimento" ADD CONSTRAINT "Investimento_id_indice_fkey" FOREIGN KEY ("id_indice") REFERENCES "Indice"("id_indice") ON DELETE SET NULL ON UPDATE CASCADE;
