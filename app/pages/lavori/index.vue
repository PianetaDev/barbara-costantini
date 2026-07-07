<!-- Figma: 780:5242 — Lavori: hero split h1 sx + body dx, griglia card max-w-bc-wrap -->
<script setup lang="ts">
useHead({ title: 'Lavori — Barbara Costantini Restauro' })

const progetti = [
  { codice: 'PRJ01', committente: 'Archivio di stato di Cagliari', titolo: "Restauro conservativo dell'Antico Archivio Regio", slug: 'archivio-regio', tipo: 'horizontal' as const, image: '/images/bc-059.jpg' },
  { codice: 'PRJ02', committente: "Munda – Museo Nazionale d'Abruzzo", titolo: 'Restauro testamenti', slug: 'restauro-testamenti', tipo: 'vertical' as const, image: '/images/bc-060.jpg' },
  { codice: 'PRJ03', committente: 'EUR Spa', titolo: 'Intervento di restauro conservativo', slug: 'restauro-eur', tipo: 'horizontal' as const, image: '/images/bc-025.jpg' },
  { codice: 'PRJ04', committente: 'Comune di Roma', titolo: 'Restauro su pergamena medievale', slug: 'restauro-pergamena', tipo: 'vertical' as const, image: '/images/bc-027.jpg' },
  { codice: 'PRJ05', committente: 'Biblioteca Nazionale', titolo: 'Restauro codice miniato', slug: 'restauro-codice', tipo: 'horizontal' as const, image: '/images/bc-026.jpg' },
  { codice: 'PRJ06', committente: 'Museo Nazionale', titolo: 'Conservazione mappe storiche', slug: 'restauro-mappe', tipo: 'vertical' as const, image: '/images/bc-038.jpg' },
  { codice: 'PRJ07', committente: 'Soprintendenza Roma', titolo: 'Restauro carteggio diplomatico', slug: 'restauro-carteggio', tipo: 'horizontal' as const, image: '/images/bc-003.jpg' },
  { codice: 'PRJ08', committente: 'Archivio Vaticano', titolo: 'Restauro atti notarili', slug: 'restauro-atti', tipo: 'vertical' as const, image: '/images/bc-040.jpg' },
  { codice: 'PRJ09', committente: 'Fondazione Prada', titolo: 'Conservazione documenti novecenteschi', slug: 'restauro-fondazione', tipo: 'horizontal' as const, image: '/images/bc-070.jpg' },
  { codice: 'PRJ10', committente: 'Università di Bologna', titolo: 'Restauro incunaboli', slug: 'restauro-incunaboli', tipo: 'vertical' as const, image: '/images/bc-025.jpg' },
  { codice: 'PRJ11', committente: 'Ministero della Cultura', titolo: 'Conservazione planimetrie storiche', slug: 'restauro-planimetrie', tipo: 'horizontal' as const, image: '/images/bc-059.jpg' },
  { codice: 'PRJ12', committente: 'Città del Vaticano', titolo: 'Restauro manoscritti pontifici', slug: 'restauro-manoscritti', tipo: 'vertical' as const, image: '/images/bc-060.jpg' },
]
</script>
<template>
  <div>
    <!-- Hero: h1 sx + body dx — Figma 780:5269 -->
    <section class="w-full px-[24px] tablet:px-bc-page border-b border-bc-black overflow-hidden">
      <div class="grid grid-cols-1 tablet:grid-cols-2 max-w-bc-wrap mx-auto w-full
                  py-[48px] tablet:py-[64px] gap-y-[32px] tablet:gap-y-0">
        <div v-reveal class="flex flex-col justify-start tablet:pr-[80px]">
          <h1 class="font-sans text-[32px] lg:text-bc-h1 font-normal text-bc-black tracking-[0.02em] leading-[1.5]">
            I lavori&nbsp;&nbsp;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel.
          </h1>
        </div>
        <div class="flex items-start justify-center tablet:pl-[40px] lg:pl-0">
          <div v-reveal="{ delay: '0.15s' }" class="lg:w-[442px] tablet:pt-[12px] lg:pt-[18px]">
            <p class="font-sans text-bc-body1 font-light text-bc-black tracking-[0.02em] leading-[1.5]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Griglia progetti — Figma 780:5243 -->
    <section class="w-full px-[24px] tablet:px-bc-page pt-[48px] tablet:pt-[64px] pb-[64px] tablet:pb-[80px]">
      <div class="max-w-bc-wrap mx-auto w-full
                  grid grid-cols-1 sm:grid-cols-2 tablet:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 bc:grid-cols-6
                  gap-x-[16px] tablet:gap-x-[24px] gap-y-bc-2xl items-start">
        <NuxtLink
          v-for="(p, i) in progetti"
          :key="i"
          :to="`/lavori/${p.slug}`"
          v-reveal="{ delay: `${Math.min(i % 6, 3) * 0.07}s` }"
          class="flex flex-col gap-[16px] group text-left"
        >
          <div
            class="w-full bg-bc-black/10 overflow-hidden ring-0 group-hover:ring-1 group-hover:ring-bc-black transition-shadow"
            :style="p.tipo === 'vertical' ? 'aspect-ratio:209/260' : 'aspect-ratio:209/139'"
          >
            <img
              v-if="p.image"
              :src="p.image"
              :alt="p.titolo"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div class="flex flex-col gap-[4px]">
            <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.028em]">{{ p.codice }}</p>
            <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.028em]">{{ p.committente }}</p>
            <p class="font-garamond text-bc-h4 font-normal text-bc-black tracking-[0.02em] group-hover:underline">{{ p.titolo }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
