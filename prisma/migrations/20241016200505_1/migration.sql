/*
  Warnings:

  - A unique constraint covering the columns `[id_indice]` on the table `Indices` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Indices_id_indice_key" ON "Indices"("id_indice");
