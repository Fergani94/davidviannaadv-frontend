'use client';

import React from 'react';
import Button from './Button';

interface HeaderProps {
  title?: React.ReactNode;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  children?: React.ReactNode;
}

export default function Header({
  title = 'Bem-vindo à DavidVianna Advocacia',
  subtitle = 'Soluções jurídicas de excelência para seu sucesso',
  backgroundImage,
  ctaText = 'Consulte-nos',
  onCtaClick,
  children,
}: HeaderProps) {
  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: '#000000' };

  return (
    <header
      className="relative h-96 flex items-center justify-center text-white text-center overflow-hidden"
      style={backgroundStyle}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 animate-[pattern-drift_25s_linear_infinite] motion-reduce:animate-none [background-image:repeating-linear-gradient(45deg,rgba(192,192,192,0.9)_0px,rgba(192,192,192,0.9)_1px,transparent_1px,transparent_16px)]"
      ></div>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <img src="/logo/dav-logo-mark.png" alt="DAV" className="h-24 w-auto mx-auto mb-6" />
        <div className="w-16 h-[2px] bg-[var(--prata)] mx-auto mb-6" />
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">{title}</h1>
        <p className="text-xl mb-8 text-gray-300 tracking-wide">{subtitle}</p>
        <Button
          variant="primary"
          size="lg"
          onClick={onCtaClick}
          className="bg-red-900 hover:bg-red-800"
        >
          {ctaText}
        </Button>
        {children}
      </div>
    </header>
  );
}
