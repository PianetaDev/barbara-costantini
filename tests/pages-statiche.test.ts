import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/vue/container-renderer';
import Contatti from '../src/pages/contatti.astro';
import Privacy from '../src/pages/privacy-policy.astro';
import Cookie from '../src/pages/cookie-policy.astro';

describe('pagine statiche', () => {
  it('contatti.astro contiene informazioni di contatto', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Contatti);
    expect(html).toMatch(/@|instagram|tel/i);
  });

  it('privacy-policy.astro contiene P.IVA/C.F.', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Privacy);
    expect(html.length).toBeGreaterThan(500);
  });

  it('cookie-policy.astro renderizza', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Cookie);
    expect(html.length).toBeGreaterThan(300);
  });
});
