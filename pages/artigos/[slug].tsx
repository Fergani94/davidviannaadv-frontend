import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { OAB, SITE_DESCRIPTION, SITE_URL, WHATSAPP_1 } from '../../lib/constants';
import { Artigo, buscarArtigo, formatarData } from '../../lib/artigos';

interface ArtigoPageProps {
  artigo: Artigo;
}

export default function ArtigoPage({ artigo }: ArtigoPageProps): React.ReactElement {
  const url = `${SITE_URL}/artigos/${artigo.slug}`;
  const descricao = artigo.resumo || SITE_DESCRIPTION;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: artigo.titulo,
    description: descricao,
    author: { '@type': 'Person', name: artigo.autor },
    mainEntityOfPage: url,
    ...(artigo.publicado_em ? { datePublished: artigo.publicado_em } : {}),
    ...(artigo.capa_url ? { image: artigo.capa_url } : {}),
  };

  return (
    <div className="site-shell">
      <Head>
        <title>{`${artigo.titulo} — David Areias Vianna Advocacia`}</title>
        <meta name="description" content={descricao} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={artigo.titulo} />
        <meta property="og:description" content={descricao} />
        <meta property="og:url" content={url} />
        {artigo.capa_url && <meta property="og:image" content={artigo.capa_url} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </Head>

      <Navbar />

      <main>
        <article className="article-page">
          <Link className="article-back" href="/artigos">
            <ArrowLeft size={15} /> Todos os artigos
          </Link>

          <header className="article-head">
            <h1>{artigo.titulo}</h1>
            {artigo.resumo && <p className="article-lead">{artigo.resumo}</p>}
            <div className="article-meta">
              <span>{artigo.autor} · {OAB}</span>
              {artigo.publicado_em && <span>{formatarData(artigo.publicado_em)}</span>}
            </div>
          </header>

          {artigo.capa_url && (
            <div className="article-cover">
              <img src={artigo.capa_url} alt="" />
            </div>
          )}

          {/* conteudo already went through the backend HTML filter (allow-list of safe tags) */}
          <div className="article-body" dangerouslySetInnerHTML={{ __html: artigo.conteudo }} />

          <aside className="article-cta">
            <p>Dúvidas sobre este tema? Fale com o escritório.</p>
            <a className="button button--black" href={WHATSAPP_1.href} target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> Falar pelo WhatsApp
            </a>
          </aside>
          <p className="article-disclaimer">
            Este texto tem caráter meramente informativo e não constitui aconselhamento jurídico nem
            substitui a análise de um caso concreto.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}

// No pages are generated at build time, so the build never depends on the backend being awake
export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: 'blocking' });

export const getStaticProps: GetStaticProps<ArtigoPageProps, { slug: string }> = async ({ params }) => {
  const slug = params?.slug;
  if (!slug) return { notFound: true };

  // Throws on backend failures (Next then serves the last good page / a non-cached error),
  // returns null only for a real 404 (unknown, draft or unpublished article)
  const artigo = await buscarArtigo(slug);
  if (!artigo) return { notFound: true, revalidate: 60 };

  return { props: { artigo }, revalidate: 60 };
};
