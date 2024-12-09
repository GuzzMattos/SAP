import { z } from "zod";

export const InvestimentSchema = z.object({
    id_cliente: z.string().uuid(),
    banco: z.string().min(1, { message: "Banco é obrigatório" }).max(50, { message: "Banco deve ter no máximo 50 caracteres" }),
    agencia: z.string().min(1, { message: "Agência é obrigatória" }).max(10, { message: "Agência deve ter no máximo 10 caracteres" }),
    conta: z.string().min(1, { message: "Conta é obrigatória" }).max(12, { message: "Conta deve ter no máximo 12 caracteres" }),
    classe: z.string(),
    sub_classe_atv: z.string().min(1, { message: "Subclasse de Atividade é obrigatória" }).max(20, { message: "Subclasse de Atividade deve ter no máximo 20 caracteres" }),
    setor_ativ: z.string().max(20, { message: "Setor de Atividade deve ter no máximo 20 caracteres" }).optional(),
    liquidez: z.string().max(20, { message: "Liquidez deve ter no máximo 20 caracteres" }).optional(),
    data_aplic: z.date(),
    data_venc: z.date(),
    id_indice: z.string().uuid(),
    porc_indice: z.number().min(0, { message: "Porcentagem do Índice deve ser um número positivo" }),
    pre_fixado: z.number().min(0, { message: "Pré-Fixado deve ser um número positivo" }),
    isento: z.boolean(),
    pais: z.string().min(1, { message: "País é obrigatório" }).max(30, { message: "País deve ter no máximo 30 caracteres" }),
    valor: z
        .string()
        .regex(/^\d+(,\d{1,2})?$/, { message: "Valor deve estar no formato correto, ex: 1000,00" })
        .transform((val) => parseFloat(val.replace(",", "."))), // Converte para número
    ativo: z.boolean(),
});

export type TInvestimentSchema = z.infer<typeof InvestimentSchema>;
