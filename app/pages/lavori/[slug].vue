<!-- Dettaglio lavoro accessibile da Lavori-Bis: layout full, no "prossimo progetto", BcSectionLavori al fondo -->
<script setup lang="ts">
definePageMeta({ layout: 'detail' })
const route = useRoute()

const progetti = useProgetti()

const slugParam = computed(() => route.params.slug as string)
const progetto = computed(() => progetti.find(p => p.slug === slugParam.value) ?? null)

const progettiSuggeriti = computed(() => {
  const cur = slugParam.value
  const altri = progetti.filter(p => p.slug !== cur)
  const curIdx = progetti.findIndex(p => p.slug === cur)
  // prendi i successivi in ordine ciclico, escludendo il corrente
  const sorted = [...altri.slice(curIdx), ...altri.slice(0, curIdx)]
  return sorted.slice(0, 3).map(p => ({
    codice: p.id,
    committente: p.meta.find(m => m.label === 'Committente')?.valore ?? '',
    titolo: p.titolo,
    slug: p.slug,
    image: p.immagini[0]?.src,
    tipo: (p.immagini[0]?.aspetto === 'v' ? 'vertical' : 'horizontal') as 'vertical' | 'horizontal',
  }))
})

const pageTitle = useState<string>('detail-title', () => '')
watchEffect(() => { pageTitle.value = progetto.value?.titolo ?? '' })

const imgIndex = ref(0)
watch(progetto, () => { imgIndex.value = 0 })
watch(imgIndex, (i) => {
  nextTick(() => {
    const scroller = document.querySelector<HTMLElement>('.bc-thumb-scroller')
    const thumbs = scroller?.querySelectorAll<HTMLElement>('.bc-thumb-btn')
    const thumb = thumbs?.[i]
    if (!scroller || !thumb) return
    const scrollerRect = scroller.getBoundingClientRect()
    const thumbRect = thumb.getBoundingClientRect()
    const offset = thumbRect.left - scrollerRect.left + scroller.scrollLeft
    const center = offset - scrollerRect.width / 2 + thumbRect.width / 2
    scroller.scrollTo({ left: center, behavior: 'instant' })
  })
})

function imgPrev() { if (progetto.value && imgIndex.value > 0) imgIndex.value-- }
function imgNext() { if (progetto.value && imgIndex.value < progetto.value.immagini.length - 1) imgIndex.value++ }

</script>

