/*
  Warnings:

  - The primary key for the `Indices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[nome]` on the table `Indices` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Indices" DROP CONSTRAINT "Indices_pkey",
ALTER COLUMN "nome" SET DATA TYPE VARCHAR(30),
ADD CONSTRAINT "Indices_pkey" PRIMARY KEY ("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Indices_nome_key" ON "Indices"("nome");
