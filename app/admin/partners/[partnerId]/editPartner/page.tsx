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
import HelperDialog from '@/components/helper-dialog';


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
                <div className="flex items-center justify-between"> </div>
                <div className='flex justify-between'>

                    <div className="text-gray-900 font-bold text-3xl pb-5">Editar Sócio </div>
                    <HelperDialog title='Editar Sócio'>
                        <div>
                            <div>
                                <p><strong>Nome</strong>: Campo obrigatório. Insira o nome completo do sócio.</p>
                            </div>

                            <div>
                                <p><strong>Email</strong>: Campo obrigatório. Insira o endereço de e-mail do sócio. Certifique-se de que o e-mail está correto para possibilitar o contato.</p>
                            </div>

                            <div>
                                <p><strong>CPF</strong>: Campo obrigatório. Insira o número do CPF do sócio. O CPF deve ser válido e não pode conter caracteres especiais (apenas números).</p>
                            </div>

                            <div>
                                <p><strong>Tipo</strong>: Selecione o tipo de acesso do sócio (por exemplo, Administrador ou Usuário padrão). Isso definirá os privilégios de acesso.</p>
                            </div>

                            <div>
                                <p><strong>Senha</strong>: Campo obrigatório. Defina uma senha para o sócio. A senha deve atender aos critérios de segurança estabelecidos.</p>
                            </div>

                            <div>
                                <p><strong>Confirmar Senha</strong>: Campo obrigatório. Confirme a senha para garantir que foi digitada corretamente.</p>
                            </div>

                            <div>
                                <p><strong>Botões Cancelar e Salvar</strong>: Use o botão "Cancelar" para descartar alterações e retornar sem salvar. Clique em "Salvar" para registrar as informações inseridas.</p>
                            </div>
                        </div>
                    </HelperDialog>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <Label htmlFor="nome" className="text-gray-700">Nome *</Label>
                        <Input id="nome" value={partner.nome} onChange={handleChange} className="bg-white text-gray-800" />
                    </div>

                    <div>
                        <Label htmlFor="email" className="text-gray-700">Email *</Label>
                        <Input id="email" value={partner.email} onChange={handleChange} className="bg-white text-gray-800" />
                    </div>

                    <div>
                        <Label htmlFor="cpf" className="text-gray-700">CPF *</Label>
                        <Input id="cpf" value={partner.cpf} onChange={handleChange} className="bg-white text-gray-800" />
                    </div>

                    <div>
                        <Label htmlFor="tipo" className="text-gray-700">Tipo *</Label>
                        <Select
                            value={partner.tipo || undefined}
                            onValueChange={(value) => setPartner({ ...partner, tipo: value })}
                        >
                            <SelectTrigger className="bg-white text-gray-800">
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Administrador</SelectItem>
                                <SelectItem value="user">Comum</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="senha" className="text-gray-700">Senha *</Label>
                        <Input type="password" id="senha" value={partner.senha} onChange={handleChange} className="bg-white text-gray-800" />
                    </div>

                    <div>
                        <Label htmlFor="confirmarSenha" className="text-gray-700">Confirmar Senha *</Label>
                        <Input type="password" id="confirmarSenha" value={partner.confirmarSenha} onChange={handleChange} className="bg-white text-gray-800" />
                    </div>
                </div>


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
