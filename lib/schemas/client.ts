import { z } from "zod";
const isAdult = (date: Date) => {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const isBeforeBirthday = (
        today.getMonth() < date.getMonth() ||
        (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())
    );
    return age > 18 || (age === 18 && !isBeforeBirthday);
};

export const ClientSchema = z.object({
    name: z.string()
        .min(1, { message: "Nome é obrigatório" })
        .max(102, { message: "Nome deve ter no máximo 102 caracteres" })
        .refine(value => /\s/.test(value), { message: "Deve conter nome e sobrenome" }),
    cpf: z.string().length(14, { message: "CPF inválido" }), // Ajustado para length
    birthDate: z.coerce.date().refine(isAdult, { message: "O cliente deve ser maior de 18 anos" }),
    ativo: z.boolean(),
    dualNationality: z.boolean().optional(),
    maritalStatus: z.enum(["Solteiro", "Casado", "Divorciado", "Viúvo"], { message: "Estado civil é obrigatório" }),
    propertyRegime: z.string().optional(),
    taxResidenceInBrazil: z.boolean().optional(),
    email: z.string().email({ message: "Email inválido" }),
    profession: z.string().nonempty({ message: "Profissão é obrigatória" }),
    partnerId: z.string().uuid({ message: "Escolha um sócio" }), // Tornar obrigatório se id_user for obrigatório
});

export type TClientSchema = z.infer<typeof ClientSchema>;

export const UpdateClientSchema = z.object({
    dualNationality: z.boolean().optional(),
    maritalStatus: z.enum(["Solteiro", "Casado", "Divorciado", "Viúvo"], { message: "Estado civil é obrigatório" }).optional(),
    propertyRegime: z.string().optional(),
    taxResidenceInBrazil: z.boolean().optional(),
    email: z.string().email({ message: "Email inválido" }),
    profession: z.string().nonempty({ message: "Profissão é obrigatória" }).optional(),
    partnerId: z.string().uuid({ message: "Escolha um sócio" }).optional(),
});