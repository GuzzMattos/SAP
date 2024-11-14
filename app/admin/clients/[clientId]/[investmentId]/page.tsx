"use client";
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInvestimentById } from "@/app/_actions/investiment";
import HelperDialog from '@/components/helper-dialog';

export default function SingleInvestmentPage({ params }: { params: { clientId: string, investmentId: string } }) {
    const [investment, setInvestment] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("Detalhes");
    console.log("Client ID:", params.clientId);
    console.log("Investment ID:", params.investmentId);
    useEffect(() => {
        const fetchInvestment = async () => {
            try {
                const data = await getInvestimentById(params.investmentId);
                setInvestment(data);
            } catch (error) {
                console.error("Failed to fetch investment", error);
            }
        };

        fetchInvestment();
    }, [params.investmentId]);

    if (!investment) {
        return <div>Loading...</div>;
    }

    return (
        <main className="bg-gray-50 min-h-screen p-6">
            <div className="flex justify-between items-center mb-4">
                <span className="text-black font-bold pb-3 text-3xl">Detalhes do Investimento</span>

                <HelperDialog title='Ajuda'>
                    <div>
                        Esta página permite visualizar os detalhes do investimento, como banco, conta, valor aplicado e data de vencimento.
                    </div>
                </HelperDialog>
            </div>

            <Card className="p-6 max-w-full mx-auto bg-white shadow-md rounded-lg">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="border-b border-gray-300 mb-4">
                        <TabsTrigger value="Detalhes" className="py-2 px-4 text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-0">
                            Detalhes
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab Panels */}
                    {activeTab === "Detalhes" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <Label htmlFor="banco" className="text-gray-700">Banco</Label>
                                <Input id="banco" value={investment.banco} className="bg-gray-100 text-gray-800" readOnly />
                            </div>

                            <div>
                                <Label htmlFor="agencia" className="text-gray-700">Agência</Label>
                                <Input id="agencia" value={investment.agencia} className="bg-gray-100 text-gray-800" readOnly />
                            </div>

                            <div>
                                <Label htmlFor="conta" className="text-gray-700">Conta</Label>
                                <Input id="conta" value={investment.conta} className="bg-gray-100 text-gray-800" readOnly />
                            </div>

                            <div>
                                <Label htmlFor="valor" className="text-gray-700">Valor</Label>
                                <Input id="valor" value={investment.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} className="bg-gray-100 text-gray-800" readOnly />
                            </div>

                            <div>
                                <Label htmlFor="data_aplic" className="text-gray-700">Data de Aplicação</Label>
                                <Input id="data_aplic" value={new Date(investment.data_aplic).toLocaleDateString('pt-BR')} className="bg-gray-100 text-gray-800" readOnly />
                            </div>

                            <div>
                                <Label htmlFor="data_venc" className="text-gray-700">Data de Vencimento</Label>
                                <Input id="data_venc" value={new Date(investment.data_venc).toLocaleDateString('pt-BR')} className="bg-gray-100 text-gray-800" readOnly />
                            </div>

                            <div>
                                <Label htmlFor="isento" className="text-gray-700">Isento</Label>
                                <Input id="isento" value={investment.isento ? "Sim" : "Não"} className="bg-gray-100 text-gray-800" readOnly />
                            </div>
                        </div>
                    )}
                </Tabs>
            </Card>
        </main>
    );
}
