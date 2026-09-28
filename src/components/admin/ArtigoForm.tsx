import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import RichTextEditor from './RichTextEditor';
import Button from '../Button';
import { ArtigoAdmin } from '../../../lib/artigos';
import { atualizarArtigo, criarArtigo, enviarCapa, tratarErroAdmin, validarCapa } from '../../../lib/adminApi';

interface ArtigoFormProps {
  token: string;
  artigo?: ArtigoAdmin;
  avisoInicial?: string;
}

const LIMITE_RESUMO = 300;
const RESUMO_IDEAL = 160;
const CAMPO = 'w-full px-4 py-2 bg-white/5 border border-white/15 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--prata)] focus:border-transparent disabled:opacity-50';

export default function ArtigoForm({ token, artigo, avisoInicial = '' }: ArtigoFormProps): React.ReactElement {
  const router = useRouter();
  const editando = Boolean(artigo);
  const [titulo, setTitulo] = useState(artigo?.titulo ?? '');
  const [resumo, setResumo] = useState(artigo?.resumo ?? '');
  const [conteudo, setConteudo] = useState(artigo?.conteudo ?? '');
  const [capaUrl, setCapaUrl] = useState<string | null>(artigo?.capa_url ?? null);
  const [publicado, setPublicado] = useState(artigo?.published ?? false);
  const [salvando, setSalvando] = useState(false);
  const [enviandoCapa, setEnviandoCapa] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(avisoInicial);
  const sujo = useRef(false);
  const avisosRef = useRef<HTMLDivElement>(null);
  const ocupado = salvando || enviandoCapa;

  // The buttons sit below the editor: bring the save feedback into view
  useEffect(() => {
    if (erro || sucesso) avisosRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [erro, sucesso]);

  // Warn before losing unsaved edits: closing/reloading the tab and in-app navigation
  useEffect(() => {
    const aoSair = (e: BeforeUnloadEvent): void => {
      if (sujo.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    const aoNavegar = (): void => {
      if (sujo.current && !window.confirm('Há alterações não salvas. Sair mesmo assim?')) {
        router.events.emit('routeChangeError');
        // Next.js has no "cancel navigation" API in the Pages Router: throwing aborts the route change
        throw 'Navegação cancelada pelo usuário';
      }
    };
    window.addEventListener('beforeunload', aoSair);
    router.events.on('routeChangeStart', aoNavegar);
    return () => {
      window.removeEventListener('beforeunload', aoSair);
      router.events.off('routeChangeStart', aoNavegar);
    };
  }, [router]);

  // The 401 redirect goes through the unsaved-changes guard: if the user cancels it, tratarErroAdmin rejects, so fall back to a message
  async function mensagemDeErro(e: unknown, padrao: string): Promise<string> {
    try {
      return await tratarErroAdmin(e, router, padrao);
    } catch {
      return 'Sessão expirada. Copie o seu texto e faça login novamente.';
    }
  }

  function marcarSujo(): void {
    sujo.current = true;
    setSucesso('');
  }

  async function salvar(published: boolean): Promise<void> {
    setSalvando(true);
    setErro('');
    setSucesso('');
    const dados = { titulo, resumo, conteudo, capa_url: capaUrl, published };

    try {
      if (artigo) {
        await atualizarArtigo(token, artigo.id, dados);
        sujo.current = false;
        setPublicado(published);
        setSucesso(published ? 'Artigo salvo e publicado.' : 'Rascunho salvo.');
      } else {
        const criado = await criarArtigo(token, dados);
        sujo.current = false;
        await router.replace(`/admin/artigos/${criado.id}?criado=${published ? 'publicado' : 'rascunho'}`);
      }
    } catch (e) {
      setErro(await mensagemDeErro(e, 'Erro ao salvar o artigo. Tente novamente.'));
    } finally {
      setSalvando(false);
    }
  }

  async function escolherCapa(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const arquivo = e.target.files?.[0];
    e.target.value = '';
    if (!arquivo) return;

    const problema = validarCapa(arquivo);
    if (problema) {
      setErro(problema);
      return;
    }

    setErro('');
    setEnviandoCapa(true);
    try {
      setCapaUrl(await enviarCapa(token, arquivo));
      marcarSujo();
    } catch (err) {
      setErro(await mensagemDeErro(err, 'Não foi possível enviar a imagem. Tente novamente.'));
    } finally {
      setEnviandoCapa(false);
    }
  }

  const contadorResumo = resumo.length;

  return (
    <div className="space-y-6">
      <div ref={avisosRef} className="space-y-6 empty:hidden scroll-mt-28">
        {erro && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30" role="alert">
            <p className="text-red-400 font-semibold">{erro}</p>
          </div>
        )}
        {sucesso && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30" role="status">
            <p className="text-green-400 font-semibold">{sucesso}</p>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="titulo" className="block text-sm font-semibold text-gray-300 mb-2">Título</label>
        <input
          id="titulo"
          type="text"
          className={CAMPO}
          value={titulo}
          maxLength={200}
          disabled={salvando}
          onChange={(e) => { setTitulo(e.target.value); marcarSujo(); }}
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-2">
          <label htmlFor="resumo" className="block text-sm font-semibold text-gray-300">Resumo</label>
          <span className={`text-xs ${contadorResumo > RESUMO_IDEAL ? 'text-yellow-400' : 'text-gray-500'}`}>
            {contadorResumo}/{LIMITE_RESUMO} · ideal até {RESUMO_IDEAL} para aparecer inteiro no Google
          </span>
        </div>
        <textarea
          id="resumo"
          rows={3}
          className={CAMPO}
          value={resumo}
          maxLength={LIMITE_RESUMO}
          disabled={salvando}
          onChange={(e) => { setResumo(e.target.value); marcarSujo(); }}
        />
      </div>

      <div>
        <span className="block text-sm font-semibold text-gray-300 mb-2">Imagem de capa (opcional)</span>
        {capaUrl && (
          <div className="mb-3 max-w-md">
            <img src={capaUrl} alt="Prévia da capa" className="w-full rounded-lg border border-white/15 aspect-video object-cover" />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <label className={`px-4 py-2 text-sm font-semibold rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors ${ocupado ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}>
            {enviandoCapa ? 'Enviando...' : capaUrl ? 'Trocar imagem' : 'Escolher imagem'}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={escolherCapa} disabled={ocupado} />
          </label>
          {capaUrl && (
            <Button type="button" variant="outline" size="sm" disabled={ocupado} onClick={() => { setCapaUrl(null); marcarSujo(); }}>
              Remover capa
            </Button>
          )}
          <span className="text-xs text-gray-500">JPG, PNG ou WebP, até 2 MB.</span>
        </div>
      </div>

      <div>
        <span className="block text-sm font-semibold text-gray-300 mb-2">Texto</span>
        <RichTextEditor
          valor={artigo?.conteudo ?? ''}
          disabled={salvando}
          onChange={(html) => { setConteudo(html); marcarSujo(); }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {publicado ? (
          <>
            <Button type="button" variant="primary" disabled={ocupado} onClick={() => salvar(true)}>
              {salvando ? 'Salvando...' : 'Salvar alterações'}
            </Button>
            <Button type="button" variant="secondary" disabled={ocupado} onClick={() => salvar(false)}>
              Despublicar
            </Button>
          </>
        ) : (
          <>
            <Button type="button" variant="secondary" disabled={ocupado} onClick={() => salvar(false)}>
              {salvando ? 'Salvando...' : 'Salvar rascunho'}
            </Button>
            <Button type="button" variant="primary" disabled={ocupado} onClick={() => salvar(true)}>
              Publicar
            </Button>
          </>
        )}
        {editando && publicado && artigo && (
          <a className="inline-block px-2 py-1" href={`/artigos/${artigo.slug}`} target="_blank" rel="noreferrer">
            <span className="text-sm font-semibold text-gray-300 hover:text-white underline">Ver no site</span>
          </a>
        )}
        <Link className="inline-block px-2 py-1 ml-auto" href="/admin/artigos">
          <span className="text-sm font-semibold text-gray-400 hover:text-white">Voltar à lista</span>
        </Link>
      </div>
    </div>
  );
}
