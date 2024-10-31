import InvestimentForm from "@/app/admin/_components/addInvestimentForm";
import { getAllIndices } from "@/app/_actions/indice";

export default async function AddInvestimentPage({ params }: { params: { clientId: string } }) {
    const indices = await getAllIndices();
    return (
        <main>
            <InvestimentForm indice={indices} clientId={params.clientId} />
        </main>
    );
}