import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';

export default function Erro500(): React.ReactElement {
  return (
    <div className="site-shell">
      <Head>
        <title>Erro — David Areias Vianna Advocacia</title>
      </Head>

      <Navbar />

      <main>
        <section className="articles-section section-pad">
          <div className="content-grid articles-heading">
            <div>
              <h2>Algo deu <em>errado.</em></h2>
            </div>
            <p>Não foi possível carregar esta página agora. Tente novamente em instantes.</p>
          </div>
          <div className="content-grid">
            <Link className="button button--black" href="/">
              Voltar ao início
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
