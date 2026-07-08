import { describe, it, expect, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/vue/container-renderer';

// Task 17: studio.astro ora legge il team da Supabase (getTeamMembers) invece
// dell'array `membri` hardcoded (Task 5). Mockiamo src/lib/supabase-public per non
// dipendere da un Supabase reale — stesso pattern di tests/lavori.test.ts.
const MEMBRI_MOCK = vi.hoisted(() => [
  { id: 'uuid-a', nome: 'Membro Uno Mock', ruolo: 'Restauratrice', bio: 'Bio membro uno.', foto_url: null, ordine: 0 },
  { id: 'uuid-b', nome: 'Membro Due Mock', ruolo: 'Restauratore', bio: 'Bio membro due.', foto_url: null, ordine: 1 },
]);
vi.mock('../src/lib/supabase-public', () => ({
  getTeamMembers: async () => MEMBRI_MOCK,
}));

import Home from '../src/pages/index.astro';
import Studio from '../src/pages/studio.astro';

describe('home e studio', () => {
  it('index.astro renderizza hero + sezioni', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Home);
    expect(html).toContain('bc-095.jpg');
  });

  it('index.astro renderizza l\'h1 reale e il <title> corretto (senza suffisso)', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Home);
    expect(html).toContain('Barbara Costantini Restauro');
    expect(html).toMatch(/<title>Barbara Costantini Restauro<\/title>/);
    // Il <title> originale (useHead di Nuxt) non ha il suffisso " — Barbara
    // Costantini Restauro" concatenato da BaseLayout per le altre pagine.
    expect(html).not.toMatch(/<title>Home/);
    expect(html).not.toMatch(/<title>Barbara Costantini Restauro — Barbara Costantini Restauro<\/title>/);
  });

  it('studio.astro renderizza bio + team', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Studio);
    expect(html).toContain('bc-097.jpg');
  });

  it('studio.astro legge il team da Supabase (getTeamMembers), non più dall\'array hardcoded', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Studio);
    for (const m of MEMBRI_MOCK) {
      expect(html).toContain(m.nome);
      expect(html).toContain(m.bio);
    }
    expect(html).not.toContain('Nome Cognome 1');
  });

  it('studio.astro renderizza l\'h1 reale ("Lo studio") e il <title> con la maiuscola originale ("Lo Studio")', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Studio);
    expect(html).toMatch(/<h1[^>]*>\s*Lo studio/);
    expect(html).toMatch(/<title>Lo Studio — Barbara Costantini Restauro<\/title>/);
  });
});
