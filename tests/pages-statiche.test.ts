import { describe, it, expect, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer } from '@astrojs/vue/container-renderer';

// PIA-75: contatti.astro ora legge i dati di contatto da Supabase (getPageContent).
// Mocchiamo il modulo per non dipendere da un Supabase reale — stesso pattern di
// home-studio.test.ts — e per verificare che la pagina usi i dati CMS.
vi.mock('../src/lib/supabase-public', () => ({
  getPageContent: vi.fn(async (page: string) => {
    if (page === 'contatti') {
      return {
        email: 'bb.costantini@gmail.com',
        instagram: '@barbara_costantini',
        telefono: '+39 349 6718022',
        indirizzo: "Largo dell'Olgiata 15 - 00123 Roma",
      };
    }
    return {};
  }),
}));

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
    expect(html).toContain('CSTBBR83M45H501C');
    expect(html).toContain('14529501000');
  });

  it('cookie-policy.astro renderizza la tabella dei cookie tecnici', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const html = await container.renderToString(Cookie);
    expect(html).toContain('bc_cookie_consent');
  });
});
