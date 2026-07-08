import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/vue/container-renderer';
import LavoriIndex from '../src/pages/lavori/index.astro';
import LavoriSlug from '../src/pages/lavori/[slug].astro';
import { PROGETTI } from '../src/data/progetti';

describe('lavori', () => {
  it('index elenca tutti e 12 i progetti', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(LavoriIndex);
    for (const p of PROGETTI) {
      expect(html).toContain(p.slug);
    }
  });

  it('ogni slug ha una pagina di dettaglio funzionante (nessun "non trovato")', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    for (const p of PROGETTI) {
      const html = await container.renderToString(LavoriSlug, { params: { slug: p.slug } });
      expect(html).toContain(p.titolo);
      expect(html).not.toContain('Progetto non trovato');
    }
  });
});
