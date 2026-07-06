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
  titoloSize?: string
  paragrafoSize?: string
  cardTitoloSize?: string
  borderTop?: boolean
  borderBottom?: boolean
}>(), {
  titolo: 'I lavori',
  ctaLabel: 'Esplora i lavori →',
  titoloSize: undefined,
  paragrafoSize: undefined,
  cardTitoloSize: undefined,
  borderTop: false,
  borderBottom: true,
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
  <section class="w-full px-bc-page overflow-hidden" :class="{ 'border-t border-bc-black': props.borderTop, 'border-b border-bc-black': props.borderBottom }">
    <div class="grid grid-cols-1 lg:grid-cols-2 py-bc-2xl lg:py-[80px] max-w-bc-wrap mx-auto w-full">

      <!-- Testo + CTA: centrato nella colonna sx -->
      <div class="flex items-center">
      <div
        v-reveal
        class="flex flex-col gap-bc-xl items-start w-full lg:pl-[117px] lg:pr-[40px]"
      >
        <p class="font-sans font-light text-bc-black tracking-[0.02em]" :class="!props.paragrafoSize ? 'text-bc-body1' : ''" :style="props.paragrafoSize ? `font-size:${props.paragrafoSize}` : ''">
          I lavori dello studio si destreggiano tra carta forbice sasso.... Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <NuxtLink to="/lavori" class="bc-ghost">{{ props.ctaLabel }}</NuxtLink>
      </div>
      </div>

      <!-- Card desktop: 3 card fisse, no carousel -->
      <div class="hidden lg:flex gap-[24px] items-start">
        <NuxtLink
          v-for="(p, i) in progetti"
          :key="p.slug"
          v-reveal="{ delay: `${i * 0.08}s` }"
          :to="`/lavori/${p.slug}`"
          class="flex-1 min-w-0 flex flex-col gap-bc-md items-start group"
        >
          <div
            class="relative w-full overflow-hidden bg-bc-black/10 ring-0 group-hover:ring-1 group-hover:ring-bc-black transition-shadow"
            :class="p.tipo === 'horizontal' ? 'aspect-[3/2]' : 'aspect-[4/5]'"
          >
            <img v-if="p.image" :src="p.image" :alt="p.titolo"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div class="flex flex-col gap-[4px]">
            <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]">{{ p.codice }}</p>
            <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]">{{ p.committente }}</p>
            <p class="font-garamond font-medium text-bc-black tracking-[0.02em] group-hover:underline" :class="!props.cardTitoloSize ? 'text-bc-h4' : ''" :style="props.cardTitoloSize ? `font-size:${props.cardTitoloSize}` : ''">{{ p.titolo }}</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Card mobile/tablet: carousel con swipe touch -->
      <div class="lg:hidden flex flex-col gap-bc-md flex-1 min-w-0">
        <!-- Previous / Next sopra, destra -->
        <div class="flex justify-end items-center gap-[8px]">
          <button
            class="flex items-center justify-center w-[44px] h-[44px] hover:opacity-60 transition-opacity disabled:opacity-25"
            :disabled="startIndex === 0"
            @click="prev"
            aria-label="Precedente"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/></svg>
          </button>
          <button
            class="flex items-center justify-center w-[44px] h-[44px] hover:opacity-60 transition-opacity disabled:opacity-25"
            :disabled="startIndex >= maxIndex"
            @click="next"
            aria-label="Successivo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/></svg>
          </button>
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
                <p class="font-garamond font-medium text-bc-black tracking-[0.02em] group-hover:underline" :class="!props.cardTitoloSize ? 'text-bc-h4' : ''" :style="props.cardTitoloSize ? `font-size:${props.cardTitoloSize}` : ''">{{ p.titolo }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
