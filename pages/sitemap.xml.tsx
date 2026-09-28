import { GetServerSideProps } from 'next';
import { SITE_URL } from '../lib/constants';
import { ArtigoResumo, buscarArtigos } from '../lib/artigos';

const PAGINAS = ['', '/sobre', '/servicos', '/artigos', '/depoimentos', '/faq', '/contato'];

function escapar(texto: string): string {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let artigos: ArtigoResumo[];
  try {
    artigos = await buscarArtigos();
  } catch {
    // Do not cache a sitemap without articles: answer 503 so crawlers retry shortly
    res.statusCode = 503;
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Retry-After', '120');
    res.end();
    return { props: {} };
  }

  const urls = [
    ...PAGINAS.map((caminho) => `<url><loc>${escapar(SITE_URL + caminho)}</loc></url>`),
    ...artigos.map((artigo) => {
      const lastmod = artigo.publicado_em ? `<lastmod>${artigo.publicado_em.slice(0, 10)}</lastmod>` : '';
      return `<url><loc>${escapar(`${SITE_URL}/artigos/${artigo.slug}`)}</loc>${lastmod}</url>`;
    }),
  ];

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`
  );
  res.end();

  return { props: {} };
};

export default function Sitemap(): null {
  return null;
}
