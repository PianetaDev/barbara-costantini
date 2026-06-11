<!-- Figma: 590:1457 — I lavori: griglia 3 progetti -->
<script setup lang="ts">
const progetti = [
  { anno: '2024', cliente: 'Cliente', titolo: 'Nome progetto', slug: 'progetto-1' },
  { anno: '2024', cliente: 'Cliente', titolo: 'Nome progetto', slug: 'progetto-2' },
  { anno: '2024', cliente: 'Cliente', titolo: 'Nome progetto', slug: 'progetto-3' },
]
</script>
<template>
  <section class="bc-container bc-section border-t border-bc-black/10">
    <div class="grid md:grid-cols-2 gap-8 items-start mb-12">
      <h2 class="font-garamond text-bc-2xl">I lavori</h2>
      <div>
        <p class="font-sans text-bc-base text-bc-black/80 leading-relaxed mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <NuxtLink to="/lavori" class="bc-btn">Esplora i lavori</NuxtLink>
      </div>
    </div>
    <div class="grid md:grid-cols-3 gap-6">
      <NuxtLink
        v-for="p in progetti"
        :key="p.slug"
        :to="`/lavori/${p.slug}`"
        class="group"
      >
        <div class="aspect-[3/4] bg-bc-black/10 mb-4 overflow-hidden">
          <img src="" :alt="p.titolo" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <p class="font-sans text-bc-xs text-bc-black/50 mb-1">{{ p.anno }} · {{ p.cliente }}</p>
        <p class="font-garamond text-bc-lg">{{ p.titolo }}</p>
      </NuxtLink>
    </div>
  </section>
</template>
