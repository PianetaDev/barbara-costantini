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

const aperto = ref<Record<number, number>>({ 0: 0, 1: 0, 2: 0, 3: 0 })

function toggle(g: number, i: number) {
  aperto.value = { ...aperto.value, [g]: aperto.value[g] === i ? -1 : i }
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

  <!-- Gruppi accordion: immagine sx + divider + titolo e accordion dx -->
  <section
    v-for="(gruppo, g) in gruppi"
    :key="g"
    class="border-b border-bc-black px-bc-page"
  >
    <div class="mx-auto max-w-bc-content">
    <div class="sv-row">

      <!-- Immagine sx -->
      <div v-reveal class="sv-img">
        <div class="w-full aspect-[442/553] bg-bc-black/10 overflow-hidden">
          <img :src="gruppo.image" :alt="gruppo.titolo" class="w-full h-full object-cover" />
        </div>
      </div>


      <!-- Titolo + Accordion dx -->
      <div v-reveal="{ delay: '0.12s' }" class="flex flex-col sv-acc">
        <h2
          class="font-garamond text-bc-black tracking-[0.02em]"
          style="font-size:20px; line-height:1.2; font-weight:700; margin-bottom:32px;"
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
                  style="font-size:20px; line-height:1.2;">{{ s.titolo }}</span>
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
                 style="font-size:20px; line-height:1.2;">{{ s.corpo }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
    </div>
  </section>

  <!-- Partner: 3 colonne con immagine sopra -->
  <section class="border-b border-bc-black px-bc-page">
    <div class="mx-auto max-w-bc-content">
    <div class="flex items-stretch">
      <template v-for="(p, i) in partner" :key="i">
        <div v-if="i > 0" class="w-px bg-bc-black self-stretch shrink-0 mx-[40px]" />
        <div
          v-reveal="{ delay: `${i * 0.1}s` }"
          class="flex flex-col gap-bc-xl flex-1 py-[64px]"
        >
          <div class="w-full bg-bc-black/10 overflow-hidden" style="aspect-ratio:327/407;">
            <img v-if="p.image" :src="p.image" :alt="p.titolo" class="w-full h-full object-cover" />
          </div>
          <div class="flex flex-col gap-bc-md">
            <h3 class="font-garamond font-medium text-bc-black tracking-[0.02em]"
                style="font-size:24px; line-height:1.2;">{{ p.titolo }}</h3>
            <p class="font-garamond font-light text-bc-black tracking-[0.02em]"
               style="font-size:16px; line-height:1.2;">{{ p.testo }}</p>
          </div>
        </div>
      </template>
    </div>
    </div>
  </section>

  <!-- CTA finale -->
  <section class="px-bc-page py-[64px] flex flex-col items-center gap-bc-2xl text-center">
    <p v-reveal class="font-garamond font-medium text-bc-black tracking-[0.02em]"
       style="font-size:20px; line-height:1.2; max-width:442px;">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.
    </p>
    <NuxtLink v-reveal="{ delay: '0.1s' }" to="/contatti" class="bc-btn">Contatta lo studio</NuxtLink>
  </section>
</template>

<style>
/* ── Gruppi accordion: immagine sx + divider + contenuto dx ── */
.sv-row {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 64px 0;
}
@media (min-width: 768px) {
  .sv-row {
    flex-direction: row;
    gap: 0;
    align-items: stretch;
    padding: 0;
  }
  .sv-img {
    flex: 1;
    padding: 64px 80px 64px 0;
    display: flex;
    align-items: center;
  }
  .sv-acc {
    flex: 1;
    padding: 64px 0 64px 80px;
  }
}
@media (min-width: 1280px) {
  .sv-row {
    justify-content: center;
    gap: 140px;
  }
  .sv-img {
    flex: none;
    width: 442px;
    padding: 64px 0;
  }
  .sv-acc {
    flex: none;
    width: 556px;
    padding: 64px 0;
  }
}



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
