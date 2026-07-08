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
});
