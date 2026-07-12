// tests/validation-progetto.test.ts
import { describe, it, expect } from 'vitest';
import { progettoSchema } from '../src/lib/validation/progetto';

describe('validazione progetto', () => {
  it('accetta un progetto valido', () => {
    const result = progettoSchema.safeParse({
      slug: 'nuovo-progetto',
      titolo: 'Restauro test',
      committente: 'Cliente Test',
      anno: '2026',
      tipo: 'horizontal',
      intro: 'Testo introduttivo',
      sezioni: [],
      immagini: [],
      ordine: 0,
    });
    expect(result.success).toBe(true);
  });

  it('rifiuta uno slug vuoto', () => {
    const result = progettoSchema.safeParse({
      slug: '',
      titolo: 'Restauro test',
      tipo: 'horizontal',
      sezioni: [],
      immagini: [],
      ordine: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rifiuta un tipo non valido', () => {
    const result = progettoSchema.safeParse({
      slug: 'test',
      titolo: 'Restauro test',
      tipo: 'diagonal',
      sezioni: [],
      immagini: [],
      ordine: 0,
    });
    expect(result.success).toBe(false);
  });

  // Regressione: verificato dal vivo contro Supabase reale che un PATCH parziale
  // (solo `intro`) tramite `progettoSchema.partial().safeParse(...)` — così come usato
  // in src/pages/api/admin/progetti/[id].ts — azzerava silenziosamente `ordine` in
  // bc_projects, perché `.default(0)` su un campo si applica anche quando il campo è
  // assente dall'input, PRIMA che `.partial()` lo renda "omissibile senza conseguenze".
  // `ordine` è quindi `.optional()` (non `.default()`) nello schema: la colonna DB ha
  // già `default 0` per il caso insert.
  it('un update parziale che omette ordine non lo inietta con un default (mai sovrascrivere ordine se non richiesto)', () => {
    const result = progettoSchema.partial().safeParse({ intro: '<p>solo intro</p>' });
    expect(result.success).toBe(true);
    expect(result.success && result.data).toEqual({ intro: '<p>solo intro</p>' });
    expect(result.success && 'ordine' in result.data).toBe(false);
  });

  it('accetta archiviato e immaginiContenuto (max 2 elementi)', () => {
    const result = progettoSchema.partial().safeParse({
      archiviato: true,
      immaginiContenuto: ['https://esempio.test/a.jpg', 'https://esempio.test/b.jpg'],
    });
    expect(result.success).toBe(true);
  });

  it('rifiuta immaginiContenuto con più di 2 elementi', () => {
    const result = progettoSchema.partial().safeParse({
      immaginiContenuto: ['a', 'b', 'c'],
    });
    expect(result.success).toBe(false);
  });

  it('un update parziale che omette archiviato non lo inietta con un default', () => {
    const result = progettoSchema.partial().safeParse({ titolo: 'Solo titolo' });
    expect(result.success).toBe(true);
    expect(result.success && 'archiviato' in result.data).toBe(false);
  });
});
