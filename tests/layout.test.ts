import { describe, it, expect } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/vue/container-renderer';
import BaseLayout from '../src/layouts/BaseLayout.astro';

describe('BaseLayout', () => {
  it('renders html lang="it" and includes nav/footer landmarks', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const result = await container.renderToString(BaseLayout, {
      props: { title: 'Test' },
      slots: { default: '<p>contenuto</p>' },
    });
    expect(result).toContain('lang="it"');
    expect(result).toContain('<nav');
    expect(result).toContain('<footer');
  });

  it('idrata Nav e CookieBanner come isole client="load", ma non Footer', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const result = await container.renderToString(BaseLayout, {
      props: { title: 'Test' },
      slots: { default: '<p>contenuto</p>' },
    });

    const islandRegex = /<astro-island[^>]*component-url="([^"]*)"[^>]*client="([^"]*)"[^>]*>/g;
    const islands = [...result.matchAll(islandRegex)].map((m) => ({
      componentUrl: m[1],
      client: m[2],
    }));

    const navIsland = islands.find((i) => i.componentUrl.includes('Nav.vue'));
    const cookieIsland = islands.find((i) => i.componentUrl.includes('CookieBanner.vue'));

    expect(navIsland?.client).toBe('load');
    expect(cookieIsland?.client).toBe('load');
    // Footer.astro è statico: non deve mai comparire come isola idratata client-side
    expect(islands.some((i) => i.componentUrl.includes('Footer'))).toBe(false);
  });
});
