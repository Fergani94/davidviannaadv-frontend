import { GetStaticProps } from 'next';
import React, { useState } from 'react';
import Navbar from '../src/components/Navbar';
import Header from '../src/components/Header';
import Card from '../src/components/Card';
import Footer from '../src/components/Footer';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
}

function FAQPage({ faqs }: FAQProps): React.ReactElement {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleAccordion = (id: number): void => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <Header
        title="Perguntas Frequentes"
        subtitle="Respostas às dúvidas mais comuns"
      />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full">
        <section className="mb-16">
          <div className="space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id} shadow="sm" padding="md" className="border-2 border-gray-200">
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left flex justify-between items-center cursor-pointer hover:text-red-900 transition-colors"
                >
                  <h3 className="text-lg font-bold text-black">{faq.question}</h3>
                  <span className={`text-red-900 font-bold transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {openId === faq.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Não encontrou sua pergunta?</h2>
          <p className="text-gray-700 mb-6">
            Entre em contato conosco para esclarecer qualquer dúvida adicional.
          </p>
          <a
            href="/contato"
            className="inline-block bg-red-900 text-white px-8 py-3 rounded-lg hover:bg-red-800 transition-colors font-semibold"
          >
            Entre em contato
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps<FAQProps> = async () => {
  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'Como funciona a consulta inicial?',
      answer:
        'A consulta inicial é um encontro onde você apresenta sua situação jurídica e objetivos. Durante este encontro, analisamos os aspectos principais do seu caso e discutimos as possíveis estratégias e soluções aplicáveis. Este momento nos permite compreender melhor suas necessidades e apresentar as opções disponíveis.',
    },
    {
      id: 2,
      question: 'Quais são as formas de pagamento dos serviços?',
      answer:
        'Oferecemos diferentes modalidades de honorários, incluindo valor fixo por serviço, honorários por hora trabalhada ou acordos específicos conforme a natureza do caso. Discutiremos as opções mais adequadas à sua situação durante a consulta inicial.',
    },
    {
      id: 3,
      question: 'Como é garantida a confidencialidade do meu caso?',
      answer:
        'O sigilo profissional é um princípio fundamental da profissão jurídica. Todos os dados, informações e documentos relacionados ao seu caso são protegidos pelo dever de confidencialidade previsto no Código de Ética Profissional da Ordem dos Advogados do Brasil. Esse direito é inviolável e garantido legalmente.',
    },
  ];

  return {
    props: {
      faqs,
    },
    revalidate: 3600,
  };
}

export default FAQPage;
