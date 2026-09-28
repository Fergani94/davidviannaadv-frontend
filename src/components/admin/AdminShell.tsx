import React from 'react';
import Head from 'next/head';
import Navbar from '../Navbar';
import AdminNav from '../AdminNav';
import Header from '../Header';
import Footer from '../Footer';

interface AdminShellProps {
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
}

export default function AdminShell({ titulo, subtitulo, children }: AdminShellProps): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Head>
        <title>{`${titulo} — Área restrita`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Navbar />
      <AdminNav />
      <Header title={titulo} subtitle={subtitulo} />
      <main className="flex-grow max-w-6xl mx-auto px-4 py-12 w-full">{children}</main>
      <Footer />
    </div>
  );
}
