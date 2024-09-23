-- CreateTable
CREATE TABLE "Usuario" (
    "id_user" CHAR(36) NOT NULL,
    "cpf" CHAR(11) NOT NULL,
    "senha" VARCHAR(38) NOT NULL,
    "nome" VARCHAR(102) NOT NULL,
    "tipo" VARCHAR(15) NOT NULL,
    "email" VARCHAR(258) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id_cliente" CHAR(36) NOT NULL,
    "cpf" CHAR(11) NOT NULL,
    "data_nasc" TIMESTAMP(3) NOT NULL,
    "nome" VARCHAR(102) NOT NULL,
    "dupla_nacio" BOOLEAN NOT NULL,
    "est_civil" VARCHAR(20) NOT NULL,
    "reg_bens" VARCHAR(30) NOT NULL,
    "res_fiscal_brasil" BOOLEAN NOT NULL,
    "email" VARCHAR(258) NOT NULL,
    "profissao" VARCHAR(258) NOT NULL,
    "id_user" CHAR(36) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "Familiar" (
    "id_familiar" CHAR(36) NOT NULL,
    "cpf" CHAR(11) NOT NULL,
    "est_civil" VARCHAR(20) NOT NULL,
    "nome" VARCHAR(102) NOT NULL,
    "data_nasc" TIMESTAMP(3) NOT NULL,
    "vivo" BOOLEAN NOT NULL,
    "nome_conj" VARCHAR(102),
    "id_cliente" CHAR(36) NOT NULL,
    "parentesco" VARCHAR(20) NOT NULL,

    CONSTRAINT "Familiar_pkey" PRIMARY KEY ("id_familiar")
);

-- CreateTable
CREATE TABLE "Investimento" (
    "id_invest" CHAR(36) NOT NULL,
    "id_cliente" CHAR(36) NOT NULL,
    "banco" VARCHAR(20) NOT NULL,
    "agencia" VARCHAR(10) NOT NULL,
    "conta" VARCHAR(12) NOT NULL,
    "classe" BOOLEAN NOT NULL,
    "sub_classe_atv" VARCHAR(20) NOT NULL,
    "setor_ativ" VARCHAR(20) NOT NULL,
    "liquidez" VARCHAR(20) NOT NULL,
    "data_aplic" TIMESTAMP(3) NOT NULL,
    "data_venc" TIMESTAMP(3) NOT NULL,
    "prazo" INTEGER NOT NULL,
    "indice" VARCHAR(10) NOT NULL,
    "porc_indice" DOUBLE PRECISION NOT NULL,
    "pre_fixado" DOUBLE PRECISION NOT NULL,
    "taxa_bruta" DOUBLE PRECISION NOT NULL,
    "isento" BOOLEAN NOT NULL,
    "pais" VARCHAR(30) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Investimento_pkey" PRIMARY KEY ("id_invest")
);

-- CreateTable
CREATE TABLE "Indices" (
    "nome" VARCHAR(10) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Indices_pkey" PRIMARY KEY ("nome")
);

-- CreateTable
CREATE TABLE "ConsolidadoInvestimento" (
    "id_consolidado" CHAR(36) NOT NULL,
    "valuation" DOUBLE PRECISION NOT NULL,
    "rent_bruta" DOUBLE PRECISION NOT NULL,
    "rent_objetivo" DOUBLE PRECISION NOT NULL,
    "rent_relativa" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ConsolidadoInvestimento_pkey" PRIMARY KEY ("id_consolidado")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_key" ON "Usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Cliente" ADD CONSTRAINT "Cliente_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "Usuario"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Familiar" ADD CONSTRAINT "Familiar_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investimento" ADD CONSTRAINT "Investimento_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "Cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;
