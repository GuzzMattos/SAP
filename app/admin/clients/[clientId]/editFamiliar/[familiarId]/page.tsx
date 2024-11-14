import { getClientById, updateClientById } from "@/app/_actions/client";
import HelperDialog from "@/components/helper-dialog";
import { EditFamiliarForm } from "./edit-familiar-form";
import { getFamiliarById } from "@/app/_actions/familiar";

export default async function EditFamiliarPage({ params }: { params: { familiarId: string } }) {

    const clientData = await getFamiliarById(params.familiarId);

    return (
        <main className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-gray-700 font-bold text-3xl">Editar Cliente</h1>
                        <HelperDialog title="Editar Familiar" children={undefined} />
                    </div>
                </div>

                <EditFamiliarForm familiar={clientData} />
            </div>
        </main>
    );
}
