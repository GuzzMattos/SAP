"use server";

import { FamiliarSchema } from "@/lib/schemas/familiar";
import { z } from "zod";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function createFamiliar(clientId: string, values: z.infer<typeof FamiliarSchema>) {
    console.log("Creating familiar with data:", values);

    const familiarExists = await prisma.familiar.findUnique({
        where: {
            cpf: values.cpf
        }
    });

    if (familiarExists) {
        throw new Error("Familiar com esse CPF já existe.");
    }


    const newFamiliar = await prisma.familiar.create({
        data: {
            id_cliente: clientId,
            cpf: values.cpf,
            est_civil: values.est_civil,
            nome: values.nome,
            data_nasc: new Date(values.data_nasc),
            vivo: values.vivo,
            nome_conj: values.nome_conj,
            parentesco: values.parentesco,
        }
    });

    console.log({ newFamiliar });

    redirect(`/admin/clients/${clientId}?success=true`)
}

// Função para obter todos os Familiares
export async function getAllFamiliars() {
    const allFamiliars = await prisma.familiar.findMany({});
    return allFamiliars;
}

export type TFamiliar = Awaited<ReturnType<typeof getAllFamiliars>>;

export async function getFamiliarsByClientId(clientId: string) {
    const client = await prisma.cliente.findUnique({
        where: {
            id_cliente: clientId
        }
    })

    if (!client) {
        throw new Error("client doest exists")
    }

    const familiars = await prisma.familiar.findMany({
        where: {
            id_cliente: clientId
        }
    })

    return familiars;
}
export type TFamiliarsByClientId = Awaited<ReturnType<typeof getFamiliarsByClientId>>;
