<!-- Stesso layout della Gallery ma le card navigano alla pagina dettaglio lavoro -->
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
    <!-- Hero: descrizione centrata -->
    <section class="w-full px-bc-page py-[64px]">
      <div class="mx-auto max-w-[908px] flex flex-col items-center text-center">
        <p v-reveal class="font-sans font-light text-bc-black tracking-[0.02em] max-w-[440px]" style="font-size: 20px;">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.
        </p>
      </div>
    </section>

    <!-- Griglia progetti -->
    <section class="w-full px-bc-page pb-[64px]">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-[24px] gap-y-bc-2xl items-start">
        <NuxtLink
          v-for="(p, i) in progetti"
          :key="i"
          :to="`/lavori/${p.slug}`"
          v-reveal="{ delay: `${Math.min(i, 3) * 0.07}s` }"
          class="flex flex-col gap-[16px] group text-left"
        >
          <div
            class="w-full bg-bc-black/10 overflow-hidden ring-0 group-hover:ring-1 group-hover:ring-bc-black transition-shadow"
            :style="p.tipo === 'vertical' ? 'aspect-ratio:326/406' : 'aspect-ratio:326/217'"
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
            <p class="font-garamond text-bc-black tracking-[0.02em] group-hover:underline" style="font-size: 20px; font-weight: 500;">{{ p.titolo }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
