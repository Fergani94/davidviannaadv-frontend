import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminShell from '../../../src/components/admin/AdminShell';
import Card from '../../../src/components/Card';
import Button from '../../../src/components/Button';
import { exigirLogin } from '../../../lib/adminAuth';
import { ArtigoAdminLinha, formatarData } from '../../../lib/artigos';
import { alterarPublicacao, excluirArtigo, listarArtigosAdmin, tratarErroAdmin } from '../../../lib/adminApi';

interface AdminArtigosProps {
  token: string;
}

// Anchors: layout/background classes go on the element; text colour goes on a child span (global `a { color: inherit }` beats Tailwind utilities)
const LINK_ACAO = 'inline-block px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors';
const TEXTO_ACAO = 'text-sm font-semibold text-white';

export default function AdminArtigos({ token }: AdminArtigosProps): React.ReactElement {
  const router = useRouter();
  const [artigos, setArtigos] = useState<ArtigoAdminLinha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [ocupadoId, setOcupadoId] = useState<string | null>(null);
  const [confirmandoId, setConfirmandoId] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setArtigos(await listarArtigosAdmin(token));
    } catch (e) {
      setErro(await tratarErroAdmin(e, router, 'Erro ao carregar os artigos. Tente novamente.'));
    } finally {
      setCarregando(false);
    }
  }, [token]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function alternarPublicacao(artigo: ArtigoAdminLinha): Promise<void> {
    setOcupadoId(artigo.id);
    setErro('');
    try {
      await alterarPublicacao(token, artigo.id, !artigo.published);
      setArtigos((anteriores) =>
        anteriores.map((a) =>
          a.id === artigo.id
            ? { ...a, published: !artigo.published, publicado_em: a.publicado_em ?? new Date().toISOString() }
            : a
        )
      );
    } catch (e) {
      setErro(await tratarErroAdmin(e, router, 'Erro ao atualizar o artigo.'));
    } finally {
      setOcupadoId(null);
    }
  }

  async function excluir(id: string): Promise<void> {
    setOcupadoId(id);
    setErro('');
    try {
      await excluirArtigo(token, id);
      setArtigos((anteriores) => anteriores.filter((a) => a.id !== id));
      setConfirmandoId(null);
    } catch (e) {
      setErro(await tratarErroAdmin(e, router, 'Erro ao excluir o artigo.'));
    } finally {
      setOcupadoId(null);
    }
  }

  return (
    <AdminShell titulo="Artigos" subtitulo="Crie, edite e publique os artigos do site">
      {erro && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-6">
          <p className="text-red-400 font-semibold">{erro}</p>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 mb-6">
        <span className="text-sm text-gray-400">Total: {artigos.length} artigo(s)</span>
        <Link
          href="/admin/artigos/novo"
          className="inline-block px-4 py-2 rounded-lg bg-red-900 hover:bg-red-800 transition-colors"
        >
          <span className="text-sm font-semibold text-white">Novo artigo</span>
        </Link>
      </div>

      {carregando && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Carregando artigos... (na primeira visita do dia pode levar alguns segundos)</p>
        </div>
      )}

      {!carregando && artigos.length === 0 && !erro && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhum artigo ainda. Clique em &ldquo;Novo artigo&rdquo; para começar.</p>
        </div>
      )}

      {!carregando && artigos.length > 0 && (
        <div className="space-y-4">
          {artigos.map((artigo) => {
            const ocupado = ocupadoId === artigo.id;
            return (
              <Card key={artigo.id} shadow="sm" padding="md">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-white break-words">{artigo.titulo}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded border ${
                          artigo.published
                            ? 'bg-green-500/10 text-green-400 border-green-500/30'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                        }`}
                      >
                        {artigo.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {artigo.published && artigo.publicado_em
                        ? `Publicado em ${formatarData(artigo.publicado_em)}`
                        : `Criado em ${formatarData(artigo.created_at)}`}
                    </p>
                  </div>

                  {confirmandoId === artigo.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm text-gray-300">Excluir definitivamente?</span>
                      <Button type="button" variant="primary" size="sm" disabled={ocupado} onClick={() => excluir(artigo.id)}>
                        {ocupado ? 'Excluindo...' : 'Sim, excluir'}
                      </Button>
                      <Button type="button" variant="secondary" size="sm" disabled={ocupado} onClick={() => setConfirmandoId(null)}>
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      {artigo.published && (
                        <a className={LINK_ACAO} href={`/artigos/${artigo.slug}`} target="_blank" rel="noreferrer">
                          <span className={TEXTO_ACAO}>Ver no site</span>
                        </a>
                      )}
                      <Link className={LINK_ACAO} href={`/admin/artigos/${artigo.id}`}>
                        <span className={TEXTO_ACAO}>Editar</span>
                      </Link>
                      <Button type="button" variant="secondary" size="sm" disabled={ocupado} onClick={() => alternarPublicacao(artigo)}>
                        {ocupado ? 'Aguarde...' : artigo.published ? 'Despublicar' : 'Publicar'}
                      </Button>
                      <Button type="button" variant="outline" size="sm" disabled={ocupado} onClick={() => setConfirmandoId(artigo.id)}>
                        Excluir
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}

export const getServerSideProps = exigirLogin;
