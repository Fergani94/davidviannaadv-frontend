import { GetServerSideProps } from 'next';
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../../src/components/Navbar';
import Header from '../../src/components/Header';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import Footer from '../../src/components/Footer';

interface Depoimento {
  id: string;
  cliente_nome: string;
  depoimento: string;
  profissao?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  criado_em: string;
  atualizado_em?: string;
}

interface AdminDepoimentosProps {
  token: string;
  title: string;
}

export default function AdminDepoimentos({ token }: AdminDepoimentosProps): React.ReactElement {
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'aprovado' | 'rejeitado'>('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  React.useEffect(() => {
    fetchDepoimentos();
  }, [statusFilter, currentPage]);

  const fetchDepoimentos = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://davidviannaadv-backend.onrender.com/api';
      const params = new URLSearchParams();

      if (statusFilter !== 'todos') {
        params.append('status', statusFilter);
      }

      params.append('limite', itemsPerPage.toString());
      params.append('pagina', currentPage.toString());

      const response = await axios.get(`${apiUrl}/admin/depoimentos`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDepoimentos(response.data.data || []);
      setTotalCount(response.data.total || 0);
    } catch (error) {
      let errorMsg = 'Erro ao carregar depoimentos. Por favor, tente novamente.';

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMsg = 'Sessão expirada. Por favor, faça login novamente.';
        } else if (error.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error.message === 'Network Error') {
          errorMsg = 'Erro de conexão. Verifique sua internet.';
        }
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [token, statusFilter, currentPage]);

  const handleStatusUpdate = async (depoimentoId: string, newStatus: 'aprovado' | 'rejeitado'): Promise<void> => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://davidviannaadv-backend.onrender.com/api';

      await axios.put(
        `${apiUrl}/admin/depoimentos/${depoimentoId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local state
      setDepoimentos(prev =>
        prev.map(dep =>
          dep.id === depoimentoId ? { ...dep, status: newStatus } : dep
        )
      );
    } catch (error) {
      let errorMsg = 'Erro ao atualizar depoimento.';

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMsg = error.response.data.message;
        }
      }

      setErrorMessage(errorMsg);
    }
  };

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejeitado':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pendente':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <Header
        title="Gerenciar Depoimentos"
        subtitle="Administre e aprove depoimentos de clientes"
      />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-16 w-full">
        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-6">
            <p className="text-red-800 font-semibold">{errorMessage}</p>
          </div>
        )}

        {/* Filter Section */}
        <Card shadow="sm" padding="md" className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <label htmlFor="status-filter" className="block text-sm font-semibold text-gray-700">
              Filtrar por Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendentes</option>
              <option value="aprovado">Aprovados</option>
              <option value="rejeitado">Rejeitados</option>
            </select>
            <span className="text-sm text-gray-600 md:ml-auto">
              Total: {totalCount} depoimento(s)
            </span>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Carregando depoimentos...</p>
          </div>
        )}

        {/* Depoimentos List */}
        {!isLoading && depoimentos.length > 0 && (
          <div className="space-y-4">
            {depoimentos.map((depoimento) => (
              <Card key={depoimento.id} shadow="sm" padding="md">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-black">{depoimento.cliente_nome}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(depoimento.status)}`}>
                        {depoimento.status === 'pendente' ? 'Pendente' : depoimento.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
                      </span>
                    </div>

                    {depoimento.profissao && (
                      <p className="text-sm text-gray-600 mb-2">{depoimento.profissao}</p>
                    )}

                    <blockquote className="text-gray-700 italic mb-3">
                      "{depoimento.depoimento}"
                    </blockquote>

                    <div className="flex flex-col md:flex-row gap-4 text-xs text-gray-500">
                      <span>Enviado: {new Date(depoimento.criado_em).toLocaleDateString('pt-BR')}</span>
                      {depoimento.atualizado_em && (
                        <span>Atualizado: {new Date(depoimento.atualizado_em).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>

                  {depoimento.status === 'pendente' && (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleStatusUpdate(depoimento.id, 'aprovado')}
                        disabled={isLoading}
                      >
                        Aprovar
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleStatusUpdate(depoimento.id, 'rejeitado')}
                        disabled={isLoading}
                      >
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && depoimentos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Nenhum depoimento encontrado com o filtro selecionado.
            </p>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Anterior
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                type="button"
                variant={currentPage === page ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                disabled={isLoading}
              >
                {page}
              </Button>
            ))}

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || isLoading}
            >
              Próximo
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<AdminDepoimentosProps> = async ({ req, res }) => {
  // Get token from cookies or local storage (passed from client)
  const token = req.cookies.auth_token;

  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
      title: 'Gerenciar Depoimentos - DavidVianna Advocacia',
    },
  };
};
