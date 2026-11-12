<script setup lang="ts">
import { ref } from 'vue'
import { caricaImmagine } from '../../lib/client/upload-immagine'

interface Servizio { titolo: string; corpo: string }
interface Gruppo { titolo: string; immagine: string; servizi: Servizio[] }

const props = defineProps<{ modelValue: Gruppo[]; name: string }>()
const emit = defineEmits<{ 'update:modelValue': [Gruppo[]] }>()

const gruppi = ref<Gruppo[]>(JSON.parse(JSON.stringify(props.modelValue.length ? props.modelValue : [])))
const uploading = ref<Record<number, boolean>>({})

function update() { emit('update:modelValue', gruppi.value) }

function addGruppo() {
  gruppi.value.push({ titolo: '', immagine: '', servizi: [{ titolo: '', corpo: '' }] })
  update()
}

function removeGruppo(gi: number) {
  gruppi.value.splice(gi, 1)
  update()
}

function addServizio(gi: number) {
  gruppi.value[gi].servizi.push({ titolo: '', corpo: '' })
  update()
}

function removeServizio(gi: number, si: number) {
  gruppi.value[gi].servizi.splice(si, 1)
  update()
}

async function uploadImg(gi: number, event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = { ...uploading.value, [gi]: true }
  try {
    gruppi.value[gi].immagine = await caricaImmagine(file, 'barbara-costantini-progetti')
    update()
  } catch (err) {
    alert((err as Error).message)
  } finally {
    uploading.value = { ...uploading.value, [gi]: false }
  }
}
</script>

<template>
  <div class="flex flex-col gap-[24px]">
    <input type="hidden" :name="name" :value="JSON.stringify(gruppi)" />

    <div v-for="(gruppo, gi) in gruppi" :key="gi"
         class="border border-bc-black p-[24px] flex flex-col gap-[16px]">

      <div class="flex items-center justify-between">
        <p class="font-sans text-[11px] uppercase tracking-widest text-bc-black/40">
          Gruppo {{ gi + 1 }}
        </p>
        <button type="button" @click="removeGruppo(gi)"
                class="font-sans text-[12px] text-red-600 hover:underline">
          Rimuovi
        </button>
      </div>

      <label class="flex flex-col gap-[4px]">
        <span class="font-sans text-[13px]">Titolo sezione</span>
        <input v-model="gruppo.titolo" @input="update"
               class="border border-bc-black px-[12px] py-[6px] font-sans text-[14px] font-light w-full" />
      </label>

      <div class="flex flex-col gap-[4px]">
        <span class="font-sans text-[13px] text-bc-black/50">Immagine</span>
        <div class="flex gap-[8px] items-center">
          <input v-model="gruppo.immagine" @input="update"
                 class="border border-bc-black px-[12px] py-[6px] font-mono text-[12px] font-light flex-1 min-w-0" />
          <label class="bc-btn cursor-pointer shrink-0 text-[12px] py-[6px] px-[10px]">
            {{ uploading[gi] ? '…' : 'Carica' }}
            <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden"
                   :disabled="uploading[gi]" @change="uploadImg(gi, $event)" />
          </label>
        </div>
        <img v-if="gruppo.immagine && gruppo.immagine.startsWith('http')"
             :src="gruppo.immagine" alt="" class="mt-[4px] w-[80px] h-[60px] object-cover border border-bc-black/20" />
      </div>

      <!-- Voci del gruppo -->
      <div class="flex flex-col gap-[12px] pl-[20px] border-l-2 border-bc-black/10 mt-[8px]">
        <p class="font-sans text-[11px] uppercase tracking-widest text-bc-black/30">Voci</p>

        <div v-for="(s, si) in gruppo.servizi" :key="si"
             class="flex flex-col gap-[8px] pb-[12px] border-b border-bc-black/10 last:border-0">
          <div class="flex items-center justify-between">
            <span class="font-sans text-[12px] text-bc-black/40">Voce {{ si + 1 }}</span>
            <button type="button" @click="removeServizio(gi, si)"
                    class="font-sans text-[12px] text-red-600 hover:underline">×</button>
          </div>
          <input v-model="s.titolo" @input="update" placeholder="Titolo voce"
                 class="border border-bc-black px-[12px] py-[6px] font-sans text-[14px] font-light w-full" />
          <textarea v-model="s.corpo" @input="update" placeholder="Descrizione" :rows="3"
                    class="border border-bc-black px-[12px] py-[6px] font-sans text-[14px] font-light w-full resize-y" />
        </div>

        <button type="button" @click="addServizio(gi)"
                class="font-sans text-[13px] font-light text-bc-black hover:underline text-left w-fit">
          + Aggiungi voce
        </button>
      </div>
    </div>

    <button type="button" @click="addGruppo"
            class="bc-btn self-start">
      + Aggiungi gruppo
    </button>
  </div>
</template>
