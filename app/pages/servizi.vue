<!-- Figma: 590:2491 — Servizi -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })

interface Servizio {
  titolo: string
  corpo: string
}

interface Gruppo {
  titolo: string
  image: string
  servizi: Servizio[]
}

const gruppi: Gruppo[] = [
  {
    titolo: 'Beni Archivistici e Librari',
    image: '/images/bc-059.jpg',
    servizi: [
      { titolo: 'Servizio 1', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 2', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula. Pellentesque ornare ullamcorper lorem, sit amet hendrerit purus molestie sed.' },
      { titolo: 'Servizio 3', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 4', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
    ],
  },
  {
    titolo: 'Opere d’arte su carta',
    image: '/images/bc-060.jpg',
    servizi: [
      { titolo: 'Servizio 1', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 2', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 3', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 4', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
    ],
  },
  {
    titolo: 'Materiali fotografici',
    image: '/images/bc-025.jpg',
    servizi: [
      { titolo: 'Servizio 1', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 2', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 3', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 4', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
    ],
  },
  {
    titolo: 'Servizi trasversali',
    image: '/images/bc-027.jpg',
    servizi: [
      { titolo: 'Progettazione', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Redazione di condition report', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Spolveratura ordinaria e straordinaria', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Ricognizione conservativa di fondi e collezioni', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
    ],
  },
]

const partner = [
  {
    titolo: 'Cornici',
    image: '/images/bc-003.jpg',
    testo: 'Collaboriamo con il laboratorio di incorniciatura Pierluigi Ferro Cornici. Tale collaborazione consente di integrare gli interventi conservativi soluzioni espositive e di montaggio di altissimo livello, compatibili con esigenze di tutela, valorizzazione e sicurezza delle opere.',
  },
  {
    titolo: 'Fotografia',
    image: '/images/bc-026.jpg',
    testo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac.',
  },
  {
    titolo: 'Diagnostica',
    image: '/images/bc-038.jpg',
    testo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac.',
  },
]

// Accordion
const aperto = ref<Record<number, number>>({ 0: 0, 1: 0, 2: 0, 3: 0 })
function toggle(g: number, i: number) {
  aperto.value = { ...aperto.value, [g]: aperto.value[g] === i ? -1 : i }
}

// Carousel partner (come SectionTeam)
const isMobile = ref(false)
const partnerCarouselEl = ref<HTMLElement>()
const partnerStart = ref(0)
const partnerOffset = ref(0)

onMounted(() => {
  const mq = window.matchMedia('(max-width: 767px)')
  isMobile.value = mq.matches
  mq.addEventListener('change', (e: MediaQueryListEvent) => {
    isMobile.value = e.matches
    nextTick(updatePartnerOffset)
  })
  window.addEventListener('resize', () => nextTick(updatePartnerOffset))
})

const partnerVisible = computed(() => isMobile.value ? 1 : 2)
const partnerMax = computed(() => Math.max(0, partner.length - partnerVisible.value))

watch(partnerMax, (max) => {
  if (partnerStart.value > max) { partnerStart.value = max; updatePartnerOffset() }
})

function partnerCardWidth() {
  if (!partnerCarouselEl.value) return 0
  const w = partnerCarouselEl.value.offsetWidth
  return partnerVisible.value === 1 ? w : (w - 16) / 2
}
function updatePartnerOffset() {
  partnerOffset.value = -(partnerStart.value * (partnerCardWidth() + 16))
}
function partnerPrev() { if (partnerStart.value > 0) { partnerStart.value--; updatePartnerOffset() } }
function partnerNext() { if (partnerStart.value < partnerMax.value) { partnerStart.value++; updatePartnerOffset() } }

const touchStartX = ref(0)
function onTouchStart(e: TouchEvent) { touchStartX.value = e.touches[0].clientX }
function onTouchEnd(e: TouchEvent) {
  const delta = touchStartX.value - e.changedTouches[0].clientX
  if (Math.abs(delta) < 40) return
  if (delta > 0) partnerNext()
  else partnerPrev()
}
</script>

<template>
  <!-- Hero: stessa struttura di home/studio senza immagine -->
  <section class="border-b border-bc-black px-bc-page py-[64px] flex flex-col items-center text-center">
    <h1
      v-reveal
      class="font-sans text-[28px] md:text-[34px] lg:text-bc-h1 font-medium text-bc-black tracking-[0.02em] max-w-[908px] mb-[24px]"
    >
      I servizi
    </h1>
    <p
      v-reveal="{ delay: '0.12s' }"
      class="font-garamond text-bc-body1 font-light text-bc-black max-w-[440px]"
    >
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.
    </p>
  </section>

  <!-- Gruppi accordion -->
  <section
    v-for="(gruppo, g) in gruppi"
    :key="g"
    class="border-b border-bc-black px-bc-page overflow-hidden"
  >
    <div class="mx-auto max-w-bc-content
                flex flex-col md:flex-row md:items-start
                py-bc-2xl md:py-0
                gap-bc-xl md:gap-[80px] xl:gap-[140px]">

      <!-- Immagine sx -->
      <div v-reveal class="flex items-start md:flex-1 xl:flex-none xl:shrink-0 min-w-0 md:py-[64px]">
        <div class="w-full xl:w-[442px] aspect-[442/553] bg-bc-black/10 overflow-hidden">
          <img :src="gruppo.image" :alt="gruppo.titolo" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Titolo + Accordion dx -->
      <div v-reveal="{ delay: '0.12s' }" class="flex flex-col md:flex-1 xl:flex-none xl:w-[556px] min-w-0 md:py-[64px]">
        <h2
          class="font-garamond text-bc-black tracking-[0.02em] mb-[32px]"
          style="font-size:20px; line-height:1.5; font-weight:700;"
        >{{ gruppo.titolo }}</h2>

        <div
          v-for="(s, i) in gruppo.servizi"
          :key="i"
          class="border-b border-bc-black"
        >
          <button
            class="w-full flex items-center justify-between py-[24px] text-left cursor-pointer"
            @click="toggle(g, i)"
          >
            <span class="font-garamond font-medium text-bc-black tracking-[0.02em]"
                  style="font-size:20px; line-height:1.5;">{{ s.titolo }}</span>
            <span
              class="shrink-0 w-[40px] h-[40px] flex items-center justify-center transition-transform duration-300"
              :style="aperto[g] === i ? 'transform:rotate(45deg)' : ''"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="10" y1="0" x2="10" y2="20" stroke="black" stroke-width="1.5"/>
                <line x1="0" y1="10" x2="20" y2="10" stroke="black" stroke-width="1.5"/>
              </svg>
            </span>
          </button>
          <div class="sv-acc-body" :class="aperto[g] === i ? 'sv-acc-open' : ''">
            <div class="sv-acc-inner">
              <p class="font-garamond font-light text-bc-black tracking-[0.02em]"
                 style="font-size:20px; line-height:1.5;">{{ s.corpo }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- Partner: 3 colonne desktop, carousel mobile/tablet -->
  <section class="border-b border-bc-black px-bc-page overflow-hidden">

    <!-- Desktop: 3 colonne con divider verticali -->
    <div class="hidden lg:flex lg:items-stretch mx-auto max-w-bc-content">
      <template v-for="(p, i) in partner" :key="`d-${i}`">
        <div v-if="i > 0" class="w-px bg-bc-black self-stretch shrink-0 mx-[40px]" />
        <div
          v-reveal="{ delay: `${i * 0.1}s` }"
          class="flex flex-col gap-[32px] flex-1 py-[64px]"
        >
          <div class="w-full bg-bc-black/10 overflow-hidden" style="aspect-ratio:327/407;">
            <img v-if="p.image" :src="p.image" :alt="p.titolo" class="w-full h-full object-cover" />
          </div>
          <div class="flex flex-col gap-bc-md">
            <h3 class="font-garamond font-medium text-bc-black tracking-[0.02em]"
                style="font-size:24px; line-height:1.5;">{{ p.titolo }}</h3>
            <p class="font-garamond font-light text-bc-black tracking-[0.02em]"
               style="font-size:16px; line-height:1.5;">{{ p.testo }}</p>
          </div>
        </div>
      </template>
    </div>

    <!-- Mobile + Tablet: carousel -->
    <div class="lg:hidden mx-auto max-w-bc-content py-bc-2xl">
      <div class="flex flex-col gap-bc-md">
        <div class="flex justify-end items-center gap-[8px]">
          <button
            class="flex items-center justify-center w-[44px] h-[44px] hover:opacity-60 transition-opacity disabled:opacity-25"
            :disabled="partnerStart === 0"
            @click="partnerPrev"
            aria-label="Precedente"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/></svg>
          </button>
          <button
            class="flex items-center justify-center w-[44px] h-[44px] hover:opacity-60 transition-opacity disabled:opacity-25"
            :disabled="partnerStart >= partnerMax"
            @click="partnerNext"
            aria-label="Successivo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/></svg>
          </button>
        </div>
        <div
          ref="partnerCarouselEl"
          class="overflow-hidden"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
        >
          <div
            class="flex gap-[16px] items-start transition-transform duration-500 ease-out"
            :style="{ transform: `translateX(${partnerOffset}px)` }"
          >
            <div
              v-for="(p, i) in partner"
              :key="i"
              class="flex-none flex flex-col gap-[32px] w-full md:w-[calc(50%-8px)]"
            >
              <div class="w-full bg-bc-black/10 overflow-hidden" style="aspect-ratio:327/407;">
                <img v-if="p.image" :src="p.image" :alt="p.titolo" class="w-full h-full object-cover" />
              </div>
              <div class="flex flex-col gap-bc-md">
                <h3 class="font-garamond font-medium text-bc-black tracking-[0.02em]"
                    style="font-size:24px; line-height:1.5;">{{ p.titolo }}</h3>
                <p class="font-garamond font-light text-bc-black tracking-[0.02em]"
                   style="font-size:16px; line-height:1.5;">{{ p.testo }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>

  <!-- CTA finale -->
  <section class="px-bc-page py-[64px] flex flex-col items-center gap-bc-2xl text-center">
    <p v-reveal class="font-garamond font-medium text-bc-black tracking-[0.02em]"
       style="font-size:20px; line-height:1.5; max-width:442px;">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.
    </p>
    <NuxtLink v-reveal="{ delay: '0.1s' }" to="/contatti" class="bc-btn">Contatta lo studio</NuxtLink>
  </section>
</template>

<style>
/* ── Accordion: animazione apertura/chiusura ─────────────── */
.sv-acc-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.35s ease;
}
.sv-acc-body.sv-acc-open {
  grid-template-rows: 1fr;
}
.sv-acc-inner {
  overflow: hidden;
  min-height: 0;
  padding-bottom: 0;
  transition: padding-bottom 0.35s ease;
}
.sv-acc-body.sv-acc-open .sv-acc-inner {
  padding-bottom: 48px;
}
</style>
