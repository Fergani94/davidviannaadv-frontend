'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowUpRight, Menu, MessageCircle, X } from 'lucide-react';
import { NAV_LINKS, OAB, WHATSAPP_1 } from '@/lib/constants';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="David Areias Vianna — início" onClick={closeMenu}>
        <img className="brand-logo" src="/logo/dav-logo-mark.png" alt="David Areias Vianna" />
        <span className="brand-copy">
          <strong>David Areias Vianna</strong>
          <small>{OAB}</small>
        </span>
      </Link>

      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      <nav className={menuOpen ? 'site-nav site-nav--open' : 'site-nav'} aria-label="Navegação principal">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={router.pathname === link.href ? 'active' : undefined}
            onClick={closeMenu}
          >
            {link.label}
          </Link>
        ))}
        <a className="nav-whatsapp" href={WHATSAPP_1.href} target="_blank" rel="noreferrer" onClick={closeMenu}>
          <MessageCircle size={14} /> WhatsApp <ArrowUpRight size={14} />
        </a>
      </nav>
    </header>
  );
}
