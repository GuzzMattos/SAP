"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getAllIndices, TIndice, updateCdiValue, updateIpcaValue, updateSelicValue } from "@/app/_actions/indice";
import axios from 'axios';
import prisma from '@/lib/db';
import { getInvestimentsToAtt, updateInvestiment } from "@/app/_actions/investiment";
import { getAllInvestmentLogs } from "@/app/_actions/investimentlog";
import HelperDialogWhite from "@/components/helper-white";


export default function IndicesPage() {
    const [indices, setIndices] = useState<TIndice>([]);
    const [lastDate, setLastDate] = useState<Date | null>(null);
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

    async function atualizarTodosIndices() {
        console.log('aaa');
        fetchAndUpdateCdi();
        fetchAndUpdateSelic();
        fetchAndUpdateIpca();
    }
    async function atualizarTodosInvestimentos() {
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

    useEffect(() => {

        async function fetchIndices() {
            const data = await getAllIndices();
            setIndices(data);
        }
        fetchIndices();
    }, []);

    useEffect(() => {
        async function fetchLogs() {
            try {
                const logs = await getAllInvestmentLogs();
                console.log(logs)
                if (logs && logs.length > 0) {
                    // Encontre a data mais recente
                    const latestLog = logs.reduce((latest, current) => {
                        const currentDate = new Date(current.data_criacao); // Converta para objeto Date
                        return currentDate > new Date(latest.data_criacao) ? current : latest;
                    });

                    // Atualize o estado com a data mais recente
                    setLastDate(new Date(latestLog.data_criacao));

                } else {
                    console.warn("Nenhum log encontrado.");
                }
            } catch (error) {
                console.error("Erro ao buscar os logs:", error);
            }
        }
        fetchLogs();
    }, []);

    return (
        <main className="flex min-h-screen bg-black p-8 flex-col">
            <div className="w-full mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Dashboard de Índices</h1>
                <div className="flex items-center">
                    <Button
                        onClick={atualizarTodosIndices}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                        Atualizar Índices
                    </Button>
                    {/* Helper para explicação do dashboard */}
                    <div className="pl-5 text-white">
                        <HelperDialogWhite title="Ajuda - Dashboard de Índices">
                            <div>
                                <p>
                                    <strong>Dashboard de Índices:</strong> Este painel exibe informações de índices econômicos e sua última atualização.
                                </p>
                                <p>
                                    <strong>Atualizar Índices:</strong> Clique no botão "Atualizar Índices" para sincronizar os valores com a última atualização disponível.
                                </p>
                                <p>
                                    <strong>Atualizar Investimentos:</strong> Clique no botão "Atualizar Investimentos" para atualizar os valores. Ele estará desabilitado caso a última atualização tenha sido feita no mesmo dia.
                                </p>
                                <p>
                                    <strong>Última Atualização:</strong> Mostra a data mais recente em que os investimentos foram sincronizados.
                                </p>
                                <p>
                                    <strong>Cartões:</strong> Cada índice é representado por um cartão contendo:
                                    <ul className="list-disc ml-6">
                                        <li><strong>Nome:</strong> Nome do índice econômico.</li>
                                        <li><strong>Valor:</strong> Valor atual do índice, exibido com precisão de duas casas decimais.</li>
                                    </ul>
                                </p>
                            </div>
                        </HelperDialogWhite>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-8 w-full mt-8">
                {indices.length > 0 ? (
                    indices.map((indice) => (
                        <Card
                            key={indice.id_indice}
                            className="bg-gray-200 text-white p-6 rounded-lg shadow-lg flex-1 min-w-[300px]"
                        >
                            <div className="text-center">
                                <h2 className="text-gray-900 text-lg font-semibold">{indice.nome}</h2>
                                <p className="text-blue-500 text-3xl font-bold mt-4">
                                    {(indice.valor).toFixed(2)}
                                    %
                                </p>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="text-gray-500 text-center w-full">Carregando índices...</p>
                )}
            </div>
            <div className="flex flex-wrap gap-8 w-full mt-8">
                <Card
                    className="bg-gray-200 text-white p-6 rounded-lg shadow-lg flex-1 min-w-[300px] mt-10"
                >
                    <div className="text-center">
                        <h2 className="text-gray-900 text-lg font-semibold">Última Atualização dos Investimentos</h2>
                        <p className="text-blue-500 text-3xl font-bold mt-4">
                            {lastDate ? lastDate.toLocaleDateString("pt-BR") : "Não disponível"}
                        </p>
                    </div>
                </Card>
            </div>
            <Button
                onClick={atualizarTodosInvestimentos}
                className={`px-6 py-2 rounded-lg mt-5 ${lastDate?.toLocaleDateString("pt-BR") === new Date().toLocaleDateString("pt-BR")
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                disabled={lastDate?.toLocaleDateString("pt-BR") === new Date().toLocaleDateString("pt-BR")}
            >
                Atualizar Investimentos
            </Button>
        </main>
    );
}
