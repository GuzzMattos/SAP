"use server"

import { ClientSchema } from "@/lib/schemas/client";
import { z } from "zod";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { GetUserId, GetUserRole } from "./user";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
            ativo: true,
        }
    });

    console.log({ newClient });

    redirect("/admin/clients");
}

export async function getAllClients() {
    const role = await GetUserRole()
    const userId = await GetUserId()

    let whereCondition: Prisma.ClienteWhereInput = {
        ativo: true,
    }

    if (role !== "admin") {
        whereCondition = {
            id_user: {
                equals: userId
            }
        }
    }

    const getAllClients = await prisma.cliente.findMany({
        where: whereCondition
    })

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
export async function updateClient(id: string, values: z.infer<typeof ClientSchema>) {
    // Acha o cliente pelo ID
    const client = await prisma.cliente.findUnique({
        where: {
            id_cliente: id
        }
    });

    // Verifica se o cliente existe
    if (!client) {
        throw new Error("Cliente não encontrado");
    }

    // Se o cliente existe, atualiza
    const updatedClient = await prisma.cliente.update({
        where: {
            id_cliente: id
        },
        data: {
            nome: values.name,
            cpf: values.cpf,
            email: values.email,
            data_nasc: values.birthDate ? new Date(values.birthDate) : client.data_nasc,
            est_civil: values.maritalStatus ?? client.est_civil,
            dupla_nacio: values.dualNationality ?? client.dupla_nacio,
            reg_bens: values.propertyRegime ?? client.reg_bens,
            res_fiscal_brasil: values.taxResidenceInBrazil ?? client.res_fiscal_brasil,
            profissao: values.profession ?? client.profissao,
            id_user: values.partnerId ?? client.id_user
        }
    });

    console.log("Client atualizado:", updatedClient);

    return updatedClient;
}

export async function updateClientById(clientId: string, values: z.infer<typeof ClientSchema>) {
    // Verifica se o cliente existe pelo ID
    const existingClient = await prisma.cliente.findUnique({
        where: {
            id_cliente: clientId
        }
    });

    if (!existingClient) {
        throw new Error("Cliente não encontrado");
    }

    // Atualiza os dados no banco
    const updatedClient = await prisma.cliente.update({
        where: { id_cliente: clientId },
        data: values,
    });

    console.log({ values, updateClient })
    return updatedClient;
}

export async function deleteClient(clientId: string) {
    // Verifica se o cliente existe pelo ID
    const existingClient = await prisma.cliente.findUnique({
        where: {
            id_cliente: clientId,
        },
    });

    if (!existingClient) {
        throw new Error("Cliente não encontrado");
    }

    // Atualiza o campo 'ativo' para false
    const updatedClient = await prisma.cliente.update({
        where: {
            id_cliente: clientId,
        },
        data: {
            ativo: false,
        },
    });

    console.log("Client desativado:", updatedClient);

    revalidatePath("/admin/clients", "layout")
}


export async function getInactiveClients() {
    const role = await GetUserRole();
    const userId = await GetUserId();

    // Definir condição inicial para buscar clientes inativos
    let whereCondition: Prisma.ClienteWhereInput = {
        ativo: false,
    };

    // Se o usuário não for admin, filtrar apenas pelos clientes associados ao usuário
    if (role !== "admin") {
        whereCondition = {
            ativo: false,
            id_user: {
                equals: userId,
            },
        };
    }

    // Buscar clientes inativos com base nas condições definidas
    const inactiveClients = await prisma.cliente.findMany({
        where: whereCondition,
    });

    return inactiveClients;
}

export type TInactiveClient = Awaited<ReturnType<typeof getInactiveClients>>;


export async function activateClient(clientId: string) {
    // Verifica se o cliente existe pelo ID
    const existingClient = await prisma.cliente.findUnique({
        where: {
            id_cliente: clientId,
        },
    });

    if (!existingClient) {
        throw new Error("Cliente não encontrado");
    }

    // Atualiza o campo 'ativo' para true
    const updatedClient = await prisma.cliente.update({
        where: {
            id_cliente: clientId,
        },
        data: {
            ativo: true,
        },
    });

    console.log("Client ativado:", updatedClient);

    // Redireciona para a página de clientes
    return updatedClient;
}
