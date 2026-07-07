<!-- Figma: 780:5242 — Lavori: hero split h1 sx + body dx, griglia card max-w-bc-wrap -->
<script setup lang="ts">
useHead({ title: 'Lavori — Barbara Costantini Restauro' })

const all = useProgetti()
const progetti = all.map(p => ({
  codice: `PRJ${p.id}`,
  committente: p.committente,
  titolo: p.titolo,
  slug: p.slug,
  tipo: p.tipo,
  image: p.immagini[0]?.src,
}))
</script>
<template>
  <div>
    <!-- Hero: h1 sx + body dx — Figma 780:5269 -->
    <section class="w-full px-[24px] tablet:px-bc-page border-b border-bc-black overflow-hidden">
      <div class="grid grid-cols-1 tablet:grid-cols-2 max-w-bc-wrap mx-auto w-full
                  py-[48px] tablet:py-[64px] gap-y-[32px] tablet:gap-y-0">
        <div v-reveal class="flex flex-col justify-start tablet:pr-[80px]">
          <h1 class="font-sans text-[28px] lg:text-bc-h1 font-normal text-bc-black tracking-[0.02em] leading-[1.5]">
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
