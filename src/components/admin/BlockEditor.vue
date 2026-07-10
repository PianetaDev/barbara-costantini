<template>
  <div class="flex flex-col gap-[12px]">

    <!-- Lista blocchi -->
    <div v-if="blocks.length" class="flex flex-col gap-[12px]">
      <div v-for="(block, i) in blocks" :key="block._id"
           class="border border-bc-black">

        <!-- Header blocco -->
        <div class="flex items-center gap-[8px] px-[16px] py-[10px] border-b border-bc-black bg-bc-canvas">
          <span class="font-sans text-[11px] uppercase tracking-widest text-bc-black/50 flex-1">
            {{ labelOf(block.type) }}
          </span>
          <button @click="moveUp(i)" :disabled="i === 0" type="button"
                  class="w-[26px] h-[26px] flex items-center justify-center border border-bc-black text-[13px] disabled:opacity-20 hover:bg-bc-black hover:text-bc-canvas transition-colors">↑</button>
          <button @click="moveDown(i)" :disabled="i === blocks.length - 1" type="button"
                  class="w-[26px] h-[26px] flex items-center justify-center border border-bc-black text-[13px] disabled:opacity-20 hover:bg-bc-black hover:text-bc-canvas transition-colors">↓</button>
          <button @click="remove(i)" type="button"
                  class="w-[26px] h-[26px] flex items-center justify-center border border-red-500 text-red-500 text-[13px] hover:bg-red-500 hover:text-white transition-colors">✕</button>
        </div>

        <!-- H2 -->
        <div v-if="block.type === 'h2'" class="p-[16px]">
          <input v-model="block.content" placeholder="Titolo sezione"
                 class="w-full border border-bc-black px-[12px] py-[8px] font-sans text-[22px] font-normal" />
        </div>

        <!-- H3 -->
        <div v-else-if="block.type === 'h3'" class="p-[16px]">
          <input v-model="block.content" placeholder="Sottotitolo"
                 class="w-full border border-bc-black px-[12px] py-[8px] font-sans text-[17px] font-normal" />
        </div>

        <!-- Testo -->
        <div v-else-if="block.type === 'text'" class="p-[16px] flex flex-col gap-[8px]">
          <div class="flex gap-[6px]">
            <button type="button" @click="execCmd('bold')"
                    class="w-[28px] h-[28px] border border-bc-black font-sans font-bold text-[13px] hover:bg-bc-black hover:text-bc-canvas transition-colors">B</button>
            <button type="button" @click="execCmd('italic')"
                    class="w-[28px] h-[28px] border border-bc-black font-sans italic text-[13px] hover:bg-bc-black hover:text-bc-canvas transition-colors">I</button>
          </div>
          <div
            :ref="el => setEditorRef(i, el)"
            contenteditable="true"
            :data-placeholder="'Paragrafo...'"
            class="border border-bc-black px-[12px] py-[8px] font-sans text-[15px] font-light leading-relaxed min-h-[100px] focus:outline-none"
            @input="block.content = ($event.target as HTMLElement).innerHTML"
            v-html="block.content"
          />
        </div>

        <!-- Immagine singola -->
        <div v-else-if="block.type === 'image'" class="p-[16px] flex flex-col gap-[12px]">
          <img v-if="block.src" :src="block.src" class="max-h-[220px] object-contain bg-black/5" />
          <div class="flex items-center gap-[12px] flex-wrap">
            <label class="bc-btn cursor-pointer">
              {{ block.src ? 'Cambia immagine' : 'Carica immagine' }}
              <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden"
                     @change="uploadSingle(i, $event)" />
            </label>
            <select v-model="block.aspetto"
                    class="border border-bc-black px-[8px] py-[6px] font-sans text-[13px] font-light">
              <option value="h">Orizzontale</option>
              <option value="v">Verticale</option>
            </select>
            <span v-if="block._uploading" class="font-sans text-[13px] text-bc-black/50">Caricamento...</span>
          </div>
        </div>

        <!-- Doppia colonna -->
        <div v-else-if="block.type === 'images2'" class="p-[16px] flex gap-[16px]">
          <div class="flex-1 flex flex-col gap-[8px]">
            <img v-if="block.src1" :src="block.src1" class="w-full aspect-[4/5] object-cover bg-black/5" />
            <label class="bc-btn cursor-pointer text-center text-[13px]">
              {{ block.src1 ? 'Cambia' : '+ Sinistra' }}
              <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden"
                     @change="uploadDouble(i, 1, $event)" />
            </label>
          </div>
          <div class="flex-1 flex flex-col gap-[8px]">
            <img v-if="block.src2" :src="block.src2" class="w-full aspect-[4/5] object-cover bg-black/5" />
            <label class="bc-btn cursor-pointer text-center text-[13px]">
              {{ block.src2 ? 'Cambia' : '+ Destra' }}
              <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden"
                     @change="uploadDouble(i, 2, $event)" />
            </label>
          </div>
        </div>

        <!-- Citazione / Metodo -->
        <div v-else-if="block.type === 'quote'" class="p-[16px] flex flex-col gap-[12px]">
          <textarea v-model="block.text" rows="3" placeholder="Testo paragrafo..."
                    class="w-full border border-bc-black px-[12px] py-[8px] font-sans text-[15px] font-light resize-y" />
          <input v-model="block.citazione" placeholder='"Citazione in evidenza..."'
                 class="w-full border border-bc-black px-[12px] py-[8px] font-sans text-[15px] font-light italic" />
        </div>

      </div>
    </div>
    <p v-else class="font-sans text-[13px] text-bc-black/40 font-light">Nessun blocco. Aggiungine uno qui sotto.</p>

    <!-- Aggiungi blocco -->
    <div class="flex flex-wrap gap-[8px] pt-[4px]">
      <button v-for="t in types" :key="t.value" @click="add(t.value)" type="button"
              class="border border-bc-black px-[12px] py-[6px] font-sans text-[13px] font-light hover:bg-bc-black hover:text-bc-canvas transition-colors">
        + {{ t.label }}
      </button>
    </div>

    <input type="hidden" :name="name" :value="JSON.stringify(clean)" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{ name: string; modelValue: any[] }>();

