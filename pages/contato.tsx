import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../src/components/Navbar';
import Header from '../src/components/Header';
import Card from '../src/components/Card';
import Button from '../src/components/Button';
import Footer from '../src/components/Footer';

interface ContatoProps {
  title: string;
}

interface FormData {
  nome: string;
  telefone: string;
  email: string;
  area_interesse: string;
  mensagem: string;
}

interface FormState extends FormData {
  isLoading: boolean;
  successMessage: string;
  errorMessage: string;
}

const areasDeInteresse = [
  { value: '', label: 'Selecione uma área...' },
  { value: 'direito_civil', label: 'Direito Civil' },
  { value: 'direito_empresarial', label: 'Direito Empresarial' },
  { value: 'direito_imobiliario', label: 'Direito Imobiliário' },
  { value: 'direito_outro', label: 'Outra' },
];

export default function Contato({ title }: ContatoProps): React.ReactElement {
  const [formState, setFormState] = useState<FormState>({
    nome: '',
    telefone: '',
    email: '',
    area_interesse: '',
    mensagem: '',
    isLoading: false,
    successMessage: '',
    errorMessage: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
      errorMessage: '', // Clear error message when user types
    }));
  };

  const validateForm = (): boolean => {
    if (!formState.nome.trim()) {
      setFormState(prevState => ({
        ...prevState,
        errorMessage: 'Por favor, insira seu nome',
      }));
      return false;
    }

    if (!formState.telefone.trim()) {
      setFormState(prevState => ({
        ...prevState,
        errorMessage: 'Por favor, insira seu telefone',
      }));
      return false;
    }

    if (!formState.email.trim()) {
      setFormState(prevState => ({
        ...prevState,
        errorMessage: 'Por favor, insira seu email',
      }));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setFormState(prevState => ({
        ...prevState,
        errorMessage: 'Por favor, insira um email válido',
      }));
      return false;
    }

    if (!formState.area_interesse) {
      setFormState(prevState => ({
        ...prevState,
        errorMessage: 'Por favor, selecione uma área de interesse',
      }));
      return false;
    }

    if (!formState.mensagem.trim()) {
      setFormState(prevState => ({
        ...prevState,
        errorMessage: 'Por favor, insira sua mensagem',
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/contato`, {
        nome: formState.nome,
        telefone: formState.telefone,
        email: formState.email,
        area_interesse: formState.area_interesse,
        mensagem: formState.mensagem,
      });

      if (response.data.success) {
        setFormState(prevState => ({
          ...prevState,
          nome: '',
          telefone: '',
          email: '',
          area_interesse: '',
          mensagem: '',
          isLoading: false,
          successMessage: 'Contato enviado com sucesso! Entraremos em contato em breve.',
          errorMessage: '',
        }));

        // Clear success message after 5 seconds
        setTimeout(() => {
          setFormState(prevState => ({
            ...prevState,
            successMessage: '',
          }));
        }, 5000);
      }
    } catch (error) {
      let errorMessage = 'Erro ao enviar contato. Por favor, tente novamente.';

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 400) {
          errorMessage = 'Por favor, verifique os dados inseridos.';
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
        title="Entre em Contato"
        subtitle="Envie-nos uma mensagem e entraremos em contato em breve"
      />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-16 w-full">
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
              <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
                Nome *
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formState.nome}
                onChange={handleInputChange}
                placeholder="Seu nome completo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
                disabled={formState.isLoading}
              />
            </div>

            {/* Telefone Field */}
            <div>
              <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                value={formState.telefone}
                onChange={handleInputChange}
                placeholder="(XX) XXXXX-XXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
                disabled={formState.isLoading}
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
                disabled={formState.isLoading}
              />
            </div>

            {/* Area de Interesse Field */}
            <div>
              <label htmlFor="area_interesse" className="block text-sm font-semibold text-gray-700 mb-2">
                Área de Interesse *
              </label>
              <select
                id="area_interesse"
                name="area_interesse"
                value={formState.area_interesse}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900 focus:border-transparent"
                disabled={formState.isLoading}
              >
                {areasDeInteresse.map(area => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mensagem Field */}
            <div>
              <label htmlFor="mensagem" className="block text-sm font-semibold text-gray-700 mb-2">
                Mensagem *
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                value={formState.mensagem}
                onChange={handleInputChange}
                placeholder="Descreva sua situação ou dúvida jurídica"
                rows={6}
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
                {formState.isLoading ? 'Enviando...' : 'Enviar Contato'}
              </Button>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              * Todos os campos são obrigatórios
            </p>
          </form>
        </Card>

        {/* Contact Info Section */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-black mb-8">Outras formas de contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card shadow="sm" padding="md">
              <h3 className="font-bold text-red-900 mb-2">Telefone</h3>
              <p className="text-gray-700">(XX) XXXXX-XXXX</p>
            </Card>

            <Card shadow="sm" padding="md">
              <h3 className="font-bold text-red-900 mb-2">Email</h3>
              <p className="text-gray-700">davidviannarj@yahoo.com.br</p>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<ContatoProps> = async () => {
  return {
    props: {
      title: 'Contato - DavidVianna Advocacia',
    },
  };
};
