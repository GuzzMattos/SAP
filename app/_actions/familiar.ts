"use server";

import { FamiliarSchema, UpdateFamiliarSchema } from "@/lib/schemas/familiar";
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


export async function deleteFamiliar(familiarId: string) {
    const user = await prisma.familiar.findUnique({
        where: {
            id_familiar: familiarId
        }
    });

    if (!user) {
        throw new Error("Familiar não encontrado");
    }
    else {
        await prisma.familiar.delete({
            where: {
                id_familiar: familiarId
            }
        });
        console.log("Familiar deleted");
    }
    return true;
}

// Function to get a familiar by their ID
export async function getFamiliarById(familiarId: string) {
    const familiar = await prisma.familiar.findUnique({
        where: {
            id_familiar: familiarId
        }
    });

    if (!familiar) {
        throw new Error("Familiar not found");
    }

    return familiar;
}
export type TFamiliarById = Awaited<ReturnType<typeof getFamiliarById>>;

export async function updateFamiliar(familiarId: string, values: z.infer<typeof UpdateFamiliarSchema>) {
    const familiarExists = await prisma.familiar.findUnique({
        where: {
            id_familiar: familiarId
        }
    });

    if (!familiarExists) {
        throw new Error("Familiar not found");
    }

    const updatedFamiliar = await prisma.familiar.update({
        where: {
            id_familiar: familiarId
        },
        data: {
            est_civil: values.est_civil,
            vivo: values.vivo,
            nome_conj: values.nome_conj,
        }
    });

    console.log("Familiar updated successfully:", updatedFamiliar);
    return updatedFamiliar;
}