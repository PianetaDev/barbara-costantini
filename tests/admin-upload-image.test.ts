// tests/admin-upload-image.test.ts
//
// Copre l'endpoint di upload immagine (Task 14): whitelist bucket, validazione
// MIME/size, autenticazione. Prima di questo file l'endpoint non aveva nessun test
// automatico, pur essendo l'unica vera superficie di attacco nuova introdotta dal
// task (un chiamante autenticato su questo sito potrebbe altrimenti scrivere in un
// bucket di un altro cliente sullo stesso progetto Supabase condiviso).
//
// Stesso pattern di mock di tests/admin-utenti.test.ts: createSupabaseServerClient
// mockato, nessun bisogno di un Supabase reale. vi.hoisted perché vi.mock è issato
// in cima al file.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetUser, mockStorageFrom } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockStorageFrom: vi.fn(),
}));
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    storage: { from: mockStorageFrom },
  })),
}));

import { POST } from '../src/pages/api/admin/upload-image';

function buildRequest(fields: Record<string, FormDataEntryValue>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return new Request('http://localhost/api/admin/upload-image', {
    method: 'POST',
    body: formData,
  });
}

describe('POST /api/admin/upload-image', () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockStorageFrom.mockReset();
  });

  it('ritorna 401 se non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const file = new File(['contenuto'], 'foto.png', { type: 'image/png' });
    const request = buildRequest({ file, bucket: 'barbara-costantini-team' });

    const res = await POST({ request, cookies: {} } as any);

    expect(res.status).toBe(401);
    expect(mockStorageFrom).not.toHaveBeenCalled();
  });

  // Regressione di sicurezza: il progetto Supabase è condiviso con altri
  // siti/clienti (bucket reali verificati dal vivo: apotheke-products,
  // apotheke-media, media, atlas-documents, segnale-screenshots) — senza questa
  // whitelist un chiamante autenticato su QUESTO sito potrebbe scrivere nello
  // storage di un altro cliente passando un bucket arbitrario nel FormData.
  it('ritorna 400 se il bucket non è nella whitelist (es. bucket di un altro cliente sullo stesso progetto Supabase)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    const file = new File(['contenuto'], 'foto.png', { type: 'image/png' });
    const request = buildRequest({ file, bucket: 'apotheke-products' });

    const res = await POST({ request, cookies: {} } as any);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Bucket non valido');
    expect(mockStorageFrom).not.toHaveBeenCalled();
  });

  it('ritorna 400 se il tipo MIME non è tra quelli consentiti (es. PDF)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    const file = new File(['contenuto'], 'documento.pdf', { type: 'application/pdf' });
    const request = buildRequest({ file, bucket: 'barbara-costantini-team' });

    const res = await POST({ request, cookies: {} } as any);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Tipo file non valido');
    expect(mockStorageFrom).not.toHaveBeenCalled();
  });

  it('ritorna 400 se il file supera i 10MB', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    const contenutoGrande = new Uint8Array(10 * 1024 * 1024 + 1);
    const file = new File([contenutoGrande], 'foto-grande.png', { type: 'image/png' });
    const request = buildRequest({ file, bucket: 'barbara-costantini-team' });

    const res = await POST({ request, cookies: {} } as any);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('File troppo grande (max 10MB)');
    expect(mockStorageFrom).not.toHaveBeenCalled();
  });

  it('con bucket whitelisted + MIME valido + size ok, carica il file e ritorna 200 con l\'url pubblico', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    const mockUpload = vi.fn().mockResolvedValue({ data: { path: 'abc-foto.png' }, error: null });
    const mockGetPublicUrl = vi.fn().mockReturnValue({
      data: { publicUrl: 'https://fmplfkzqexaposaamgwi.supabase.co/storage/v1/object/public/barbara-costantini-team/abc-foto.png' },
    });
    mockStorageFrom.mockReturnValue({ upload: mockUpload, getPublicUrl: mockGetPublicUrl });

    const file = new File(['contenuto'], 'foto.png', { type: 'image/png' });
    const request = buildRequest({ file, bucket: 'barbara-costantini-team' });

    const res = await POST({ request, cookies: {} } as any);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.url).toBe('https://fmplfkzqexaposaamgwi.supabase.co/storage/v1/object/public/barbara-costantini-team/abc-foto.png');
    expect(mockStorageFrom).toHaveBeenCalledWith('barbara-costantini-team');
    // Il file ricevuto da `mockUpload` non è la stessa istanza di `file`: passando per
    // FormData (multipart), `request.formData()` ricostruisce un nuovo oggetto File
    // (stesso nome/tipo/contenuto, ma identità e `lastModified` diversi) — verifichiamo
    // quindi nome/tipo del secondo argomento invece di un'uguaglianza per riferimento.
    expect(mockUpload).toHaveBeenCalledTimes(1);
    const [calledFileName, calledFile] = mockUpload.mock.calls[0];
    expect(calledFileName).toContain('foto.png');
    expect(calledFile).toBeInstanceOf(File);
    expect(calledFile.name).toBe('foto.png');
    expect(calledFile.type).toBe('image/png');
  });
});
