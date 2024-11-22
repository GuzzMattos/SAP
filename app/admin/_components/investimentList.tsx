"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { EditIcon, Eye, TrashIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { getInvestimentsByClientId, getInvestimentById, TInvestimentsByClientId, TInvestimentById, deactivateInvestiment } from "@/app/_actions/investiment";
import HelperDialog from '@/components/helper-dialog';

interface IInvestmentsPage {
    clientId: string;
}

export default function InvestmentsPage({ clientId }: IInvestmentsPage) {
    const [investments, setInvestments] = useState<TInvestimentsByClientId>([]);
    const [selectedInvestment, setSelectedInvestment] = useState<TInvestimentById | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedInvestmentId, setSelectedInvestmentId] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const investmentsPerPage = 10;

    const confirmDeleteInvestment = async () => {
        if (selectedInvestmentId) {
            try {
                await deactivateInvestiment(selectedInvestmentId);
                setSelectedInvestmentId(null)
                setDialogOpen(false);;
            } catch (error: any) {
                console.log(error.message);  // Captura a mensagem de erro para exibição
            }
        }
    };

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

    const handleViewInvestment = async (investmentId: string) => {
        try {
            const investment = await getInvestimentById(investmentId);
            setSelectedInvestment(investment);
            setIsDialogOpen(true);
        } catch (error) {
            console.error("Failed to fetch investment details", error);
        }
    };

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

                {/* Campo de busca */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Buscar por banco ou classe"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full p-2 border rounded bg-slate-100 text-gray-700"
                    />

                    {/* Adicionando HelperDialog ao lado do campo de busca */}
                    <div className="ml-2">
                        <HelperDialog title="Investimentos Ativos">
                            <div>
                                {/* Conteúdo do HelperDialog */}
                                <p><strong>Buscar por Banco ou Classe</strong>: Permite localizar investimentos pelo nome do banco ou pela classe (ex.: fixa, variável).</p>
                                <p><strong>Coluna "Banco"</strong>: Indica o nome da instituição financeira do investimento.</p>
                                <p><strong>Coluna "Classe"</strong>: Identifica o tipo do investimento, como renda fixa ou variável.</p>
                                <p><strong>Coluna "Data Aplicação"</strong>: Exibe a data de início do investimento.</p>
                                <p><strong>Ações</strong>: Nesta coluna, você pode visualizar os detalhes ou excluir o investimento.</p>
                                <p><strong>Botão "Adicionar Investimento"</strong>: Clique para incluir um novo investimento.</p>
                                <p><strong>Botões "Anterior" e "Próximo"</strong>: Permitem navegar entre páginas de registros.</p>
                            </div>
                        </HelperDialog>
                    </div>
                </div>

                {/* Cabeçalhos da tabela */}
                <div className="grid grid-cols-4 gap-4 text-gray-700 font-semibold p-4">
                    <div>Banco</div>
                    <div className="text-center">Classe</div>
                    <div className="text-center">Data Aplicação</div>
                    <div className="text-end pr-2.5">Ações</div>
                </div>

                {/* Conteúdo da lista */}
                <div className="divide-y divide-gray-200 text-black">
                    {currentInvestments.map((investment) => (
                        <div key={investment.id_invest} className="grid grid-cols-4 gap-4 items-center px-4 py-1">
                            <div>{investment.banco}</div>
                            <div className="text-center">{investment.classe}</div>
                            <div className="text-center">{new Date(investment.data_aplic).toLocaleDateString()}</div>
                            <div className="flex items-center justify-end space-x-2">
                                <button
                                    aria-label="Visualizar"
                                    className="p-1 rounded hover:bg-gray-200"
                                    onClick={() => handleViewInvestment(investment.id_invest)}
                                >
                                    <Eye className="w-5 h-5 text-gray-600" />
                                </button>
                                <Dialog open={dialogOpen} key={investment.id_invest} onOpenChange={setDialogOpen}>
                                    <DialogTrigger asChild>
                                        <button
                                            key={investment.id_invest}
                                            aria-label="Delete"
                                            className="p-1 rounded hover:bg-gray-200"
                                            onClick={() => {
                                                setSelectedInvestmentId(investment.id_invest);
                                                setDialogOpen(true); // Abre o diálogo quando clica em deletar
                                            }}
                                        >
                                            <TrashIcon className="w-5 h-5 text-red-600" />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                                        <DialogDescription>
                                            Tem certeza de que deseja excluir o investimento?
                                        </DialogDescription>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                                Cancelar
                                            </Button>
                                            <Button variant="destructive" onClick={confirmDeleteInvestment}>
                                                Confirmar
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Paginação */}
                <div className="flex justify-between p-4">
                    <Button onClick={handlePreviousPage} disabled={currentPage === 1} variant="outline">
                        Anterior
                    </Button>
                    <Link href={`/admin/clients/${clientId}/addInvestiment`}>
                        <Button variant="outline">
                            Adicionar Investimento
                        </Button>
                    </Link>
                    <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="outline">
                        Próximo
                    </Button>
                </div>
            </div>

            {/* Dialog para visualização dos detalhes */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalhes do Investimento</DialogTitle>
                    </DialogHeader>
                    {selectedInvestment && (
                        <div className="space-y-2">
                            <p><strong>Banco:</strong> {selectedInvestment.banco}</p>
                            <p><strong>Classe:</strong> {selectedInvestment.classe}</p>
                            <p><strong>Agência:</strong> {selectedInvestment.agencia}</p>
                            <p><strong>Conta:</strong> {selectedInvestment.conta}</p>
                            <p><strong>Indice:</strong> {
                                selectedInvestment.id_indice === "8e451598-6c3a-4880-b95a-4683e1dad0ec" ? "CDI" :
                                    selectedInvestment.id_indice === "7f2dfbf0-4270-47a8-9912-4a4cae9eb1f6" ? "SELIC" :
                                        "IPCA"
                            }</p>
                            <p><strong>Porcentagem do Índice:</strong> {selectedInvestment.porc_indice}%</p>
                            <p><strong>Pré Fixado:</strong> {selectedInvestment.pre_fixado}%</p>
                            <p><strong>Data de Aplicação:</strong> {new Date(selectedInvestment.data_aplic).toLocaleDateString()}</p>
                            <p><strong>Data de Vencimento:</strong> {new Date(selectedInvestment.data_venc).toLocaleDateString()}</p>
                            <p><strong>Valor:</strong> {selectedInvestment.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}