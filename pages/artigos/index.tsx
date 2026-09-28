import { GetStaticProps } from 'next';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { ArtigoResumo, buscarArtigos, formatarData } from '../../lib/artigos';

interface ArtigosProps {
  artigos: ArtigoResumo[];
  erro: boolean;
}

export default function Artigos({ artigos, erro }: ArtigosProps): React.ReactElement {
  return (
    <div className="site-shell">
      <Head>
        <title>Artigos — David Areias Vianna Advocacia</title>
        <meta
          name="description"
          content="Textos informativos sobre temas do Direito Civil, escritos por David Areias Vianna."
        />
      </Head>

      <Navbar />

      <main>
        <section className="articles-section section-pad">
          <div className="content-grid articles-heading">
            <div>
              <h2>Informação jurídica com <em>clareza.</em></h2>
            </div>
            <p>
              Textos informativos sobre temas do Direito Civil. O conteúdo tem caráter geral e não
              substitui a análise de um caso concreto.
            </p>
          </div>

          {erro ? (
            <p className="articles-empty">
              Não foi possível carregar os artigos agora. Tente novamente em instantes.
            </p>
          ) : artigos.length > 0 ? (
            <div className="article-grid">
              {artigos.map((artigo) => (
                <Link className="article-card" href={`/artigos/${artigo.slug}`} key={artigo.id}>
                  <div className={artigo.capa_url ? 'article-card-cover' : 'article-card-cover article-card-cover--empty'}>
                    {artigo.capa_url && <img src={artigo.capa_url} alt="" loading="lazy" />}
                  </div>
                  <div className="article-card-body">
                    <h3>{artigo.titulo}</h3>
                    {artigo.resumo && <p>{artigo.resumo}</p>}
                    <div className="article-card-meta">
                      <span>{formatarData(artigo.publicado_em)}</span>
                      <ArrowUpRight size={17} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="articles-empty">Nenhum artigo publicado no momento.</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps<ArtigosProps> = async () => {
  try {
    const artigos = await buscarArtigos();
    return { props: { artigos, erro: false }, revalidate: 60 };
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Short revalidate so a slow/asleep backend does not keep the error page for long
    return { props: { artigos: [], erro: true }, revalidate: 10 };
  }
};
