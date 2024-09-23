import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Email inválido" }),
  password: z
    .string()
    .min(8, { message: "Senha deve conter no mínimo 8 caracateres" }),
})