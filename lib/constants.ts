export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://davidviannaadv-backend.onrender.com/api';

export const COLORS = {
  preto: '#000000',
  vermelhoRubi: '#8B1538',
  prata: '#C0C0C0',
};

export const SITE_NAME = 'David Areias Vianna — Advogado';
export const SITE_DESCRIPTION = 'Advocacia de princípio: a lei como único norte.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://davidviannaadv-frontend.vercel.app';

export const OAB = 'OAB/RJ 138.124';
export const WHATSAPP_1 = { label: '(48) 98801-4440', href: 'https://wa.me/5548988014440' };
export const TELEFONE = { label: '(69) 98135-4662', href: 'tel:+5569981354662' };
export const ENDERECO = 'Rua Siqueira Campos, 2406, Apartamento 93, Centro, Pirassununga/SP · CEP 13.631-010';
export const FOOTER_TAGLINE = 'Soluções jurídicas de excelência para sua vida.';
export const CONTACT_EMAIL = 'davidviannarj@yahoo.com.br';

export interface AreaAtuacao {
  title: string;
  description: string;
  featured?: boolean;
}

export const AREAS_ATUACAO: AreaAtuacao[] = [
  { title: 'Responsabilidade Civil', description: 'Análise de danos, deveres de reparação e medidas cabíveis.', featured: true },
  { title: 'Consumidor', description: 'Orientação e atuação em relações de consumo e conflitos contratuais.', featured: true },
  { title: 'Direito de Família', description: 'Demandas familiares conduzidas com discrição e critério técnico.', featured: true },
  { title: 'Contratos', description: 'Elaboração e análise de contratos, com segurança jurídica para as partes.' },
  { title: 'Direito de Vizinhança', description: 'Prevenção e tratamento de conflitos de convivência e propriedade.' },
  { title: 'Inquilinato', description: 'Questões locatícias, obrigações e relações entre locadores e locatários.' },
  { title: 'Inventário', description: 'Organização jurídica para a formalização de sucessões consensuais.' },
  { title: 'Usucapião extrajudicial', description: 'Análise documental e encaminhamento do procedimento em cartório.' },
];

export const SERVICOS: string[] = [
  'Consultoria nas áreas de experiência: Direito de Família, Inventário, Usucapião, Vizinhança, Inquilinato, Responsabilidade Civil e Consumidor',
  'Elaboração de contratos',
  'Diligências extrajudiciais',
  'Assessoria jurídica em 1ª e 2ª instâncias, bem como extrajudiciais',
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    question: 'É causa ganha?',
    answer: 'Não. Cada caso é examinado conforme seus fatos, documentos e o direito aplicável. Nenhum resultado pode ser antecipado ou garantido.',
  },
  {
    question: 'O processo demora muito?',
    answer: 'O tempo de tramitação varia conforme a natureza da demanda, as medidas necessárias e a atuação do Poder Judiciário. A orientação é apresentada de forma realista em cada caso.',
  },
  {
    question: 'A consulta inicial é gratuita?',
    answer: 'Não há consulta inicial gratuita; os honorários e o escopo da análise são esclarecidos antes do atendimento, com transparência.',
  },
  {
    question: 'O atendimento é presencial?',
    answer: 'O atendimento é integralmente online e realizado diretamente pelo advogado, mediante canais digitais adequados à necessidade de cada caso.',
  },
];

export const NAV_LINKS: Array<{ label: string; href: string }> = [
  { label: 'Sobre', href: '/sobre' },
  { label: 'Atuação', href: '/servicos' },
  { label: 'Artigos', href: '/artigos' },
  { label: 'Depoimentos', href: '/depoimentos' },
  { label: 'Dúvidas', href: '/faq' },
  { label: 'Contato', href: '/contato' },
];
