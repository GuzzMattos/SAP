import cron from 'node-cron';
import prisma from '@/lib/db';
import { getInvestimentsToAtt, updateInvestiment } from '../_actions/investiment';
import { updateCdiValue, updateIpcaValue, updateSelicValue } from '../_actions/indice';
import axios from 'axios';
export async function updateInvestimentsAndIndexDaily() {

    // Busca todos os investimentos e inclui o valor do índice relacionado a cada um
    const investiments = await getInvestimentsToAtt()

    // Itera sobre cada investimento e calcula o novo valor
    for (const investiment of investiments) {
        const { valor, porc_indice, pre_fixado, indice } = investiment;

        // Verifica se o índice está associado ao investimento
        if (indice && indice.valor) {
            const valorIndice = indice.valor;

            // Calcula o novo valor com base na fórmula especificada
            const novoValor =
                (valor *
                    ((((((((valorIndice) * (porc_indice / 100)) + pre_fixado) / 100 + 1) ** (1 / 252) - 1)) + 1)));
            // Atualiza o investimento com o novo valor calculado
            updateInvestiment(investiment.id_invest, novoValor)



        }


        console.log("Valores de todos os investimentos atualizados com base no índice.");
    }

}
async function fetchIpcasSumLast12Months(): Promise<number | null> {
    const apiUrl = 'http://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados?formato=json';

    try {
        const response = await axios.get(apiUrl);
        const data: { data: string; valor: string }[] = response.data;

        if (data.length === 0) {
            console.warn('Nenhuma cotação disponível.');
            return null;
        }

        // Obter a data atual
        const today = new Date();

        // Filtrar as entradas dos últimos 12 meses
        const last12MonthsData = data.filter((entry) => {
            const entryDate = new Date(entry.data.split('/').reverse().join('-'));
            const twelveMonthsAgo = new Date(today);
            twelveMonthsAgo.setMonth(today.getMonth() - 13);

            return entryDate >= twelveMonthsAgo && entryDate <= today;
        });

        if (last12MonthsData.length === 0) {
            console.warn('Nenhum dado disponível para os últimos 12 meses.');
            return null;
        }

        // Somar os valores dos últimos 12 meses
        const total = last12MonthsData.reduce((sum, entry) => {
            return sum + parseFloat(entry.valor);
        }, 0);

        return total;
    } catch (error) {
        console.error('Erro ao buscar o IPCA da API:', error);
        return null;
    }
}
async function fetchCdiValue(): Promise<number | null> {
    const apiUrl = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json';

    try {
        const response = await axios.get(apiUrl);
        const data: { data: string; valor: string }[] = response.data;

        if (data.length === 0) {
            console.warn('Nenhuma cotação disponível.');
            return null;
        }

        // Ordena as datas em ordem decrescente
        const sortedData = data.sort((a, b) => {
            const dateA = new Date(a.data.split('/').reverse().join('-'));
            const dateB = new Date(b.data.split('/').reverse().join('-'));
            return dateB.getTime() - dateA.getTime();
        });

        // Pega a data mais recente
        const latestEntry = sortedData[0];

        if (!latestEntry || !latestEntry.valor) {
            console.warn('Nenhuma cotação válida encontrada.');
            return null;
        }

        const cdiValue = parseFloat(latestEntry.valor);
        const cdiAnual = (((((cdiValue / 100) + 1) ** 252) - 1) * 100)
        return cdiAnual;
    } catch (error) {
        console.error('Erro ao buscar o CDI da API:', error);
        return null;
    }
}
async function fetchAndUpdateCdi() {
    const cdiValue = await fetchCdiValue();

    if (cdiValue !== null) {
        await updateCdiValue(cdiValue);
    } else {
        console.warn('Valor do CDI não encontrado, operação abortada.');
    }
}
async function fetchAndUpdateSelic() {
    const cdiValue = await fetchCdiValue();

    if (cdiValue !== null) {
        await updateSelicValue(cdiValue + 0.1);
    } else {
        console.warn('Valor da SELIC não encontrado, operação abortada.');
    }
}
async function fetchAndUpdateIpca() {
    const ipcaValue = await fetchIpcasSumLast12Months();

    if (ipcaValue !== null) {
        await updateIpcaValue(ipcaValue);
    } else {
        console.warn('Valor do IPCA não encontrado, operação abortada.');
    }
}


cron.schedule('0 0 * * *', () => {
    console.log("Executando tarefa diária...");
    fetchAndUpdateCdi()
    fetchAndUpdateSelic()
    fetchAndUpdateIpca()
    updateInvestimentsAndIndexDaily()


});

console.log('Tarefa agendada para rodar todo dia.');
