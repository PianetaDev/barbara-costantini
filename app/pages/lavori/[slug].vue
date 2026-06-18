<!-- Figma: 329:915 — Dettaglio progetto -->
<script setup lang="ts">
definePageMeta({ layout: "detail" })
const route = useRoute()

interface MetaVoce {
  label: string
  valore: string
}

interface Immagine {
  src: string
  label: string
  aspetto?: 'h' | 'v'
}

interface Sezione {
  titolo: string
  sottotitolo: string
  testi: string[]
}

interface Metodo {
  testi: string[]
  citazione: string
}

interface Progetto {
  id: string
  slug: string
  titolo: string
  meta: MetaVoce[]
  immagini: Immagine[]
  immaginiContenuto: string[]
  intro: string[]
  sezioni: Sezione[]
  metodo: Metodo
}

const progetti: Progetto[] = [
  {
    id: "01",
    slug: "archivio-regio",
    titolo: "Restauro conservativo dell'Antico Archivio Regio",
    meta: [
      { label: "Committente", valore: "Archivio di Stato di Cagliari" },
      { label: "Anno", valore: "2022\u20132023" },
      { label: "Durata restauro", valore: "8 mesi" },
      { label: "Dimensioni", valore: "Varie" },
      { label: "Condizioni", valore: "Mediocri" },
    ],
    immagini: [
      { src: "/images/bc-027.jpg", label: "01-01", aspetto: "h" },
      { src: "/images/bc-003.jpg", label: "01-02", aspetto: "v" },
    ],
    immaginiContenuto: ["/images/bc-059.jpg", "/images/bc-026.jpg"],
    intro: [
      "Il Restauro conservativo dell'Antico Archivio Regio si compone, in riferimento ai documenti in oggetto, di 262 unit\u00e0 archivistiche comprese in un arco temporale che va dal 1381 al 1805.",
      "Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula. Pellentesque ornare ullamcorper lorem, sit amet hendrerit purus molestie sed.",
    ],
    sezioni: [
      {
        titolo: "Titolo Lorem ipsum",
        sottotitolo: "Titolo Lorem Ipsum",
        testi: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula.",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet.",
        ],
      },
    ],
    metodo: {
      testi: [
        "Metodo Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.",
        "Metodo Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.",
      ],
      citazione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.",
    },
  },
  {
    id: "02",
    slug: "restauro-testamenti",
    titolo: "Restauro testamenti",
    meta: [
      { label: "Committente", valore: "Munda \u2013 Museo Nazionale d'Abruzzo" },
      { label: "Anno", valore: "2021\u20132022" },
      { label: "Durata restauro", valore: "6 mesi" },
      { label: "Dimensioni", valore: "Varie" },
      { label: "Condizioni", valore: "Buone" },
    ],
    immagini: [
      { src: "/images/bc-059.jpg", label: "02-01", aspetto: "h" },
      { src: "/images/bc-060.jpg", label: "02-02", aspetto: "v" },
    ],
    immaginiContenuto: ["/images/bc-040.jpg", "/images/bc-070.jpg"],
    intro: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.",
      "Pellentesque ornare ullamcorper lorem, sit amet hendrerit purus molestie sed. Pellentesque ac elit eu ex dictum tempor.",
    ],
    sezioni: [
      {
        titolo: "Titolo Lorem ipsum",
        sottotitolo: "Titolo Lorem Ipsum",
        testi: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        ],
      },
    ],
    metodo: {
      testi: [
        "Metodo Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Metodo Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      ],
      citazione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.",
    },
  },
  {
    id: "03",
    slug: "restauro-eur",
    titolo: "Intervento di restauro conservativo",
    meta: [
      { label: "Committente", valore: "EUR Spa" },
      { label: "Anno", valore: "2020–2021" },
      { label: "Durata restauro", valore: "10 mesi" },
      { label: "Dimensioni", valore: "Varie" },
      { label: "Condizioni", valore: "Mediocri" },
    ],
    immagini: [
      { src: "/images/bc-038.jpg", label: "03-01", aspetto: "h" },
      { src: "/images/bc-090.jpg", label: "03-02", aspetto: "v" },
    ],
    immaginiContenuto: ["/images/bc-003.jpg", "/images/bc-026.jpg"],
    intro: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.",
      "Pellentesque ornare ullamcorper lorem, sit amet hendrerit purus molestie sed. Pellentesque ac elit eu ex dictum tempor.",
    ],
    sezioni: [
      {
        titolo: "Titolo Lorem ipsum",
        sottotitolo: "Titolo Lorem Ipsum",
        testi: [
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        ],
      },
    ],
    metodo: {
      testi: [
        "Metodo Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Metodo Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      ],
      citazione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.",
    },
  },
]

