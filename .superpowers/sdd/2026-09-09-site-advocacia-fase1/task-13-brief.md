# Task 13: Frontend Shared Components

## Overview
Create 5 reusable UI components for the DavidVianna Advocacia website using TypeScript and Tailwind CSS.

## Corporate Palette
- **Preto**: #000000 (Black)
- **Vermelho Rubi**: #8B0000 (Dark Red)
- **Prata**: #C0C0C0 (Silver)

## Components

### 1. Button.tsx
Reusable button component with support for multiple variants and sizes.

```typescript
'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const variantClasses = {
    primary: 'bg-red-900 text-white hover:bg-red-800 active:bg-red-900',
    secondary: 'bg-gray-300 text-black hover:bg-gray-400 active:bg-gray-300',
    outline: 'border-2 border-red-900 text-red-900 hover:bg-red-50 active:bg-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const baseClasses = 'font-semibold rounded-lg transition-colors duration-200 font-sans';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
```

### 2. Card.tsx
Container component for content sections.

```typescript
'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  className = '',
  shadow = 'md',
  padding = 'md',
}: CardProps) {
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`${shadowClasses[shadow]} ${paddingClasses[padding]} rounded-lg bg-white border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
}
```

### 3. Navbar.tsx
Navigation component for the header.

```typescript
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface NavbarProps {
  logo?: string;
  menuItems?: Array<{ label: string; href: string }>;
  onMenuItemClick?: (href: string) => void;
}

export default function Navbar({
  logo = 'DavidVianna Advocacia',
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
    <nav className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-red-700">{logo}</div>
        
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
              className="hover:text-red-700 transition-colors duration-200"
              onClick={() => onMenuItemClick?.(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-black md:hidden">
            <div className="flex flex-col gap-4 p-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:text-red-700 transition-colors duration-200"
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
```

### 4. Header.tsx
Hero/header section component.

```typescript
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
```

### 5. Footer.tsx
Footer component.

```typescript
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
```

## Testing
Run `npm run build` to verify all components compile correctly without errors.

## Commit Message
"feat: add shared components"

## Notes
- All components are TypeScript-first
- Tailwind CSS for styling with corporate color palette
- Components are pure UI with no business logic
- Responsive design for mobile and desktop
