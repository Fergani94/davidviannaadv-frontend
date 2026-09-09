'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  companyName?: string;
  email?: string;
  phone?: string;
  address?: string;
  socialLinks?: Array<{ icon: string; url: string; label: string }>;
  quickLinks?: Array<{ label: string; href: string }>;
}

export default function Footer({
  companyName = 'DavidVianna Advocacia',
  email = 'contato@davidvianna.com.br',
  phone = '+55 (XX) XXXXX-XXXX',
  address = 'Endereço - Cidade, Estado',
  socialLinks = [],
  quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Contato', href: '/contato' },
  ],
}: FooterProps) {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold text-red-700 mb-4">{companyName}</h3>
            <p className="text-gray-400 text-sm">
              Soluções jurídicas de excelência para o seu negócio.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-red-700">Links Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-red-700 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-red-700">Contato</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: {email}</li>
              <li>Telefone: {phone}</li>
              <li>Endereço: {address}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-red-700">Redes Sociais</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-red-700 transition-colors duration-200"
                  title={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-gray-700 mb-4" />

        <div className="text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} {companyName}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
