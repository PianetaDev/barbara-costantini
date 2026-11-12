// src/lib/client/archivio.ts
// Azioni comuni a Lavori e Team nel pannello admin (solo browser):
//   archivia   → toglie dal sito, resta nell'elenco Archiviati (recuperabile)
//   ripristina → rimette sul sito
//   elimina    → cancella per sempre, solo da Archiviati (NON recuperabile)
// I pulsanti dichiarano l'azione con attributi data-*:
//   data-azione="archivia|ripristina|elimina"  data-endpoint="/api/admin/progetti/<id>"
//   data-nome="Titolo"  data-dopo="/admin/progetti?vista=archiviati" (facoltativo)
import { erroreRisposta } from './upload-immagine';

const PAROLA_CONFERMA = 'ELIMINA';

function mostraErrore(messaggio: string) {
  const el = document.getElementById('azione-errore');
  if (el) {
    el.textContent = messaggio;
    el.classList.remove('hidden');
    el.scrollIntoView({ block: 'nearest' });
  } else {
    alert(messaggio);
  }
}

async function esegui(btn: HTMLButtonElement) {
  const { azione, endpoint, nome = 'questo elemento', dopo } = btn.dataset;
  if (!azione || !endpoint) return;

  let init: RequestInit;
  if (azione === 'archivia') {
    if (!confirm(`Archiviare «${nome}»?\n\nSparisce dal sito ma resta nell'elenco Archiviati: puoi ripristinarlo quando vuoi.`)) return;
    init = { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ archiviato: true }) };
  } else if (azione === 'ripristina') {
    init = { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ archiviato: false }) };
  } else if (azione === 'elimina') {
    const risposta = prompt(
      `Eliminare definitivamente «${nome}»?\n\nTesti e immagini vengono cancellati per sempre e NON si possono recuperare.\n\nPer confermare scrivi ${PAROLA_CONFERMA}`,
    );
    if (risposta === null) return;
    if (risposta.trim().toUpperCase() !== PAROLA_CONFERMA) {
      mostraErrore(`Eliminazione annullata: per confermare bisogna scrivere ${PAROLA_CONFERMA}.`);
      return;
    }
    init = { method: 'DELETE' };
  } else {
    return;
  }

  btn.disabled = true;
  let res: Response;
  try {
    res = await fetch(endpoint, init);
  } catch {
    btn.disabled = false;
    mostraErrore('Operazione non riuscita: controlla la connessione e riprova.');
    return;
  }
  const errore = await erroreRisposta(res);
  if (errore) {
    btn.disabled = false;
    mostraErrore(errore);
    return;
  }
  if (dopo) window.location.href = dopo;
  else window.location.reload();
}

export function attivaAzioniArchivio() {
  document.querySelectorAll<HTMLButtonElement>('button[data-azione]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      void esegui(btn);
    });
  });
}
