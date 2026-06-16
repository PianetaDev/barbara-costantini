<!-- Figma: 590:1571 section5 — griglia 4 col, gap-x 24px / gap-y 48px -->
<!-- Card-vertical: img aspect 326/406 | Card-horizontal: img aspect 326/217 -->
<!-- Testo: PRJ (PS 14 light) + Committente (PS 14 light) + Nome (Garamond 24 semibold) -->
<script setup lang="ts">
interface Progetto {
  codice: string
  committente: string
  titolo: string
  slug: string
  image?: string
  tipo: 'vertical' | 'horizontal'
}

withDefaults(defineProps<{
  progetti?: Progetto[]
}>(), {
  progetti: () => [
    // Row 1: V H V H
    { codice: 'PRJ01', committente: 'Committente', titolo: 'Nome progetto', slug: 'prj-01', tipo: 'vertical' },
    { codice: 'PRJ02', committente: 'Committente', titolo: 'Nome progetto', slug: 'prj-02', tipo: 'horizontal' },
    { codice: 'PRJ03', committente: 'Committente', titolo: 'Nome progetto', slug: 'prj-03', tipo: 'vertical' },
    { codice: 'PRJ04', committente: 'Committente', titolo: 'Nome progetto', slug: 'prj-04', tipo: 'horizontal' },
    // Row 2: H V V H
    { codice: 'PRJ05', committente: 'Committente', titolo: 'Nome progetto', slug: 'prj-05', tipo: 'horizontal' },
    { codice: 'PRJ06', committente: 'Committente', titolo: 'Nome progetto', slug: 'prj-06', tipo: 'vertical' },
    { codice: 'PRJ07', committente: 'Committente', titolo: 'Nome progetto', slug: 'prj-07', tipo: 'vertical' },
    { codice: 'PRJ08', committente: 'Committente', titolo: 'Nome progetto', slug: 'prj-08', tipo: 'horizontal' },
    // Row 3: H H V V
    { codice: 'PRJ09', committente: 'Committente', titolo: 'Nome progetto', slug: 'prj-09', tipo: 'horizontal' },
    { codice: 'PRJ10', committente: 'Committente', titolo: 'Nome progetto', slug: 'prj-10', tipo: 'horizontal' },
    { codice: 'PRJ11', committente: 'Committente', titolo: 'Nome progetto', slug: 'prj-11', tipo: 'vertical' },
    { codice: 'PRJ12', committente: 'Committente', titolo: 'Nome progetto', slug: 'prj-12', tipo: 'vertical' },
  ]
})
</script>
<template>
  <section class="w-full px-bc-page py-bc-4xl">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-bc-2xl items-start">
      <NuxtLink
        v-for="p in progetti"
        :key="p.slug"
        :to="`/gallery/${p.slug}`"
        class="flex flex-col gap-[16px] group"
      >
        <!-- Immagine -->
        <div
          class="w-full bg-bc-black/10 overflow-hidden"
          :style="p.tipo === 'vertical' ? 'aspect-ratio: 326/406' : 'aspect-ratio: 326/217'"
        >
          <img
            v-if="p.image"
            :src="p.image"
            :alt="p.titolo"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <!-- Testo -->
        <div class="flex flex-col gap-[4px]">
          <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.028em]">{{ p.codice }}</p>
          <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.028em]">{{ p.committente }}</p>
          <p class="font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em]">{{ p.titolo }}</p>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
