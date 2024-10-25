import cron from 'node-cron';
import prisma from '@/lib/db';

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
    const indice = await prisma.indices.findUnique({
        where: { nome: 'CDI' },
    });
    return !!indice; // Retorna true se o índice existir, false caso contrário
}

// Função para atualizar o índice CDI com o valor do dia 1º do mês
async function updateIndiceCDI() {
    try {
        const valorPrimeiroDoMes = await fetchIndiceValueForFirstOfMonth();

        // Verifica se obteve um valor da API; caso contrário, mantém o valor existente
        if (valorPrimeiroDoMes !== null) {
            const indiceExiste = await indiceCDIExists();

            if (indiceExiste) {
                const updatedIndice = await prisma.indices.update({
                    where: { nome: "CDI" },
                    data: { valor: valorPrimeiroDoMes },
                });
                console.log("Índice CDI atualizado com sucesso:", updatedIndice);
            } else {
                console.log("Índice CDI não encontrado, criando um novo índice.");
                const novoIndice = await prisma.indices.create({
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
    updateIndiceCDI();
});

console.log('Tarefa agendada para rodar todo dia 1 do mês.');
