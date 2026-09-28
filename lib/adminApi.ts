import axios from 'axios';
import type { NextRouter } from 'next/router';
import { API_BASE_URL } from './constants';
import type { ArtigoAdmin, ArtigoAdminLinha } from './artigos';

const ARTIGOS_URL = `${API_BASE_URL}/artigos`;
const TIPOS_CAPA = ['image/jpeg', 'image/png', 'image/webp'];
const LIMITE_CAPA_BYTES = 2 * 1024 * 1024;

export interface DadosArtigo {
  titulo: string;
  resumo: string;
  conteudo: string;
  capa_url: string | null;
  published: boolean;
}

const auth = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export async function listarArtigosAdmin(token: string): Promise<ArtigoAdminLinha[]> {
  const response = await axios.get(`${ARTIGOS_URL}/admin`, auth(token));
  return response.data?.data || [];
}

export async function obterArtigoAdmin(token: string, id: string): Promise<ArtigoAdmin> {
  const response = await axios.get(`${ARTIGOS_URL}/admin/${id}`, auth(token));
  return response.data.data;
}

export async function criarArtigo(token: string, dados: DadosArtigo): Promise<{ id: string; slug: string }> {
  const response = await axios.post(`${ARTIGOS_URL}/admin`, dados, auth(token));
  return response.data.data;
}

export async function atualizarArtigo(token: string, id: string, dados: DadosArtigo): Promise<void> {
  await axios.put(`${ARTIGOS_URL}/admin/${id}`, dados, auth(token));
}

export async function alterarPublicacao(token: string, id: string, published: boolean): Promise<void> {
  await axios.patch(`${ARTIGOS_URL}/admin/${id}/publicacao`, { published }, auth(token));
}

export async function excluirArtigo(token: string, id: string): Promise<void> {
  await axios.delete(`${ARTIGOS_URL}/admin/${id}`, auth(token));
}

// Returns an error message, or null when the file is acceptable
export function validarCapa(arquivo: File): string | null {
  if (!TIPOS_CAPA.includes(arquivo.type)) return 'Use uma imagem JPG, PNG ou WebP.';
  if (arquivo.size > LIMITE_CAPA_BYTES) return 'A imagem deve ter no máximo 2 MB.';
  return null;
}

// Asks the backend for a signed upload URL, sends the file straight to Supabase Storage, returns the public URL
export async function enviarCapa(token: string, arquivo: File): Promise<string> {
  const { data } = await axios.post(`${ARTIGOS_URL}/admin/capa`, { contentType: arquivo.type }, auth(token));

  const formData = new FormData();
  formData.append('cacheControl', '3600');
  formData.append('', arquivo);

  const resposta = await fetch(data.uploadUrl, { method: 'PUT', body: formData, headers: { 'x-upsert': 'false' } });
  if (!resposta.ok) throw new Error(`Falha ao enviar a imagem (${resposta.status})`);

  return data.publicUrl as string;
}

// Expired/invalid token -> clear the cookie and go to the login with a notice; otherwise return a readable message
export async function tratarErroAdmin(error: unknown, router: NextRouter, padrao: string): Promise<string> {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      try {
        await axios.post('/api/admin/logout');
      } catch {
        // proceeds to the login anyway
      }
      await router.push('/admin/login?expirou=1');
      return 'Sessão expirada. Faça login novamente.';
    }
    if (error.response?.data?.error) return error.response.data.error;
    if (error.message === 'Network Error') return 'Erro de conexão. Verifique sua internet.';
  }
  return padrao;
}
