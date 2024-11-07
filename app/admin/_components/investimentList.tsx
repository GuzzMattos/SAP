"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { EditIcon, TrashIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import { getInvestimentsByClientId, TInvestimentsByClientId } from "@/app/_actions/investiment"; // Ajuste o caminho conforme necessário
import HelperDialog from '@/components/helper-dialog';

interface IInvestmentsPage {
    clientId: string;
}

export default function InvestmentsPage({ clientId }: IInvestmentsPage) {
    const [investments, setInvestments] = useState<TInvestimentsByClientId>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const investmentsPerPage = 10;

    // UIUIUIUIUIUIUIUIUIUIUIUIUIUIUIUIUIUIUI

    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                const response = await getInvestimentsByClientId(clientId);
                setInvestments(response);
            } catch (error) {
                console.error("Failed to fetch investments", error);
            }
        };

        fetchInvestments();
    }, [clientId]);

    const filteredInvestments = investments.filter(investment =>
        investment.banco.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.classe.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastInvestment = currentPage * investmentsPerPage;
    const indexOfFirstInvestment = indexOfLastInvestment - investmentsPerPage;
    const currentInvestments = filteredInvestments.slice(indexOfFirstInvestment, indexOfLastInvestment);

    const totalPages = Math.ceil(filteredInvestments.length / investmentsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <main className="bg-gray-50 min-h-screen p-6 rounded relative">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            
            {/* Contêiner para o campo de busca e HelperDialog */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                {/* Campo de busca */}
                <input
                    type="text"
                    placeholder="Buscar por banco ou classe"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-2 border rounded bg-slate-100 text-gray-700"
                />
    
                {/* HelperDialog alinhado ao lado direito do campo de busca */}
                <div className="ml-2"> {/* Ajuste o espaçamento conforme necessário */}
                    <HelperDialog title="Ajuda">
                        <div>
                            {/* Conteúdo da ajuda */}
                            Utilize o campo de busca para filtrar investimentos por banco ou classe. Navegue pelas ações disponíveis para gerenciar cada investimento.
                        </div>
                    </HelperDialog>
                </div>
            </div>
    
            {/* Cabeçalhos da tabela */}
            <div className="grid grid-cols-4 gap-4 text-gray-700 font-semibold p-4">
                <div className="justify-start text-start">Banco</div>
                <div className="text-center">Classe</div>
                <div className="text-center">Data Aplicação</div>
                <div className="text-end pr-2.5">Ações</div>
            </div>
    
            {/* Conteúdo da lista */}
            <div className="divide-y divide-gray-200">
                {currentInvestments.map((investment) => (
                    <div key={investment.id_invest} className="grid grid-cols-4 gap-4 items-center px-4 py-1">
                        <div className="flex items-center justify-start text-gray-900">
                            <Link href={`/admin/investments/${investment.id_invest}`} className="text-gray-600 hover:underline">
                                {investment.banco}
                            </Link>
                        </div>
                        <div className="flex items-center justify-center text-gray-600">
                            {investment.classe}
                        </div>
                        <div className="flex items-center justify-center text-gray-600">
                            {new Date(investment.data_aplic).toLocaleDateString()}
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                            <button
                                aria-label="Edit"
                                className="p-1 rounded hover:bg-gray-200"
                            >
                                <EditIcon className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                aria-label="Delete"
                                className="p-1 rounded hover:bg-gray-200"
                            >
                                <TrashIcon className="w-5 h-5 text-red-600" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
    
            {/* Paginação */}
            <div className="flex justify-between p-4">
                <Button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    variant="outline"
                >
                    Anterior
                </Button>
                <Button variant="outline">
                    <Link href={`/admin/clients/${clientId}/addInvestiment`}>Adicionar Investimento</Link>
                </Button>
                <Button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                >
                    Próximo
                </Button>
            </div>
        </div>
    </main>
    )
}
    