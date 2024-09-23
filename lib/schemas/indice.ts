import { z } from "zod";

export const IndicesSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório").max(10, "Nome deve ter no máximo 10 caracteres"),
    valor: z.number().min(0, "Valor deve ser maior que 0"),
});
