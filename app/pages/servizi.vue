<!-- Figma: 590:2491 — Servizi -->
<script setup lang="ts">
definePageMeta({ layout: 'default' })

interface Servizio {
  titolo: string
  corpo: string
}

interface Gruppo {
  titolo: string
  descrizione: string
  servizi: Servizio[]
}

const gruppi: Gruppo[] = [
  {
    titolo: 'Beni Archivistici e Librari',
    descrizione: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac.',
    servizi: [
      { titolo: 'Servizio 1', corpo: '' },
      { titolo: 'Servizio 2', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula. Pellentesque ornare ullamcorper lorem, sit amet hendrerit purus molestie sed.' },
      { titolo: 'Servizio 3', corpo: '' },
      { titolo: 'Servizio 4', corpo: '' },
    ],
  },
  {
    titolo: 'Opere d\u2019arte su carta',
    descrizione: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac.',
    servizi: [
      { titolo: 'Servizio 1', corpo: '' },
      { titolo: 'Servizio 2', corpo: '' },
      { titolo: 'Servizio 3', corpo: '' },
      { titolo: 'Servizio 4', corpo: '' },
    ],
  },
  {
    titolo: 'Materiali fotografici',
    descrizione: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac.',
    servizi: [
      { titolo: 'Servizio 1', corpo: '' },
      { titolo: 'Servizio 2', corpo: '' },
      { titolo: 'Servizio 3', corpo: '' },
      { titolo: 'Servizio 4', corpo: '' },
    ],
  },
  {
    titolo: 'Servizi trasversali',
    descrizione: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac.',
    servizi: [
      { titolo: 'Progettazione', corpo: '' },
      { titolo: 'Redazione di condition report', corpo: '' },
      { titolo: 'Spolveratura ordinaria e straordinaria', corpo: '' },
      { titolo: 'Ricognizione conservativa di fondi e collezioni', corpo: '' },
    ],
  },
]

const partner = [
  {
    titolo: 'Cornici',
    testo: 'Collaboriamo con il laboratorio di incorniciatura Pierluigi Ferro Cornici. Tale collaborazione consente di integrare gli interventi conservativi soluzioni espositive e di montaggio di altissimo livello, compatibili con esigenze di tutela, valorizzazione e sicurezza delle opere.',
  },
  {
    titolo: 'Fotografia',
    testo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac.',
  },
  {
    titolo: 'Diagnostica',
    testo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac.',
  },
]

const aperto = ref<Record<number, number>>({ 0: 1 })

function toggle(g: number, i: number) {
  aperto.value = { ...aperto.value, [g]: aperto.value[g] === i ? -1 : i }
}
</script>

<template>
  <!-- Hero -->
  <section class="border-b border-bc-black px-bc-page py-bc-4xl flex flex-col items-center gap-bc-2xl text-center">
    <h1 class="font-garamond font-semibold text-bc-black tracking-[0.02em]"
        style="font-size:56px; line-height:1.2; max-width:908px;">
      I servizi
    </h1>
    <p class="font-garamond font-normal text-bc-black"
       style="font-size:28px; line-height:1.2; max-width:438px;">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.
    </p>
  </section>

  <!-- Gruppi accordion -->
  <section
    v-for="(gruppo, g) in gruppi"
    :key="g"
    class="border-b border-bc-black"
  >
    <div class="px-bc-page py-bc-4xl flex flex-col md:flex-row md:gap-bc-2xl lg:gap-[140px] md:justify-center">

      <!-- Categoria sx -->
      <div class="flex flex-col gap-bc-xl shrink-0 mb-bc-2xl md:mb-0 md:w-[240px] lg:w-[326px]">
        <h2 class="font-garamond font-semibold text-bc-black tracking-[0.02em]"
            style="font-size:38px; line-height:1.2;">{{ gruppo.titolo }}</h2>
        <p class="font-garamond font-normal text-bc-black tracking-[0.02em]"
           style="font-size:22px; line-height:1.2;">{{ gruppo.descrizione }}</p>
      </div>

      <!-- Accordion dx -->
      <div class="flex flex-col flex-1 lg:flex-none lg:w-[676px]">
        <div
          v-for="(s, i) in gruppo.servizi"
          :key="i"
          class="border-b border-bc-black"
        >
          <button
            class="w-full flex items-center justify-between py-[24px] text-left cursor-pointer"
            @click="toggle(g, i)"
          >
            <span class="font-garamond font-semibold text-bc-black tracking-[0.02em]"
                  style="font-size:24px; line-height:1.2;">{{ s.titolo }}</span>
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
          <div v-if="aperto[g] === i && s.corpo" class="pb-bc-2xl">
            <p class="font-garamond font-normal text-bc-black tracking-[0.02em]"
               style="font-size:22px; line-height:1.2;">{{ s.corpo }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- Partner: 3 colonne con divisori -->
  <section class="border-b border-bc-black">
    <div class="flex flex-col md:flex-row">
      <div
        v-for="(p, i) in partner"
        :key="i"
        class="flex-1 px-bc-page py-bc-4xl"
        :class="i < partner.length - 1 ? 'border-b border-bc-black md:border-b-0 md:border-r' : ''"
      >
        <div class="flex flex-col gap-bc-xl max-w-[327px]">
          <h3 class="font-garamond font-semibold text-bc-black tracking-[0.02em]"
              style="font-size:32px; line-height:1.2;">{{ p.titolo }}</h3>
          <p class="font-garamond font-normal text-bc-black tracking-[0.02em]"
             style="font-size:22px; line-height:1.2;">{{ p.testo }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA finale -->
  <section class="px-bc-page py-bc-4xl flex flex-col items-center gap-bc-2xl text-center">
    <p class="font-garamond font-semibold text-bc-black tracking-[0.02em]"
       style="font-size:24px; line-height:1.2; max-width:442px;">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.
    </p>
    <NuxtLink to="/contatti" class="bc-btn">Contatta lo studio</NuxtLink>
  </section>
</template>
