'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  menuItems?: Array<{ label: string; href: string }>;
  onMenuItemClick?: (href: string) => void;
}

export default function Navbar({
  menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Contato', href: '/contato' },
  ],
  onMenuItemClick,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuItemClick = (href: string) => {
    setIsOpen(false);
    onMenuItemClick?.(href);
  };

  return (
    <nav className="bg-black text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <img src="/logo/dav-logo-mark.png" alt="DAV" className="h-10 w-auto" />

        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        <div className={`hidden md:flex gap-8`}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-widest text-gray-300 hover:text-[var(--prata)] transition-colors duration-200"
              onClick={() => onMenuItemClick?.(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-black border-b border-white/10 md:hidden">
            <div className="flex flex-col gap-4 p-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm uppercase tracking-widest text-gray-300 hover:text-[var(--prata)] transition-colors duration-200"
                  onClick={() => handleMenuItemClick(item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
