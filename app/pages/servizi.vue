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
      { titolo: 'Servizio 1', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 2', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula. Pellentesque ornare ullamcorper lorem, sit amet hendrerit purus molestie sed.' },
      { titolo: 'Servizio 3', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 4', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
    ],
  },
  {
    titolo: 'Opere d\u2019arte su carta',
    descrizione: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac.',
    servizi: [
      { titolo: 'Servizio 1', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 2', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 3', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 4', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
    ],
  },
  {
    titolo: 'Materiali fotografici',
    descrizione: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac.',
    servizi: [
      { titolo: 'Servizio 1', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 2', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 3', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
      { titolo: 'Servizio 4', corpo: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.' },
    ],
  },
  {
    titolo: 'Servizi trasversali',
    descrizione: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac.',
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

const aperto = ref<Record<number, number>>({ 0: 0, 1: 0, 2: 0, 3: 0 })

function toggle(g: number, i: number) {
  aperto.value = { ...aperto.value, [g]: aperto.value[g] === i ? -1 : i }
}
</script>

<template>
  <!-- Hero -->
  <section class="border-b border-bc-black px-bc-page py-bc-4xl flex flex-col items-center gap-bc-2xl text-center">
    <h1 v-reveal class="font-garamond font-medium text-bc-black tracking-[0.02em]"
        style="font-size:40px; line-height:1.2; max-width:908px;">
      I servizi
    </h1>
    <p v-reveal="{ delay: '0.12s' }" class="font-garamond font-light text-bc-black"
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
    <div class="px-bc-page py-bc-4xl sv-row">

      <!-- Categoria sx -->
      <div v-reveal class="flex flex-col gap-bc-xl sv-cat">
        <h2 class="font-garamond font-medium text-bc-black tracking-[0.02em]"
            style="font-size:32px; line-height:1.2;">{{ gruppo.titolo }}</h2>
        <p class="font-garamond font-light text-bc-black tracking-[0.02em]"
           style="font-size:20px; line-height:1.2;">{{ gruppo.descrizione }}</p>
      </div>

      <!-- Accordion dx -->
      <div v-reveal="{ delay: '0.12s' }" class="flex flex-col sv-acc">
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
  </section>

  <!-- Partner: 3 colonne con divisori -->
  <section class="border-b border-bc-black">
    <div class="sv-partner-row">
      <div
        v-for="(p, i) in partner"
        :key="i"
        v-reveal="{ delay: `${i * 0.1}s` }"
        class="sv-partner-col"
      >
        <div class="sv-partner-inner">
          <h3 class="font-garamond font-medium text-bc-black tracking-[0.02em]"
              style="font-size:24px; line-height:1.2;">{{ p.titolo }}</h3>
          <p class="font-garamond font-light text-bc-black tracking-[0.02em] mt-bc-xl"
             style="font-size:20px; line-height:1.2;">{{ p.testo }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA finale -->
  <section class="px-bc-page py-bc-4xl flex flex-col items-center gap-bc-2xl text-center">
    <p v-reveal class="font-garamond font-medium text-bc-black tracking-[0.02em]"
       style="font-size:20px; line-height:1.2; max-width:442px;">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.
    </p>
    <NuxtLink v-reveal="{ delay: '0.1s' }" to="/contatti" class="bc-btn">Contatta lo studio</NuxtLink>
  </section>
</template>

<style>
/* ── Partner: 3 colonne con divisori verticali ───────────── */
.sv-partner-row {
  display: flex;
  flex-direction: column;
}
.sv-partner-col {
  padding: 48px 32px;
  border-bottom: 1px solid black;
}
.sv-partner-col:last-child {
  border-bottom: none;
}
.sv-partner-inner {
  max-width: 327px;
}
@media (min-width: 768px) {
  .sv-partner-row {
    flex-direction: row;
    align-items: stretch;
  }
  .sv-partner-col {
    flex: 1;
    padding: 80px 48px;
    border-bottom: none;
    border-right: 1px solid black;
  }
  .sv-partner-col:last-child {
    border-right: none;
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

/* ── Gruppi: due colonne da tablet in su ─────────────────── */
.sv-row {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
@media (min-width: 768px) {
  .sv-row {
    flex-direction: row;
    gap: 48px;
    align-items: flex-start;
  }
  .sv-cat {
    flex: 1;
    min-width: 0;
  }
  .sv-acc {
    flex: 1;
    min-width: 0;
  }
}
@media (min-width: 1280px) {
  .sv-row {
    justify-content: center;
    gap: 140px;
  }
  .sv-cat {
    flex: none;
    width: 326px;
  }
  .sv-acc {
    flex: none;
    width: 676px;
  }
}
</style>
