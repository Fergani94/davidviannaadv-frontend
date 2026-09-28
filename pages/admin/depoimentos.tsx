import { GetServerSideProps } from 'next';
import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import Navbar from '../../src/components/Navbar';
import Header from '../../src/components/Header';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import Footer from '../../src/components/Footer';
import AdminNav from '../../src/components/AdminNav';
import { API_BASE_URL } from '../../lib/constants';

interface Depoimento {
  id: string;
  nome: string;
  texto: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  created_at: string;
  updated_at?: string;
}

interface AdminDepoimentosProps {
  token: string;
}

export default function AdminDepoimentos({ token }: AdminDepoimentosProps): React.ReactElement {
  const [linkGerado, setLinkGerado] = useState('');
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [depoimentos, setDepoimentos] = useState<Depoimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'aprovado' | 'rejeitado'>('todos');

  const fetchDepoimentos = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.get(`${API_BASE_URL}/depoimentos/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepoimentos(response.data?.data || []);
    } catch (error) {
      let errorMsg = 'Erro ao carregar depoimentos. Por favor, tente novamente.';
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) errorMsg = 'Sessão expirada. Por favor, faça login novamente.';
        else if (error.response?.data?.error) errorMsg = error.response.data.error;
        else if (error.message === 'Network Error') errorMsg = 'Erro de conexão. Verifique sua internet.';
      }
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDepoimentos();
  }, [fetchDepoimentos]);

  const handleStatusUpdate = async (id: string, status: 'aprovado' | 'rejeitado'): Promise<void> => {
    try {
      await axios.put(
        `${API_BASE_URL}/depoimentos/admin/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDepoimentos((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    } catch (error) {
      let errorMsg = 'Erro ao atualizar depoimento.';
      if (axios.isAxiosError(error) && error.response?.data?.error) errorMsg = error.response.data.error;
      setErrorMessage(errorMsg);
    }
  };

  const handleGerarLink = async (): Promise<void> => {
    setIsGeneratingLink(true);
    setErrorMessage('');
    setCopied(false);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/depoimentos/admin/gerar-link`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, timeout: 90000 }
      );
      setLinkGerado(`${window.location.origin}/depoimento/${response.data.token}`);
    } catch (error) {
      let errorMsg = 'Erro ao gerar o link.';
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) errorMsg = 'Sessão expirada. Por favor, faça login novamente.';
        else if (error.response?.data?.error) errorMsg = error.response.data.error;
      }
      setErrorMessage(errorMsg);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopiar = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(linkGerado);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const getStatusBadgeColor =(status: string): string => {
    switch (status) {
      case 'aprovado': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'rejeitado': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
    }
  };

  const filtered = statusFilter === 'todos' ? depoimentos : depoimentos.filter((d) => d.status === statusFilter);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Head>
        <title>Depoimentos — Área restrita</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Navbar />
      <AdminNav />

      <Header title="Gerenciar Depoimentos" subtitle="Administre e aprove depoimentos de clientes" />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-16 w-full">
        {errorMessage && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-6">
            <p className="text-red-400 font-semibold">{errorMessage}</p>
          </div>
        )}

        <Card shadow="sm" padding="md" className="mb-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <p className="text-gray-300 text-sm">Gere um link único (válido por 30 dias) para o cliente enviar o depoimento.</p>
              <div className="flex gap-2">
                <Button type="button" variant="primary" size="sm" onClick={handleGerarLink} disabled={isGeneratingLink}>
                  {isGeneratingLink ? 'Gerando...' : 'Gerar link de depoimento'}
                </Button>
              </div>
            </div>
            {linkGerado && (
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <input readOnly value={linkGerado} onFocus={(e) => e.target.select()} className="flex-grow px-3 py-2 bg-white/5 border border-white/15 text-white rounded-lg text-sm" />
                <Button type="button" variant="secondary" size="sm" onClick={handleCopiar}>{copied ? 'Copiado!' : 'Copiar'}</Button>
              </div>
            )}
          </div>
        </Card>

        <Card shadow="sm" padding="md" className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <label htmlFor="status-filter" className="block text-sm font-semibold text-gray-300">
              Filtrar por Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-4 py-2 bg-white/5 border border-white/15 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--prata)] focus:border-transparent"
            >
              <option value="todos" className="bg-black text-white">Todos</option>
              <option value="pendente" className="bg-black text-white">Pendentes</option>
              <option value="aprovado" className="bg-black text-white">Aprovados</option>
              <option value="rejeitado" className="bg-black text-white">Rejeitados</option>
            </select>
            <span className="text-sm text-gray-400 md:ml-auto">Total: {filtered.length} depoimento(s)</span>
          </div>
        </Card>

        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Carregando depoimentos...</p>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map((depoimento) => (
              <Card key={depoimento.id} shadow="sm" padding="md">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-white">{depoimento.nome}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(depoimento.status)}`}>
                        {depoimento.status === 'pendente' ? 'Pendente' : depoimento.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
                      </span>
                    </div>
                    <blockquote className="text-gray-300 italic mb-3">&ldquo;{depoimento.texto}&rdquo;</blockquote>
                    <div className="flex flex-col md:flex-row gap-4 text-xs text-gray-500">
                      <span>Enviado: {new Date(depoimento.created_at).toLocaleDateString('pt-BR')}</span>
                      {depoimento.updated_at && (
                        <span>Atualizado: {new Date(depoimento.updated_at).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>

                  {depoimento.status === 'pendente' && (
                    <div className="flex gap-2">
                      <Button type="button" variant="primary" size="sm" onClick={() => handleStatusUpdate(depoimento.id, 'aprovado')}>
                        Aprovar
                      </Button>
                      <Button type="button" variant="secondary" size="sm" onClick={() => handleStatusUpdate(depoimento.id, 'rejeitado')}>
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum depoimento encontrado com o filtro selecionado.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<AdminDepoimentosProps> = async ({ req }) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return {
    props: { token },
  };
};
