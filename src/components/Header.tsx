'use client';

import React from 'react';

interface HeaderProps {
  title?: React.ReactNode;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header style={{ background: '#111', color: '#fff', padding: 'clamp(48px, 7vw, 80px) 5.4vw' }}>
      <div style={{ maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ width: 32, height: 1, background: 'var(--ruby)', marginBottom: 20 }} />
        <h1 style={{ color: '#fff' }}>{title}</h1>
        {subtitle && (
          <p style={{ color: '#cfcfcf', fontSize: 15, marginTop: 16, maxWidth: 560 }}>{subtitle}</p>
        )}
      </div>
    </header>
  );
}
