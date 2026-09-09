import { GetStaticProps } from 'next';
import React from 'react';
import Navbar from '../src/components/Navbar';
import Header from '../src/components/Header';
import Card from '../src/components/Card';
import Button from '../src/components/Button';
import Footer from '../src/components/Footer';

interface HomeProps {
  title: string;
}

export default function Home({ title }: HomeProps): React.ReactElement {
  const handleCtaClick = (): void => {
    window.location.href = '/contato';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <Header
        title={title}
        subtitle="Assistência jurídica focada em resultados"
        ctaText="Agende sua consulta"
        onCtaClick={handleCtaClick}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-16 w-full">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8">Áreas de Atuação</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card shadow="md" padding="lg">
              <h3 className="text-xl font-bold text-red-900 mb-3">Direito Civil</h3>
              <p className="text-gray-700 mb-4">
                Orientação em questões contratuais, responsabilidade civil e resolução de litígios.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Saiba mais
              </Button>
            </Card>

            <Card shadow="md" padding="lg">
              <h3 className="text-xl font-bold text-red-900 mb-3">Direito Empresarial</h3>
              <p className="text-gray-700 mb-4">
                Consultoria em constituição, fusões, aquisições e conformidade regulatória.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Saiba mais
              </Button>
            </Card>

            <Card shadow="md" padding="lg">
              <h3 className="text-xl font-bold text-red-900 mb-3">Direito Imobiliário</h3>
              <p className="text-gray-700 mb-4">
                Negociação e documentação de operações imobiliárias residenciais e comerciais.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Saiba mais
              </Button>
            </Card>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8">Por que nos escolher</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card shadow="sm" padding="md">
              <p className="text-gray-700">
                <strong className="text-red-900">Experiência:</strong> Profissional com década e meia de prática jurídica comprovada.
              </p>
            </Card>
            <Card shadow="sm" padding="md">
              <p className="text-gray-700">
                <strong className="text-red-900">Atendimento Personalizado:</strong> Soluções adaptadas aos seus objetivos.
              </p>
            </Card>
            <Card shadow="sm" padding="md">
              <p className="text-gray-700">
                <strong className="text-red-900">Confidencialidade:</strong> Sigilo profissional garantido em todas as gestões.
              </p>
            </Card>
            <Card shadow="sm" padding="md">
              <p className="text-gray-700">
                <strong className="text-red-900">Resultados:</strong> Compromisso com soluções efetivas para seus problemas jurídicos.
              </p>
            </Card>
          </div>
        </section>

        <section className="text-center bg-gray-50 rounded-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-black mb-4">Pronto para uma consulta?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Entre em contato conosco para agendar uma consulta inicial gratuita.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={handleCtaClick}
            className="bg-red-900 hover:bg-red-800"
          >
            Agende agora
          </Button>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  return {
    props: {
      title: 'DavidVianna Advocacia',
    },
    revalidate: 3600,
  };
};
