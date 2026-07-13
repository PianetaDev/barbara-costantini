import { describe, it, expect, vi, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/vue/container-renderer';

// PIA-75: contatti.astro legge i dati di contatto da Supabase (getPageContent).
// PIA-76: privacy-policy.astro e cookie-policy.astro leggono html_body da CMS.
// Mocchiamo il modulo con vi.hoisted così ogni test può sovrascrivere l'implementazione
// di default — stesso pattern di home-studio.test.ts.
const { mockGetPageContent } = vi.hoisted(() => ({ mockGetPageContent: vi.fn() }));

vi.mock('../src/lib/supabase-public', () => ({
  getPageContent: mockGetPageContent,
}));

import Contatti from '../src/pages/contatti.astro';
import Privacy from '../src/pages/privacy-policy.astro';
import Cookie from '../src/pages/cookie-policy.astro';

beforeEach(() => {
  mockGetPageContent.mockReset();
  mockGetPageContent.mockImplementation(async (page: string) => {
    if (page === 'contatti') {
      return {
        email: 'bb.costantini@gmail.com',
        instagram: '@barbara_costantini',
        telefono: '+39 349 6718022',
        indirizzo: "Largo dell'Olgiata 15 - 00123 Roma",
      };
    }
    return {};
  });
});

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
    expect(html).toContain('CSTBBR83M45H501C');
    expect(html).toContain('14529501000');
  });

  it('cookie-policy.astro renderizza la tabella dei cookie tecnici', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Cookie);
    expect(html).toContain('bc_cookie_consent');
  });

  // PIA-76: CMS html_body
  it('privacy-policy.astro legge html_body da CMS quando disponibile', async () => {
    mockGetPageContent.mockImplementation(async (page: string) => {
      if (page === 'privacy-policy') return { html_body: '<p>Privacy content from CMS</p>' };
      return {};
    });
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Privacy);
    expect(html).toContain('Privacy content from CMS');
  });

  it('privacy-policy.astro usa markup statico quando html_body è vuoto', async () => {
    mockGetPageContent.mockImplementation(async () => ({ html_body: '' }));
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Privacy);
    expect(html).not.toContain('Privacy content from CMS');
    expect(html.length).toBeGreaterThan(500); // ha contenuto statico reale
  });

  it('cookie-policy.astro legge html_body da CMS quando disponibile', async () => {
    mockGetPageContent.mockImplementation(async (page: string) => {
      if (page === 'cookie-policy') return { html_body: '<p>Cookie content from CMS</p>' };
      return {};
    });
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Cookie);
    expect(html).toContain('Cookie content from CMS');
  });

  it('cookie-policy.astro usa markup statico quando html_body è vuoto', async () => {
    mockGetPageContent.mockImplementation(async () => ({ html_body: '' }));
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Cookie);
    expect(html).not.toContain('Cookie content from CMS');
    expect(html.length).toBeGreaterThan(500);
  });
});
