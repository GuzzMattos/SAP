/*
  Warnings:

  - A unique constraint covering the columns `[id_cliente]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_familiar]` on the table `Familiar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `Familiar` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_invest]` on the table `Investimento` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_user]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cliente_id_cliente_key" ON "Cliente"("id_cliente");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_cpf_key" ON "Cliente"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Familiar_id_familiar_key" ON "Familiar"("id_familiar");

-- CreateIndex
CREATE UNIQUE INDEX "Familiar_cpf_key" ON "Familiar"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Investimento_id_invest_key" ON "Investimento"("id_invest");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_id_user_key" ON "Usuario"("id_user");
