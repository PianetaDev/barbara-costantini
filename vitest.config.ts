import { getViteConfig } from 'astro/config';

// NOTA per chi scrive i prossimi test: oggi i test usano solo l'Astro
// Container API (SSR puro, vedi tests/layout.test.ts), quindi non serve un
// DOM environment. Se un task futuro monta un componente Vue direttamente
// (es. @vue/test-utils / @testing-library/vue) per testare interazioni client
// (click, localStorage, ecc.), aggiungi `test.environment: 'happy-dom'` (o
// 'jsdom') qui sotto e installa la relativa dipendenza dev.
export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
