"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { EditIcon, TrashIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import { getAllClients, TClient } from '@/app/_actions/client';

export default function ClientsPage() {
  const [clients, setClients] = useState<TClient>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getAllClients()

        setClients(response);
      } catch (error) {
        console.error("Failed to fetch clients", error);
      }
    };

    fetchClients();
  }, []);

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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Resetar a página atual quando o termo de pesquisa mudar
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Voltar para a primeira página ao pesquisar
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
            <Link href={"/admin/clients/addClient"}>Adicionar Cliente
            </Link></Button>
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
