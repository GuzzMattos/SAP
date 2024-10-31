"use client";

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getClientById } from "@/app/_actions/client"; // Ajuste o caminho conforme necessário
import FamiliaresPage from '../../_components/familiarList';
import InvestmentsPage from '../../_components/investimentList';

export default function SingleClientPage({ params }: { params: { clientId: string } }) {
  const [client, setClient] = useState<any>(null); // Ajuste o tipo conforme o formato dos dados
  const [activeTab, setActiveTab] = useState("Cliente");

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getClientById(params.clientId);
        setClient(data);
      } catch (error) {
        console.error("Failed to fetch client", error);
      }
    };

    fetchClient();
  }, [params.clientId]);

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <main className="bg-gray-50 min-h-screen p-6">
      <span className="text-black font-bold pb-3 text-3xl">{client.nome}</span>
      <Card className="p-6 max-w-full mx-auto bg-white shadow-md rounded-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>

          <TabsList className="border-b border-gray-300 mb-4">

            <TabsTrigger value="Cliente" className="py-2 px-4 text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-0">
              Cliente
            </TabsTrigger>
            <TabsTrigger value="Familiares" className="py-2 px-4 text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-0">
              Familiares
            </TabsTrigger>
            <TabsTrigger value="Investimentos" className="py-2 px-4 text-gray-400 hover:text-blue-500 focus:outline-none focus:ring-0">
              Investimentos
            </TabsTrigger>
          </TabsList>

          {/* Tab Panels */}
          {activeTab === "Cliente" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="name" className="text-gray-700">Nome</Label>
                <Input id="name" value={client.nome} className="bg-gray-100 text-gray-800" readOnly />
              </div>

              <div>
                <Label htmlFor="cpf" className="text-gray-700">CPF</Label>
                <Input id="cpf" value={client.cpf} className="bg-gray-100 text-gray-800" readOnly />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input id="email" value={client.email} className="bg-gray-100 text-gray-800" readOnly />
              </div>

              <div>
                <Label htmlFor="birthDate" className="text-gray-700">Data de Nascimento</Label>
                <Input id="birthDate" value={client.data_nasc.toLocaleDateString()} className="bg-gray-100 text-gray-800" readOnly />
              </div>

              <div>
                <Label htmlFor="maritalStatus" className="text-gray-700">Estado Civil</Label>
                <Input id="maritalStatus" value={client.est_civil} className="bg-gray-100 text-gray-800" readOnly />
              </div>

              <div>
                <Label htmlFor="dualNationality" className="text-gray-700">Dupla Nacionalidade</Label>
                <Input id="dualNationality" value={client.dupla_nacio ? "Sim" : "Não"} className="bg-gray-100 text-gray-800" readOnly />
              </div>

              <div>
                <Label htmlFor="propertyRegime" className="text-gray-700">Regime de Bens</Label>
                <Input id="propertyRegime" value={client.reg_bens} className="bg-gray-100 text-gray-800" readOnly />
              </div>

              <div>
                <Label htmlFor="taxResidenceInBrazil" className="text-gray-700">Residência Fiscal no Brasil</Label>
                <Input id="taxResidenceInBrazil" value={client.res_fiscal_brasil ? "Sim" : "Não"} className="bg-gray-100 text-gray-800" readOnly />
              </div>

              <div>
                <Label htmlFor="profession" className="text-gray-700">Profissão</Label>
                <Input id="profession" value={client.profissao} className="bg-gray-100 text-gray-800" readOnly />
              </div>

              <div>
                <Label htmlFor="partnerId" className="text-gray-700">ID do Parceiro</Label>
                <Input id="partnerId" value={client.id_user} className="bg-gray-100 text-gray-800" readOnly />
              </div>
            </div>
          )}
          {activeTab === "Familiares" && (
            <div>
              <FamiliaresPage clientId={params.clientId} />
            </div>
          )}
          {activeTab === "Investimentos" && (
            <div>
              <InvestmentsPage clientId={params.clientId} />
            </div>
          )}
        </Tabs>
      </Card>
    </main>
  );
}
