import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Navbar from '../../src/components/Navbar';
import Header from '../../src/components/Header';
import Card from '../../src/components/Card';
import Button from '../../src/components/Button';
import Footer from '../../src/components/Footer';

interface DepoimentoTokenProps {
  token: string;
  title: string;
}

interface FormData {
  cliente_nome: string;
  depoimento: string;
  profissao?: string;
  foto_url?: string;
}

interface FormState extends FormData {
  isLoading: boolean;
  successMessage: string;
  errorMessage: string;
}

export default function DepoimentoSubmit({ token }: DepoimentoTokenProps): React.ReactElement {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    cliente_nome: '',
    depoimento: '',
    profissao: '',
    foto_url: '',
    isLoading: false,
    successMessage: '',
    errorMessage: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
      errorMessage: '', // Clear error message when user types
    }));
  };

  const validateForm = (): boolean => {
    if (!formState.cliente_nome.trim()) {
      setFormState(prevState => ({
        ...prevState,
        errorMessage: 'Por favor, insira seu nome',
      }));
      return false;
    }

    if (!formState.depoimento.trim()) {
      setFormState(prevState => ({
        ...prevState,
        errorMessage: 'Por favor, escreva seu depoimento',
      }));
      return false;
    }

    if (formState.depoimento.trim().length < 10) {
      setFormState(prevState => ({
        ...prevState,
        errorMessage: 'O depoimento deve ter pelo menos 10 caracteres',
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormState(prevState => ({
      ...prevState,
      isLoading: true,
      successMessage: '',
      errorMessage: '',
    }));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://davidviannaadv-backend.onrender.com/api';
      const response = await axios.post(`${apiUrl}/depoimentos/submit`, {
        token,
        cliente_nome: formState.cliente_nome,
        depoimento: formState.depoimento,
        profissao: formState.profissao || undefined,
        foto_url: formState.foto_url || undefined,
      });

      if (response.data.success) {
        setFormState(prevState => ({
          ...prevState,
          cliente_nome: '',
          depoimento: '',
          profissao: '',
          foto_url: '',
          isLoading: false,
          successMessage: 'Depoimento enviado com sucesso! Obrigado por compartilhar sua experiência.',
          errorMessage: '',
        }));

        // Redirect to depoimentos page after 3 seconds
        setTimeout(() => {
          router.push('/depoimentos');
        }, 3000);
      }
    } catch (error) {
      let errorMessage = 'Erro ao enviar depoimento. Por favor, tente novamente.';

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 400) {
          errorMessage = 'Token inválido ou expirado. Por favor, solicite um novo link.';
        } else if (error.response?.status === 500) {
          errorMessage = 'Erro no servidor. Por favor, tente novamente mais tarde.';
        } else if (error.message === 'Network Error') {
          errorMessage = 'Erro de conexão. Verifique sua internet.';
        }
      }

      setFormState(prevState => ({
        ...prevState,
        isLoading: false,
        errorMessage,
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <Header
        title="Compartilhe Sua Experiência"
        subtitle="Deixe seu depoimento sobre nossos serviços"
      />

      <main className="flex-grow max-w-2xl mx-auto px-4 py-16 w-full">
        <Card shadow="md" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {formState.successMessage && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="text-green-800 font-semibold">{formState.successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {formState.errorMessage && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="text-red-800 font-semibold">{formState.errorMessage}</p>
              </div>
            )}

            {/* Nome Field */}
            <div>
              <label htmlFor="cliente_nome" className="block text-sm font-semibold text-gray-700 mb-2">
                Seu Nome *
              </label>
              <input
                type="text"
                id="cliente_nome"
                name="cliente_nome"
                value={formState.cliente_nome}
                onChange={handleInputChange}
                placeholder="Seu nome completo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
                disabled={formState.isLoading}
              />
            </div>

            {/* Profissão Field */}
            <div>
              <label htmlFor="profissao" className="block text-sm font-semibold text-gray-700 mb-2">
                Profissão (opcional)
              </label>
              <input
                type="text"
                id="profissao"
                name="profissao"
                value={formState.profissao}
                onChange={handleInputChange}
                placeholder="Sua profissão"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
                disabled={formState.isLoading}
              />
            </div>

            {/* Depoimento Field */}
            <div>
              <label htmlFor="depoimento" className="block text-sm font-semibold text-gray-700 mb-2">
                Seu Depoimento *
              </label>
              <textarea
                id="depoimento"
                name="depoimento"
                value={formState.depoimento}
                onChange={handleInputChange}
                placeholder="Compartilhe sua experiência com nossos serviços (mínimo 10 caracteres)"
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent resize-none"
                disabled={formState.isLoading}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={formState.isLoading}
                className={formState.isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              >
                {formState.isLoading ? 'Enviando...' : 'Enviar Depoimento'}
              </Button>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              * Campos obrigatórios. Seu depoimento será revisado antes de ser publicado.
            </p>
          </form>
        </Card>
      </main>

      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<DepoimentoTokenProps> = async ({ params }) => {
  const token = params?.token as string;

  if (!token) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      token,
      title: 'Enviar Depoimento - DavidVianna Advocacia',
    },
  };
};
