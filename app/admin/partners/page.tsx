"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { EditIcon, Key, TrashIcon } from "lucide-react";
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
import { getAllPartners, TPartner, deletePartner } from "@/app/_actions/partner";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import HelperDialog from '@/components/helper-dialog';

export default function PartnersPage() {
  const [partners, setPartners] = useState<TPartner>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [selectedPartnerName, setSelectedPartnerName] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const partnersPerPage = 10;

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await getAllPartners();
        setPartners(response);
      } catch (error) {
        console.error("Failed to fetch partners", error);
      }
    };

    fetchPartners();
  }, []);

  const filteredPartners = partners.filter(partner =>
    partner.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.cpf.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.nome.localeCompare(b.nome));

  const sortedPartners = filteredPartners.sort((a, b) => a.nome.localeCompare(b.nome));
  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = sortedPartners.slice(indexOfFirstPartner, indexOfLastPartner);

  const totalPages = Math.ceil(filteredPartners.length / partnersPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const confirmDeletePartner = async () => {
    if (selectedPartnerId) {
      try {
        await deletePartner(selectedPartnerId);
        setPartners(partners.filter(partner => partner.id_user !== selectedPartnerId));
        setSelectedPartnerId(null)
        setSelectedPartnerName(null)
        setDialogOpen(false);;
      } catch (error: any) {
        setError(error.message);  // Captura a mensagem de erro para exibição
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  //aaaaa
  return (
    <main className="bg-gray-50 min-h-screen p-6 rounded">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 rounded">
          <div className="mb-4">
            <div className="w-full flex items-center justify-between">
              <h1 className="justify-start text-start text-gray-700 font-bold pb-3 text-3xl">Sócios</h1>

              <HelperDialog title="Lista de Sócios">
                <div>
                  <div>

                    <div>
                      <p><strong>Buscar por nome ou CPF</strong>: Utilize este campo para buscar sócios já cadastrados pelo nome ou número de CPF. Digite parte do nome ou do CPF completo para que o sistema exiba resultados correspondentes.</p>
                    </div>

                    <div>
                      <p><strong>Nome</strong>: Coluna que exibe o nome dos sócios cadastrados.</p>
                    </div>

                    <div>
                      <p><strong>CPF</strong>: Coluna que mostra o CPF dos sócios cadastrados, permitindo uma identificação única de cada pessoa.</p>
                    </div>

                    <div>
                      <p><strong>Ações</strong>: Coluna onde são disponibilizadas as ações que podem ser realizadas com o sócio listado. Os ícones de edição e exclusão permitem atualizar ou remover o registro do sócio.</p>
                    </div>

                    <div>
                      <p><strong>Botão "Adicionar Novo"</strong>: Clique neste botão para adicionar um novo sócio. Você será redirecionado para uma página de cadastro onde poderá inserir todas as informações necessárias.</p>
                    </div>
                    <div>
                      <p><strong>Botões "Anterior e Próxima"</strong>: Estes dois botões permitem que você navague pelas páginas da lista de sócios cadastrados.</p>
                    </div>
                  </div>

                </div>
              </HelperDialog>
            </div>

            <input
              type="text"
              placeholder="Buscar por nome ou CPF"
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
          {currentPartners.map((partner) => (
            <div key={partner.id_user} className="grid grid-cols-3 gap-4 items-center px-4 py-1">
              <div className="flex items-center justify-start text-gray-900">
                <Link href={`/admin/partners/${partner.id_user}`} className="text-gray-600 hover:underline">
                  {partner.nome}
                </Link>
              </div>

              <div className="flex items-center justify-center text-gray-600">
                {partner.cpf}
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  aria-label="Edit"
                  className="p-1 rounded hover:bg-gray-200"

                >
                  <Link href={`/admin/partners/${partner.id_user}/editPartner`} className="text-gray-600 hover:underline">
                    <EditIcon className="w-5 h-5 text-gray-600" />
                  </Link>

                </button>
                <Dialog open={dialogOpen} key={partner.id_user} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <button
                      key={partner.id_user}
                      aria-label="Delete"
                      className="p-1 rounded hover:bg-gray-200"
                      onClick={() => {
                        setSelectedPartnerId(partner.id_user);
                        setSelectedPartnerName(partner.nome)
                        setDialogOpen(true); // Abre o diálogo quando clica em deletar
                      }}
                    >
                      <TrashIcon className="w-5 h-5 text-red-600" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>
                      Tem certeza de que deseja excluir o sócio {selectedPartnerName}?
                    </DialogDescription>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button variant="destructive" onClick={confirmDeletePartner}>
                        Confirmar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end p-4">
          <Link href={"/admin/partners/addPartner"}>
            <Button variant="outline">
              Adicionar Novo
            </Button>
          </Link>
        </div>

        {/* Paginação ShadCN com fundo preto e texto branco */}
        {/* Paginação ShadCN com fundo preto e texto branco */}
        <Pagination className="text-white p-2 rounded-lg">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className="bg-black text-white hover:text-gray-300"
              >
                Anterior
              </PaginationPrevious>
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => handlePageChange(i + 1)}
                  className={`bg-black text-white hover:text-gray-300 ${currentPage === i + 1 ? 'font-bold' : ''}`}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {totalPages > 5 && (
              <PaginationItem>
                <PaginationEllipsis className="text-white" />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className="bg-black text-white hover:text-gray-300"
              >
                Próximo
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>

      </div>

      {/* Diálogo de erro para exclusão */}
      {error && (
        <Dialog open={!!error} onOpenChange={() => setError(null)}>
          <DialogContent>
            <DialogTitle>Erro ao Excluir Sócio</DialogTitle>
            <DialogDescription>{error}</DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setError(null)}>
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}