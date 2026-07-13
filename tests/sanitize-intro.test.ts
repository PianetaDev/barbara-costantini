// tests/sanitize-intro.test.ts
import { describe, it, expect } from 'vitest';
import { sanitizeIntroHtml } from '../src/lib/sanitize-intro';

describe('sanitizeIntroHtml', () => {
  it('lascia intatto l\'HTML che Tiptap/StarterKit può produrre', () => {
    const html = '<p>Testo <strong>forte</strong> e <em>corsivo</em>.</p><ul><li>Punto</li></ul>';
    expect(sanitizeIntroHtml(html)).toBe(html);
  });

  it('rimuove tag pericolosi (script, img con onerror)', () => {
    const html = '<p>Testo</p><script>alert(1)</script><img src=x onerror="alert(1)">';
    expect(sanitizeIntroHtml(html)).toBe('<p>Testo</p>');
  });

  it('rimuove attributi anche su tag consentiti (nessun attributo è nell\'allowlist)', () => {
    const html = '<p onclick="alert(1)" style="color:red">Testo</p>';
    expect(sanitizeIntroHtml(html)).toBe('<p>Testo</p>');
  });

  it('rimuove link (nessuna estensione Link in StarterKit di default)', () => {
    const html = '<p>Testo <a href="javascript:alert(1)">click</a></p>';
    expect(sanitizeIntroHtml(html)).toBe('<p>Testo click</p>');
  });
});
