"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { EditIcon, TrashIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { deleteFamiliar, getFamiliarsByClientId, TFamiliarsByClientId } from "@/app/_actions/familiar"; // Ajuste o caminho conforme necessário
import { getClientById } from '@/app/_actions/client';
import HelperDialog from '@/components/helper-dialog';

interface IFamiliarPage {
    clientId: string;
}

export default function FamiliaresPage({ clientId }: IFamiliarPage) {
    const [familiares, setFamiliares] = useState<TFamiliarsByClientId>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [client, setClient] = useState<any>(null); // Ajuste o tipo conforme o formato dos dados
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedFamiliarId, setSelectedFamiliarId] = useState<string | null>(null);

    const familiaresPerPage = 10;

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const data = await getClientById(clientId);
                setClient(data);
            } catch (error) {
                console.error("Failed to fetch client", error);
            }
        };
        fetchClient();
    }, [clientId]);

    useEffect(() => {
        const fetchFamiliares = async () => {
            try {
                const response = await getFamiliarsByClientId(clientId);

                // Ordenar os familiares em ordem alfabética pelo nome
                const sortedFamiliares = response.sort((a, b) =>
                    a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
                );

                setFamiliares(sortedFamiliares);
            } catch (error) {
                console.error("Failed to fetch familiares", error);
            }
        };

        fetchFamiliares();
    }, [clientId]);

    const handleDeleteClick = (familiarId: string) => {
        setSelectedFamiliarId(familiarId);
        setIsDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedFamiliarId) {
            deleteFamiliar(selectedFamiliarId)
            setFamiliares(familiares.filter(f => f.id_familiar !== selectedFamiliarId));
            setIsDialogOpen(false);
            setSelectedFamiliarId(null);
        }
    };

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
        <main className="bg-gray-50 min-h-screen p-6 rounded relative">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">

                {/* Contêiner para o campo de busca e HelperDialog */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    {/* Campo de busca */}
                    <input
                        type="text"
                        placeholder="Buscar por nome ou telefone"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full p-2 border rounded bg-slate-100 text-gray-700"
                    />

                    {/* HelperDialog alinhado ao lado direito do campo de busca */}
                    <div className="ml-2"> {/* Ajuste o espaçamento conforme necessário */}
                        <HelperDialog title="Lista de Familiares">
                            <div>
                                {/* Conteúdo da ajuda */}
                                <div>
                                    <div>
                                        <p><strong>Buscar por nome ou telefone</strong>: Utilize este campo para buscar familiares já cadastrados pelo nome ou número de telefone. Insira parte do nome ou o telefone completo e o sistema exibirá resultados compatíveis.</p>
                                    </div>
                                    <div>
                                        <p><strong>Nome</strong>: Coluna que exibe o nome dos familiares cadastrados.</p>
                                    </div>
                                    <div>
                                        <p><strong>CPF</strong>: Coluna que mostra o CPF dos familiares cadastrados, permitindo uma identificação única de cada pessoa.</p>
                                    </div>
                                    <div>
                                        <p><strong>Ações</strong>: Coluna onde são disponibilizadas as ações que podem ser realizadas com o familiar listado, como editar ou excluir o cadastro.</p>
                                    </div>
                                    <div>
                                        <p><strong>Botão "Adicionar Familiar"</strong>: Clique neste botão para cadastrar um novo familiar. Você será redirecionado para uma página de cadastro onde poderá inserir todas as informações necessárias.</p>
                                    </div>
                                    <div>
                                        <p><strong>Botão "Anterior"</strong>: Use este botão para navegar para a página anterior na lista de familiares, caso haja vários registros.</p>
                                    </div>
                                    <div>
                                        <p><strong>Botão "Próximo"</strong>: Use este botão para avançar para a próxima página na lista de familiares, caso haja muitos registros.</p>
                                    </div>
                                </div>
                            </div>
                        </HelperDialog>
                    </div>
                </div>

                {/* Cabeçalhos da tabela */}
                <div className="grid grid-cols-3 gap-4 text-gray-700 font-semibold p-4">
                    <div className="justify-start text-start">Nome</div>
                    <div className="text-center">CPF</div>
                    <div className="text-end pr-2.5">Ações</div>
                </div>

                {/* Conteúdo da lista */}
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
                                    <Link href={`/admin/clients/${clientId}/editFamiliar/${familiar.id_familiar}`}>
                                        <EditIcon className="w-5 h-5 text-gray-600" />
                                    </Link>
                                </button>
                                <button
                                    aria-label="Delete"
                                    className="p-1 rounded hover:bg-gray-200"
                                    onClick={() => handleDeleteClick(familiar.id_familiar)}
                                >
                                    <TrashIcon className="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Diálogo de confirmação de exclusão */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar Exclusão</DialogTitle>
                        </DialogHeader>
                        <p>Tem certeza de que deseja excluir este familiar? Esta ação não pode ser desfeita.</p>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Excluir
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Paginação */}
                <div className="flex justify-between p-4">
                    <Button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        variant="outline"
                    >
                        Anterior
                    </Button>
                    <Link href={`/admin/clients/${clientId}/addFamiliar`}>
                        <Button variant="outline">
                            Adicionar Familiar
                        </Button>
                    </Link>
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
