import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

const ITENS = [
  { label: 'Artigos', href: '/admin/artigos' },
  { label: 'Depoimentos', href: '/admin/depoimentos' },
];

export default function AdminNav(): React.ReactElement {
  const router = useRouter();

  const handleLogout = async (): Promise<void> => {
    await axios.post('/api/admin/logout');
    await router.push('/admin/login');
  };

  return (
    <nav aria-label="Painel administrativo" className="border-b border-white/10 bg-black">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex gap-6">
          {ITENS.map((item) => {
            const ativo = router.pathname === item.href || router.pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold pb-1 border-b-2 ${
                  ativo ? 'border-[var(--ruby)]' : 'border-transparent'
                }`}
              >
                {/* the global unlayered `a { color: inherit }` beats Tailwind utilities on the anchor, so the color lives on the span */}
                <span className={ativo ? 'text-white' : 'text-gray-400 hover:text-white'}>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <button type="button" onClick={handleLogout} className="text-sm font-semibold text-gray-300 hover:text-white">
          Sair
        </button>
      </div>
    </nav>
  );
}
