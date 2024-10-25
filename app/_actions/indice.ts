"use server";

import { IndicesSchema } from "@/lib/schemas/indice";
import { z } from "zod";
import prisma from "@/lib/db";

export async function createIndice(values: z.infer<typeof IndicesSchema>) {
    console.log("Creating indice with data:", values);

    const indiceExists = await prisma.indices.findUnique({
        where: {
            nome: values.nome
        }
    });

    if (indiceExists) {
        throw new Error("Índice com esse nome já existe.");
    }

    const newIndice = await prisma.indices.create({
        data: {
            nome: values.nome,
            valor: values.valor,
        }
    });

    console.log({ newIndice });

}

