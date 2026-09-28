import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';

export default function AdminLogin(): React.ReactElement {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    router.query.expirou ? 'Sua sessão expirou. Entre novamente.' : ''
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await axios.post('/api/admin/login', { email, password });
      await router.push('/admin/artigos');
    } catch (error) {
      let message = 'Não foi possível entrar. Tente novamente.';
      if (axios.isAxiosError(error) && error.response?.data?.error) message = error.response.data.error;
      setErrorMessage(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="site-shell">
      <Head>
        <title>Área restrita — David Areias Vianna Advocacia</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Navbar />

      <main>
        <section className="contact-section section-pad">
          <div className="contact-heading">
            <h2>Área <em>restrita.</em></h2>
            <p>Acesso reservado à administração do site.</p>
          </div>
          <div style={{ maxWidth: 520, margin: '0 auto', border: '1px solid var(--hairline)' }}>
            <form className="contact-form" onSubmit={handleSubmit}>
              {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
              <label>E-mail
                <input required type="email" name="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
              </label>
              <label>Senha
                <input required type="password" name="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
              </label>
              <button className="button button--black" type="submit" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'} <ArrowUpRight size={17} />
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (req.cookies.auth_token) {
    return { redirect: { destination: '/admin/artigos', permanent: false } };
  }
  return { props: {} };
};
