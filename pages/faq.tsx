import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import Head from 'next/head';
import { ChevronDown } from 'lucide-react';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { FAQS } from '../lib/constants';

interface FAQProps {
  title: string;
}

function FAQPage({ title }: FAQProps): React.ReactElement {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="site-shell">
      <Head>
        <title>{title}</title>
      </Head>

      <Navbar />

      <main>
        <section id="faq" className="faq-section section-pad">
          <div className="content-grid faq-grid">
            <div className="faq-intro">
              <h2>Informação clara desde o <em>primeiro contato.</em></h2>
              <p>
                O atendimento é conduzido com objetividade, sem antecipação de resultados e com respeito
                às particularidades de cada situação.
              </p>
            </div>
            <div className="faq-list">
              {FAQS.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div className={isOpen ? 'faq-item faq-item--open' : 'faq-item'} key={faq.question}>
                    <button type="button" onClick={() => setOpenIndex(isOpen ? null : index)} aria-expanded={isOpen}>
                      <span>{faq.question}</span><ChevronDown size={20} />
                    </button>
                    <div className="faq-answer"><p>{faq.answer}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps<FAQProps> = async () => {
  return {
    props: {
      title: 'Perguntas Frequentes — David Areias Vianna Advocacia',
    },
    revalidate: 86400,
  };
};

export default FAQPage;