<template>
  <div v-if="progetto">

    <!-- Hero -->
    <div class="flex justify-center px-bc-page my-[32px]">
      <div class="w-full h-[300px] tablet:h-[450px] overflow-hidden">
        <img v-if="progetto.immagini[imgIndex]?.src" :src="progetto.immagini[imgIndex].src" :alt="progetto.titolo" class="w-full h-full object-contain" />
      </div>
    </div>

    <!-- Navigation thumbnails carosello -->
    <div class="border-t border-b border-bc-black py-[24px] flex items-start">
      <!-- Frecce — fuori dallo scroll, sempre visibili -->
      <div class="flex items-start gap-[8px] shrink-0 pl-bc-page bc:pl-[calc((100vw-1440px)/2+32px)] pr-[32px] self-stretch bg-bc-canvas">
        <button
          class="flex items-center justify-center w-[44px] h-[44px] hover:opacity-60 transition-opacity disabled:opacity-25"
          :disabled="imgIndex === 0"
          @click="imgPrev"
          aria-label="Immagine precedente"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/></svg>
        </button>
        <button
          class="flex items-center justify-center w-[44px] h-[44px] hover:opacity-60 transition-opacity disabled:opacity-25"
          :disabled="imgIndex === progetto.immagini.length - 1"
          @click="imgNext"
          aria-label="Immagine successiva"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/></svg>
        </button>
      </div>
      <!-- Thumbnails — scrollano al vivo verso destra -->
      <div class="bc-thumb-scroller flex-1 overflow-x-auto">
        <div class="flex gap-[24px] items-start pr-bc-page">
          <button
            v-for="(img, i) in progetto.immagini"
            :key="i"
            class="bc-thumb-btn flex flex-col gap-[5px] items-start shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
            @click="imgIndex = i"
          >
            <div
              class="overflow-hidden transition-opacity"
              :style="img.aspetto === 'v' ? 'width:62px; aspect-ratio:2/3; background:rgba(0,0,0,0.25);' : 'width:93px; aspect-ratio:3/2; background:rgba(0,0,0,0.25);'"
              :class="i === imgIndex ? 'border border-bc-black' : 'opacity-60'"
            >
              <img v-if="img.src" :src="img.src" :alt="img.label" class="w-full h-full object-cover" />
            </div>
            <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:14px; line-height:1.5;">({{ img.label }})</p>
          </button>
        </div>
      </div>
    </div>

    <!-- Metadata + intro -->
    <div class="px-bc-page pt-[64px] pb-[64px]">
    <div class="bc-grid bc-2col bc-442 bc-meta max-w-bc-wrap mx-auto">
      <div class="flex flex-col gap-[12px] bc-sidebar">
        <div v-for="(m, i) in progetto.meta.filter(m => ['Committente', 'Anno'].includes(m.label))" :key="i" class="flex flex-col gap-[4px]">
          <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px; line-height:1.5;">{{ m.label }}:</p>
          <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:16px; line-height:1.5;">{{ m.valore }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-bc-md bc-intro">
        <p v-for="(t, i) in progetto.intro" :key="i" class="font-garamond font-light text-bc-black tracking-[0.02em]" style="font-size:18px; line-height:1.5;">{{ t }}</p>
      </div>
      <div class="bc-spacer-r" />
    </div>
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
        <h2 class="font-garamond text-bc-black tracking-[0.02em]" style="font-size:24px; line-height:1.5; margin-bottom:32px; font-weight:400;">{{ s.titolo }}</h2>
        <h3 class="font-garamond text-bc-black tracking-[0.02em]" style="font-size:20px; line-height:1.5; margin-bottom:16px; font-weight:400;">{{ s.sottotitolo }}</h3>
        <p v-for="(t, j) in s.testi" :key="j" class="font-garamond font-light text-bc-black tracking-[0.02em]" style="font-size:18px; line-height:1.5; margin-bottom:16px;">{{ t }}</p>
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
        <p class="font-garamond font-light text-bc-black tracking-[0.02em]" style="font-size:18px; line-height:1.5;">{{ progetto.metodo.testi[0] }}</p>
        <p class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:18px; line-height:1.5;">"{{ progetto.metodo.citazione }}"</p>
        <p v-if="progetto.metodo.testi[1]" class="font-garamond font-light text-bc-black tracking-[0.02em]" style="font-size:18px; line-height:1.5;">{{ progetto.metodo.testi[1] }}</p>
      </div>
    </div>

    <!-- Sfoglia altri lavori -->
    <BcSectionLavori titolo="Sfoglia altri lavori" cta-label="Vedi tutti" titolo-size="32px" paragrafo-size="20px" card-titolo-size="20px" :border-top="true" :border-bottom="false" :progetti="progettiSuggeriti" />

  </div>

  <!-- 404 -->
  <div v-else class="px-bc-page py-[64px] flex flex-col items-center gap-bc-xl">
    <p class="font-garamond text-bc-black" style="font-size:32px; font-weight:400;">Progetto non trovato</p>
    <NuxtLink to="/lavori" class="bc-btn">Torna ai lavori</NuxtLink>
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
  .bc-sidebar { position: absolute; top: 0; left: 32px; max-width: calc(50% - 277px); }
  .bc-intro { max-width: 442px; margin: 0 auto; }
  .bc-meta .bc-spacer-r { display: none; }
}
</style>
