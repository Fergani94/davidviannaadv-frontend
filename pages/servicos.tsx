import { GetStaticProps } from 'next';
import React from 'react';
import Head from 'next/head';
import { ArrowUpRight, Check } from 'lucide-react';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { AREAS_ATUACAO, SERVICOS } from '../lib/constants';

interface ServicosProps {
  title: string;
}

export default function Servicos({ title }: ServicosProps): React.ReactElement {
  return (
    <div className="site-shell">
      <Head>
        <title>{title}</title>
      </Head>

      <Navbar />

      <main>
        <section id="atuacao" className="practice-section section-pad">
          <div className="content-grid practice-heading">
            <div>
              <h2>Atuação direcionada a questões <em>concretas.</em></h2>
            </div>
            <p>
              A análise começa pela compreensão precisa da necessidade apresentada. Conheça as áreas em
              que o atendimento é prestado.
            </p>
          </div>

          <div className="areas-grid">
            {AREAS_ATUACAO.map((area) => (
              <article className={area.featured ? 'area-card area-card--featured' : 'area-card'} key={area.title}>
                <div className="area-card-top"><ArrowUpRight size={19} /></div>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="services-section">
          <div className="content-grid services-grid">
            <div className="services-intro">
              <h2>Orientação jurídica com escopo <em>definido.</em></h2>
              <p>
                O atendimento contempla análise, parecer, elaboração de instrumentos e diligências,
                sempre conforme a necessidade concreta do caso.
              </p>
            </div>
            <ul className="service-list">
              {SERVICOS.map((service) => (
                <li key={service}><Check size={16} /> {service}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps<ServicosProps> = async () => {
  return {
    props: {
      title: 'Áreas de Atuação e Serviços — David Areias Vianna Advocacia',
    },
    revalidate: 86400,
  };
};
