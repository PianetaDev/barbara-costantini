<!-- Figma: 590:1395 — header/nav bar -->
<script setup lang="ts">
const links = [
  { label: 'Studio', to: '/studio' },
  { label: 'Lavori', to: '/lavori' },
  { label: 'Servizi', to: '/servizi' },
  { label: 'Galleria', to: '/galleria' },
  { label: 'Contatti', to: '/contatti' },
]
</script>
<template>
  <header class="bc-container flex items-center justify-between py-5 border-b border-bc-black/10">
    <NuxtLink to="/" class="font-garamond text-bc-lg font-medium tracking-tight">
      Barbara Costantini Restauro
    </NuxtLink>
    <nav class="hidden md:flex items-center gap-8">
      <NuxtLink
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        class="font-sans text-bc-sm tracking-widest uppercase hover:opacity-60 transition-opacity"
      >
        {{ l.label }}
      </NuxtLink>
    </nav>
  </header>
</template>
