import { getAllPartners } from "@/app/_actions/partner";
import ClientForm from "../../_components/addClientForm";

export default async function AddClientPage() {
    const partners = await getAllPartners()

    return (
        <main>
            <ClientForm partners={partners} />
        </main>
    );
}