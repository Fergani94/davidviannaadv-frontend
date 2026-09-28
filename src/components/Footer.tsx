'use client';

import React from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { ENDERECO, FOOTER_TAGLINE, OAB, WHATSAPP_1 } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Link className="brand brand--footer" href="/">
          <img className="brand-logo" src="/logo/dav-logo-mark.png" alt="David Areias Vianna" />
          <span className="brand-copy">
            <strong>David Areias Vianna</strong>
            <small>{FOOTER_TAGLINE}</small>
          </span>
        </Link>
        <p>Advocacia de princípio: a lei como único norte.</p>
        <a className="footer-whatsapp" href={WHATSAPP_1.href} target="_blank" rel="noreferrer">
          <Phone size={15} /> Atendimento via WhatsApp
        </a>
      </div>
      <div className="footer-bottom">
        <span>David Areias Vianna · {OAB}</span>
        <span>{ENDERECO}</span>
        <span>© {new Date().getFullYear()} · Todos os direitos reservados</span>
      </div>
    </footer>
  );
}
