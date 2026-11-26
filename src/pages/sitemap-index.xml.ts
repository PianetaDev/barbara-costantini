// src/pages/sitemap-index.xml.ts
// Vecchio indirizzo della sitemap (generata a build-time fino a novembre 2026): chi lo
// aveva già registrato, es. Search Console, viene portato a quella nuova.
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ redirect }) => redirect('/sitemap.xml', 301);
