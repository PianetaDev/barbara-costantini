<!-- Figma: 590:1395 > Menu-desktop (590:1428) — 1440×107, border-bottom -->
<script setup lang="ts">
const links = [
  { label: 'Studio', to: '/studio' },
  { label: 'Lavori', to: '/lavori' },
  { label: 'Servizi', to: '/servizi' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contatti', to: '/contatti' },
]

const menuOpen = ref(false)
</script>
<template>
  <header class="w-full border-b border-bc-black">
    <div class="flex items-center justify-between px-bc-page py-bc-xl">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3" @click="menuOpen = false">
        <img src="/logo.svg" alt="Barbara Costantini Restauro" class="h-[30px] w-auto" />
        <span class="hidden lg:block font-garamond text-bc-body2 font-bold tracking-[0.02em]">
          Barbara Costantini Restauro
        </span>
      </NuxtLink>

      <!-- Nav desktop -->
      <nav class="hidden lg:flex items-center justify-between w-[676px]">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="font-sans text-bc-nav font-normal tracking-[0.02em] px-bc-md py-bc-sm hover:opacity-60 transition-opacity"
        >
          {{ l.label }}
        </NuxtLink>
      </nav>

      <!-- Hamburger mobile/tablet -->
      <button
        class="lg:hidden flex flex-col gap-[5px] p-2"
        aria-label="Menu"
        @click="menuOpen = !menuOpen"
      >
        <span class="block w-[22px] h-px bg-bc-black transition-all" :class="menuOpen ? 'rotate-45 translate-y-[6px]' : ''" />
        <span class="block w-[22px] h-px bg-bc-black transition-all" :class="menuOpen ? 'opacity-0' : ''" />
        <span class="block w-[22px] h-px bg-bc-black transition-all" :class="menuOpen ? '-rotate-45 -translate-y-[6px]' : ''" />
      </button>
    </div>

    <!-- Menu mobile/tablet aperto -->
    <nav
      v-if="menuOpen"
      class="lg:hidden flex flex-col border-t border-bc-black"
    >
      <NuxtLink
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        class="font-sans text-bc-nav font-normal tracking-[0.02em] px-bc-page py-bc-xl border-b border-bc-black/20 hover:opacity-60 transition-opacity"
        @click="menuOpen = false"
      >
        {{ l.label }}
      </NuxtLink>
    </nav>
  </header>
</template>
