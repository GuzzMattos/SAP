-- CreateTable
CREATE TABLE "LogInvestimento" (
    "id_log" CHAR(36) NOT NULL,
    "id_invest" CHAR(36) NOT NULL,
    "valor_anterior" DOUBLE PRECISION NOT NULL,
    "valor_atual" DOUBLE PRECISION NOT NULL,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogInvestimento_pkey" PRIMARY KEY ("id_log")
);

-- AddForeignKey
ALTER TABLE "LogInvestimento" ADD CONSTRAINT "LogInvestimento_id_invest_fkey" FOREIGN KEY ("id_invest") REFERENCES "Investimento"("id_invest") ON DELETE RESTRICT ON UPDATE CASCADE;
