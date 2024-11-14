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
                        <HelperDialog title="Editar Clientes" children={undefined} />
                    </div>
                </div>

                <EditClientForm client={clientData} partners={partnersData} />
            </div>
        </main>
    );
}
