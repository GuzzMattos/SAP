"use client";

import { useEffect, useState } from "react";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { getAllClients, TClient } from "@/app/_actions/client";
import { getInvestimentsByClientId, TInvestimentsByClientId } from "@/app/_actions/investiment";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export default function DashboardPage() {
  const [clientes, setClientes] = useState<TClient>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [investimentos, setInvestimentos] = useState<TInvestimentsByClientId>([]);
  const [totalInvestimentos, setTotalInvestimentos] = useState<number>(0);
  const [numInvestimentos, setNumInvestimentos] = useState<number>(0);
  const [totalCDB, setTotalCDB] = useState<number>(0);
  const [chartData1, setChartData1] = useState([
    { tipoativo: "cdb", quant: 900, fill: "red" },
    { tipoativo: "lc", quant: 275, fill: "green" },
    { tipoativo: "fis", quant: 200, fill: "yellow" },
    { tipoativo: "acoes", quant: 187, fill: "purple" },
    { tipoativo: "tesouro", quant: 173, fill: "brown" },
    { tipoativo: "debentures", quant: 90, fill: "blue" },
  ]);

  const [chartData2, setChartData2] = useState([
    { banco: "xp", quantb: 350, fill: "yellow" },
    { banco: "c6", quantb: 250, fill: "grey" },
    { banco: "itau", quantb: 150, fill: "orange" },
    { banco: "bradesco", quantb: 150, fill: "red" },
    { banco: "nubank", quantb: 150, fill: "purple" },
  ]);

  const chartConfig = {
    quantb: {
      label: "Bancos"
    },
    quant: {
      label: "Tipos de Ativos",
    },
    cdb: {
      label: "CDB",
      color: "red",
    },
    lc: {
      label: "LCI/LCA",
      color: "green",
    },
    fis: {
      label: "FIs",
      color: "yellow",
    },
    acoes: {
      label: "Ações",
      color: "purple",
    },
    tesouro: {
      label: "Tesouro",
      color: "brown",
    },
    debentures: {
      label: "Debentures",
      color: "blue",
    },
    xp: {
      label: "XP",
      color: "yellow",
    },
    c6: {
      label: "C6",
      color: "grey",
    },
    itau: {
      label: "Itaú",
      color: "orange",
    },
    bradesco: {
      label: "Bradesco",
      color: "red",
    },
    nubank: {
      label: "Nubank",
      color: "purple",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    async function fetchClientes() {
      try {
        const dados = await getAllClients();
        setClientes(dados);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    }
    fetchClientes();
  }, []);

  useEffect(() => {
    async function fetchInvestimentos() {
      if (selectedClient) {
        try {
          const investments = await getInvestimentsByClientId(selectedClient);
          setInvestimentos(investments);

          const total = investments.reduce((acc, investimento) => acc + investimento.valor, 0);
          setTotalInvestimentos(total);
          setNumInvestimentos(investments.length);

          // Calcular o total de CDB
          const totalCDB = investments
            .filter(investimento => investimento.sub_classe_atv === "cdb")
            .reduce((acc, investimento) => acc + investimento.valor, 0);
          setTotalCDB(totalCDB);

          // Calcular totais por tipo de ativo
          const tipoAtivoTotals = investments.reduce((acc, investimento) => {
            const tipo = investimento.sub_classe_atv;
            if (!acc[tipo]) acc[tipo] = 0;
            acc[tipo] += investimento.valor;
            return acc;
          }, {} as Record<string, number>);

          // Atualizar chartData1 com os totais
          setChartData1(prevData =>
            prevData.map(item => ({
              ...item,
              quant: tipoAtivoTotals[item.tipoativo] || 0,
            }))
          );

          // Calcular totais por banco
          const bancoTotals = investments.reduce((acc, investimento) => {
            const banco = investimento.banco;
            if (!acc[banco]) acc[banco] = 0;
            acc[banco] += investimento.valor;
            return acc;
          }, {} as Record<string, number>);

          // Atualizar chartData2 com os totais
          setChartData2(prevData =>
            prevData.map(item => ({
              ...item,
              quantb: bancoTotals[item.banco] || 0,
            }))
          );
        } catch (error) {
          console.error("Erro ao buscar investimentos:", error);
        }
      }
    }
    fetchInvestimentos();
  }, [selectedClient]);

  return (
    <main className="flex min-h-screen bg-black p-8 flex-col">
      <div className="w-full mb-8">
        <Select onValueChange={setSelectedClient}>
          <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg shadow-sm">
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent className="mt-2 rounded-lg shadow-lg">
            {clientes?.map((cliente) => (
              <SelectItem key={cliente.id_cliente} value={cliente.id_cliente} className="p-2 hover:bg-gray-100">
                {cliente.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-8 w-full mt-8">
        {selectedClient && (
          <div className="bg-white rounded-lg shadow-md p-10 flex-1 min-w-[300px] text-center">
            <h2 className="text-gray-500 mb-2">Investimentos</h2>
            <h3 className="text-black text-2xl font-bold mb-4">Valuation</h3>
            <p className="text-blue-500 text-3xl font-semibold">R${totalInvestimentos.toFixed(2)}</p>
            <p className="text-gray-500 mt-4">dividido em</p>
            <p className="text-blue-500 text-3xl font-semibold">{numInvestimentos}</p>
            <p className="text-gray-500">aplicações</p>
          </div>
        )}

        {/* Novo quadro como placeholder */}
        <div className="bg-gray-200 rounded-lg shadow-md p-10 flex-1 min-w-[300px] text-center">
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-gray-500">Rentabilidade Bruta</p>
              <p className="text-red-500 text-5xl font-bold">12%</p>
            </div>
            <div>
              <p className="text-gray-500">Rentabilidade Objetivo</p>
              <p className="text-blue-500 text-5xl font-bold">15%</p>
            </div>
          </div>

          <div className="mt-4 pt-8">
            <p className="text-gray-500">Rentabilidade Relativa</p>
            <p className="text-red-500 text-5xl font-bold">-2%</p>
          </div>
        </div>
      </div>
      <div className="flex gap-8 w-full mt-8">
        <Card className="flex-1 min-w-[300px]">
          <CardHeader className="items-center pb-0">
            <CardTitle>Ativos</CardTitle>
            <CardDescription>Distribuição em tipos de ativos</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <Pie data={chartData1} dataKey="quant" />
                <ChartLegend
                  content={<ChartLegendContent nameKey="tipoativo" />}
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[300px]">
          <CardHeader className="items-center pb-0">
            <CardTitle>Bancos</CardTitle>
            <CardDescription>Distribuição em bancos</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <Pie data={chartData2} dataKey="quantb" />
                <ChartLegend
                  content={<ChartLegendContent nameKey="banco" />}
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );


}
