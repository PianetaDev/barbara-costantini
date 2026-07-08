import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/vue/container-renderer';
import Home from '../src/pages/index.astro';
import Studio from '../src/pages/studio.astro';

describe('home e studio', () => {
  it('index.astro renderizza hero + sezioni', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Home);
    expect(html).toContain('bc-095.jpg');
  });

  it('studio.astro renderizza bio + team', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Studio);
    expect(html).toContain('bc-097.jpg');
  });
});
