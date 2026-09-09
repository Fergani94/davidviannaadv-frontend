import { GetStaticProps } from 'next';
import React from 'react';
import Navbar from '../src/components/Navbar';
import Header from '../src/components/Header';
import Card from '../src/components/Card';
import Button from '../src/components/Button';
import Footer from '../src/components/Footer';

interface Service {
  id: number;
  title: string;
  description: string;
}

interface ServicesProps {
  services: Service[];
}

export default function Services({ services }: ServicesProps): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <Header
        title="Nossos Serviços"
        subtitle="Soluções jurídicas abrangentes para seus negócios"
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-16 w-full">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-black mb-8">Áreas de Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {services.map((service) => (
              <Card key={service.id} shadow="md" padding="lg">
                <h3 className="text-2xl font-bold text-red-900 mb-4">{service.title}</h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <Button variant="outline" size="md" className="w-full">
                  Solicitar informações
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 rounded-lg p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-black mb-6">Processo de Atendimento</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-900 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">Consulta Inicial</h3>
                <p className="text-gray-700">
                  Apresentação do caso e definição de objetivos.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-900 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">Análise Jurídica</h3>
                <p className="text-gray-700">
                  Estudo profundo da situação e identificação de soluções aplicáveis.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-900 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">Orientação Estratégica</h3>
                <p className="text-gray-700">
                  Apresentação de opções com análise de benefícios e riscos.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-red-900 text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">Execução</h3>
                <p className="text-gray-700">
                  Implementação das estratégias acordadas com acompanhamento constante.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps<ServicesProps> = async () => {
  const services: Service[] = [
    {
      id: 1,
      title: 'Contratos e Acordos',
      description:
        'Elaboração, revisão e negociação de contratos comerciais, trabalhistas e pessoais com observância das normas legais vigentes.',
    },
    {
      id: 2,
      title: 'Direito Imobiliário',
      description:
        'Assistência em compra, venda, aluguel e operações imobiliárias, incluindo análise de documentação e regularização de imóveis.',
    },
    {
      id: 3,
      title: 'Direito Civil',
      description:
        'Orientação em questões de responsabilidade civil, danos patrimoniais e pessoais, e resolução de conflitos entre partes.',
    },
    {
      id: 4,
      title: 'Direito Empresarial',
      description:
        'Consultoria para constituição de empresas, fusões, aquisições, conformidade regulatória e questões administrativas.',
    },
    {
      id: 5,
      title: 'Litígios e Demandas',
      description:
        'Representação em processos judiciais, mediação e arbitragem para resolução de conflitos de forma eficiente.',
    },
    {
      id: 6,
      title: 'Consultoria Jurídica',
      description:
        'Orientação preventiva em questões legais para evitar problemas futuros e garantir conformidade com legislação aplicável.',
    },
    {
      id: 7,
      title: 'Documentação Legal',
      description:
        'Preparação e formalização de documentos legais diversos, testamentos, procurações e outros atos notariais.',
    },
  ];

  return {
    props: {
      services,
    },
    revalidate: 3600,
  };
};