type Block = {
  _id: string;
  type: string;
  content?: string;
  src?: string; src1?: string; src2?: string;
  aspetto?: string;
  text?: string;
  citazione?: string;
  _uploading?: boolean;
};

const types = [
  { value: 'h2',      label: 'H2 Titolo' },
  { value: 'h3',      label: 'H3 Sottotitolo' },
  { value: 'text',    label: 'Testo' },
  { value: 'image',   label: 'Immagine singola' },
  { value: 'images2', label: 'Doppia colonna' },
  { value: 'quote',   label: 'Citazione' },
];

const labelOf = (type: string) => types.find(t => t.value === type)?.label ?? type;

const blocks = ref<Block[]>(
  (props.modelValue || []).map((b: any) => ({ ...b, _id: Math.random().toString(36).slice(2) }))
);

// Riferimenti agli editor contenteditable per bold/italic
const editorRefs: Record<number, HTMLElement> = {};
function setEditorRef(i: number, el: any) { if (el) editorRefs[i] = el; }
function execCmd(cmd: string) { document.execCommand(cmd, false); }

function add(type: string) {
  const b: Block = { _id: Math.random().toString(36).slice(2), type };
  if (type === 'h2' || type === 'h3' || type === 'text') b.content = '';
  if (type === 'image') { b.src = ''; b.aspetto = 'h'; }
  if (type === 'images2') { b.src1 = ''; b.src2 = ''; }
  if (type === 'quote') { b.text = ''; b.citazione = ''; }
  blocks.value.push(b);
}

function remove(i: number) { blocks.value.splice(i, 1); }
function moveUp(i: number) {
  if (i === 0) return;
  [blocks.value[i-1], blocks.value[i]] = [blocks.value[i], blocks.value[i-1]];
}
function moveDown(i: number) {
  if (i === blocks.value.length - 1) return;
  [blocks.value[i], blocks.value[i+1]] = [blocks.value[i+1], blocks.value[i]];
}

async function uploadSingle(i: number, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  blocks.value[i]._uploading = true;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('bucket', 'barbara-costantini-progetti');
  const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd });
  const json = await res.json();
  if (res.ok) blocks.value[i].src = json.url;
  blocks.value[i]._uploading = false;
}

async function uploadDouble(i: number, side: 1 | 2, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const fd = new FormData();
  fd.append('file', file);
  fd.append('bucket', 'barbara-costantini-progetti');
  const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd });
  const json = await res.json();
  if (res.ok) {
    if (side === 1) blocks.value[i].src1 = json.url;
    else blocks.value[i].src2 = json.url;
  }
}

const clean = computed(() =>
  blocks.value.map(({ _id, _uploading, ...rest }) => rest)
);
</script>
