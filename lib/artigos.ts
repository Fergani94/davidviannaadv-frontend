import axios from 'axios';
import { API_BASE_URL } from './constants';

export interface ArtigoResumo {
  id: string;
  titulo: string;
  slug: string;
  resumo: string | null;
  capa_url: string | null;
  publicado_em: string | null;
}

export interface Artigo extends ArtigoResumo {
  conteudo: string;
  autor: string;
}

export interface ArtigoAdmin {
  id: string;
  titulo: string;
  slug: string;
  resumo: string | null;
  conteudo: string;
  capa_url: string | null;
  published: boolean;
  publicado_em: string | null;
  created_at: string;
  updated_at: string | null;
}

export type ArtigoAdminLinha = Omit<ArtigoAdmin, 'conteudo'>;

const TIMEOUT_MS = 25000;

export async function buscarArtigos(): Promise<ArtigoResumo[]> {
  const response = await axios.get(`${API_BASE_URL}/artigos`, { timeout: TIMEOUT_MS });
  return response.data?.data || [];
}

// Returns null only when the backend says 404; any other failure throws (so it is never cached as "not found")
export async function buscarArtigo(slug: string): Promise<Artigo | null> {
  try {
    const response = await axios.get(`${API_BASE_URL}/artigos/${encodeURIComponent(slug)}`, { timeout: TIMEOUT_MS });
    return response.data?.data || null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
}

export function formatarData(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  });
}
