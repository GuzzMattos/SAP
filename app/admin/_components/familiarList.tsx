"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { EditIcon, TrashIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import { getFamiliarsByClientId, TFamiliarsByClientId } from "@/app/_actions/familiar"; // Ajuste o caminho conforme necessário


interface IFamiliarPage {
    clientId: string;
}

export default function FamiliaresPage({ clientId }: IFamiliarPage) {
    const [familiares, setFamiliares] = useState<TFamiliarsByClientId>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const familiaresPerPage = 10;

    // UIUIUIUIUIUIUIUIUIUIUIUIUIUIUIUIUIUIUI

    useEffect(() => {
        const fetchFamiliares = async () => {
            try {
                const response = await getFamiliarsByClientId(clientId)
                setFamiliares(response);
            } catch (error) {
                console.error("Failed to fetch familiares", error);
            }
        };

        fetchFamiliares();
    }, []);

    const filteredFamiliares = familiares.filter(familiar =>
        familiar.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        familiar.cpf.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastFamiliar = currentPage * familiaresPerPage;
    const indexOfFirstFamiliar = indexOfLastFamiliar - familiaresPerPage;
    const currentFamiliares = filteredFamiliares.slice(indexOfFirstFamiliar, indexOfLastFamiliar);

    const totalPages = Math.ceil(filteredFamiliares.length / familiaresPerPage);

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
        <main className="bg-gray-50 min-h-screen p-6 rounded">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-200 rounded">
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por nome ou telefone"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="w-full p-2 border rounded bg-slate-100 text-gray-700"
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-gray-700 font-semibold">
                        <div className="justify-start text-start">Nome</div>
                        <div className="text-center">CPF</div>
                        <div className="text-end pr-2.5">Ações</div>
                    </div>
                </div>
                <div className="divide-y divide-gray-200">
                    {currentFamiliares.map((familiar) => (
                        <div key={familiar.id_familiar} className="grid grid-cols-3 gap-4 items-center px-4 py-1">
                            <div className="flex items-center justify-start text-gray-900">
                                <Link href={`/admin/familiares/${familiar.id_familiar}`} className="text-gray-600 hover:underline">
                                    {familiar.nome}
                                </Link>
                            </div>
                            <div className="flex items-center justify-center text-gray-600">
                                {familiar.cpf}
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
                <div className="flex justify-between p-4">
                    <Button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        variant="outline"
                    >
                        Anterior
                    </Button>
                    <Button variant="outline">
                        <Link href={`/admin/clients/${clientId}/addFamiliar`}>Adicionar Familiar</Link>
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
    );
}
