import FamiliarForm from "@/app/admin/_components/addFamiliarForm";

export default function AddFamiliarPage({ params }: { params: { clientId: string } }) {

    return (
        <main>
            <FamiliarForm clientId={params.clientId} />
        </main>
    );
}