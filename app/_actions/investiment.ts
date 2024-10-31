"use server";

import { InvestimentSchema } from "@/lib/schemas/investiment";
import { z } from "zod";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

// Função para criar um novo Investiment
export async function createInvestiment(clientId: string, values: z.infer<typeof InvestimentSchema>) {
    const investimentExists = await prisma.investimento.findFirst({
        where: {
            conta: values.conta,
        }
    });

    if (investimentExists) {
        throw new Error("Investiment com essa conta já existe.");
    }

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
            id_indice: values.id_indice ?? null // Corrigido para passar apenas a string `id_indice`
        }
    });

    console.log({ newInvestiment });
    redirect(`/admin/clients/${clientId}?success=true`);
}



// Função para obter todos os Investiments
export async function getAllInvestiments() {
    const allInvestiments = await prisma.investimento.findMany({});
    return allInvestiments;
}

export type TInvestiment = Awaited<ReturnType<typeof getAllInvestiments>>;

export async function getInvestimentsByClientId(clientId: string) {
    const client = await prisma.cliente.findUnique({
        where: {
            id_cliente: clientId
        }
    })

    if (!client) {
        throw new Error("client doest exists")
    }
    const investiments = await prisma.investimento.findMany({
        where: {
            id_cliente: clientId
        }
    })

    return investiments;
}
export type TInvestimentsByClientId = Awaited<ReturnType<typeof getInvestimentsByClientId>>;