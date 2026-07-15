<template>
  <div class="flex flex-col gap-[16px]">

    <!-- Immagini esistenti -->
    <div v-if="images.length" class="flex flex-col divide-y divide-bc-black border border-bc-black">
      <div v-for="(img, i) in images" :key="img._id"
           class="flex items-center gap-[12px] px-[16px] py-[12px]">
        <img v-if="isRemote(img.src)" :src="img.src" class="w-[64px] h-[48px] object-cover shrink-0 bg-black/10" />
        <div v-else class="w-[64px] h-[48px] shrink-0 bg-black/10 flex items-center justify-center font-sans text-[10px] text-black/30 leading-tight text-center px-1">locale</div>
        <div class="flex-1 min-w-0">
          <select v-model="img.aspetto"
                  class="border border-bc-black px-[8px] py-[4px] font-sans text-[13px] font-light">
            <option value="h">Orizzontale</option>
            <option value="v">Verticale</option>
          </select>
        </div>
        <button @click="moveUp(i)" :disabled="i === 0" type="button"
                class="w-[28px] h-[28px] flex items-center justify-center border border-bc-black font-sans text-[14px] disabled:opacity-20 hover:bg-bc-black hover:text-bc-canvas transition-colors">↑</button>
        <button @click="moveDown(i)" :disabled="i === images.length - 1" type="button"
                class="w-[28px] h-[28px] flex items-center justify-center border border-bc-black font-sans text-[14px] disabled:opacity-20 hover:bg-bc-black hover:text-bc-canvas transition-colors">↓</button>
        <button @click="remove(i)" type="button"
                class="w-[28px] h-[28px] flex items-center justify-center border border-red-500 text-red-500 font-sans text-[14px] hover:bg-red-500 hover:text-white transition-colors">✕</button>
      </div>
    </div>
    <p v-else class="font-sans text-[13px] text-bc-black/40 font-light">Nessuna immagine nello slideshow.</p>

    <!-- Upload nuova -->
    <label class="bc-btn cursor-pointer inline-flex items-center gap-[8px] w-fit">
      <span v-if="!uploading">+ Aggiungi immagine</span>
      <span v-else>Caricamento...</span>
      <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden"
             :disabled="uploading" @change="upload($event)" />
    </label>
    <p v-if="uploadError" class="text-red-600 font-sans text-[13px]">{{ uploadError }}</p>

    <!-- Hidden input per il form -->
    <input type="hidden" :name="name" :value="JSON.stringify(clean)" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  name: string;
  modelValue: { src: string; label?: string; aspetto?: string }[];
}>();

type Img = { _id: string; src: string; label: string; aspetto: string };

const images = ref<Img[]>(
  (props.modelValue || []).map((img, i) => ({
    _id: String(i) + Math.random(),
    src: img.src,
    label: img.label ?? '',
    aspetto: img.aspetto ?? 'h',
  }))
);

const uploading = ref(false);
const uploadError = ref('');

async function upload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  uploading.value = true;
  uploadError.value = '';
  const fd = new FormData();
  fd.append('file', file);
  fd.append('bucket', 'barbara-costantini-progetti');
  const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd });
  const json = await res.json();
  if (res.ok) {
    images.value.push({ _id: Math.random().toString(36).slice(2), src: json.url, label: '', aspetto: 'h' });
  } else {
    uploadError.value = json.error ?? 'Errore upload';
  }
  uploading.value = false;
  (e.target as HTMLInputElement).value = '';
}

function isRemote(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://');
}

function remove(i: number) { images.value.splice(i, 1); }
function moveUp(i: number) {
  if (i === 0) return;
  [images.value[i - 1], images.value[i]] = [images.value[i], images.value[i - 1]];
}
function moveDown(i: number) {
  if (i === images.value.length - 1) return;
  [images.value[i], images.value[i + 1]] = [images.value[i + 1], images.value[i]];
}

const clean = computed(() => images.value.map(({ _id, ...rest }) => rest));
</script>
