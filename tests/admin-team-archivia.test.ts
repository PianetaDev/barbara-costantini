// tests/admin-team-archivia.test.ts
//
// DELETE /api/admin/team/[id] e /api/admin/progetti/[id]: eliminazione definitiva.
// Regole: solo admin di questo sito, solo elementi già archiviati, errore visibile se
// la cancellazione non colpisce nessuna riga, immagini rimosse dallo Storage.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGetUser, mockFrom, mockMaybeSingle, mockDeleteSelect, mockIsAdmin, mockRemove } = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockFrom: vi.fn(),
  mockMaybeSingle: vi.fn(),
  mockDeleteSelect: vi.fn(),
  mockIsAdmin: vi.fn(),
  mockRemove: vi.fn(),
}));
vi.mock('../src/lib/admin-roles', () => ({ checkIsAdmin: mockIsAdmin, checkIsSuperadmin: vi.fn(async () => true) }));
vi.mock('../src/lib/supabase', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  })),
  createSupabaseAdminClient: vi.fn(() => ({
    storage: { from: vi.fn(() => ({ remove: mockRemove })) },
  })),
}));

import { DELETE as DELETE_TEAM } from '../src/pages/api/admin/team/[id]';
import { DELETE as DELETE_PROGETTO } from '../src/pages/api/admin/progetti/[id]';

const ID = '22222222-2222-4222-8222-222222222222';
const STORAGE = 'https://xyz.supabase.co/storage/v1/object/public';
const ctx = (id = ID) => ({ params: { id }, request: new Request('http://localhost', { method: 'DELETE' }), cookies: {} }) as any;

beforeEach(() => {
  [mockGetUser, mockFrom, mockMaybeSingle, mockDeleteSelect, mockIsAdmin, mockRemove].forEach((m) => m.mockReset());
  mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
  mockIsAdmin.mockResolvedValue(true);
  mockRemove.mockResolvedValue({ error: null });
  mockDeleteSelect.mockResolvedValue({ data: [{ id: ID }], error: null });
  mockFrom.mockReturnValue({
    select: () => ({ eq: () => ({ maybeSingle: mockMaybeSingle }) }),
    delete: () => ({ eq: () => ({ select: mockDeleteSelect }) }),
  });
});

describe('DELETE /api/admin/team/[id]', () => {
  it('elimina definitivamente un membro archiviato e rimuove la sua foto dallo Storage', async () => {
    mockMaybeSingle.mockResolvedValue({ data: { id: ID, archiviato: true, foto_url: `${STORAGE}/barbara-costantini-team/abc-foto.jpg` }, error: null });
    const res = await DELETE_TEAM(ctx());
    expect(res.status).toBe(200);
    expect(mockFrom).toHaveBeenCalledWith('bc_team_members');
    expect(mockRemove).toHaveBeenCalledWith(['abc-foto.jpg']);
  });

  it('rifiuta (409) se il membro non è archiviato: prima si archivia, poi si elimina', async () => {
    mockMaybeSingle.mockResolvedValue({ data: { id: ID, archiviato: false, foto_url: '' }, error: null });
    const res = await DELETE_TEAM(ctx());
    expect(res.status).toBe(409);
    expect(mockDeleteSelect).not.toHaveBeenCalled();
  });

  it('ritorna 404 se il membro non esiste', async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });
    expect((await DELETE_TEAM(ctx())).status).toBe(404);
  });

  it('ritorna 404 per un id che non è un uuid, senza interrogare il database', async () => {
    expect((await DELETE_TEAM(ctx('membro-1'))).status).toBe(404);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('ritorna 401 se non autenticato', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const res = await DELETE_TEAM(ctx());
    expect(res.status).toBe(401);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it('ritorna 403 se loggato ma non admin di questo sito (progetto Supabase condiviso)', async () => {
    mockIsAdmin.mockResolvedValue(false);
    const res = await DELETE_TEAM(ctx());
    expect(res.status).toBe(403);
    expect(mockFrom).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/admin/progetti/[id]', () => {
  const progetto = {
    id: ID,
    archiviato: true,
    immagini: [{ src: `${STORAGE}/barbara-costantini-progetti/uno.jpg`, label: '' }, { src: '/images/bc-001.jpg', label: '' }],
    blocks: [{ type: 'image', src: `${STORAGE}/barbara-costantini-progetti/due.jpg` }, { type: 'text', content: 'ciao' }],
    // Un bucket di un altro sito sullo stesso progetto non va mai toccato.
    immagini_contenuto: [`${STORAGE}/apotheke-products/altro.jpg`],
  };

  it('elimina un lavoro archiviato e rimuove solo le immagini dei bucket di questo sito', async () => {
    mockMaybeSingle.mockResolvedValue({ data: progetto, error: null });
    const res = await DELETE_PROGETTO(ctx());
    expect(res.status).toBe(200);
    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(mockRemove.mock.calls[0][0].sort()).toEqual(['due.jpg', 'uno.jpg']);
  });

  it('rifiuta (409) se il lavoro non è archiviato', async () => {
    mockMaybeSingle.mockResolvedValue({ data: { ...progetto, archiviato: false }, error: null });
    const res = await DELETE_PROGETTO(ctx());
    expect(res.status).toBe(409);
    expect(mockDeleteSelect).not.toHaveBeenCalled();
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('se la cancellazione non colpisce nessuna riga risponde con errore (non "ok") e non tocca le immagini', async () => {
    mockMaybeSingle.mockResolvedValue({ data: progetto, error: null });
    mockDeleteSelect.mockResolvedValue({ data: [], error: null });
    const res = await DELETE_PROGETTO(ctx());
    expect(res.status).toBe(403);
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('ritorna 403 se loggato ma non admin di questo sito', async () => {
    mockIsAdmin.mockResolvedValue(false);
    expect((await DELETE_PROGETTO(ctx())).status).toBe(403);
    expect(mockFrom).not.toHaveBeenCalled();
  });
});
