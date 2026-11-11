<script setup lang="ts">
import { ref } from 'vue'

interface Partner { titolo: string; immagine: string; testo: string }

const props = defineProps<{ modelValue: Partner[]; name: string }>()
const emit = defineEmits<{ 'update:modelValue': [Partner[]] }>()

const partner = ref<Partner[]>(JSON.parse(JSON.stringify(props.modelValue.length ? props.modelValue : [])))
const uploading = ref<Record<number, boolean>>({})

function update() { emit('update:modelValue', partner.value) }

function addPartner() {
  partner.value.push({ titolo: '', immagine: '', testo: '' })
  update()
}

function removePartner(i: number) {
  partner.value.splice(i, 1)
  update()
}

async function uploadImg(i: number, event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = { ...uploading.value, [i]: true }
  try {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('bucket', 'barbara-costantini-progetti')
    const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd })
    const json = await res.json()
    if (res.ok) {
      partner.value[i].immagine = json.url
      update()
    } else {
      alert('Errore upload: ' + json.error)
    }
  } finally {
    uploading.value = { ...uploading.value, [i]: false }
  }
}
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <input type="hidden" :name="name" :value="JSON.stringify(partner)" />

    <div v-for="(p, i) in partner" :key="i"
         class="border border-bc-black p-[20px] flex flex-col gap-[12px]">
      <div class="flex items-center justify-between">
        <p class="font-sans text-[11px] uppercase tracking-widest text-bc-black/40">
          Partner {{ i + 1 }}
        </p>
        <button type="button" @click="removePartner(i)"
                class="font-sans text-[12px] text-red-600 hover:underline">
          Rimuovi
        </button>
      </div>

      <label class="flex flex-col gap-[4px]">
        <span class="font-sans text-[13px]">Nome</span>
        <input v-model="p.titolo" @input="update"
               class="border border-bc-black px-[12px] py-[6px] font-sans text-[14px] font-light w-full" />
      </label>

      <div class="flex flex-col gap-[4px]">
        <span class="font-sans text-[13px] text-bc-black/50">Immagine</span>
        <div class="flex gap-[8px] items-center">
          <input v-model="p.immagine" @input="update"
                 class="border border-bc-black px-[12px] py-[6px] font-mono text-[12px] font-light flex-1 min-w-0" />
          <label class="bc-btn cursor-pointer shrink-0 text-[12px] py-[6px] px-[10px]">
            {{ uploading[i] ? '…' : 'Carica' }}
            <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden"
                   :disabled="uploading[i]" @change="uploadImg(i, $event)" />
          </label>
        </div>
        <img v-if="p.immagine && p.immagine.startsWith('http')"
             :src="p.immagine" alt="" class="mt-[4px] w-[80px] h-[60px] object-cover border border-bc-black/20" />
      </div>

      <label class="flex flex-col gap-[4px]">
        <span class="font-sans text-[13px]">Descrizione</span>
        <textarea v-model="p.testo" @input="update" :rows="3"
                  class="border border-bc-black px-[12px] py-[6px] font-sans text-[14px] font-light w-full resize-y" />
      </label>
    </div>

    <button type="button" @click="addPartner"
            class="bc-btn self-start">
      + Aggiungi partner
    </button>
  </div>
</template>
