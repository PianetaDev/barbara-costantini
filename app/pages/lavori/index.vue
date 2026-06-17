<!-- Figma: 590:1457 / 329:644 — Lavori: hero + archivio accordion -->
<script setup lang="ts">
interface Lavoro {
  id: string
  titolo: string
  committente: string
  slug: string
  descrizione: string
  data?: string
  image?: string
  hasDetail?: boolean
}

const PAGE_SIZE = 6

const tuttiILavori: Lavoro[] = [
  {
    id: "01",
    titolo: "Restauro conservativo dell'Antico Archivio Regio",
    committente: "Archivio di stato di Cagliari",
    slug: "archivio-regio",
    descrizione: "Il Restauro conservativo dell'<em>Antico Archivio Regio</em>, si compone, in riferimento ai documenti in oggetto, di <strong>262 unit\u00e0 archivistiche</strong> comprese in un arco temporale che va dal 1381 al 1805.",
    data: "Mar 2023",
    hasDetail: true,
  },
  {
    id: "02",
    titolo: "Restauro testamenti",
    committente: "Munda \u2013 Museo Nazionale d'Abruzzo",
    slug: "restauro-testamenti",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.",
    hasDetail: true,
  },
  {
    id: "03",
    titolo: "Intervento di restauro conservativo",
    committente: "EUR Spa",
    slug: "restauro-eur",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet.",
    hasDetail: true,
  },
  {
    id: "04",
    titolo: "Titolo Lorem ipsum dolor",
    committente: "Museo/Fondazione",
    slug: "lavoro-04",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.",
  },
  {
    id: "05",
    titolo: "Titolo Lorem ipsum dolor",
    committente: "Museo/Fondazione",
    slug: "lavoro-05",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.",
  },
  {
    id: "06",
    titolo: "Titolo Lorem ipsum dolor",
    committente: "Museo/Fondazione",
    slug: "lavoro-06",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.",
  },
  {
    id: "07",
    titolo: "Titolo Lorem ipsum dolor",
    committente: "Museo/Fondazione",
    slug: "lavoro-07",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.",
  },
  {
    id: "08",
    titolo: "Titolo Lorem ipsum dolor",
    committente: "Museo/Fondazione",
    slug: "lavoro-08",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.",
  },
  {
    id: "09",
    titolo: "Titolo Lorem ipsum dolor",
    committente: "Museo/Fondazione",
    slug: "lavoro-09",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.",
  },
  {
    id: "10",
    titolo: "Titolo Lorem ipsum dolor",
    committente: "Museo/Fondazione",
    slug: "lavoro-10",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.",
  },
  {
    id: "11",
    titolo: "Titolo Lorem ipsum dolor",
    committente: "Museo/Fondazione",
    slug: "lavoro-11",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.",
  },
  {
    id: "12",
    titolo: "Titolo Lorem ipsum dolor",
    committente: "Museo/Fondazione",
    slug: "lavoro-12",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.",
  },
  {
    id: "13",
    titolo: "Titolo Lorem ipsum dolor",
    committente: "Museo/Fondazione",
    slug: "lavoro-13",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.",
  },
  {
    id: "14",
    titolo: "Titolo Lorem ipsum dolor",
    committente: "Museo/Fondazione",
    slug: "lavoro-14",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.",
  },
  {
    id: "15",
    titolo: "Titolo Lorem ipsum dolor",
    committente: "Museo/Fondazione",
    slug: "lavoro-15",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.",
  },
  {
    id: "16",
    titolo: "Titolo Lorem ipsum dolor",
    committente: "Museo/Fondazione",
    slug: "lavoro-16",
    descrizione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.",
  },
]

const visibili = ref<number>(10)
const lavoriVisibili = computed(() => tuttiILavori.slice(0, visibili.value))
const haAltri = computed(() => visibili.value < tuttiILavori.length)

const aperto = ref<string | null>("01")

function toggle(id: string) {
  aperto.value = aperto.value === id ? null : id
}

