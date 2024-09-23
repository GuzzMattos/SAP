import InvestimentForm from "@/app/admin/_components/addInvestimentForm";

export default function AddInvestimentPage({ params }: { params: { clientId: string } }) {

    return (
        <main>
            <InvestimentForm clientId={params.clientId} />
        </main>
    );
}