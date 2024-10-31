"use server";

import { IndicesSchema } from "@/lib/schemas/indice";
import { z } from "zod";
import prisma from "@/lib/db";

export async function createIndice(values: z.infer<typeof IndicesSchema>) {
    console.log("Creating indice with data:", values);

    const indiceExists = await prisma.indice.findUnique({
        where: {
            nome: values.nome
        }
    });

    if (indiceExists) {
        throw new Error("Índice com esse nome já existe.");
    }

    const newIndice = await prisma.indice.create({
        data: {
            nome: values.nome,
            valor: values.valor,
        }
    });

    console.log({ newIndice });

}
export async function getAllIndices() {
    const allIndices = await prisma.indice.findMany({});
    console.log(allIndices);
    return allIndices;
}

export type TIndice = Awaited<ReturnType<typeof getAllIndices>>;

export async function getIndiceValorById(id_indice: string) {
    const indice = await prisma.indice.findUnique({
        where: {
            id_indice: id_indice,
        },
        select: {
            valor: true,
        },
    });

    if (!indice) {
        throw new Error("Índice com o ID fornecido não encontrado.");
    }

    return indice.valor;
}