const slugParam = computed(() => route.params.slug as string)
const indice = computed(() => progetti.findIndex((p) => p.slug === slugParam.value))
const progetto = computed(() => indice.value >= 0 ? progetti[indice.value] : null)
const precedente = computed(() => indice.value > 0 ? progetti[indice.value - 1] : null)
const successivo = computed(() => progetti[(indice.value + 1) % progetti.length])

// Carosello immagini
const imgIndex = ref(0)
watch(progetto, () => { imgIndex.value = 0 })

function imgPrev() {
  if (progetto.value && imgIndex.value > 0) imgIndex.value--
}
function imgNext() {
  if (progetto.value && imgIndex.value < progetto.value.immagini.length - 1) imgIndex.value++
}

const heroImgStyle = computed(() => {
  const img = progetto.value?.immagini[imgIndex.value]
  if (img?.aspetto === 'v') {
    return 'max-width:300px; aspect-ratio:2/3; background:rgba(0,0,0,0.15);'
  }
  return 'max-width:677px; aspect-ratio:3/2; background:rgba(0,0,0,0.15);'
})

</script>

<template>
  <div v-if="progetto">

    <!-- Hero: responsive grid — centrato su desktop, progetto+immagine su tablet, stacked su mobile -->
    <div
      class="px-bc-page py-bc-4xl bc-hero-grid"
    >
      <!-- Titolo: col 2, row 1 -->
      <h1
        class="font-garamond font-semibold text-bc-black text-center tracking-[0.02em] bc-col2-r1"
        style="font-size:38px; line-height:1.2; margin-bottom:48px;"
      >{{ progetto.titolo }}</h1>
      <!-- Metadata: nascosto su mobile, visibile da md — col 1 row 2 -->
      <div class="hidden md:flex md:flex-col gap-[8px] bc-col1-r2">
        <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px; line-height:1.2;">Progetto:</p>
        <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px; line-height:1.2;">{{ progetto.id }}</p>
      </div>
      <!-- Immagine corrente del carosello: col 2, row 2 -->
      <div class="flex justify-center bc-col2-r2">
        <div class="w-full overflow-hidden" :style="heroImgStyle">
          <img
            v-if="progetto.immagini[imgIndex]?.src"
            :src="progetto.immagini[imgIndex].src"
            :alt="progetto.titolo"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>

    <!-- Navigation thumbnails carosello -->
    <div class="border-t border-b border-bc-black px-bc-page py-[24px] flex items-end gap-[32px]">
      <!-- Previous / Next -->
      <div class="flex items-center gap-[8px] shrink-0">
        <button
          class="font-sans font-light text-bc-black hover:underline disabled:opacity-30 transition-opacity"
          style="font-size:16px;"
          :disabled="imgIndex === 0"
          @click="imgPrev"
        >Previous</button>
        <span class="font-sans font-light text-bc-black" style="font-size:16px;">/</span>
        <button
          class="font-sans font-light text-bc-black hover:underline disabled:opacity-30 transition-opacity"
          style="font-size:16px;"
          :disabled="imgIndex === progetto.immagini.length - 1"
          @click="imgNext"
        >Next</button>
      </div>
      <!-- Thumbnails cliccabili -->
      <div class="flex gap-[24px] items-end overflow-x-auto">
        <button
          v-for="(img, i) in progetto.immagini"
          :key="i"
          class="flex flex-col gap-[5px] items-start shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
          @click="imgIndex = i"
        >
          <div
            class="overflow-hidden transition-opacity"
            :style="img.aspetto === 'v' ? 'width:62px; aspect-ratio:2/3; background:rgba(0,0,0,0.25);' : 'width:93px; aspect-ratio:3/2; background:rgba(0,0,0,0.25);'"
            :class="i === imgIndex ? 'border border-bc-black' : 'opacity-60'"
          >
            <img
              v-if="img.src"
              :src="img.src"
              :alt="img.label"
              class="w-full h-full object-cover"
            />
          </div>
          <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:14px; line-height:1.2;">
            ({{ img.label }})
          </p>
        </button>
      </div>
    </div>

    <!-- Contenuto: metadata sinistra + intro destra -->
    <div class="px-bc-page pt-bc-4xl pb-bc-4xl bc-grid bc-2col bc-442 bc-meta">
      <div class="flex flex-col gap-bc-md bc-sidebar">
        <div
          v-for="(m, i) in progetto.meta"
          :key="i"
          class="flex flex-col gap-[8px]"
        >
          <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px; line-height:1.2;">{{ m.label }}:</p>
          <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px; line-height:1.2;">{{ m.valore }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-bc-md bc-intro">
        <p
          v-for="(t, i) in progetto.intro"
          :key="i"
          class="font-garamond font-normal text-bc-black tracking-[0.02em]"
          style="font-size:18px; line-height:1.2;"
        >{{ t }}</p>
      </div>
      <div class="bc-spacer-r" />
    </div>

    <!-- Immagine grande contenuto -->
    <div class="px-bc-page pb-bc-4xl bc-grid bc-2col bc-676">
      <div class="bc-spacer-l" />
      <div style="aspect-ratio:676/451; background:rgba(0,0,0,0.1); overflow:hidden;">
        <img v-if="progetto.immaginiContenuto[0]" :src="progetto.immaginiContenuto[0]" :alt="progetto.titolo" style="width:100%; height:100%; object-fit:cover;" />
      </div>
      <div class="bc-spacer-r" />
    </div>

    <!-- Sezioni testo -->
    <div
      v-for="(s, i) in progetto.sezioni"
      :key="i"
      class="px-bc-page pb-bc-4xl bc-grid bc-2col bc-442"
    >
      <div class="bc-spacer-l" />
      <div>
        <h2
          class="font-garamond font-semibold text-bc-black text-center tracking-[0.02em]"
          style="font-size:32px; line-height:1.2; margin-bottom:32px;"
        >{{ s.titolo }}</h2>
        <h3
          class="font-garamond font-semibold text-bc-black tracking-[0.02em]"
          style="font-size:24px; line-height:1.2; margin-bottom:16px;"
        >{{ s.sottotitolo }}</h3>
        <p
          v-for="(t, j) in s.testi"
          :key="j"
          class="font-garamond font-normal text-bc-black tracking-[0.02em]"
          style="font-size:18px; line-height:1.2; margin-bottom:16px;"
        >{{ t }}</p>
      </div>
      <div class="bc-spacer-r" />
    </div>

    <!-- Due immagini affiancate -->
    <div class="px-bc-page pb-bc-4xl bc-grid bc-2col bc-676">
      <div class="bc-spacer-l" />
      <div style="display:flex; gap:24px;">
        <div style="flex:1; min-width:0; aspect-ratio:326/406; background:rgba(0,0,0,0.1); overflow:hidden;">
          <img v-if="progetto.immaginiContenuto[0]" :src="progetto.immaginiContenuto[0]" :alt="progetto.titolo" style="width:100%; height:100%; object-fit:cover;" />
        </div>
        <div style="flex:1; min-width:0; aspect-ratio:326/406; background:rgba(0,0,0,0.1); overflow:hidden;">
          <img v-if="progetto.immaginiContenuto[1]" :src="progetto.immaginiContenuto[1]" :alt="progetto.titolo" style="width:100%; height:100%; object-fit:cover;" />
        </div>
      </div>
      <div class="bc-spacer-r" />
    </div>

    <!-- Testo metodo -->
    <div class="px-bc-page pb-bc-4xl bc-grid bc-2col bc-442">
      <div class="bc-spacer-l" />
      <div>
        <div style="display:flex; flex-direction:column; gap:32px;">
          <p
            class="font-garamond font-normal text-bc-black tracking-[0.02em]"
            style="font-size:18px; line-height:1.2;"
          >{{ progetto.metodo.testi[0] }}</p>
          <p
            class="font-garamond font-bold text-bc-black tracking-[0.02em]"
            style="font-size:18px; line-height:1.2;"
          >"{{ progetto.metodo.citazione }}"</p>
          <p
            v-if="progetto.metodo.testi[1]"
            class="font-garamond font-normal text-bc-black tracking-[0.02em]"
            style="font-size:18px; line-height:1.2;"
          >{{ progetto.metodo.testi[1] }}</p>
        </div>
      </div>
    </div>

    <!-- Preview progetto successivo con sfumatura + scroll-to-navigate -->
    <div v-if="successivo" class="relative overflow-hidden">
      <div class="border-t border-bc-black" />
      <div
        class="px-bc-page py-bc-4xl bc-hero-grid"
      >
        <h2
          class="font-garamond font-semibold text-bc-black text-center tracking-[0.02em] bc-col2-r1"
          style="font-size:38px; line-height:1.2; margin-bottom:48px;"
        >{{ successivo.titolo }}</h2>
        <div class="hidden md:flex md:flex-col gap-[8px] bc-col1-r2">
          <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px; line-height:1.2;">Progetto:</p>
          <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px; line-height:1.2;">{{ successivo.id }}</p>
        </div>
        <div class="bc-col2-r2" style="aspect-ratio:677/451; background:rgba(0,0,0,0.1); overflow:hidden;">
          <img v-if="successivo.immagini[0]?.src" :src="successivo.immagini[0].src" :alt="successivo.titolo" style="width:100%; height:100%; object-fit:cover;" />
        </div>
      </div>
      <!-- Sfumatura che copre il fondo dell'immagine -->
      <div class="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-bc-canvas to-transparent pointer-events-none" />
      <!-- CTA -->
      <div class="relative z-10 flex justify-center pb-bc-4xl">
        <NuxtLink
          :to="`/lavori/${successivo.slug}`"
          class="font-garamond font-normal text-bc-black border-b border-bc-black hover:font-semibold"
          style="font-size:18px; line-height:1.2; padding-bottom:2px;"
        >Continua a leggere</NuxtLink>
      </div>
    </div>

  </div>

  <!-- 404 -->
  <div v-else class="px-bc-page py-bc-4xl flex flex-col items-center gap-bc-xl">
    <p class="font-garamond font-semibold text-bc-black" style="font-size:38px;">Progetto non trovato</p>
    <NuxtLink to="/lavori" class="bc-btn">Torna ai lavori</NuxtLink>
  </div>
