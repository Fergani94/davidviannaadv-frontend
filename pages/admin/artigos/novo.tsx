import React from 'react';
import AdminShell from '../../../src/components/admin/AdminShell';
import ArtigoForm from '../../../src/components/admin/ArtigoForm';
import { exigirLogin } from '../../../lib/adminAuth';

interface NovoArtigoProps {
  token: string;
}

export default function NovoArtigo({ token }: NovoArtigoProps): React.ReactElement {
  return (
    <AdminShell titulo="Novo artigo" subtitulo="Escreva o texto e salve como rascunho ou publique">
      <ArtigoForm token={token} />
    </AdminShell>
  );
}

export const getServerSideProps = exigirLogin;
