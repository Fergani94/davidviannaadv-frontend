import { GetStaticProps } from 'next';
import React from 'react';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../src/components/Navbar';
import Header from '../src/components/Header';
import Card from '../src/components/Card';
import Button from '../src/components/Button';
import Footer from '../src/components/Footer';

interface Depoimento {
  id: string;
  cliente_nome: string;
  depoimento: string;
  profissao?: string;
  foto_url?: string;
  criado_em: string;
}

interface DepoimentosProps {
  depoimentos: Depoimento[];
  title: string;
}

export default function Depoimentos({ depoimentos }: DepoimentosProps): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <Header
        title="Depoimentos de Clientes"
        subtitle="Veja o que nossos clientes dizem sobre nossos serviços"
      />

      <main className="flex-grow max-w-6xl mx-auto px-4 py-16 w-full">
        {depoimentos && depoimentos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {depoimentos.map((depoimento) => (
              <Card key={depoimento.id} shadow="md" padding="lg" className="flex flex-col">
                <blockquote className="text-gray-700 italic mb-4 flex-grow">
                  "{depoimento.depoimento}"
                </blockquote>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-bold text-black">{depoimento.cliente_nome}</p>
                  {depoimento.profissao && (
                    <p className="text-sm text-gray-600">{depoimento.profissao}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(depoimento.criado_em).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-6">
              Nenhum depoimento aprovado no momento. Seja o primeiro a compartilhar sua experiência!
            </p>
            <Link href="/depoimento/novo">
              <Button variant="primary">
                Enviar Depoimento
              </Button>
            </Link>
          </div>
        )}

        {depoimentos && depoimentos.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/depoimento/novo">
              <Button variant="primary">
                Compartilhe Sua Experiência
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export const getStaticProps: GetStaticProps<DepoimentosProps> = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://davidviannaadv-backend.onrender.com/api';
    const response = await axios.get(`${apiUrl}/depoimentos`, {
      timeout: 10000, // 10 second timeout
    });

    return {
      props: {
        depoimentos: response.data || [],
        title: 'Depoimentos - DavidVianna Advocacia',
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return {
      props: {
        depoimentos: [],
        title: 'Depoimentos - DavidVianna Advocacia',
      },
      revalidate: 60, // Retry after 1 minute on error
    };
  }
};
