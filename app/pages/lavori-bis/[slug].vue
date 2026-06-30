<!-- Dettaglio lavoro accessibile da Lavori-Bis: layout full, no "prossimo progetto", BcSectionLavori al fondo -->
<script setup lang="ts">
const route = useRoute()

interface MetaVoce { label: string; valore: string }
interface Immagine { src: string; label: string; aspetto?: 'h' | 'v' }
interface Sezione { titolo: string; sottotitolo: string; testi: string[] }
interface Metodo { testi: string[]; citazione: string }
interface Progetto {
  id: string; slug: string; titolo: string
  meta: MetaVoce[]; immagini: Immagine[]; immaginiContenuto: string[]
  intro: string[]; sezioni: Sezione[]; metodo: Metodo
}

const progetti: Progetto[] = [
  {
    id: "01", slug: "archivio-regio",
    titolo: "Restauro conservativo dell'Antico Archivio Regio",
    meta: [
      { label: "Committente", valore: "Archivio di Stato di Cagliari" },
      { label: "Anno", valore: "2022–2023" },
      { label: "Durata restauro", valore: "8 mesi" },
      { label: "Dimensioni", valore: "Varie" },
      { label: "Condizioni", valore: "Mediocri" },
    ],
    immagini: [
      { src: "/images/bc-059.jpg", label: "01-01", aspetto: "h" },
      { src: "/images/bc-027.jpg", label: "01-02", aspetto: "v" },
    ],
    immaginiContenuto: ["/images/bc-059.jpg", "/images/bc-026.jpg"],
    intro: [
      "Il Restauro conservativo dell'Antico Archivio Regio si compone, in riferimento ai documenti in oggetto, di 262 unità archivistiche comprese in un arco temporale che va dal 1381 al 1805.",
      "Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula. Pellentesque ornare ullamcorper lorem, sit amet hendrerit purus molestie sed.",
    ],
    sezioni: [{ titolo: "Titolo Lorem ipsum", sottotitolo: "Titolo Lorem Ipsum", testi: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet."] }],
    metodo: { testi: ["Metodo Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat.", "Metodo Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis."], citazione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat." },
  },
  {
    id: "02", slug: "restauro-testamenti",
    titolo: "Restauro testamenti",
    meta: [
      { label: "Committente", valore: "Munda – Museo Nazionale d'Abruzzo" },
      { label: "Anno", valore: "2021–2022" },
      { label: "Durata restauro", valore: "6 mesi" },
      { label: "Dimensioni", valore: "Varie" },
      { label: "Condizioni", valore: "Buone" },
    ],
    immagini: [
      { src: "/images/bc-060.jpg", label: "02-01", aspetto: "h" },
      { src: "/images/bc-026.jpg", label: "02-02", aspetto: "v" },
    ],
    immaginiContenuto: ["/images/bc-040.jpg", "/images/bc-070.jpg"],
    intro: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.", "Pellentesque ornare ullamcorper lorem, sit amet hendrerit purus molestie sed. Pellentesque ac elit eu ex dictum tempor."],
    sezioni: [{ titolo: "Titolo Lorem ipsum", sottotitolo: "Titolo Lorem Ipsum", testi: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit."] }],
    metodo: { testi: ["Metodo Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "Metodo Lorem ipsum dolor sit amet, consectetur adipiscing elit."], citazione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia." },
  },
  {
    id: "03", slug: "restauro-eur",
    titolo: "Intervento di restauro conservativo",
    meta: [
      { label: "Committente", valore: "EUR Spa" },
      { label: "Anno", valore: "2020–2021" },
      { label: "Durata restauro", valore: "10 mesi" },
      { label: "Dimensioni", valore: "Varie" },
      { label: "Condizioni", valore: "Mediocri" },
    ],
    immagini: [
      { src: "/images/bc-025.jpg", label: "03-01", aspetto: "h" },
      { src: "/images/bc-038.jpg", label: "03-02", aspetto: "v" },
    ],
    immaginiContenuto: ["/images/bc-003.jpg", "/images/bc-026.jpg"],
    intro: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.", "Pellentesque ornare ullamcorper lorem, sit amet hendrerit purus molestie sed. Pellentesque ac elit eu ex dictum tempor."],
    sezioni: [{ titolo: "Titolo Lorem ipsum", sottotitolo: "Titolo Lorem Ipsum", testi: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.", "Lorem ipsum dolor sit amet, consectetur adipiscing elit."] }],
    metodo: { testi: ["Metodo Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "Metodo Lorem ipsum dolor sit amet, consectetur adipiscing elit."], citazione: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia." },
  },
]

const slugParam = computed(() => route.params.slug as string)
const progetto = computed(() => progetti.find(p => p.slug === slugParam.value) ?? null)

const imgIndex = ref(0)
watch(progetto, () => { imgIndex.value = 0 })

function imgPrev() { if (progetto.value && imgIndex.value > 0) imgIndex.value-- }
function imgNext() { if (progetto.value && imgIndex.value < progetto.value.immagini.length - 1) imgIndex.value++ }

const heroImgStyle = computed(() => {
  const img = progetto.value?.immagini[imgIndex.value]
  if (img?.aspetto === 'v') return 'max-width:300px; aspect-ratio:2/3; background:rgba(0,0,0,0.15);'
  return 'max-width:677px; aspect-ratio:3/2; background:rgba(0,0,0,0.15);'
})
</script>

<template>
  <div v-if="progetto">

    <!-- Hero -->
    <div class="px-bc-page py-[64px] bc-hero-grid">
      <h1
        class="font-garamond text-bc-black text-center tracking-[0.02em] bc-col2-r1"
        style="font-size:32px; line-height:1.2; margin-bottom:48px; font-weight:500;"
      >{{ progetto.titolo }}</h1>
      <div class="hidden md:flex md:flex-col gap-[8px] bc-col1-r2">
        <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px; line-height:1.2;">Progetto:</p>
        <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px; line-height:1.2;">{{ progetto.id }}</p>
      </div>
      <div class="flex justify-center bc-col2-r2">
        <div class="w-full overflow-hidden" :style="heroImgStyle">
          <img v-if="progetto.immagini[imgIndex]?.src" :src="progetto.immagini[imgIndex].src" :alt="progetto.titolo" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    <!-- Navigation thumbnails carosello -->
    <div class="border-t border-b border-bc-black px-bc-page py-[24px] flex items-end gap-[32px]">
      <div class="flex items-center gap-[8px] shrink-0">
        <button class="font-sans font-light text-bc-black hover:underline disabled:opacity-30 transition-opacity" style="font-size:16px;" :disabled="imgIndex === 0" @click="imgPrev">Previous</button>
        <span class="font-sans font-light text-bc-black" style="font-size:16px;">/</span>
        <button class="font-sans font-light text-bc-black hover:underline disabled:opacity-30 transition-opacity" style="font-size:16px;" :disabled="imgIndex === progetto.immagini.length - 1" @click="imgNext">Next</button>
      </div>
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
            <img v-if="img.src" :src="img.src" :alt="img.label" class="w-full h-full object-cover" />
          </div>
          <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:14px; line-height:1.2;">({{ img.label }})</p>
        </button>
      </div>
    </div>

    <!-- Metadata + intro -->
    <div class="px-bc-page pt-[64px] pb-[64px] bc-grid bc-2col bc-442 bc-meta">
      <div class="flex flex-col gap-bc-md bc-sidebar">
        <div v-for="(m, i) in progetto.meta" :key="i" class="flex flex-col gap-[8px]">
          <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px; line-height:1.2;">{{ m.label }}:</p>
          <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px; line-height:1.2;">{{ m.valore }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-bc-md bc-intro">
        <p v-for="(t, i) in progetto.intro" :key="i" class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:18px; line-height:1.2;">{{ t }}</p>
      </div>
      <div class="bc-spacer-r" />
    </div>

    <!-- Immagine grande contenuto -->
    <div class="px-bc-page pb-[64px] bc-grid bc-2col bc-676">
      <div class="bc-spacer-l" />
      <div style="aspect-ratio:676/451; background:rgba(0,0,0,0.1); overflow:hidden;">
        <img v-if="progetto.immaginiContenuto[0]" :src="progetto.immaginiContenuto[0]" :alt="progetto.titolo" style="width:100%; height:100%; object-fit:cover;" />
      </div>
      <div class="bc-spacer-r" />
    </div>

    <!-- Sezioni testo -->
    <div v-for="(s, i) in progetto.sezioni" :key="i" class="px-bc-page pb-[64px] bc-grid bc-2col bc-442">
      <div class="bc-spacer-l" />
      <div>
        <h2 class="font-garamond text-bc-black text-center tracking-[0.02em]" style="font-size:32px; line-height:1.2; margin-bottom:32px; font-weight:500;">{{ s.titolo }}</h2>
        <h3 class="font-garamond text-bc-black tracking-[0.02em]" style="font-size:24px; line-height:1.2; margin-bottom:16px; font-weight:500;">{{ s.sottotitolo }}</h3>
        <p v-for="(t, j) in s.testi" :key="j" class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:18px; line-height:1.2; margin-bottom:16px;">{{ t }}</p>
      </div>
      <div class="bc-spacer-r" />
    </div>

    <!-- Due immagini affiancate -->
    <div class="px-bc-page pb-[64px] bc-grid bc-2col bc-676">
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
    <div class="px-bc-page pb-[64px] bc-grid bc-2col bc-442">
      <div class="bc-spacer-l" />
      <div style="display:flex; flex-direction:column; gap:32px;">
        <p class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:18px; line-height:1.2;">{{ progetto.metodo.testi[0] }}</p>
        <p class="font-garamond font-bold text-bc-black tracking-[0.02em]" style="font-size:18px; line-height:1.2;">"{{ progetto.metodo.citazione }}"</p>
        <p v-if="progetto.metodo.testi[1]" class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:18px; line-height:1.2;">{{ progetto.metodo.testi[1] }}</p>
      </div>
    </div>

    <!-- Sfoglia altri lavori -->
    <BcSectionLavori titolo="Sfoglia altri lavori" cta-label="Vedi tutti" titolo-size="32px" paragrafo-size="20px" card-titolo-size="20px" :border-top="true" />

  </div>

  <!-- 404 -->
  <div v-else class="px-bc-page py-[64px] flex flex-col items-center gap-bc-xl">
    <p class="font-garamond text-bc-black" style="font-size:38px; font-weight:500;">Progetto non trovato</p>
    <NuxtLink to="/lavori-bis" class="bc-btn">Torna ai lavori</NuxtLink>
  </div>
</template>

<style>
.bc-hero-grid { display: grid; grid-template-rows: auto auto; gap: 0 24px; }
@media (min-width: 768px) { .bc-hero-grid { grid-template-columns: 120px 1fr; } }
@media (min-width: 1024px) { .bc-hero-grid { grid-template-columns: 1fr 677px 1fr; } }
@media (min-width: 768px) {
  .bc-col2-r1 { grid-column: 2; grid-row: 1; }
  .bc-col1-r2 { grid-column: 1; grid-row: 2; align-self: start; }
  .bc-col2-r2 { grid-column: 2; grid-row: 2; }
}
.bc-grid { display: grid; gap: 24px; }
@media (min-width: 768px) { .bc-2col { grid-template-columns: 1fr 2fr; } }
@media (min-width: 1024px) {
  .bc-442 { grid-template-columns: 1fr 442px 1fr; }
  .bc-676 { grid-template-columns: 1fr 676px 1fr; }
}
.bc-spacer-l, .bc-spacer-r { display: none; }
@media (min-width: 768px) { .bc-spacer-l { display: block; } }
@media (min-width: 1024px) { .bc-spacer-r { display: block; } }
@media (min-width: 1024px) {
  .bc-meta { display: block !important; position: relative; }
  .bc-sidebar { position: absolute; top: 64px; left: 32px; max-width: calc(50% - 277px); }
  .bc-intro { max-width: 442px; margin: 0 auto; }
  .bc-meta .bc-spacer-r { display: none; }
}
</style>
