import React from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowUpRight, MessageCircle } from 'lucide-react';
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import { AREAS_ATUACAO, WHATSAPP_1 } from '../lib/constants';

const FEATURED_AREAS = AREAS_ATUACAO.filter((area) => area.featured);

export default function Home(): React.ReactElement {
  return (
    <div className="site-shell">
      <Navbar />

      <main>
        <section className="hero-section">
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-content">
            <h1>Advocacia de <em>princípio</em>:</h1>
            <p className="hero-deck">a lei como único norte.</p>
            <p className="hero-intro">
              David Areias Vianna atua de forma direta e criteriosa em demandas de Direito Civil: família,
              responsabilidade civil, consumidor, vizinhança, contratos, inventário e usucapião extrajudiciais.
            </p>
            <div className="hero-actions">
              <a className="button button--ruby" href={WHATSAPP_1.href} target="_blank" rel="noreferrer">
                <MessageCircle size={18} /> Falar pelo WhatsApp
              </a>
              <Link className="button button--line-light" href="/contato">
                Entrar em contato <ArrowDownRight size={17} />
              </Link>
            </div>
          </div>

          <div className="hero-still-life" aria-label="Caneta e agenda">
            <div className="still-life-frame">
              <img src="/images/caneta-agenda.jpg" alt="Caneta-tinteiro sobre agenda de couro preto" />
            </div>
            <p className="image-caption">Prática forense e análise técnica</p>
          </div>

          <div className="hero-footer">
            <div>
              <strong>22+</strong>
              <span>anos de<br />experiência</span>
            </div>
            <div className="hero-fields">
              {FEATURED_AREAS.map((area, index) => (
                <React.Fragment key={area.title}>
                  <span>{area.title}</span>
                  {index < FEATURED_AREAS.length - 1 && <i />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        <section id="atuacao" className="practice-section section-pad">
          <div className="content-grid practice-heading">
            <div>
              <h2>Atuação direcionada a questões <em>concretas.</em></h2>
            </div>
            <p>
              A análise começa pela compreensão precisa da necessidade apresentada. Conheça as principais
              áreas de atuação.
            </p>
          </div>

          <div className="areas-grid">
            {FEATURED_AREAS.map((area) => (
              <article className="area-card area-card--featured" key={area.title}>
                <Link href="/servicos">
                  <div className="area-card-top"><ArrowUpRight size={19} /></div>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </Link>
              </article>
            ))}
            <article className="area-card">
              <Link href="/servicos">
                <div className="area-card-top"><ArrowUpRight size={19} /></div>
                <h3>Outras áreas</h3>
                <p>Contratos, vizinhança, inquilinato, inventário e usucapião extrajudicial.</p>
              </Link>
            </article>
          </div>
        </section>

        <section className="statement-section">
          <div className="statement-rule" />
          <blockquote>&ldquo;No direito, não há espaço para aventuras.&rdquo;</blockquote>
          <p>— David Areias Vianna</p>
        </section>

        <section className="contact-section section-pad">
          <div className="contact-heading">
            <h2>Converse sobre o seu <em>caso.</em></h2>
            <p>Atendimento online, de segunda a sexta-feira, em horário comercial, com disponibilidade para emergências.</p>
            <div className="hero-actions" style={{ justifyContent: 'center', marginTop: 32 }}>
              <a className="button button--ruby" href={WHATSAPP_1.href} target="_blank" rel="noreferrer">
                <MessageCircle size={18} /> Falar pelo WhatsApp
              </a>
              <Link className="button button--line" href="/contato">
                Enviar mensagem <ArrowDownRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
