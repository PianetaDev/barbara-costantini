<!-- Stesso layout della Gallery ma le card navigano alla pagina dettaglio lavoro -->
<script setup lang="ts">
useHead({ title: 'Lavori Bis — Barbara Costantini Restauro' })

const base = [
  { codice: '01', committente: 'Archivio di stato di Cagliari', titolo: "Restauro conservativo dell'Antico Archivio Regio", slug: 'archivio-regio', tipo: 'horizontal' as const, image: '/images/bc-059.jpg' },
  { codice: '02', committente: "Munda – Museo Nazionale d'Abruzzo", titolo: 'Restauro testamenti', slug: 'restauro-testamenti', tipo: 'vertical' as const, image: '/images/bc-060.jpg' },
  { codice: '03', committente: 'EUR Spa', titolo: 'Intervento di restauro conservativo', slug: 'restauro-eur', tipo: 'horizontal' as const, image: '/images/bc-025.jpg' },
]

// 12 card = 3 righe × 4 colonne su desktop
const progetti = [...base, ...base, ...base, ...base]
</script>
<template>
  <div>
    <!-- Hero: titolo + descrizione centrati -->
    <section class="w-full border-b border-bc-black px-bc-page py-[64px]">
      <div class="mx-auto max-w-[908px] flex flex-col items-center text-center" style="gap: 24px;">
        <h1 v-reveal class="font-garamond font-medium text-bc-black tracking-[0.02em] leading-[1.2]" style="font-size: 48px; font-weight: 500;">
          I lavori
        </h1>
        <p v-reveal="{ delay: '0.12s' }" class="font-garamond text-bc-sub font-normal text-bc-black tracking-[0.02em] max-w-[700px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>
    </section>

    <!-- Griglia progetti -->
    <section class="w-full px-bc-page py-[64px]">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-[24px] gap-y-bc-2xl items-start">
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
            <p class="font-garamond text-bc-h4 text-bc-black tracking-[0.02em] group-hover:underline" style="font-weight: 500;">{{ p.titolo }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
