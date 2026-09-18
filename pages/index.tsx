import React from 'react';
import Navbar from '../src/components/Navbar';
import Header from '../src/components/Header';
import Card from '../src/components/Card';
import Button from '../src/components/Button';
import Footer from '../src/components/Footer';
import { ServiceFlipCycler } from '../src/components/ui/service-flip-cycler';

const SERVICE_NAMES = ['Direito Civil', 'Direito Empresarial', 'Direito Imobiliário'];

const SERVICE_DESCRIPTIONS: Record<string, string> = {
  'Direito Civil': 'Orientação em questões contratuais, responsabilidade civil e resolução de litígios.',
  'Direito Empresarial': 'Consultoria em constituição, fusões, aquisições e conformidade regulatória.',
  'Direito Imobiliário': 'Negociação e documentação de operações imobiliárias residenciais e comerciais.',
};

export default function Home(): React.ReactElement {
  const handleCtaClick = (): void => {
    window.location.href = '/contato';
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />

      <Header
        title={<ServiceFlipCycler words={SERVICE_NAMES} className="text-white" />}
        subtitle="Assistência jurídica focada em resultados"
        ctaText="Agende sua consulta"
        onCtaClick={handleCtaClick}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 py-16 w-full">
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Áreas de Atuação</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICE_NAMES.map((name) => (
              <Card key={name} shadow="md" padding="lg">
                <h3 className="text-xl font-bold text-white text-center mb-3">{name}</h3>
                <p className="text-gray-400 mb-4">
                  {SERVICE_DESCRIPTIONS[name]}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Saiba mais
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Por que nos escolher</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card shadow="sm" padding="md">
              <p className="text-gray-400">
                <strong className="text-[var(--prata)]">Experiência:</strong> Profissional com década e meia de prática jurídica comprovada.
              </p>
            </Card>
            <Card shadow="sm" padding="md">
              <p className="text-gray-400">
                <strong className="text-[var(--prata)]">Atendimento Personalizado:</strong> Soluções adaptadas aos seus objetivos.
              </p>
            </Card>
            <Card shadow="sm" padding="md">
              <p className="text-gray-400">
                <strong className="text-[var(--prata)]">Confidencialidade:</strong> Sigilo profissional garantido em todas as gestões.
              </p>
            </Card>
            <Card shadow="sm" padding="md">
              <p className="text-gray-400">
                <strong className="text-[var(--prata)]">Resultados:</strong> Compromisso com soluções efetivas para seus problemas jurídicos.
              </p>
            </Card>
          </div>
        </section>

        <section className="text-center bg-white/5 rounded-lg p-8 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-4">Pronto para uma consulta?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
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
