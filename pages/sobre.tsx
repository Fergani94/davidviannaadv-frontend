import { GetStaticProps } from 'next';
import React from 'react';
import Navbar from '../src/components/Navbar';
import Header from '../src/components/Header';
import Card from '../src/components/Card';
import Footer from '../src/components/Footer';

interface AboutProps {
  title: string;
}

export default function About({ title }: AboutProps): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <Header
        title="Sobre David Vianna"
        subtitle="Advogado com mais de duas décadas de experiência"
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-16 w-full">
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Card shadow="md" padding="lg">
                <div className="w-full h-80 bg-gray-300 rounded-lg flex items-center justify-center text-gray-600 mb-4">
                  [Foto do Advogado]
                </div>
              </Card>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-black mb-6">David Vianna</h2>
              <p className="text-lg text-gray-700 mb-4">
                Advogado formado há mais de 22 anos, dedicado à prestação de serviços jurídicos de qualidade.
              </p>
              <div className="space-y-4">
                <Card shadow="sm" padding="md">
                  <h3 className="font-bold text-red-900 mb-2">Formação Acadêmica</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Bacharelado em Direito</li>
                    <li>Aprovado no Exame da Ordem dos Advogados do Brasil</li>
                    <li>Cursos de especialização em direito civil e empresarial</li>
                  </ul>
                </Card>

                <Card shadow="sm" padding="md">
                  <h3 className="font-bold text-red-900 mb-2">Experiência Profissional</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Prática contínua em direito civil por mais de 20 anos</li>
                    <li>Consultoria em direito empresarial e imobiliário</li>
                    <li>Resolução de litígios e negociações comerciais</li>
                  </ul>
                </Card>

                <Card shadow="sm" padding="md">
                  <h3 className="font-bold text-red-900 mb-2">Compromissos Profissionais</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Ética e integridade em todas as relações profissionais</li>
                    <li>Sigilo e confidencialidade garantidos</li>
                    <li>Dedicação aos interesses de seus clientes</li>
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16 bg-gray-50 rounded-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-black mb-6">Metodologia de Trabalho</h2>
          <p className="text-gray-700 mb-6">
            Utilizamos uma abordagem consultiva focada em entender profundamente as necessidades de cada cliente, oferecendo orientação estratégica e prática jurídica robusta.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card shadow="sm" padding="md">
              <h3 className="font-bold text-red-900 mb-2">Análise Detalhada</h3>
              <p className="text-gray-700 text-sm">
                Exame cuidadoso de cada situação para identificar oportunidades e riscos.
              </p>
            </Card>
            <Card shadow="sm" padding="md">
              <h3 className="font-bold text-red-900 mb-2">Orientação Estratégica</h3>
              <p className="text-gray-700 text-sm">
                Recomendações baseadas em experiência e conhecimento jurídico aprofundado.
              </p>
            </Card>
            <Card shadow="sm" padding="md">
              <h3 className="font-bold text-red-900 mb-2">Acompanhamento Contínuo</h3>
              <p className="text-gray-700 text-sm">
                Suporte permanente durante todo o processo jurídico, do início ao encerramento.
              </p>
            </Card>
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
      title: 'Sobre - DavidVianna Advocacia',
    },
    revalidate: 3600,
  };
};
