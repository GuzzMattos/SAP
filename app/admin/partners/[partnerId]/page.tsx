"use client"
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPartnerById } from "@/app/_actions/partner";
import HelperDialog from '@/components/helper-dialog';

export default function SinglePartnerPage({ params }: { params: { partnerId: string } }) {
    const [partner, setPartner] = useState<any>(null); // Ajuste o tipo conforme o formato dos dados
    const [activeTab, setActiveTab] = useState("Detalhes");

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const data = await getPartnerById(params.partnerId);
                setPartner(data);
            } catch (error) {
                console.error("Failed to fetch partner", error);
            }
        };

        fetchPartner();
    }, [params.partnerId]);

    if (!partner) {
        return <div>Loading...</div>;
    }

    return (
        <main className="bg-gray-50 min-h-screen p-6">
            <div className="flex justify-between items-center mb-4">
                <span className="text-black font-bold pb-3 text-3xl">Detalhes do Sócio</span>

                <HelperDialog title='Ajuda'>
                    <div>
                        Esta página permite visualizar os detalhes do parceiro, como nome, email, CPF e tipo. Use as abas para acessar outras informações sobre o parceiro.
                    </div>
                </HelperDialog>
            </div>

            <Card className="p-6 max-w-full mx-auto bg-white shadow-md rounded-lg">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="border-b border-gray-300 mb-4">
                        <TabsTrigger value="Detalhes" className="py-2 px-4 text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-0">
                            Detalhes
                        </TabsTrigger>
                        {/* <TabsTrigger value="Outras Informações" className="py-2 px-4 text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-0">
                            Clientes
                        </TabsTrigger> */}
                    </TabsList>

                    {/* Tab Panels */}
                    {activeTab === "Detalhes" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <Label htmlFor="name" className="text-gray-700">Nome</Label>
                                <Input id="name" value={partner.nome} className="bg-gray-100 text-gray-800" readOnly />
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-gray-700">Email</Label>
                                <Input id="email" value={partner.email} className="bg-gray-100 text-gray-800" readOnly />
                            </div>

                            <div>
                                <Label htmlFor="cpf" className="text-gray-700">CPF</Label>
                                <Input id="cpf" value={partner.cpf} className="bg-gray-100 text-gray-800" readOnly />
                            </div>

                            <div>
                                <Label htmlFor="tipo" className="text-gray-700">Tipo</Label>
                                <Input id="tipo" value={partner.tipo === 'user' ? 'Comum' : partner.tipo === 'admin' ? 'Administrador' : ''} className="bg-gray-100 text-gray-800" readOnly />
                            </div>

                            {/* Adicione mais campos conforme necessário */}
                        </div>
                    )}
                    {activeTab === "Outras Informações" && (
                        <div>
                            {/* Conteúdo da aba Outras Informações */}
                            <p>Conteúdo da aba Outras Informações.</p>
                        </div>
                    )}
                </Tabs>
            </Card>
        </main>
    )
}
