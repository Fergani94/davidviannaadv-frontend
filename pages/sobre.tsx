import { GetStaticProps } from 'next';
import React from 'react';
import Head from 'next/head';
import { FileSearch, Scale, ShieldCheck } from 'lucide-react';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';

interface AboutProps {
  title: string;
}

export default function Sobre({ title }: AboutProps): React.ReactElement {
  return (
    <div className="site-shell">
      <Head>
        <title>{title}</title>
      </Head>

      <Navbar />

      <main>
        <section className="about-section section-pad">
          <div className="content-grid about-grid">
            <div className="about-aside">
              <div className="about-photo">
                <img src="/images/david-vianna.jpg" alt="David Areias Vianna em seu escritório" />
              </div>
              <div className="vertical-rule" />
              <p className="aside-note">
                Uma atuação pessoal, objetiva e vinculada ao que os autos e a lei permitem sustentar.
              </p>
            </div>
            <div className="about-body">
              <h2>Critério técnico para decisões que exigem <em>seriedade.</em></h2>
              <p>
                Com mais de 22 anos de experiência, David Areias Vianna (OAB/RJ 138.124) conduz o atendimento
                de cada caso de maneira pessoal e individual, sem equipe intermediária. A atuação parte da
                análise cuidadosa dos fatos, da documentação disponível e dos meios juridicamente adequados
                para cada situação.
              </p>
              <p>
                <strong>Experiência profissional:</strong> consultoria nas áreas de experiência (Direito de
                Família, Inventário, Usucapião, Vizinhança, Inquilinato, Responsabilidade Civil e Consumidor);
                elaboração de contratos; diligências extrajudiciais; e assessoria jurídica em 1ª e 2ª
                instâncias, bem como extrajudiciais.
              </p>
              <p>
                O atendimento é integralmente online, de segunda a sexta-feira em horário comercial, com
                disponibilidade para emergências em qualquer dia e horário.
              </p>
              <div className="principles">
                <div><Scale size={21} /><span>Atuação individual</span></div>
                <div><FileSearch size={21} /><span>Mais de 22 anos de experiência</span></div>
                <div><ShieldCheck size={21} /><span>Orientação fundamentada</span></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps<AboutProps> = async () => {
  return {
    props: {
      title: 'Sobre — David Areias Vianna Advocacia',
    },
    revalidate: 86400,
  };
};
