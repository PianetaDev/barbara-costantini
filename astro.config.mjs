import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: { port: 3456 },
  output: 'server',
  adapter: vercel({
    isr: {
      expiration: 60 * 60, // 1h: pagine prerender servite da CDN, rivalidate ogni ora
    },
  }),
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
    domains: ['fmplfkzqexaposaamgwi.supabase.co'],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
