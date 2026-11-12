import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: { port: 3456 },
  output: 'server',
  // Nessuna ISR: tutte le pagine sono SSR (prerender = false) e leggono Supabase a ogni
  // richiesta. Con isr attivo il CDN di Vercel teneva in cache l'HTML per 1h, ignorando
  // Cache-Control: no-store, e i salvataggi dell'admin non comparivano sul sito.
  adapter: vercel(),
  integrations: [
    vue(),
    sitemap(),
  ],
  site: 'https://barbara-costantini-pianetastudios-projects.vercel.app',
  image: {
    // Necessario per <Image src={membro.foto_url} ...> in src/pages/admin/team/[id].astro
    // (Task 14): astro:assets rifiuta di ottimizzare un'immagine remota il cui host non è
    // esplicitamente whitelisted qui, anche in SSR (`output: 'server'`). `fmplfkzqexaposaamgwi`
    // è il ref del progetto Supabase condiviso "pianeta-xp" (vedi supabase/README.md) — le
    // foto team caricate su Storage (bucket barbara-costantini-team) sono servite da questo
    // host.
    // fmplfkzqexaposaamgwi = dev Supabase; lqnwtmmhgmnxxtduvugh = prod Supabase.
    // Entrambi necessari: le foto caricate dall'admin su Storage (bucket
    // barbara-costantini-team / barbara-costantini-progetti) vengono servite dal
    // progetto attivo nell'env corrente. Senza la whitelist, <Image src={remoteUrl}>
    // lancia un errore "hostname not allowed" in SSR.
    domains: ['fmplfkzqexaposaamgwi.supabase.co', 'lqnwtmmhgmnxxtduvugh.supabase.co'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
