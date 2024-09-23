import { z } from "zod";

// Define the schema for the Familiar model
export const FamiliarSchema = z.object({
    cpf: z
        .string()
    // .length(11, { message: "CPF inválido" })
    , // O CPF deve ter exatamente 11 caracteres
    est_civil: z.enum(["Solteiro", "Casado", "Divorciado", "Viúvo"], { message: "Estado civil é obrigatório" }), // Estado civil é obrigatório e deve estar dentro das opções fornecidas
    nome: z.string().min(1, { message: "Nome é obrigatório" }).max(102, { message: "Nome deve ter no máximo 102 caracteres" }), // Nome é obrigatório e deve ter no máximo 102 caracteres
    data_nasc: z.date(), // Verifica se a data de nascimento é válida
    vivo: z.boolean(), // A informação se o familiar está vivo ou não é obrigatória
    nome_conj: z.string().optional(), // Nome do cônjuge é opcional e deve ter no máximo 102 caracteres
    parentesco: z.string().min(1, { message: "Parentesco é obrigatório" }).max(20, { message: "Parentesco deve ter no máximo 20 caracteres" }), // O parentesco é obrigatório e deve ter no máximo 20 caracteres
});

export type TFamiliarSchema = z.infer<typeof FamiliarSchema>;
