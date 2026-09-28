import { GetStaticProps } from 'next';
import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { API_BASE_URL } from '../lib/constants';

interface Depoimento {
  id: string;
  nome: string;
  texto: string;
  created_at: string;
}

interface DepoimentosProps {
  depoimentos: Depoimento[];
  title: string;
}

export default function Depoimentos({ depoimentos, title }: DepoimentosProps): React.ReactElement {
  return (
    <div className="site-shell">
      <Head>
        <title>{title}</title>
      </Head>

      <Navbar />

      <main>
        <section className="testimonials-section section-pad">
          <div className="content-grid testimonial-heading">
            <div>
              <h2>Relações pautadas por <em>clareza.</em></h2>
            </div>
            <p>Relatos autorizados por clientes atendidos.</p>
          </div>

          {depoimentos.length > 0 ? (
            <div className="testimonial-grid">
              {depoimentos.map((depoimento) => (
                <article className="testimonial-card" key={depoimento.id}>
                  <span className="quote-mark">&ldquo;</span>
                  <p>{depoimento.texto}</p>
                  <div>
                    <strong>{depoimento.nome}</strong>
                    <small>{new Date(depoimento.created_at).toLocaleDateString('pt-BR')}</small>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="testimonial-empty">
              Nenhum depoimento publicado no momento. Os relatos são coletados diretamente com clientes
              atendidos, mediante convite pessoal.
            </p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps<DepoimentosProps> = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/depoimentos`, { timeout: 10000 });

    return {
      props: {
        depoimentos: response.data?.data || [],
        title: 'Depoimentos — David Areias Vianna Advocacia',
      },
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return {
      props: {
        depoimentos: [],
        title: 'Depoimentos — David Areias Vianna Advocacia',
      },
      revalidate: 60,
    };
  }
};
