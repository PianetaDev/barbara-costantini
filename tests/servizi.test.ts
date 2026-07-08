import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/vue/container-renderer';
import Servizi from '../src/pages/servizi.astro';

describe('servizi', () => {
  it('renderizza i gruppi di servizi e i partner', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Servizi);
    expect(html).toContain('Pierluigi Ferro Cornici');
    expect(html).toContain('Beni Archivistici e Librari');
    expect(html).toContain('Opere d’arte su carta');
    expect(html).toContain('Materiali fotografici');
    expect(html).toContain('Servizi trasversali');
    expect(html).toContain('Ricognizione conservativa di fondi e collezioni');
    expect(html).toContain('Fotografia');
    expect(html).toContain('Diagnostica');
  });

  it('usa <details> nativo per l\'accordion, con il primo servizio di ogni gruppo aperto di default', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Servizi);

    // 4 gruppi × 4 servizi = 16 <details> totali per l'accordion.
    const detailsTags = html.match(/<details\b/g) ?? [];
    expect(detailsTags.length).toBe(16);

    // Il primo servizio di ciascuno dei 4 gruppi è aperto di default
    // (equivalente all'originale: aperto.value = { 0: 0, 1: 0, 2: 0, 3: 0 }).
    const openDetails = html.match(/<details\b[^>]*\bopen\b[^>]*>/g) ?? [];
    expect(openDetails.length).toBe(4);
  });
});
