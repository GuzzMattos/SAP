import cron from 'node-cron';
import prisma from '@/lib/db';
export async function updateInvestimentsByIndice() {
    // Busca todos os investimentos e inclui o valor do índice relacionado a cada um
    const investiments = await prisma.investimento.findMany({
        include: {
            indice: {
                select: {
                    valor: true,
                },
            },
        },
    });

    // Itera sobre cada investimento e calcula o novo valor
    for (const investiment of investiments) {
        const { valor, porc_indice, pre_fixado, indice } = investiment;

        // Verifica se o índice está associado ao investimento
        if (indice && indice.valor) {
            const valorIndice = indice.valor;

            // Calcula o novo valor com base na fórmula especificada
            const novoValor =
                (valor *
                    ((((valorIndice) * (porc_indice / 100) + ((pre_fixado / 100 + 1) ** (1 / 12) - 1)) + 1)));
            // Atualiza o investimento com o novo valor calculado
            await prisma.investimento.update({
                where: { id_invest: investiment.id_invest },
                data: { valor: novoValor },
            });
        }
    }

    console.log("Valores de todos os investimentos atualizados com base no índice.");
}
// Função para buscar o valor da API para o dia 1 do mês atual
async function fetchIndiceValueForFirstOfMonth() {
    const today = new Date();
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const formattedDate = firstOfMonth.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json');
    const data = await response.json();

    // Filtrar o valor correspondente ao primeiro dia do mês
    const firstOfMonthData = data.find((entry: { data: string; valor: string }) => entry.data === formattedDate);
    if (!firstOfMonthData) {
        console.warn(`Nenhum valor encontrado para a data ${formattedDate}.`);
        return null; // Retorna null para tratamento de fallback
    }

    return parseFloat(firstOfMonthData.valor);
}

// Função para verificar se o índice CDI existe
async function indiceCDIExists() {
    const indice = await prisma.indice.findUnique({
        where: { nome: 'CDI' },
    });
    return !!indice; // Retorna true se o índice existir, false caso contrário
}
async function indiceSELICExists() {
    const indice = await prisma.indice.findUnique({
        where: { nome: 'SELIC' },
    });
    return !!indice; // Retorna true se o índice existir, false caso contrário
}
async function updateIndiceSELIC() {
    try {
        const valorPrimeiroDoMes = await fetchIndiceValueForFirstOfMonth();

        // Verifica se obteve um valor da API; caso contrário, mantém o valor existente
        if (valorPrimeiroDoMes !== null) {
            const indiceExiste = await indiceSELICExists();
            const selicatualizada = parseFloat((((((((valorPrimeiroDoMes / 100) + 1) ** 21) - 1)) + (0.00008)) / 100).toFixed(6));


            if (indiceExiste) {
                const updatedIndice = await prisma.indice.update({
                    where: { nome: "SELIC" },
                    data: { valor: selicatualizada },
                });
                console.log("Índice SELIC atualizado com sucesso:", updatedIndice);
            } else {
                console.log("Índice SELIC não encontrado, criando um novo índice.");
                const novoIndice = await prisma.indice.create({
                    data: {
                        nome: "SELIC",
                        valor: valorPrimeiroDoMes,
                    },
                });
                console.log("Índice SELIC criado com sucesso:", novoIndice);
            }
        } else {
            console.log("Nenhum valor disponível na API para o primeiro dia do mês.");
        }
    } catch (error) {
        console.error("Erro ao atualizar ou criar o índice SELIC:", error);
    }
}

// Função para atualizar o índice CDI com o valor do dia 1º do mês
async function updateIndiceCDI() {
    try {
        const valorPrimeiroDoMes = await fetchIndiceValueForFirstOfMonth();

        // Verifica se obteve um valor da API; caso contrário, mantém o valor existente
        if (valorPrimeiroDoMes !== null) {
            const indiceExiste = await indiceCDIExists();

            if (indiceExiste) {
                const updatedIndice = await prisma.indice.update({
                    where: { nome: "CDI" },
                    data: { valor: parseFloat((((((valorPrimeiroDoMes / 100) + 1) ** 21) - 1)).toFixed(6)) },
                });
                console.log("Índice CDI atualizado com sucesso:", updatedIndice);
            } else {
                console.log("Índice CDI não encontrado, criando um novo índice.");
                const novoIndice = await prisma.indice.create({
                    data: {
                        nome: "CDI",
                        valor: valorPrimeiroDoMes,
                    },
                });
                console.log("Índice CDI criado com sucesso:", novoIndice);
            }
        } else {
            console.log("Nenhum valor disponível na API para o primeiro dia do mês.");
        }
    } catch (error) {
        console.error("Erro ao atualizar ou criar o índice CDI:", error);
    }
}


// Agendando a tarefa para o dia 1 de cada mês às 00:00
cron.schedule('0 0 1 * *', () => {
    console.log("Executando tarefa mensal...");
    updateIndiceCDI()
    updateIndiceSELIC();
    updateInvestimentsByIndice()
});

console.log('Tarefa agendada para rodar todo dia 1 do mês.');
