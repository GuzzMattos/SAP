"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { EditIcon, TrashIcon, ArrowBigUp } from "lucide-react";
import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { activateClient, getInactiveClients, TInactiveClient } from '@/app/_actions/client';
import HelperDialog from '@/components/helper-dialog';
import { DialogTrigger, Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { redirect } from "next/navigation";


export default function ClientsPage() {
    const [clients, setClients] = useState<TInactiveClient>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const clientsPerPage = 10;

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await getInactiveClients()

                setClients(response);
            } catch (error) {
                console.error("Failed to fetch clients", error);
            }
        };

        fetchClients();
    }, []);

    const confirmActivateClient = async () => {
        if (selectedClientId) {
            try {
                await activateClient(selectedClientId);
                setSelectedClientId(null)
                setSelectedClientName(null)
                setDialogOpen(false);;
                redirect("/admin/clients");
            } catch (error: any) {
                console.log(error.message);  // Captura a mensagem de erro para exibição
            }
        }
    };

    // Filtrar clientes com base no termo de pesquisa
    const filteredClients = clients.filter(client =>
        client.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cpf.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Determinar os clientes a serem exibidos na página atual
    const indexOfLastClient = currentPage * clientsPerPage;
    const indexOfFirstClient = indexOfLastClient - clientsPerPage;
    const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

    // Calcular o número total de páginas
    const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

    // Funções de navegação de página
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <main className="bg-gray-50 min-h-screen p-6 rounded relative">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">

                {/* Contêiner do título e HelperDialog */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h1 className="text-gray-700 font-bold text-3xl">Clientes Inativos</h1>

                    {/* HelperDialog no canto superior direito */}
                    <HelperDialog title="Ajuda">
                        <div>
                            Aqui você pode gerenciar seus clientes inativos. Utilize o campo de busca para filtrar por nome ou CPF.
                        </div>
                    </HelperDialog>
                </div>

                <div className="p-4 border-b border-gray-200">
                    {/* Campo de busca */}
                    <input
                        type="text"
                        placeholder="Buscar por nome ou CPF"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full p-2 border rounded bg-slate-100 text-gray-700"
                    />

                    {/* Cabeçalhos da tabela */}
                    <div className="grid grid-cols-3 gap-4 text-gray-700 font-semibold mt-4">
                        <div className="justify-start text-start">Nome</div>
                        <div className="text-center">CPF</div>
                        <div className="text-end pr-2.5">Ações</div>
                    </div>
                </div>

                {/* Lista de clientes */}
                <div className="divide-y divide-gray-200">
                    {currentClients.map((client) => (
                        <div key={client.id_cliente} className="grid grid-cols-3 gap-4 items-center px-4 py-1">
                            <div className="flex items-center justify-start text-gray-900">
                                <Link href={`/admin/clients/${client.id_cliente}`} className="text-gray-600 hover:underline">
                                    {client.nome}
                                </Link>
                            </div>
                            <div className="flex items-center justify-center text-gray-600">
                                {client.cpf}
                            </div>
                            <div className="flex items-center justify-end space-x-2">

                                <Dialog open={dialogOpen} key={client.id_cliente} onOpenChange={setDialogOpen}>
                                    <DialogTrigger asChild>
                                        <button
                                            key={client.id_cliente}
                                            aria-label="Ativar"
                                            className="p-1 rounded hover:bg-gray-200 mr-5"
                                            onClick={() => {
                                                setSelectedClientId(client.id_cliente);
                                                setSelectedClientName(client.nome)
                                                setDialogOpen(true); // Abre o diálogo quando clica em deletar
                                            }}
                                        >
                                            <ArrowBigUp className="w-5 h-5 text-green-600" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle>Confirmar Ativação</DialogTitle>
                                        <DialogDescription>
                                            Tem certeza de que deseja ativar o cliente {selectedClientName}?
                                        </DialogDescription>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                                Cancelar
                                            </Button>
                                            <Button variant="destructive" onClick={confirmActivateClient}>
                                                Confirmar
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Botão Adicionar Novo */}

                {/* Paginação */}
                <Pagination className="text-white p-2 rounded-lg">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                className="bg-black text-white hover:text-gray-300"
                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            >
                                Anterior
                            </PaginationPrevious>
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    className={`bg-black text-white hover:text-gray-300 ${currentPage === i + 1 ? 'font-bold' : ''}`}
                                    onClick={() => handlePageChange(i + 1)}
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                className="bg-black text-white hover:text-gray-300"
                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            >
                                Próximo
                            </PaginationNext>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </main>
    )
}