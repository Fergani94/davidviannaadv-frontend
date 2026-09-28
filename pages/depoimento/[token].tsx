import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';
import { API_BASE_URL } from '../../lib/constants';

interface DepoimentoTokenProps {
  token: string;
  title: string;
}

interface FormState {
  nome: string;
  texto: string;
  isLoading: boolean;
  successMessage: string;
  errorMessage: string;
}

const initialForm: FormState = {
  nome: '',
  texto: '',
  isLoading: false,
  successMessage: '',
  errorMessage: '',
};

export default function DepoimentoSubmit({ token, title }: DepoimentoTokenProps): React.ReactElement {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(initialForm);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value, errorMessage: '' }));
  };

  const validateForm = (): boolean => {
    if (!formState.nome.trim()) {
      setFormState((prev) => ({ ...prev, errorMessage: 'Por favor, insira seu nome' }));
      return false;
    }
    if (formState.texto.trim().length < 10) {
      setFormState((prev) => ({ ...prev, errorMessage: 'O depoimento deve ter pelo menos 10 caracteres' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormState((prev) => ({ ...prev, isLoading: true, successMessage: '', errorMessage: '' }));

    try {
      const response = await axios.post(`${API_BASE_URL}/depoimentos/submit`, {
        token,
        nome: formState.nome,
        texto: formState.texto,
      });

      if (response.data.success) {
        setFormState({
          ...initialForm,
          successMessage: 'Depoimento enviado com sucesso! Obrigado por compartilhar sua experiência.',
        });
        setTimeout(() => router.push('/depoimentos'), 3000);
      }
    } catch (error) {
      let errorMessage = 'Erro ao enviar depoimento. Por favor, tente novamente.';
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error) errorMessage = error.response.data.error;
        else if (error.response?.status === 400) errorMessage = 'Link inválido ou expirado. Por favor, solicite um novo.';
        else if (error.response?.status === 500) errorMessage = 'Erro no servidor. Por favor, tente novamente mais tarde.';
        else if (error.message === 'Network Error') errorMessage = 'Erro de conexão. Verifique sua internet.';
      }
      setFormState((prev) => ({ ...prev, isLoading: false, errorMessage }));
    }
  };

  return (
    <div className="site-shell">
      <Head>
        <title>{title}</title>
      </Head>

      <Navbar />

      <main>
        <section className="contact-section section-pad">
          <div className="contact-heading">
            <h2>Compartilhe sua <em>experiência.</em></h2>
            <p>Seu relato será revisado antes de ser publicado na página de depoimentos.</p>
          </div>
          <div style={{ maxWidth: 620, margin: '0 auto', border: '1px solid var(--hairline)' }}>
            <form className="contact-form" onSubmit={handleSubmit}>
              {formState.successMessage && <p className="form-success" role="status">{formState.successMessage}</p>}
              {formState.errorMessage && <p className="form-error" role="alert">{formState.errorMessage}</p>}

              <label>Seu nome
                <input required name="nome" autoComplete="name" placeholder="Seu nome completo" value={formState.nome} onChange={handleInputChange} disabled={formState.isLoading} />
              </label>
              <label>Seu depoimento
                <textarea required name="texto" rows={7} placeholder="Compartilhe sua experiência (mínimo 10 caracteres)" value={formState.texto} onChange={handleInputChange} disabled={formState.isLoading} />
              </label>
              <button className="button button--black" type="submit" disabled={formState.isLoading}>
                {formState.isLoading ? 'Enviando...' : 'Enviar depoimento'} <ArrowUpRight size={17} />
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<DepoimentoTokenProps> = async ({ params }) => {
  const token = params?.token as string;

  if (!token) {
    return { notFound: true };
  }

  return {
    props: {
      token,
      title: 'Enviar Depoimento — David Areias Vianna Advocacia',
    },
  };
};
