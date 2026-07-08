import { getViteConfig } from 'astro/config';

// NOTA per chi scrive i prossimi test: oggi i test usano solo l'Astro
// Container API (SSR puro, vedi tests/layout.test.ts), quindi non serve un
// DOM environment. Se un task futuro monta un componente Vue direttamente
// (es. @vue/test-utils / @testing-library/vue) per testare interazioni client
// (click, localStorage, ecc.), aggiungi `test.environment: 'happy-dom'` (o
// 'jsdom') qui sotto e installa la relativa dipendenza dev.
export default getViteConfig({
  // Astro imposta di default `envPrefix: 'PUBLIC_'` (vedi node_modules/astro/dist/core/create-vite.js)
  // per evitare che variabili server-only finiscano nel bundle client. Questo filtro si
  // applica anche a `import.meta.env` lato test (a differenza del vero server Astro in
  // dev/build, dove il codice server-side legge `process.env` senza restrizioni di prefisso).
  // I test di autenticazione (tests/admin-auth.test.ts) istanziano il client Supabase reale
  // via `createSupabaseServerClient`, che legge `SUPABASE_URL`/`SUPABASE_ANON_KEY` (senza
  // prefisso `PUBLIC_`, di proposito: sono usate solo lato server) — vanno quindi aggiunte
  // esplicitamente qui perché il test possa vederle.
  envPrefix: ['PUBLIC_', 'SUPABASE_'],
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
