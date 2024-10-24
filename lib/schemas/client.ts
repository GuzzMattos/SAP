import { z } from "zod";

export const ClientSchema = z.object({
    name: z.string()
        .min(1, { message: "Nome é obrigatório" })
        .max(102, { message: "Nome deve ter no máximo 102 caracteres" })
        .refine(value => /\s/.test(value), { message: "Deve conter nome e sobrenome" }),
    cpf: z.string().length(14, { message: "CPF inválido" }), // Ajustado para length
    birthDate: z.date().refine(date => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        // Verifica se a idade é maior ou igual a 18 anos
        return age > 18 || (age === 18 && monthDiff > 0) || (age === 18 && monthDiff === 0 && today.getDate() >= date.getDate());
    }, {
        message: "O cliente precisa ser maior de 18 anos",
    }),
    dualNationality: z.boolean().optional(),
    maritalStatus: z.enum(["Solteiro", "Casado", "Divorciado", "Viúvo"], { message: "Estado civil é obrigatório" }),
    propertyRegime: z.string().optional(),
    taxResidenceInBrazil: z.boolean().optional(),
    email: z.string().email({ message: "Email inválido" }),
    profession: z.string().nonempty({ message: "Profissão é obrigatória" }),
    partnerId: z.string().uuid(), // Tornar obrigatório se id_user for obrigatório
});

export type TClientSchema = z.infer<typeof ClientSchema>;
