<script setup lang="ts">
// Widget segnalazioni "Segnale" → crea GitHub Issue su PianetaDev/barbara-costantini
useHead({
  script: [{
    src: 'https://segnale-phi.vercel.app/widget.js',
    defer: true,
    'data-project': 'barbara-costantini',
    'data-source': 'public',
  }],
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bc-canvas">
    <BcNav />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
    <BcFooter />
    <BcCookieBanner />
  </div>
</template>
