<script setup lang="ts">
import { ref } from 'vue'

interface Partner { titolo: string; immagine: string; testo: string }

const props = defineProps<{ modelValue: Partner[]; name: string }>()
const emit = defineEmits<{ 'update:modelValue': [Partner[]] }>()

const partner = ref<Partner[]>(JSON.parse(JSON.stringify(props.modelValue.length ? props.modelValue : [])))

function update() { emit('update:modelValue', partner.value) }

function addPartner() {
  partner.value.push({ titolo: '', immagine: '', testo: '' })
  update()
}

function removePartner(i: number) {
  partner.value.splice(i, 1)
  update()
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

      <label class="flex flex-col gap-[4px]">
        <span class="font-sans text-[13px] text-bc-black/50">Immagine (path es. /images/bc-003.jpg)</span>
        <input v-model="p.immagine" @input="update"
               class="border border-bc-black px-[12px] py-[6px] font-mono text-[12px] font-light w-full" />
      </label>

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
