"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClientById, updateClientById } from "@/app/_actions/client";
import { getAllPartners } from "@/app/_actions/partner"; // Supondo que esta função traga todos os partners disponíveis
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditClientPage({ params }: { params: { clientId: string } }) {
    const router = useRouter();
    const [client, setClient] = useState<any>({
        nome: '',
        email: '',
        cpf: '',
        data_nasc: '',
        est_civil: '',
        dupla_nacio: false,
        reg_bens: '',
        res_fiscal_brasil: false,
        profissao: '',
        id_user: '' // Armazena o ID do partner responsável
    });
    const [partners, setPartners] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("Detalhes");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchClientAndPartners = async () => {
            try {
                const clientData = await getClientById(params.clientId);
                const partnersData = await getAllPartners();
                setClient(clientData);
                setPartners(partnersData);
            } catch (error) {
                console.error("Failed to fetch client or partners", error);
            }
        };

        fetchClientAndPartners();
    }, [params.clientId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setClient({ ...client, [id]: value });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateClientById(params.clientId, client);
            alert('Cliente atualizado com sucesso!');
            router.push(`/admin/clients`);
        } catch (error) {
            console.error("Failed to update client", error);
            alert('Erro ao atualizar o cliente.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!client) {
        return <div>Loading...</div>;
    }

    return (
        <main className="bg-gray-50 min-h-screen p-6">
            <Card className="p-6 max-w-full mx-auto bg-white shadow-md rounded-lg">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="border-b border-gray-300 mb-4">
                        <TabsTrigger value="Detalhes" className="py-2 px-4 text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-0">
                            Detalhes
                        </TabsTrigger>
                    </TabsList>

                    {activeTab === "Detalhes" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <Label htmlFor="nome" className="text-gray-700">Nome</Label>
                                <Input id="nome" value={client.nome} onChange={handleChange} className="bg-white text-gray-800" />
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-gray-700">Email</Label>
                                <Input id="email" value={client.email} onChange={handleChange} className="bg-white text-gray-800" />
                            </div>

                            <div>
                                <Label htmlFor="cpf" className="text-gray-700">CPF</Label>
                                <Input id="cpf" value={client.cpf} onChange={handleChange} className="bg-white text-gray-800" />
                            </div>

                            <div>
                                <Label htmlFor="data_nasc" className="text-gray-700">Data de Nascimento</Label>
                                <Input type="date" id="data_nasc" value={client.data_nasc} onChange={handleChange} className="bg-white text-gray-800" />
                            </div>

                            <div>
                                <Label htmlFor="est_civil" className="text-gray-700">Estado Civil</Label>
                                <Input id="est_civil" value={client.est_civil} onChange={handleChange} className="bg-white text-gray-800" />
                            </div>

                            <div>
                                <Label htmlFor="dupla_nacio" className="text-gray-700">Dupla Nacionalidade</Label>
                                <Select
                                    value={client.dupla_nacio ? "Sim" : "Não"}
                                    onValueChange={(value) => setClient({ ...client, dupla_nacio: value === "Sim" })}
                                >
                                    <SelectTrigger className="bg-white text-gray-800">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sim">Sim</SelectItem>
                                        <SelectItem value="Não">Não</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="reg_bens" className="text-gray-700">Regime de Bens</Label>
                                <Input id="reg_bens" value={client.reg_bens} onChange={handleChange} className="bg-white text-gray-800" />
                            </div>

                            <div>
                                <Label htmlFor="res_fiscal_brasil" className="text-gray-700">Residência Fiscal no Brasil</Label>
                                <Select
                                    value={client.res_fiscal_brasil ? "Sim" : "Não"}
                                    onValueChange={(value) => setClient({ ...client, res_fiscal_brasil: value === "Sim" })}
                                >
                                    <SelectTrigger className="bg-white text-gray-800">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sim">Sim</SelectItem>
                                        <SelectItem value="Não">Não</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="profissao" className="text-gray-700">Profissão</Label>
                                <Input id="profissao" value={client.profissao} onChange={handleChange} className="bg-white text-gray-800" />
                            </div>

                            <div>
                                <Label htmlFor="id_user" className="text-gray-700">Partner Responsável</Label>
                                <Select
                                    value={client.id_user || undefined}
                                    onValueChange={(value) => setClient({ ...client, id_user: value })}
                                >
                                    <SelectTrigger className="bg-white text-gray-800">
                                        <SelectValue placeholder="Selecione o Partner" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {partners.map((partner) => (
                                            <SelectItem key={partner.id_user} value={partner.id_user}>
                                                {partner.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </Tabs>

                <div className="mt-6 flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => router.push(`/admin/clients/${params.clientId}`)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Salvando...' : 'Salvar'}
                    </Button>
                </div>
            </Card>
        </main>
    );
}
