"use server";

import { InvestimentSchema } from "@/lib/schemas/investiment";
import { z } from "zod";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

// Função para criar um novo Investiment
export async function createInvestiment(clientId: string, values: z.infer<typeof InvestimentSchema>) {
    const newInvestiment = await prisma.investimento.create({
        data: {
            id_cliente: clientId,
            banco: values.banco,
            agencia: values.agencia,
            conta: values.conta,
            classe: values.classe,
            sub_classe_atv: values.sub_classe_atv,
            setor_ativ: values.setor_ativ,
            liquidez: values.liquidez,
            data_aplic: new Date(values.data_aplic),
            data_venc: new Date(values.data_venc),
            porc_indice: values.porc_indice,
            pre_fixado: values.pre_fixado,
            isento: values.isento,
            pais: values.pais,
            valor: values.valor,
            id_indice: values.id_indice ?? null, // Corrigido para passar apenas a string `id_indice`
            ativo: true,
        }
    });

    console.log({ newInvestiment });
    redirect(`/admin/clients/${clientId}?success=true`);
}



// Função para obter todos os Investiments
export async function getAllInvestiments() {
    // Buscar investimentos com ativo: true
    const allInvestiments = await prisma.investimento.findMany({
        where: {
            ativo: true, // Adicionando o filtro ativo: true
        }
    });

    // Atualizar o status de ativos com vencimento após a data atual
    await Promise.all(
        allInvestiments.map(i => {
            if (i.data_venc < new Date()) {
                return prisma.investimento.update({
                    where: { id_invest: i.id_invest },
                    data: {
                        ativo: false,
                    }
                });
            }
        })
    );

    return allInvestiments;
}


export type TInvestiment = Awaited<ReturnType<typeof getAllInvestiments>>;

export async function getInvestimentsByClientId(clientId: string) {
    const client = await prisma.cliente.findUnique({
        where: {
            id_cliente: clientId,
        }
    })

    if (!client) {
        throw new Error("client doest exists")
    }
    const investiments = await prisma.investimento.findMany({
        where: {
            id_cliente: clientId,
            ativo: true,
        }
    })

    return investiments;
}
export type TInvestimentsByClientId = Awaited<ReturnType<typeof getInvestimentsByClientId>>;

// não for admin --> socio
// export async function getAllInvestimentsByPartner() {
//     const userId = await GetUserId()

//     const userInvestiments = await prisma.cliente.findMany({
//         where: {
//             id_user: userId
//         }, 
//         select: {
//             Investimento: true
//         }
//     })

//     return userInvestiments;
// }

// export async function getAllPartnersWithClientsInvestiments() {
//     const role = await GetUserRole()

//     if(role !== "admin") {
//         return null;
//     }

//     const clients = await prisma.cliente.findMany({
//         include: {
//             Investimento: true,
//             user: true
//         }
//     })

//     return clients;
// }

export async function getInvestimentById(investimentId: string) {
    const investiment = await prisma.investimento.findUnique({
        where: {
            id_invest: investimentId,
        }

    });

    if (!investiment) {
        throw new Error("Investimento não encontrado");
    }

    return investiment;
}

export type TInvestimentById = Awaited<ReturnType<typeof getInvestimentById>>;


// Função para obter investimentos inativos
export async function getInactiveInvestments() {
    const inactiveInvestments = await prisma.investimento.findMany({
        where: {
            ativo: false, // Filtro para investimentos inativos
        }
    });

    return inactiveInvestments;
}

// Função para desativar um investimento
export async function deactivateInvestiment(investmentId: string) {
    const updatedInvestment = await prisma.investimento.update({
        where: {
            id_invest: investmentId, // Localiza o investimento pelo ID
        },
        data: {
            ativo: false, // Define o status como inativo
        },
    });

    return updatedInvestment;
}

// Função para ativar um investimento
export async function activateInvestiment(investmentId: string) {
    const updatedInvestment = await prisma.investimento.update({
        where: {
            id_invest: investmentId, // Localiza o investimento pelo ID
        },
        data: {
            ativo: true, // Define o status como ativo
        },
    });

    return updatedInvestment;
}

// Função para obter investimentos inativos por ID de cliente
export async function getInactiveInvestimentsByClientId(clientId: string) {
    const client = await prisma.cliente.findUnique({
        where: {
            id_cliente: clientId,
        }
    });

    if (!client) {
        throw new Error("Cliente não encontrado");
    }

    const inactiveInvestments = await prisma.investimento.findMany({
        where: {
            id_cliente: clientId,
            ativo: false, // Filtro para buscar apenas investimentos inativos
        }
    });

    return inactiveInvestments;
}

// Tipagem para getInactiveInvestimentsByClientId
export type TInvestimentsByClientIdInactive = Awaited<ReturnType<typeof getInactiveInvestimentsByClientId>>;

// Função para obter um investimento inativo por ID
export async function getInactiveInvestimentById(investmentId: string) {
    const investment = await prisma.investimento.findUnique({
        where: {
            id_invest: investmentId,
            ativo: false, // Filtro para garantir que seja um investimento inativo
        }
    });

    if (!investment) {
        throw new Error("Investimento inativo não encontrado");
    }

    return investment;
}

// Tipagem para getInactiveInvestimentById
export type TInvestimentByIdInactive = Awaited<ReturnType<typeof getInactiveInvestimentById>>;


// Função para obter os investimentos de todos os clientes de um partner
export async function getInvestmentsByPartner(partnerId: string) {
    // Busca todos os clientes que são associados ao partner
    const clients = await prisma.cliente.findMany({
        where: {
            id_user: partnerId, // Assumindo que o campo id_user é a referência ao partner
            ativo: true
        }
    });

    // Caso não haja clientes para o partner
    if (clients.length === 0) {
        return [];
    }

    // Obtém os investimentos de todos os clientes
    const investments = await prisma.investimento.findMany({
        where: {
            id_cliente: {
                in: clients.map(client => client.id_cliente) // Assuming clienteId is the foreign key to Cliente
            },
            ativo: true

        }
    });

    return investments;
}
