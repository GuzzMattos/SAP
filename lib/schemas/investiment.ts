import { z } from "zod";

// Define the schema for the Investimento model
export const InvestimentSchema = z.object({
    id_cliente: z.string().uuid(), // O id_cliente é uma string UUID obrigatória
    banco: z.string().min(1, { message: "Banco é obrigatório" }).max(50, { message: "Banco deve ter no máximo 50 caracteres" }), // Banco é obrigatório e deve ter no máximo 20 caracteres
    agencia: z.string().min(1, { message: "Agência é obrigatória" }).max(10, { message: "Agência deve ter no máximo 10 caracteres" }), // Agência é obrigatória e deve ter no máximo 10 caracteres
    conta: z.string().min(1, { message: "Conta é obrigatória" }).max(12, { message: "Conta deve ter no máximo 12 caracteres" }), // Conta é obrigatória e deve ter no máximo 12 caracteres
    classe: z.string(), // Classe é obrigatória e deve ser um booleano
    sub_classe_atv: z.string().min(1, { message: "Subclasse de Atividade é obrigatória" }).max(20, { message: "Subclasse de Atividade deve ter no máximo 20 caracteres" }), // Subclasse de Atividade é obrigatória e deve ter no máximo 20 caracteres
    setor_ativ: z.string().min(1, { message: "Setor de Atividade é obrigatório" }).max(20, { message: "Setor de Atividade deve ter no máximo 20 caracteres" }), // Setor de Atividade é obrigatório e deve ter no máximo 20 caracteres
    liquidez: z.string().min(1, { message: "Liquidez é obrigatória" }).max(20, { message: "Liquidez deve ter no máximo 20 caracteres" }), // Liquidez é obrigatória e deve ter no máximo 20 caracteres
    data_aplic: z.date(),
    data_venc: z.date(),
    indice: z.string().min(1, { message: "Índice é obrigatório" }).max(10, { message: "Índice deve ter no máximo 10 caracteres" }), // Índice é obrigatório e deve ter no máximo 10 caracteres
    porc_indice: z.number().min(0, { message: "Porcentagem do Índice deve ser um número positivo" }), // Porcentagem do Índice deve ser um número positivo
    pre_fixado: z.number().min(0, { message: "Pré-Fixado deve ser um número positivo" }), // Pré-Fixado deve ser um número positivo
    isento: z.boolean(), // Isento é obrigatória e deve ser um booleano
    pais: z.string().min(1, { message: "País é obrigatório" }).max(30, { message: "País deve ter no máximo 30 caracteres" }), // País é obrigatório e deve ter no máximo 30 caracteres
    valor: z.number().min(0, { message: "Valor deve ser um número positivo" }), // Valor deve ser um número positivo
});

export type TInvestimentSchema = z.infer<typeof InvestimentSchema>;
