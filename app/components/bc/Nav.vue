<!-- Figma: 590:1395 > Menu-desktop (590:1428) — 1440×107, border-bottom -->
<script setup lang="ts">
const links = [
  { label: 'Homepage', to: '/' },
  { label: 'Studio', to: '/studio' },
  { label: 'Lavori', to: '/lavori' },
  { label: 'Servizi', to: '/servizi' },
  { label: 'Gallery', to: '/galleria' },
  { label: 'Contatti', to: '/contatti' },
]
</script>
<template>
  <header class="w-full border-b border-bc-black flex items-center justify-between px-bc-page py-bc-xl">
    <NuxtLink to="/" class="flex items-center gap-2">
      <!-- Logo SVG placeholder — sostituire con NuxtImg -->
      <span class="font-garamond text-bc-body2 font-bold tracking-[0.02em]">Barbara Costantini Restauro</span>
    </NuxtLink>
    <nav class="hidden md:flex items-center justify-between w-[676px]">
      <NuxtLink
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        class="font-sans text-bc-nav font-normal tracking-[0.02em] px-bc-md py-bc-sm hover:opacity-60 transition-opacity"
      >
        {{ l.label }}
      </NuxtLink>
    </nav>
  </header>
</template>
