"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPartnerById, updatePartnerById } from "@/app/_actions/partner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function EditPartnerPage({ params }: { params: { partnerId: string } }) {
    const router = useRouter();
    const [partner, setPartner] = useState<any>({
        nome: '',
        email: '',
        cpf: '',
        tipo: 'user',
        senha: '',
        confirmarSenha: ''
    });
    const [activeTab, setActiveTab] = useState("Detalhes");
    const [isLoading, setIsLoading] = useState(false);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setPartner({ ...partner, [id]: value });
    };

    const handleSave = async () => {
        if (partner.senha !== partner.confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        setIsLoading(true);
        try {
            await updatePartnerById(params.partnerId, partner);
            alert('Partner atualizado com sucesso!');
            router.push(`/admin/partners`);
        } catch (error) {
            console.error("Failed to update partner", error);
            alert('Erro ao atualizar o partner.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!partner) {
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
                        {/* <TabsTrigger value="Outras Informações" className="py-2 px-4 text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-0">
                            Clientes
                        </TabsTrigger> */}
                    </TabsList>

                    {activeTab === "Detalhes" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <Label htmlFor="nome" className="text-gray-700">Nome</Label>
                                <Input id="nome" value={partner.nome} onChange={handleChange} className="bg-white text-gray-800" />
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-gray-700">Email</Label>
                                <Input id="email" value={partner.email} onChange={handleChange} className="bg-white text-gray-800" />
                            </div>

                            <div>
                                <Label htmlFor="cpf" className="text-gray-700">CPF</Label>
                                <Input id="cpf" value={partner.cpf} onChange={handleChange} className="bg-white text-gray-800" />
                            </div>

                            <div>
                                <Label htmlFor="tipo" className="text-gray-700">Tipo</Label>
                                <Select
                                    value={partner.tipo || undefined}
                                    onValueChange={(value) => setPartner({ ...partner, tipo: value })}
                                >
                                    <SelectTrigger className="bg-white text-gray-800">
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Opções válidas */}
                                        <SelectItem value="admin">Administrador</SelectItem>
                                        <SelectItem value="user">Comum</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="senha" className="text-gray-700">Senha</Label>
                                <Input type="password" id="senha" value={partner.senha} onChange={handleChange} className="bg-white text-gray-800" />
                            </div>

                            <div>
                                <Label htmlFor="confirmarSenha" className="text-gray-700">Confirmar Senha</Label>
                                <Input type="password" id="confirmarSenha" value={partner.confirmarSenha} onChange={handleChange} className="bg-white text-gray-800" />
                            </div>
                        </div>
                    )}
                </Tabs>

                <div className="mt-6 flex justify-end space-x-4">
                    <Button variant="outline" onClick={() => router.push(`/admin/partners/${params.partnerId}`)}>
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
