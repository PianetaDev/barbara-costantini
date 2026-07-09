import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
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
    domains: ['fmplfkzqexaposaamgwi.supabase.co'],
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      // Il tracciamento dipendenze di Vercel non trova sempre `tslib`
      // annidato nello store pnpm (es. @supabase/functions-js -> tslib),
      // causando "Cannot find module 'tslib'" a runtime. Bundlare la
      // catena @supabase/* invece di lasciarla esterna elimina il problema
      // alla radice: niente require() a runtime da tracciare.
      noExternal: [/^@supabase\//],
    },
  },
});
