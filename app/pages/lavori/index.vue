<!-- Figma: 590:1457 — Lavori: hero + archivio accordion -->
<script setup lang="ts">
interface Lavoro {
  id: string
  titolo: string
  committente: string
  slug: string
  descrizione?: string
  data?: string
  image?: string
}

const lavori: Lavoro[] = [
  {
    id: '01',
    titolo: 'Restauro testamenti',
    committente: 'Munda – Museo Nazionale d’Abruzzo',
    slug: 'restauro-testamenti',
  },
  {
    id: '02',
    titolo: 'Restauro conservativo dell\'Antico Archivio Regio',
    committente: 'Archivio di stato di Cagliari',
    slug: 'archivio-regio',
    descrizione: 'Il Restauro conservativo dell\'<em>Antico Archivio Regio</em>, si compone, in riferimento ai documenti in oggetto, di <strong>262 unità archivistiche</strong> comprese in un arco temporale che va dal 1381 al 1805',
    data: 'Mar 2023',
  },
  {
    id: '03',
    titolo: 'Intervento di restauro conservativo',
    committente: 'EUR Spa',
    slug: 'restauro-eur',
  },
  {
    id: '04',
    titolo: 'Titolo Lorem ipsum dolor',
    committente: 'Museo/Fondazione',
    slug: 'lavoro-04',
  },
  {
    id: '05',
    titolo: 'Titolo Lorem ipsum dolor',
    committente: 'Museo/Fondazione',
    slug: 'lavoro-05',
  },
  {
    id: '06',
    titolo: 'Titolo Lorem ipsum dolor',
    committente: 'Museo/Fondazione',
    slug: 'lavoro-06',
  },
  {
    id: '07',
    titolo: 'Titolo Lorem ipsum dolor',
    committente: 'Museo/Fondazione',
    slug: 'lavoro-07',
  },
  {
    id: '08',
    titolo: 'Titolo Lorem ipsum dolor',
    committente: 'Museo/Fondazione',
    slug: 'lavoro-08',
  },
  {
    id: '09',
    titolo: 'Titolo Lorem ipsum dolor',
    committente: 'Museo/Fondazione',
    slug: 'lavoro-09',
  },
  {
    id: '10',
    titolo: 'Titolo Lorem ipsum dolor',
    committente: 'Museo/Fondazione',
    slug: 'lavoro-10',
  },
]

const aperto = ref<string | null>(null)

function toggle(id: string) {
  aperto.value = aperto.value === id ? null : id
}
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="w-full border-b border-bc-black py-bc-4xl px-bc-page">
      <div class="flex flex-col items-center gap-bc-2xl text-center max-w-[908px] mx-auto">
        <h1 class="font-garamond text-bc-h1 font-semibold text-bc-black tracking-[0.02em]">
          I Lavori
        </h1>
        <p class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:28px; line-height:1.2; max-width:438px;">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.
        </p>
      </div>
    </section>

    <!-- ARCHIVIO -->
    <section class="w-full px-bc-page py-bc-4xl">
      <div class="max-w-[1142px] mx-auto flex flex-col gap-bc-2xl">
        <h2 class="font-garamond text-bc-h2 font-semibold text-bc-black tracking-[0.02em] text-center">
          Archivio lavori completo
        </h2>

        <div class="flex flex-col">
          <!-- Header riga -->
          <div class="border-b border-bc-black py-[24px] hidden md:flex gap-[24px] items-center">
            <p class="font-sans font-light text-bc-black tracking-[0.02em] w-[91px]" style="font-size:16px;">PRJ ID</p>
            <p class="font-sans font-light text-bc-black tracking-[0.02em] flex-1" style="font-size:16px;">Lavoro</p>
            <p class="font-sans font-light text-bc-black tracking-[0.02em] w-[209px]" style="font-size:16px;">Committente</p>
            <div class="w-[209px]" />
          </div>

          <!-- Righe lavori -->
          <div
            v-for="l in lavori"
            :key="l.id"
            class="border-b border-bc-black"
          >
            <!-- Riga principale -->
            <div class="flex gap-[24px] items-center py-[24px] cursor-pointer group" @click="l.descrizione ? toggle(l.id) : null">
              <p class="font-garamond font-normal text-bc-black tracking-[0.02em] w-[91px] shrink-0" style="font-size:22px; line-height:1.2;">
                {{ l.id }}
              </p>
              <p class="font-garamond font-semibold text-bc-black tracking-[0.02em] flex-1" style="font-size:24px; line-height:1.2;">
                {{ l.titolo }}
              </p>
              <p class="font-garamond font-normal text-bc-black tracking-[0.02em] w-[209px] hidden md:block" style="font-size:22px; line-height:1.2;">
                {{ l.committente }}
              </p>
              <div class="flex items-center gap-bc-md justify-end w-[209px] shrink-0">
                <NuxtLink
                  :to="`/lavori/${l.slug}`"
                  class="font-garamond font-normal text-bc-black underline underline-offset-2 hover:opacity-60 transition-opacity whitespace-nowrap"
                  style="font-size:18px;"
                  @click.stop
                >
                  Vedi di più
                </NuxtLink>
                <button
                  v-if="l.descrizione"
                  class="w-[40px] h-[40px] border border-bc-black flex items-center justify-center hover:bg-bc-black hover:text-white transition-colors shrink-0"
                  :aria-label="aperto === l.id ? 'Chiudi' : 'Apri'"
                  @click.stop="toggle(l.id)"
                >
                  <span class="text-xl leading-none">{{ aperto === l.id ? '−' : '+' }}</span>
                </button>
              </div>
            </div>

            <!-- Pannello espanso -->
            <Transition name="accordion">
              <div v-if="aperto === l.id && l.descrizione" class="pb-[64px]">
                <div class="flex gap-[24px] items-start">
                  <div class="flex flex-col gap-bc-md max-w-[560px]">
                    <p
                      class="font-garamond font-normal text-bc-black"
                      style="font-size:18px; line-height:1.2;"
                      v-html="l.descrizione"
                    />
                    <p
                      v-if="l.data"
                      class="font-garamond italic text-bc-black"
                      style="font-size:18px; line-height:1.2;"
                    >
                      {{ l.data }}
                    </p>
                  </div>
                  <div v-if="l.image" class="w-[207px] h-[258px] shrink-0 overflow-hidden">
                    <img :src="l.image" :alt="l.titolo" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-[207px] h-[258px] shrink-0 bg-bc-black/10" />
                </div>
              </div>
            </Transition>
          </div>

          <!-- Scopri di più -->
          <div class="flex justify-center pt-bc-4xl pb-bc-4xl">
            <button class="font-garamond font-normal text-bc-black border-b border-bc-black hover:opacity-60 transition-opacity" style="font-size:18px; line-height:1.2; padding-bottom:2px;">
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
  max-height: 400px;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
