<!-- Figma: 590:1395 > Menu-desktop (590:1428) — 1440×107, border-bottom -->
<!-- Style guide 457:8130: nav hover = font-medium | mobile menu = fullscreen overlay -->
<script setup lang="ts">
const links = [
  { label: 'Studio', to: '/studio' },
  { label: 'Lavori', to: '/lavori' },
  { label: 'Servizi', to: '/servizi' },
  { label: 'Contatti', to: '/contatti' },
]

const menuOpen = ref(false)

watch(menuOpen, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>
<template>
  <header class="w-full border-b border-bc-black sticky top-0 z-40 bg-bc-canvas">
    <div class="flex items-center justify-between px-bc-page py-[24px]">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center" @click="menuOpen = false">
        <span class="font-sans text-bc-nav tracking-[0.02em]" style="font-weight: 700;">
          Barbara Costantini Restauro
        </span>
      </NuxtLink>

      <!-- Nav desktop: hover = font-medium (style guide 457:8130) -->
      <nav class="hidden lg:flex items-center gap-[32px]">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          exact-active-class="font-semibold underline"
          class="font-sans text-bc-nav font-light tracking-[0.02em] py-bc-sm hover:font-semibold hover:underline"
        >
          {{ l.label }}
        </NuxtLink>
      </nav>

      <!-- Hamburger mobile/tablet -->
      <button
        class="lg:hidden flex flex-col gap-[5px] p-2"
        aria-label="Menu"
        @click="menuOpen = true"
      >
        <span class="block w-[22px] h-px bg-bc-black" />
        <span class="block w-[22px] h-px bg-bc-black" />
        <span class="block w-[22px] h-px bg-bc-black" />
      </button>
    </div>

    <!-- Menu mobile: fullscreen overlay (style guide 457:8130) -->
    <Teleport to="body">
      <div
        v-if="menuOpen"
        class="lg:hidden fixed inset-0 z-50 bg-bc-canvas flex flex-col"
      >
        <!-- Header overlay: logo + X -->
        <div class="flex items-center justify-between px-bc-page py-bc-xl border-b border-bc-black shrink-0">
          <NuxtLink to="/" class="flex items-center" @click="menuOpen = false">
            <span class="font-sans text-bc-nav tracking-[0.02em]" style="font-weight: 700;">
              Barbara Costantini Restauro
            </span>
          </NuxtLink>
          <button class="p-2" aria-label="Chiudi menu" @click="menuOpen = false">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="1" y1="1" x2="21" y2="21" stroke="#000000" stroke-width="1.5" stroke-linecap="round" />
              <line x1="21" y1="1" x2="1" y2="21" stroke="#000000" stroke-width="1.5" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <!-- Links centrati verticalmente -->
        <nav class="flex-1 flex flex-col items-center justify-center gap-[32px]">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="font-sans text-bc-body1 font-light tracking-[0.02em] hover:font-semibold"
            @click="menuOpen = false"
          >
            {{ l.label }}
          </NuxtLink>
        </nav>
      </div>
    </Teleport>
  </header>
</template>

