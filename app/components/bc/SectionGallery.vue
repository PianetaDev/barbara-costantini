<!-- Figma: 590:1571 — Gallery con lightbox -->
<script setup lang="ts">
interface Immagine {
  codice: string
  committente: string
  titolo: string
  image?: string
  tipo: 'vertical' | 'horizontal'
}

const props = withDefaults(defineProps<{ immagini?: Immagine[] }>(), {
  immagini: () => [
    { codice: 'PRJ01', committente: 'Committente', titolo: 'Nome progetto', tipo: 'horizontal', image: '/images/bc-020.jpg' },
    { codice: 'PRJ02', committente: 'Committente', titolo: 'Nome progetto', tipo: 'vertical',   image: '/images/bc-030.jpg' },
    { codice: 'PRJ03', committente: 'Committente', titolo: 'Nome progetto', tipo: 'horizontal', image: '/images/bc-050.jpg' },
    { codice: 'PRJ04', committente: 'Committente', titolo: 'Nome progetto', tipo: 'horizontal', image: '/images/bc-007.jpg' },
    { codice: 'PRJ05', committente: 'Committente', titolo: 'Nome progetto', tipo: 'horizontal', image: '/images/bc-015.jpg' },
    { codice: 'PRJ06', committente: 'Committente', titolo: 'Nome progetto', tipo: 'vertical',   image: '/images/bc-080.jpg' },
    { codice: 'PRJ07', committente: 'Committente', titolo: 'Nome progetto', tipo: 'horizontal', image: '/images/bc-070.jpg' },
    { codice: 'PRJ08', committente: 'Committente', titolo: 'Nome progetto', tipo: 'horizontal', image: '/images/bc-090.jpg' },
    { codice: 'PRJ09', committente: 'Committente', titolo: 'Nome progetto', tipo: 'horizontal', image: '/images/bc-005.jpg' },
    { codice: 'PRJ10', committente: 'Committente', titolo: 'Nome progetto', tipo: 'horizontal', image: '/images/bc-040.jpg' },
    { codice: 'PRJ11', committente: 'Committente', titolo: 'Nome progetto', tipo: 'vertical',   image: '/images/bc-010.jpg' },
    { codice: 'PRJ12', committente: 'Committente', titolo: 'Nome progetto', tipo: 'horizontal', image: '/images/bc-068.jpg' },
  ]
})

// Lightbox
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const imgCorrente = computed(() => props.immagini[lightboxIndex.value])

function apriLightbox(i: number) {
  lightboxIndex.value = i
  lightboxOpen.value = true
}

function chiudiLightbox() {
  lightboxOpen.value = false
}

function prev() {
  lightboxIndex.value = (lightboxIndex.value - 1 + props.immagini.length) % props.immagini.length
}

function next() {
  lightboxIndex.value = (lightboxIndex.value + 1) % props.immagini.length
}

