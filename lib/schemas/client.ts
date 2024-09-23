import { z } from "zod";

export const ClientSchema = z.object({
    name: z.string().min(1, { message: "Nome é obrigatório" }).max(102, { message: "Nome deve ter no máximo 102 caracteres" }),
    cpf: z.string().length(11, { message: "CPF inválido" }), // Ajustado para length
    birthDate: z.date(),
    dualNationality: z.boolean().optional(),
    maritalStatus: z.enum(["Solteiro", "Casado", "Divorciado", "Viúvo"], { message: "Estado civil é obrigatório" }),
    propertyRegime: z.string().optional(),
    taxResidenceInBrazil: z.boolean().optional(),
    email: z.string().email({ message: "Email inválido" }),
    profession: z.string().nonempty({ message: "Profissão é obrigatória" }),
    partnerId: z.string().uuid(), // Tornar obrigatório se id_user for obrigatório
});

export type TClientSchema = z.infer<typeof ClientSchema>
