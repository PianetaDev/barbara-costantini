<!-- Porta da app/pages/lavori/[slug].vue (blocco hero + thumbnails, righe ~30-102).
     Resta Vue island (stato imgIndex, scroll centrato del thumbnail attivo). -->
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Immagine { src: string; label: string; aspetto?: 'h' | 'v' }
interface Props {
  immagini: Immagine[]
  titolo: string
}
const props = defineProps<Props>()

const imgIndex = ref(0)
const scroller = ref<HTMLElement>()
const thumbRefs = ref<HTMLElement[]>([])

function setThumbRef(el: unknown, i: number) {
  if (el) thumbRefs.value[i] = el as HTMLElement
}

watch(imgIndex, (i) => {
  nextTick(() => {
    const scrollerEl = scroller.value
    const thumb = thumbRefs.value[i]
    if (!scrollerEl || !thumb) return
    const scrollerRect = scrollerEl.getBoundingClientRect()
    const thumbRect = thumb.getBoundingClientRect()
    const offset = thumbRect.left - scrollerRect.left + scrollerEl.scrollLeft
    const center = offset - scrollerRect.width / 2 + thumbRect.width / 2
    scrollerEl.scrollTo({ left: center, behavior: 'instant' })
  })
})

function imgPrev() { if (imgIndex.value > 0) imgIndex.value-- }
function imgNext() { if (imgIndex.value < props.immagini.length - 1) imgIndex.value++ }
</script>
<template>
  <div>
    <!-- Hero -->
    <div class="flex justify-center px-bc-page my-[32px]">
      <div class="w-full h-[300px] tablet:h-[450px] overflow-hidden">
        <img v-if="immagini[imgIndex]?.src" :src="immagini[imgIndex].src" :alt="titolo" class="w-full h-full object-contain" />
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
          :disabled="imgIndex === immagini.length - 1"
          @click="imgNext"
          aria-label="Immagine successiva"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/></svg>
        </button>
      </div>
      <!-- Thumbnails — scrollano al vivo verso destra -->
      <div ref="scroller" class="flex-1 overflow-x-auto">
        <div class="flex gap-[24px] items-start pr-bc-page">
          <button
            v-for="(img, i) in immagini"
            :key="i"
            :ref="(el) => setThumbRef(el, i)"
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
            <p class="font-sans font-light text-bc-black tracking-[0.02em]" style="font-size:14px; line-height:1.5;">({{ img.label }})</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