</template>

<style>
/* ── Hero / Preview: griglia responsiva ──────────────────── */
.bc-hero-grid {
  display: grid;
  grid-template-rows: auto auto;
  gap: 0 24px;
}
@media (min-width: 768px) {
  .bc-hero-grid { grid-template-columns: 120px 1fr; }
}
@media (min-width: 1024px) {
  .bc-hero-grid { grid-template-columns: 1fr 677px 1fr; }
}

/* ── Posizione celle hero/preview ────────────────────────── */
@media (min-width: 768px) {
  .bc-col2-r1 { grid-column: 2; grid-row: 1; }
  .bc-col1-r2 { grid-column: 1; grid-row: 2; align-self: start; }
  .bc-col2-r2 { grid-column: 2; grid-row: 2; }
}

/* ── Contenuto: 2 col tablet, 3 col centrate desktop ──────── */
.bc-grid { display: grid; gap: 24px; }
@media (min-width: 768px) {
  .bc-2col { grid-template-columns: 1fr 2fr; }
}
@media (min-width: 1024px) {
  .bc-442 { grid-template-columns: 1fr 442px 1fr; }
  .bc-676 { grid-template-columns: 1fr 676px 1fr; }
}

/* ── Spacer colonne ──────────────────────────────────────── */
.bc-spacer-l, .bc-spacer-r { display: none; }
@media (min-width: 768px) { .bc-spacer-l { display: block; } }
@media (min-width: 1024px) { .bc-spacer-r { display: block; } }

/* ── Meta section desktop: sidebar assoluto, altezza = intro ─ */
@media (min-width: 1024px) {
  .bc-meta {
    display: block !important;
    position: relative;
  }
  .bc-sidebar {
    position: absolute;
    top: 80px;   /* = pt-bc-4xl */
    left: 32px;  /* = px-bc-page */
    max-width: calc(50% - 277px);
  }
  .bc-intro {
    max-width: 442px;
    margin: 0 auto;
  }
  .bc-meta .bc-spacer-r { display: none; }
}
</style>
