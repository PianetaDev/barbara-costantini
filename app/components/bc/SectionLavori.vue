<!-- Figma: 590:1396 — section2 "I lavori" — border-bottom, 3 card mix vertical/horizontal -->
<script setup lang="ts">
interface Progetto {
  codice: string
  committente: string
  titolo: string
  slug: string
  image?: string
  tipo?: 'vertical' | 'horizontal'
}

withDefaults(defineProps<{
  progetti?: Progetto[]
}>(), {
  progetti: () => [
    { codice: 'PRJ01', committente: 'Committente', titolo: 'Nome progetto', slug: 'progetto-1', tipo: 'vertical' },
    { codice: 'PRJ01', committente: 'Committente', titolo: 'Nome progetto', slug: 'progetto-2', tipo: 'horizontal' },
    { codice: 'PRJ01', committente: 'Committente', titolo: 'Nome progetto', slug: 'progetto-3', tipo: 'vertical' },
  ]
})
</script>
<template>
  <section class="w-full border-b border-bc-black">
    <div class="mx-auto max-w-bc-content flex gap-[140px] items-center py-bc-4xl">
      <!-- Testo + CTA -->
      <div class="flex flex-col gap-bc-xl items-start shrink-0 w-[327px]">
        <div class="flex flex-col gap-bc-xl">
          <h2 class="font-garamond text-bc-h2 font-semibold text-bc-black tracking-[0.02em]">I lavori</h2>
          <p class="font-garamond text-bc-body1 font-normal text-bc-black tracking-[0.02em]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac.
          </p>
        </div>
        <NuxtLink to="/lavori" class="bc-btn">Esplora i lavori</NuxtLink>
      </div>
      <!-- Cards -->
      <div class="flex gap-[24px] items-end w-[676px]">
        <NuxtLink
          v-for="p in progetti"
          :key="p.slug"
          :to="`/lavori/${p.slug}`"
          class="flex flex-col gap-bc-md items-start group"
          :class="p.tipo === 'horizontal' ? 'w-[210px]' : 'w-[209px]'"
        >
          <div
            class="relative w-full overflow-hidden bg-bc-black/10"
            :class="p.tipo === 'horizontal' ? 'aspect-[209/139]' : 'aspect-[209/260]'"
          >
            <img
              v-if="p.image"
              :src="p.image"
              :alt="p.titolo"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div class="flex flex-col gap-[4px]">
            <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]">{{ p.codice }}</p>
            <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]">{{ p.committente }}</p>
            <p class="font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em]">{{ p.titolo }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
