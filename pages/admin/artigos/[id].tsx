import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminShell from '../../../src/components/admin/AdminShell';
import ArtigoForm from '../../../src/components/admin/ArtigoForm';
import { exigirLogin } from '../../../lib/adminAuth';
import { ArtigoAdmin } from '../../../lib/artigos';
import { obterArtigoAdmin, tratarErroAdmin } from '../../../lib/adminApi';

interface EditarArtigoProps {
  token: string;
}

export default function EditarArtigo({ token }: EditarArtigoProps): React.ReactElement {
  const router = useRouter();
  const id = typeof router.query.id === 'string' ? router.query.id : '';
  const [artigo, setArtigo] = useState<ArtigoAdmin | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!id) return;
    let cancelado = false;

    (async () => {
      try {
        const dados = await obterArtigoAdmin(token, id);
        if (!cancelado) setArtigo(dados);
      } catch (e) {
        const mensagem = await tratarErroAdmin(e, router, 'Não foi possível carregar o artigo.');
        if (!cancelado) setErro(mensagem);
      } finally {
        if (!cancelado) setCarregando(false);
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [id, token]);

  return (
    <AdminShell titulo="Editar artigo" subtitulo="Altere o texto, a capa e o estado de publicação">
      {carregando && (
        <p className="text-center text-gray-400 text-lg py-12">Carregando artigo... (na primeira visita do dia pode levar alguns segundos)</p>
      )}
      {!carregando && erro && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 font-semibold">{erro}</p>
        </div>
      )}
      {artigo && (
        <ArtigoForm
          key={artigo.id}
          token={token}
          artigo={artigo}
          avisoInicial={router.query.criado === '1' ? 'Rascunho criado. Você pode continuar editando.' : ''}
        />
      )}
    </AdminShell>
  );
}

export const getServerSideProps = exigirLogin;
