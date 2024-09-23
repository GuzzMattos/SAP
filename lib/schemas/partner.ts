import { z } from "zod";

export const PartnerSchema = z.object({
    cpf: z.string()
        .length(11, { message: "CPF inválido" }),
    senha: z.string()
        .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
        .max(38, { message: "Senha deve ter no máximo 38 caracteres" }),
    nome: z.string()
        .min(1, { message: "Nome é obrigatório" })
        .max(102, { message: "Nome deve ter no máximo 102 caracteres" }),
    tipo: z.enum(["Administrador", "Comum"], { message: "Tipo de usuário é obrigatório" })
        .refine(value => value.length <= 15, { message: "Tipo deve ter no máximo 15 caracteres" }),
    email: z.string()
        .email({ message: "Email inválido" })
        .max(258, { message: "Email deve ter no máximo 258 caracteres" }),
});
export type TParterSchema = z.infer<typeof PartnerSchema>
