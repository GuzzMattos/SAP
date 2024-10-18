/*
  Warnings:

  - The primary key for the `Indices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id_indice` was added to the `Indices` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Indices" DROP CONSTRAINT "Indices_pkey",
ADD COLUMN     "id_indice" TEXT NOT NULL,
ADD CONSTRAINT "Indices_pkey" PRIMARY KEY ("id_indice");
