<!-- Figma: 590:1396 — section2 "I lavori" — border-bottom, 3 card mix vertical/horizontal -->
<!-- Tablet 590:2197: flex-row, text sx + (prev/next sopra + 2 card) dx -->
<!-- Mobile 590:1897: flex-col stacked, prev/next sopra le card -->
<script setup lang="ts">
interface Progetto {
  codice: string
  committente: string
  titolo: string
  slug: string
  image?: string
  tipo?: 'vertical' | 'horizontal'
}

const props = withDefaults(defineProps<{
  progetti?: Progetto[]
  titolo?: string
  ctaLabel?: string
}>(), {
  titolo: 'I lavori',
  ctaLabel: 'Esplora i lavori',
  progetti: () => [
    { codice: '01', committente: 'Archivio di stato di Cagliari', titolo: "Restauro conservativo dell'Antico Archivio Regio", slug: 'archivio-regio', tipo: 'vertical', image: '/images/bc-059.jpg' },
    { codice: '02', committente: "Munda – Museo Nazionale d'Abruzzo", titolo: 'Restauro testamenti', slug: 'restauro-testamenti', tipo: 'horizontal', image: '/images/bc-060.jpg' },
    { codice: '03', committente: 'EUR Spa', titolo: 'Intervento di restauro conservativo', slug: 'restauro-eur', tipo: 'vertical', image: '/images/bc-025.jpg' },
  ]
})

const carouselEl = ref<HTMLElement>()
const startIndex = ref(0)
const offset = ref(0)
const maxIndex = computed(() => Math.max(0, props.progetti.length - 2))

onMounted(() => {
  window.addEventListener('resize', () => nextTick(updateOffset))
})

function cardWidth() {
  if (!carouselEl.value) return 0
  return (carouselEl.value.offsetWidth - 16) / 2
}

function updateOffset() {
  offset.value = -(startIndex.value * (cardWidth() + 16))
}

function prev() { if (startIndex.value > 0) { startIndex.value--; updateOffset() } }
function next() { if (startIndex.value < maxIndex.value) { startIndex.value++; updateOffset() } }

const touchStartX = ref(0)
function onTouchStart(e: TouchEvent) { touchStartX.value = e.touches[0].clientX }
function onTouchEnd(e: TouchEvent) {
  const delta = touchStartX.value - e.changedTouches[0].clientX
  if (Math.abs(delta) < 40) return
  if (delta > 0) next()
  else prev()
}
</script>
<template>
  <section class="w-full border-b border-bc-black px-bc-page overflow-hidden">
    <div class="mx-auto max-w-bc-content
                flex flex-col md:flex-row md:items-start
                gap-bc-xl md:gap-bc-2xl lg:gap-0 lg:justify-between
                py-bc-2xl lg:py-bc-4xl lg:items-center">

      <!-- Testo + CTA -->
      <div
        v-reveal
        class="flex flex-col gap-bc-xl items-start md:shrink-0 md:w-[240px] lg:w-[327px]"
      >
        <div class="flex flex-col gap-bc-xl">
          <h2 class="font-garamond text-bc-h2 font-semibold text-bc-black tracking-[0.02em]">{{ props.titolo }}</h2>
          <p class="font-garamond text-bc-body1 font-normal text-bc-black tracking-[0.02em]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac.
          </p>
        </div>
        <NuxtLink to="/lavori" class="bc-btn">{{ props.ctaLabel }}</NuxtLink>
      </div>

      <!-- Card desktop: 3 card fisse, no carousel -->
      <div class="hidden lg:flex gap-[24px] items-start">
        <NuxtLink
          v-for="(p, i) in progetti"
          :key="p.slug"
          v-reveal="{ delay: `${i * 0.08}s` }"
          :to="`/lavori/${p.slug}`"
          class="flex flex-col gap-bc-md items-start group"
          :class="p.tipo === 'horizontal' ? 'w-[210px]' : 'w-[209px]'"
        >
          <div
            class="relative w-full overflow-hidden bg-bc-black/10 ring-0 group-hover:ring-1 group-hover:ring-bc-black transition-shadow"
            :class="p.tipo === 'horizontal' ? 'aspect-[209/139]' : 'aspect-[209/260]'"
          >
            <img v-if="p.image" :src="p.image" :alt="p.titolo"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="flex flex-col gap-[4px]">
            <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]">{{ p.codice }}</p>
            <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]">{{ p.committente }}</p>
            <p class="font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em] group-hover:underline">{{ p.titolo }}</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Card mobile/tablet: carousel con swipe touch -->
      <div class="lg:hidden flex flex-col gap-bc-md flex-1 min-w-0">
        <!-- Previous / Next sopra, destra -->
        <div class="flex justify-end items-center gap-bc-md">
          <button
            class="font-garamond text-bc-body2 font-normal text-bc-black tracking-[0.02em] hover:opacity-60 transition-opacity disabled:opacity-25"
            :disabled="startIndex === 0"
            @click="prev"
          >Previous</button>
          <span class="font-garamond text-bc-body2 text-bc-black">/</span>
          <button
            class="font-garamond text-bc-body2 font-normal text-bc-black tracking-[0.02em] hover:opacity-60 transition-opacity disabled:opacity-25"
            :disabled="startIndex >= maxIndex"
            @click="next"
          >Next</button>
        </div>
        <!-- Track con slide animato -->
        <div
          ref="carouselEl"
          class="overflow-hidden"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
        >
          <div
            class="flex gap-[16px] items-start transition-transform duration-500 ease-out"
            :style="{ transform: `translateX(${offset}px)` }"
          >
            <NuxtLink
              v-for="p in progetti"
              :key="p.slug"
              :to="`/lavori/${p.slug}`"
              class="flex-none flex flex-col gap-bc-md items-start group w-[calc(50%-8px)]"
            >
              <div
                class="relative w-full overflow-hidden bg-bc-black/10 ring-0 group-hover:ring-1 group-hover:ring-bc-black transition-shadow"
                :class="p.tipo === 'horizontal' ? 'aspect-[3/2]' : 'aspect-[2/3]'"
              >
                <img v-if="p.image" :src="p.image" :alt="p.titolo"
                  class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div class="flex flex-col gap-[4px]">
                <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]">{{ p.codice }}</p>
                <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]">{{ p.committente }}</p>
                <p class="font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em] group-hover:underline">{{ p.titolo }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
