-- AlterTable
ALTER TABLE "Familiar" ALTER COLUMN "parentesco" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "Investimento" ALTER COLUMN "banco" SET DATA TYPE VARCHAR(40),
ALTER COLUMN "agencia" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "conta" SET DATA TYPE VARCHAR(17),
ALTER COLUMN "sub_classe_atv" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "setor_ativ" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "indice" SET DATA TYPE VARCHAR(20);
