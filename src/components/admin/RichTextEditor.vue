<!--
  PATTERN DI RIFERIMENTO — isola Vue collegata a un form Astro senza genitore Vue.

  Questo componente stabilisce il pattern da riusare per i prossimi CRUD (Team, pagine
  di contenuto, ecc.): un'isola Astro/Vue (`client:load`/`client:idle`) montata dentro
  un <form> scritto in .astro puro non ha modo di far arrivare il proprio stato al
  submit handler via v-model/emit (Astro non inoltra gli emit Vue come eventi DOM — vedi
  commento più sotto). La soluzione è far sì che l'isola stessa renderizzi un
  <input type="hidden" :name :value> dentro il proprio template: essendo un discendente
  reale del <form> (Astro monta le isole in light DOM, non Shadow DOM), il suo valore
  arriva a `new FormData(form)` come qualunque altro campo nativo, senza bisogno di
  eventi globali o convenzioni ad hoc.

  Generalizzazione per campi non-stringa (es. `sezioni`/`immagini`, che sono
  array/oggetti): l'hidden input HTML può contenere solo testo, quindi va serializzato
  con `JSON.stringify(valore)` come `:value`, e il lato server (endpoint API o comunque
  chi legge `formData.get(...)`) deve fare `JSON.parse(...)` prima di validare con Zod.
  Questo componente non ne ha bisogno perché `intro` è già una stringa (HTML), ma un
  futuro editor per `sezioni`/`immagini` che segua lo stesso pattern dovrà aggiungere
  quel passaggio di (de)serializzazione.
-->
<template>
  <div>
    <div class="flex gap-bc-2xs mb-bc-2xs">
      <button type="button" @click="editor?.chain().focus().toggleBold().run()" class="bc-ghost">B</button>
      <button type="button" @click="editor?.chain().focus().toggleItalic().run()" class="bc-ghost">I</button>
    </div>
    <editor-content :editor="editor" class="border border-bc-black p-bc-sm min-h-[150px]" />
    <!--
      Perché un hidden input renderizzato QUI dentro, invece di un evento globale o di
      un v-model "vero": questo componente viene montato come isola Astro/Vue
      (`client:load`) dentro un <form> scritto in una pagina .astro semplice, non dentro
      un albero Vue — non esiste un componente padre Vue che possa ricevere
      `update:modelValue` via v-model. Astro non inoltra gli emit Vue come eventi DOM
      nativi (verificato: nessun riferimento a CustomEvent/dispatchEvent nel runtime
      client di Astro per gli island), quindi un listener nello <script> della pagina
      non potrebbe intercettare l'emit in alcun modo affidabile.
      La soluzione più semplice e verificabile: il componente stesso possiede un
      <input type="hidden" :name :value>, che essendo mount-ato come discendente reale
      del <form> (Astro esegue il render dell'isola in light DOM, senza Shadow DOM —
      verificato in astro-island.prebuilt.js) diventa un vero campo del form. Quando
      l'utente scrive nell'editor, `currentValue` si aggiorna e Vue riflette il nuovo
      valore sulla proprietà `.value` dell'input; al submit, `new FormData(form)` legge
      quella proprietà esattamente come per qualsiasi altro input nativo — nessun
      collegamento aggiuntivo richiesto lato pagina.
    -->
    <input type="hidden" :name="name" :value="currentValue" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import { ref, watch, onBeforeUnmount } from 'vue';

const props = withDefaults(defineProps<{ modelValue: string; name?: string }>(), {
  name: 'intro',
});
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

// Stato interno: la "fonte di verità" del contenuto HTML corrente. Non ci si può
// affidare a `props.modelValue` per gli aggiornamenti dopo il mount iniziale — non
// avendo un vero genitore Vue non torna mai ad aggiornarsi da solo, va gestito qui.
const currentValue = ref(props.modelValue);

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    currentValue.value = editor.getHTML();
    emit('update:modelValue', currentValue.value);
  },
});

// Permette comunque un uso "idiomatico" (v-model) nei casi in cui questo componente
// venga effettivamente montato dentro un albero Vue reale (es. un test con
// @vue/test-utils, o un futuro editor più ricco che lo compone come figlio).
watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
      editor.value.commands.setContent(value, false);
      currentValue.value = value;
    }
  }
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>
