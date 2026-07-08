// @vitest-environment happy-dom
//
// Verifica reale (mount + interazione, non solo lettura del codice) del collegamento
// RichTextEditor↔form descritto nel Task 13: essendo montato come isola Astro/Vue
// dentro un <form> scritto in una pagina .astro semplice (nessun genitore Vue), il
// componente non può affidarsi a v-model per far arrivare il proprio valore al submit
// handler. La soluzione scelta è un <input type="hidden"> renderizzato dal componente
// stesso: questo test monta il componente DENTRO un vero <form>, digita nell'editor
// Tiptap (chiamando i suoi comandi reali, non un mock), e verifica che
// `new FormData(form)` — esattamente ciò che il submit handler della pagina usa —
// veda il nuovo contenuto HTML.
//
// Ambiente: solo questo file usa happy-dom (via il commento sopra), come anticipato
// dal commento in vitest.config.ts — gli altri test continuano a girare nell'ambiente
// di default (Astro Container API, nessun DOM), non toccati da questo cambiamento.
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import RichTextEditor from '../src/components/admin/RichTextEditor.vue';

describe('RichTextEditor collegato al form (hidden input)', () => {
  it('espone il valore iniziale nell\'hidden input dentro un vero <form>', async () => {
    const formEl = document.createElement('form');
    document.body.appendChild(formEl);

    const wrapper = mount(RichTextEditor, {
      attachTo: formEl,
      props: { modelValue: '<p>Intro iniziale</p>', name: 'intro' },
    });

    const hidden = formEl.querySelector('input[type="hidden"][name="intro"]') as HTMLInputElement;
    expect(hidden).toBeTruthy();
    expect(hidden.value).toBe('<p>Intro iniziale</p>');

    const formData = new FormData(formEl);
    expect(formData.get('intro')).toBe('<p>Intro iniziale</p>');

    wrapper.unmount();
    formEl.remove();
  });

  it('quando l\'utente scrive nell\'editor, il valore arriva nel FormData del form (submit reale)', async () => {
    const formEl = document.createElement('form');
    document.body.appendChild(formEl);

    const wrapper = mount(RichTextEditor, {
      attachTo: formEl,
      props: { modelValue: '<p>Testo originale</p>', name: 'intro' },
    });

    // Simula la digitazione dell'utente usando i comandi reali di Tiptap (lo stesso
    // meccanismo dietro toggleBold/toggleItalic nei pulsanti del componente), non un
    // mock del componente: questo esercita l'handler onUpdate reale.
    const editorInstance = (wrapper.vm as any).editor;
    editorInstance.commands.setContent('<p>Testo scritto dall\'utente nell\'editor</p>');
    await wrapper.vm.$nextTick();

    const hidden = formEl.querySelector('input[type="hidden"][name="intro"]') as HTMLInputElement;
    expect(hidden.value).toContain('Testo scritto dall\'utente nell\'editor');

    // Il submit handler della pagina (src/pages/admin/progetti/[id].astro) costruisce
    // il payload leggendo esattamente `new FormData(form).get('intro')`: verifichiamo
    // che questo, non un dettaglio interno del componente, produca il valore atteso.
    const formData = new FormData(formEl);
    expect(formData.get('intro')).toContain('Testo scritto dall\'utente nell\'editor');

    // Anche l'evento update:modelValue va emesso, per un eventuale uso idiomatico
    // futuro del componente dentro un vero albero Vue.
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();

    wrapper.unmount();
    formEl.remove();
  });
});
