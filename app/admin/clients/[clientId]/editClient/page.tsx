import { getClientById, updateClientById } from "@/app/_actions/client";
import HelperDialog from "@/components/helper-dialog";
import { EditClientForm } from "./edit-client-form";
import { getAllPartners } from "@/app/_actions/partner";

export default async function EditClientPage({ params }: { params: { clientId: string } }) {

    const clientData = await getClientById(params.clientId);
    const partnersData = await getAllPartners();
    return (
        <main className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-gray-700 font-bold text-3xl">Editar Cliente</h1>
                        <HelperDialog title="Ajuda - Editar Cliente">
                            <div>
                                <p>
                                    <strong>Email:</strong> Preencha com o endereço de email válido do cliente. Este campo é usado para notificações e comunicação oficial.
                                </p>
                                <p>
                                    <strong>Sócio:</strong> Selecione o sócio responsável pelo cliente. Esta informação é útil para associações empresariais.
                                </p>
                                <p>
                                    <strong>Estado Civil:</strong> Informe o estado civil do cliente (ex.: Solteiro, Casado, Divorciado). Essa informação pode ser relevante para análises ou documentos fiscais.
                                </p>
                                <p>
                                    <strong>Dupla Nacionalidade:</strong> Escolha "Sim" ou "Não" para indicar se o cliente possui mais de uma nacionalidade. Isso pode impactar o tratamento fiscal ou jurídico.
                                </p>
                                <p>
                                    <strong>Residência Fiscal no Brasil:</strong> Escolha "Sim" ou "Não" para indicar se o cliente é residente fiscal no Brasil. Essa informação é crucial para fins tributários.
                                </p>
                                <p>
                                    <strong>Profissão:</strong> Selecione a profissão do cliente. Utilize a lista de profissões disponíveis para garantir consistência e padronização.
                                </p>
                            </div>
                        </HelperDialog>
                    </div>
                </div>
    
                <EditClientForm client={clientData} partners={partnersData} />
            </div>
        </main>
    );
}
