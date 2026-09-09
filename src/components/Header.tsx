'use client';

import React from 'react';
import Button from './Button';

interface HeaderProps {
  title?: string;
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
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-4 text-white">{title}</h1>
        <p className="text-xl mb-8 text-gray-200">{subtitle}</p>
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
