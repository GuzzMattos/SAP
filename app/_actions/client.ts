"use server"

import { ClientSchema } from "@/lib/schemas/client";
import { z } from "zod";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export async function createClient(values: z.infer<typeof ClientSchema>) {
    console.log("Creating client with data:", values);

    const clientExists = await prisma.cliente.findUnique({
        where: {
            cpf: values.cpf
        }
    });

    if (clientExists) {
        throw new Error("Um cliente com esse CPF já existe.");
    }

    if (!values.partnerId) {
        throw new Error("O ID do usuário responsável é obrigatório.");
    }

    const newClient = await prisma.cliente.create({
        data: {
            nome: values.name,
            cpf: values.cpf,
            email: values.email,
            data_nasc: new Date(values.birthDate), // Converte a string para Date
            est_civil: values.maritalStatus,
            dupla_nacio: values.dualNationality ?? false,
            reg_bens: values.propertyRegime ?? "",
            res_fiscal_brasil: values.taxResidenceInBrazil ?? false,
            profissao: values.profession,
            id_user: values.partnerId,
        }
    });

    console.log({ newClient });

    redirect("/admin/clients");
}

export async function getAllClients() {
    const getAllClients = await prisma.cliente.findMany({})

    return getAllClients;
}

export type TClient = Awaited<ReturnType<typeof getAllClients>>;

export async function getClientById(clientId: string) {
    const client = await prisma.cliente.findUnique({
        where: {
            id_cliente: clientId
        }
    })

    // VERIFICA SE EXISTE
    if (!client) {
        throw new Error("Usuário não encontrado");
    }

    return client;
}