function caricaAltri() {
  visibili.value = Math.min(visibili.value + PAGE_SIZE, tuttiILavori.length)
}
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="w-full border-b border-bc-black py-bc-4xl px-bc-page">
      <div class="flex flex-col items-center gap-bc-2xl text-center max-w-[908px] mx-auto">
        <h1 v-reveal class="font-garamond text-bc-h1 font-semibold text-bc-black tracking-[0.02em]">
          I Lavori
        </h1>
        <p v-reveal="{ delay: '0.12s' }" class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:28px; line-height:1.2; max-width:438px;">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.
        </p>
      </div>
    </section>

    <!-- ARCHIVIO -->
    <section class="w-full px-bc-page py-bc-4xl">
      <div class="max-w-[1142px] mx-auto flex flex-col gap-bc-2xl">
        <h2 v-reveal class="font-garamond text-bc-h2 font-semibold text-bc-black tracking-[0.02em] text-center">
          Archivio lavori completo
        </h2>

        <div class="flex flex-col">
          <!-- Header riga — mobile: PRJ ID / Titolo / Committente verticali -->
          <div class="border-b border-bc-black py-[24px] md:hidden flex flex-col gap-[8px]">
            <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px;">PRJ ID</p>
            <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px;">Titolo</p>
            <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px;">Committente</p>
          </div>
          <!-- Header riga — tablet (md → lg): Committente stacked sotto Lavoro -->
          <div class="border-b border-bc-black py-[24px] hidden md:flex lg:hidden gap-[24px] items-start">
            <p class="font-sans font-light text-bc-black tracking-[0.02em] w-[91px]" style="font-size:16px;">PRJ ID</p>
            <div class="flex flex-col gap-[8px] flex-1">
              <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px;">Lavoro</p>
              <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px;">Committente</p>
            </div>
            <div class="w-[209px]" />
          </div>
          <!-- Header riga — solo desktop (lg+): con colonna Committente -->
          <div class="border-b border-bc-black py-[24px] hidden lg:flex gap-[24px] items-center">
            <p class="font-sans font-light text-bc-black tracking-[0.02em] w-[91px]" style="font-size:16px;">PRJ ID</p>
            <p class="font-sans font-light text-bc-black tracking-[0.02em] flex-1" style="font-size:16px;">Lavoro</p>
            <p class="font-sans font-light text-bc-black tracking-[0.02em] w-[209px]" style="font-size:16px;">Committente</p>
            <div class="w-[209px]" />
          </div>

          <!-- Righe lavori -->
          <div
            v-for="l in lavoriVisibili"
            :key="l.id"
            v-reveal
            class="border-b border-bc-black"
          >
            <!-- Riga principale — MOBILE: stacked (ID+Azioni in cima, poi Titolo+Committente) -->
            <div class="md:hidden flex flex-col gap-[16px] py-[24px] cursor-pointer" @click="toggle(l.id)">
              <div class="flex items-center justify-between">
                <p class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:22px; line-height:1.2;">{{ l.id }}</p>
                <div class="flex items-center gap-bc-md">
                  <NuxtLink v-if="l.hasDetail" :to="`/lavori/${l.slug}`" class="font-garamond font-normal text-bc-black underline underline-offset-2 hover:font-semibold whitespace-nowrap" style="font-size:18px;" @click.stop>Vedi di più</NuxtLink>
                  <span v-else class="w-[80px]" />
                  <button class="w-[40px] h-[40px] flex items-center justify-center shrink-0 hover:opacity-60 transition-opacity" :aria-label="aperto === l.id ? 'Chiudi' : 'Apri'" @click.stop="toggle(l.id)">
                    <span class="font-garamond leading-none select-none" style="font-size:28px;">{{ aperto === l.id ? '−' : '+' }}</span>
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-[8px]">
                <p class="font-garamond font-semibold text-bc-black tracking-[0.02em]" style="font-size:24px; line-height:1.2;">{{ l.titolo }}</p>
                <p class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:22px; line-height:1.2;">{{ l.committente }}</p>
              </div>
            </div>
            <!-- Riga principale — TABLET+: colonne affiancate -->
            <div class="hidden md:flex gap-[24px] items-center py-[24px] cursor-pointer" @click="toggle(l.id)">
              <p class="font-garamond font-normal text-bc-black tracking-[0.02em] w-[91px] shrink-0" style="font-size:22px; line-height:1.2;">{{ l.id }}</p>
              <div class="flex-1 min-w-0 flex flex-col gap-[8px]">
                <p class="font-garamond font-semibold text-bc-black tracking-[0.02em]" style="font-size:24px; line-height:1.2;">{{ l.titolo }}</p>
                <p class="md:block lg:hidden font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:22px; line-height:1.2;">{{ l.committente }}</p>
              </div>
              <p class="hidden lg:block font-garamond font-normal text-bc-black tracking-[0.02em] w-[209px] shrink-0" style="font-size:22px; line-height:1.2;">{{ l.committente }}</p>
              <div class="flex items-center gap-bc-md justify-end w-[209px] shrink-0">
                <NuxtLink v-if="l.hasDetail" :to="`/lavori/${l.slug}`" class="font-garamond font-normal text-bc-black underline underline-offset-2 hover:font-semibold whitespace-nowrap" style="font-size:18px;" @click.stop>Vedi di più</NuxtLink>
                <span v-else class="w-[80px]" />
                <button class="w-[40px] h-[40px] flex items-center justify-center shrink-0 hover:opacity-60 transition-opacity" :aria-label="aperto === l.id ? 'Chiudi' : 'Apri'" @click.stop="toggle(l.id)">
                  <span class="font-garamond leading-none select-none" style="font-size:28px;">{{ aperto === l.id ? '−' : '+' }}</span>
                </button>
              </div>
            </div>

            <!-- Pannello espanso -->
            <Transition name="accordion">
              <div v-if="aperto === l.id" class="pb-[64px]">
                <!-- Desktop (lg+): allineato alle 4 colonne della riga -->
                <div class="hidden lg:flex gap-[24px] items-start">
                  <!-- Spazio colonna ID -->
                  <div class="w-[91px] shrink-0" />
                  <!-- Descrizione: sotto il Titolo -->
                  <div class="flex flex-col gap-bc-md flex-1 min-w-0">
                    <p
                      class="font-garamond font-normal text-bc-black"
                      style="font-size:18px; line-height:1.2;"
                      v-html="l.descrizione"
                    />
                    <p v-if="l.data" class="font-garamond italic text-bc-black" style="font-size:18px; line-height:1.2;">
                      {{ l.data }}
                    </p>
                  </div>
                  <!-- Immagine: sotto il Committente -->
                  <div class="w-[207px] h-[258px] shrink-0 overflow-hidden bg-bc-black/10">
                    <img v-if="l.image" :src="l.image" :alt="l.titolo" class="w-full h-full object-cover" />
                  </div>
                  <!-- Spazio colonna Azioni -->
                  <div class="w-[209px] shrink-0" />
                </div>
                <!-- Tablet (md → lg): descrizione allineata al Titolo, immagine allineata alle Azioni -->
                <div class="hidden md:flex lg:hidden gap-[24px] items-start">
                  <!-- Spazio colonna ID -->
                  <div class="w-[91px] shrink-0" />
                  <!-- Descrizione: flex-1, sotto il Titolo+Committente -->
                  <div class="flex flex-col gap-bc-md flex-1 min-w-0">
                    <p
                      class="font-garamond font-normal text-bc-black"
                      style="font-size:18px; line-height:1.2;"
                      v-html="l.descrizione"
                    />
                    <p v-if="l.data" class="font-garamond italic text-bc-black" style="font-size:18px; line-height:1.2;">
                      {{ l.data }}
                    </p>
                  </div>
                  <!-- Immagine: allineata alla colonna Azioni (destra) -->
                  <div class="w-[209px] h-[258px] shrink-0 overflow-hidden bg-bc-black/10">
                    <img v-if="l.image" :src="l.image" :alt="l.titolo" class="w-full h-full object-cover" />
                  </div>
                </div>
                <!-- Mobile: stack con immagine -->
                <div class="md:hidden flex flex-col gap-bc-md">
                  <p class="font-garamond font-normal text-bc-black" style="font-size:18px; line-height:1.2;" v-html="l.descrizione" />
                  <p v-if="l.data" class="font-garamond italic text-bc-black" style="font-size:18px; line-height:1.2;">{{ l.data }}</p>
                  <div class="w-[207px] h-[258px] overflow-hidden bg-bc-black/10">
                    <img v-if="l.image" :src="l.image" :alt="l.titolo" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Scopri di più: scompare quando finiscono gli elementi -->
          <div v-if="haAltri" class="flex justify-center pt-bc-4xl pb-bc-4xl">
            <button
              class="font-garamond font-normal text-bc-black border-b border-bc-black hover:font-semibold"
              style="font-size:18px; line-height:1.2; padding-bottom:2px;"
              @click="caricaAltri"
            >
              Scopri di più
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: opacity 0.25s ease, max-height 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
