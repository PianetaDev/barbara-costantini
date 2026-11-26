// src/pages/robots.txt.ts
// Dice ai motori di ricerca (e ai crawler degli assistenti AI) cosa possono leggere:
// tutto il sito pubblico, non il pannello né le API.
import type { APIRoute } from 'astro';
import { SITE_URL } from '../lib/seo';

export const prerender = false;

export const GET: APIRoute = () =>
  new Response(
    ['User-agent: *', 'Allow: /', 'Disallow: /admin', 'Disallow: /api/', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } },
  );