function onKey(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') chiudiLightbox()
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

watch(lightboxOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <!-- Griglia gallery -->
  <section class="w-full px-bc-page py-[64px]">
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-[24px] gap-y-bc-2xl items-start">
      <button
        v-for="(img, i) in immagini"
        :key="i"
        v-reveal="{ delay: `${Math.min(i, 3) * 0.07}s` }"
        class="flex flex-col gap-[16px] group text-left cursor-pointer"
        @click="apriLightbox(i)"
      >
        <div
          class="w-full bg-bc-black/10 overflow-hidden ring-0 group-hover:ring-1 group-hover:ring-bc-black transition-shadow"
          :style="img.tipo === 'vertical' ? 'aspect-ratio:326/406' : 'aspect-ratio:326/217'"
        >
          <img
            v-if="img.image"
            :src="img.image"
            :alt="img.titolo"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div class="flex flex-col gap-[4px]">
          <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.028em]">{{ img.codice }}</p>
          <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.028em]">{{ img.committente }}</p>
          <p class="font-garamond text-bc-h4 font-medium text-bc-black tracking-[0.02em] group-hover:underline">{{ img.titolo }}</p>
        </div>
      </button>
    </div>
  </section>

  <!-- Lightbox overlay -->
  <Teleport to="body">
    <Transition name="gl-fade">
      <div
        v-if="lightboxOpen"
        class="gl-overlay"
        @click.self="chiudiLightbox"
      >
        <!-- Counter + close -->
        <div class="gl-top-bar">
          <span class="gl-counter">{{ lightboxIndex + 1 }} / {{ immagini.length }}</span>
          <button class="gl-close" @click="chiudiLightbox" aria-label="Chiudi">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="1" y1="1" x2="19" y2="19" stroke="white" stroke-width="1.5"/>
              <line x1="19" y1="1" x2="1" y2="19" stroke="white" stroke-width="1.5"/>
            </svg>
          </button>
        </div>

        <!-- Freccia sinistra -->
        <button class="gl-arrow gl-arrow-l" @click="prev" aria-label="Precedente">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="15 18 9 12 15 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Immagine -->
        <div class="gl-img-wrap">
          <Transition name="gl-img" mode="out-in">
            <div :key="lightboxIndex" class="gl-img-inner">
              <img
                v-if="imgCorrente?.image"
                :src="imgCorrente.image"
                :alt="imgCorrente.titolo"
                class="gl-img"
              />
              <div
                v-else
                class="gl-placeholder"
                :style="imgCorrente?.tipo === 'vertical' ? 'aspect-ratio:2/3; height:65vh;' : 'aspect-ratio:3/2; width:min(70vw,900px);'"
              />
            </div>
          </Transition>
        </div>

        <!-- Freccia destra -->
        <button class="gl-arrow gl-arrow-r" @click="next" aria-label="Successivo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="9 18 15 12 9 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Didascalia -->
        <div class="gl-caption">
          <span class="gl-caption-code">{{ imgCorrente?.codice }}</span>
          <span class="gl-caption-sep">/</span>
          <span class="gl-caption-committente">{{ imgCorrente?.committente }}</span>
          <span class="gl-caption-sep">/</span>
          <span class="gl-caption-titolo">{{ imgCorrente?.titolo }}</span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
/* ── Overlay ─────────────────────────────────────────────── */
.gl-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.90);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* ── Top bar: counter centrato + close ghost ─────────────── */
.gl-top-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  pointer-events: none;
}
.gl-counter {
  font-family: 'Public Sans', sans-serif;
  font-weight: 300;
  font-size: 14px;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.5);
}
.gl-close {
  pointer-events: all;
  position: absolute;
  top: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.55;
  transition: opacity 0.2s;
}
.gl-close:hover { opacity: 1; }

/* ── Immagine centrale ───────────────────────────────────── */
.gl-img-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 80vw;
  max-height: 72vh;
}
.gl-img-inner {
  display: flex;
  align-items: center;
  justify-content: center;
}
.gl-img {
  max-width: 80vw;
  max-height: 72vh;
  width: auto;
  height: auto;
  object-fit: contain;
  display: block;
}
.gl-placeholder {
  background: #4a4a47;
  max-width: 80vw;
  max-height: 72vh;
}

/* ── Frecce ghost ────────────────────────────────────────── */
.gl-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.55;
  transition: opacity 0.2s;
}
.gl-arrow:hover { opacity: 1; }
.gl-arrow-l { left: 24px; }
.gl-arrow-r { right: 24px; }

/* ── Didascalia ──────────────────────────────────────────── */
.gl-caption {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}
.gl-caption-code,
.gl-caption-committente {
  font-family: 'Public Sans', sans-serif;
  font-weight: 300;
  font-size: 14px;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.5);
}
.gl-caption-sep {
  font-family: 'Public Sans', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.25);
}
.gl-caption-titolo {
  font-family: 'EB Garamond', Georgia, serif;
  font-weight: 400;
  font-size: 18px;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.85);
}

/* ── Transizioni overlay e immagine ─────────────────────── */
.gl-fade-enter-active,
.gl-fade-leave-active {
  transition: opacity 0.3s ease;
}
.gl-fade-enter-from,
.gl-fade-leave-to {
  opacity: 0;
}
.gl-img-enter-active,
.gl-img-leave-active {
  transition: opacity 0.2s ease;
}
.gl-img-enter-from,
.gl-img-leave-to {
  opacity: 0;
}
</style>
