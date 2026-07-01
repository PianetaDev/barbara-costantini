<!-- Figma: 590:1429 section 2 — 3 Team-card full-width -->
<!-- Desktop: flex con divider verticali (mx-[40px] × 2 = 80px gap) -->
<!-- Mobile 590:1929: 1 card, Tablet 590:2230: 2 card — carousel slide animato -->
<script setup lang="ts">
interface Membro {
  nome: string
  ruolo: string
  bio: string
  image?: string
}

const props = withDefaults(defineProps<{
  membri?: Membro[]
}>(), {
  membri: () => [
    { nome: 'Nome Cognome 1', ruolo: 'Ruolo', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula.' },
    { nome: 'Nome Cognome 2', ruolo: 'Ruolo', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula.' },
    { nome: 'Nome Cognome 3', ruolo: 'Ruolo', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula.' },
  ]
})

const isMobile = ref(false)
const carouselEl = ref<HTMLElement>()
const startIndex = ref(0)
const offset = ref(0)

onMounted(() => {
  const mq = window.matchMedia('(max-width: 767px)')
  isMobile.value = mq.matches
  mq.addEventListener('change', (e: MediaQueryListEvent) => {
    isMobile.value = e.matches
    nextTick(updateOffset)
  })
  window.addEventListener('resize', () => nextTick(updateOffset))
})

const visibleCount = computed(() => isMobile.value ? 1 : 2)
const maxIndex = computed(() => Math.max(0, props.membri.length - visibleCount.value))

watch(maxIndex, (max) => {
  if (startIndex.value > max) { startIndex.value = max; updateOffset() }
})

function cardWidth() {
  if (!carouselEl.value) return 0
  const w = carouselEl.value.offsetWidth
  const gap = 16
  return visibleCount.value === 1 ? w : (w - gap) / 2
}

function updateOffset() {
  offset.value = -(startIndex.value * (cardWidth() + 16))
}

function prev() { if (startIndex.value > 0) { startIndex.value--; updateOffset() } }
function next() { if (startIndex.value < maxIndex.value) { startIndex.value++; updateOffset() } }

const touchStartX = ref(0)
function onTouchStart(e: TouchEvent) { touchStartX.value = e.touches[0].clientX }
function onTouchEnd(e: TouchEvent) {
  const delta = touchStartX.value - e.changedTouches[0].clientX
  if (Math.abs(delta) < 40) return
  if (delta > 0) next()
  else prev()
}
</script>
<template>
  <section class="w-full border-t border-bc-black px-bc-page overflow-hidden">

    <!-- Desktop: 3 colonne con divider verticali -->
    <div class="hidden lg:flex lg:items-stretch mx-auto max-w-bc-content">
      <template v-for="(m, i) in membri" :key="`d-${i}`">
        <div v-if="i > 0" class="w-px bg-bc-black self-stretch shrink-0 mx-[40px]" />
        <div class="flex flex-col gap-bc-xl flex-1 py-[64px]">
          <div class="w-full bg-bc-black/10 overflow-hidden" style="aspect-ratio: 327/407;">
            <img v-if="m.image" :src="m.image" :alt="m.nome" class="w-full h-full object-cover" />
          </div>
          <div class="flex flex-col gap-bc-md">
            <div class="flex flex-col gap-[12px]">
              <h3 class="font-sans text-bc-h3 font-medium text-bc-black tracking-[0.02em]">{{ m.nome }}</h3>
              <p class="font-garamond text-bc-h4 font-medium text-bc-black tracking-[0.02em]">{{ m.ruolo }}</p>
            </div>
            <p class="font-garamond text-bc-body2 font-light text-bc-black tracking-[0.02em]">{{ m.bio }}</p>
          </div>
        </div>
      </template>
    </div>

    <!-- Mobile + Tablet: carousel animato -->
    <div class="lg:hidden mx-auto max-w-bc-content py-bc-2xl">
      <div class="flex flex-col gap-bc-md">
        <!-- Previous / Next -->
        <div class="flex justify-end items-center gap-[8px]">
          <button
            class="flex items-center justify-center w-[44px] h-[44px] border border-bc-black hover:opacity-60 transition-opacity disabled:opacity-25"
            :disabled="startIndex === 0"
            @click="prev"
            aria-label="Precedente"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/></svg>
          </button>
          <button
            class="flex items-center justify-center w-[44px] h-[44px] border border-bc-black hover:opacity-60 transition-opacity disabled:opacity-25"
            :disabled="startIndex >= maxIndex"
            @click="next"
            aria-label="Successivo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/></svg>
          </button>
        </div>
        <!-- Track con slide -->
        <div
          ref="carouselEl"
          class="overflow-hidden"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
        >
          <div
            class="flex gap-[16px] items-start transition-transform duration-500 ease-out"
            :style="{ transform: `translateX(${offset}px)` }"
          >
            <div
              v-for="(m, i) in membri"
              :key="i"
              class="flex-none flex flex-col gap-bc-xl w-full md:w-[calc(50%-8px)]"
            >
              <div class="w-full bg-bc-black/10 overflow-hidden" style="aspect-ratio: 327/407;">
                <img v-if="m.image" :src="m.image" :alt="m.nome" class="w-full h-full object-cover" />
              </div>
              <div class="flex flex-col gap-bc-md">
                <div class="flex flex-col gap-[12px]">
                  <h3 class="font-sans text-bc-h3 font-medium text-bc-black tracking-[0.02em]">{{ m.nome }}</h3>
                  <p class="font-garamond text-bc-h4 font-medium text-bc-black tracking-[0.02em]">{{ m.ruolo }}</p>
                </div>
                <p class="font-garamond text-bc-body2 font-light text-bc-black tracking-[0.02em]">{{ m.bio }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>
