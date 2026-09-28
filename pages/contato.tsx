import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { ArrowUpRight, Clock3, MapPin, Mail, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { API_BASE_URL, AREAS_ATUACAO, CONTACT_EMAIL, ENDERECO, TELEFONE, WHATSAPP_1 } from '../lib/constants';

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

const initialForm: FormState = {
  nome: '',
  telefone: '',
  email: '',
  area_interesse: '',
  mensagem: '',
  isLoading: false,
  successMessage: '',
  errorMessage: '',
};

export default function Contato({ title }: ContatoProps): React.ReactElement {
  const [formState, setFormState] = useState<FormState>(initialForm);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value, errorMessage: '' }));
  };

  const validateForm = (): boolean => {
    if (!formState.nome.trim()) {
      setFormState((prev) => ({ ...prev, errorMessage: 'Por favor, insira seu nome' }));
      return false;
    }
    if (!formState.telefone.trim()) {
      setFormState((prev) => ({ ...prev, errorMessage: 'Por favor, insira seu telefone' }));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setFormState((prev) => ({ ...prev, errorMessage: 'Por favor, insira um email válido' }));
      return false;
    }
    if (!formState.area_interesse) {
      setFormState((prev) => ({ ...prev, errorMessage: 'Por favor, selecione uma área de interesse' }));
      return false;
    }
    if (!formState.mensagem.trim()) {
      setFormState((prev) => ({ ...prev, errorMessage: 'Por favor, insira sua mensagem' }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormState((prev) => ({ ...prev, isLoading: true, successMessage: '', errorMessage: '' }));

    try {
      const response = await axios.post(`${API_BASE_URL}/contato`, {
        nome: formState.nome,
        telefone: formState.telefone,
        email: formState.email,
        area_interesse: formState.area_interesse,
        mensagem: formState.mensagem,
      });

      if (response.data.success) {
        setFormState({
          ...initialForm,
          successMessage: 'Contato enviado com sucesso! Entraremos em contato em breve.',
        });
      }
    } catch (error) {
      let errorMessage = 'Erro ao enviar contato. Por favor, tente novamente.';
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error) errorMessage = error.response.data.error;
        else if (error.response?.status === 400) errorMessage = 'Por favor, verifique os dados inseridos.';
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
        <section id="contato" className="contact-section section-pad">
          <div className="contact-heading">
            <h2>Converse sobre o seu <em>caso.</em></h2>
            <p>Atendimento online, de segunda a sexta-feira, em horário comercial, com disponibilidade para emergências.</p>
          </div>
          <div className="contact-layout">
            <form className="contact-form" onSubmit={handleSubmit}>
              {formState.successMessage && <p className="form-success" role="status">{formState.successMessage}</p>}
              {formState.errorMessage && <p className="form-error" role="alert">{formState.errorMessage}</p>}

              <div className="form-row">
                <label>Nome
                  <input required name="nome" autoComplete="name" placeholder="Seu nome" value={formState.nome} onChange={handleInputChange} disabled={formState.isLoading} />
                </label>
                <label>Telefone
                  <input required name="telefone" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" value={formState.telefone} onChange={handleInputChange} disabled={formState.isLoading} />
                </label>
              </div>
              <label>E-mail
                <input required name="email" type="email" autoComplete="email" placeholder="seuemail@exemplo.com" value={formState.email} onChange={handleInputChange} disabled={formState.isLoading} />
              </label>
              <label>Área de interesse
                <select required name="area_interesse" value={formState.area_interesse} onChange={handleInputChange} disabled={formState.isLoading}>
                  <option value="" disabled>Selecione uma área</option>
                  {AREAS_ATUACAO.map((area) => (
                    <option key={area.title} value={area.title}>{area.title}</option>
                  ))}
                </select>
              </label>
              <label>Mensagem
                <textarea required name="mensagem" rows={5} placeholder="Descreva brevemente como posso ajudar." value={formState.mensagem} onChange={handleInputChange} disabled={formState.isLoading} />
              </label>
              <p className="lgpd-notice"><ShieldCheck size={15} /> Seus dados serão usados apenas para responder sua mensagem.</p>
              <button className="button button--black" type="submit" disabled={formState.isLoading}>
                {formState.isLoading ? 'Enviando...' : 'Enviar mensagem'} <ArrowUpRight size={17} />
              </button>
            </form>
            <aside className="contact-details">
              <div className="contact-emblem">
                <img src="/logo/dav-logo-mark.png" alt="David Areias Vianna" />
              </div>
              <div className="contact-line">
                <MessageCircle size={18} />
                <div>
                  <small>WhatsApp</small>
                  <a href={WHATSAPP_1.href} target="_blank" rel="noreferrer">{WHATSAPP_1.label}</a>
                </div>
              </div>
              <div className="contact-line">
                <Phone size={18} />
                <div>
                  <small>Telefone</small>
                  <a href={TELEFONE.href}>{TELEFONE.label}</a>
                </div>
              </div>
              <div className="contact-line">
                <MapPin size={18} />
                <div>
                  <small>Endereço</small>
                  <p>{ENDERECO}</p>
                </div>
              </div>
              <div className="contact-line">
                <Mail size={18} />
                <div>
                  <small>E-mail</small>
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </div>
              </div>
              <div className="contact-line">
                <Clock3 size={18} />
                <div>
                  <small>Atendimento</small>
                  <p>Online · segunda a sexta<br />Horário comercial</p>
                </div>
              </div>
            </aside>
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
      title: 'Contato — David Areias Vianna Advocacia',
    },
  };
};
