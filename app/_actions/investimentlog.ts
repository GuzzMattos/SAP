"use server";

import prisma from "@/lib/db";

// Função para criar um novo Investiment
export async function createInvestmentLog(
    investmentId: string,
    previousValue: number,
    currentValue: number
) {
    const log = await prisma.logInvestimento.create({
        data: {
            id_invest: investmentId,
            valor_anterior: previousValue,
            valor_atual: currentValue,
        },
    });

    console.log(`Log criado para investimento ${investmentId}`);
    return log;
}

export async function getInvestmentLogs(investmentId: string) {
    const logs = await prisma.logInvestimento.findMany({
        where: {
            id_invest: investmentId,
        },
        orderBy: {
            data_criacao: 'desc',
        },
    });

    return logs;
}

export async function getAllInvestmentLogs() {
    try {
        const allLogs = await prisma.logInvestimento.findMany();

        if (!allLogs || allLogs.length === 0) {
            console.warn('No investment logs found.');
            return [];
        }

        return allLogs;
    } catch (error) {
        console.error('Error fetching investment logs:', error);
        throw new Error('Failed to fetch investment logs. Please try again later.');
    }
}

