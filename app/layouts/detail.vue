<script setup lang="ts">
const pageTitle = useState<string>('detail-title', () => '')
</script>

<template>
  <div class="min-h-screen flex flex-col bg-bc-canvas">
    <!-- Barra navigazione sticky -->
    <header class="w-full border-b border-bc-black sticky top-0 z-40 bg-bc-canvas px-bc-page">
      <div class="relative flex items-center h-[80px] max-w-bc-wrap mx-auto">
        <!-- Freccia indietro -->
        <NuxtLink
          to="/lavori"
          class="flex items-center justify-center w-[44px] h-[44px] hover:opacity-60 transition-opacity shrink-0"
          aria-label="Torna ai lavori"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="currentColor"/>
          </svg>
        </NuxtLink>
        <!-- Titolo 12px dopo la freccia -->
        <p
          v-if="pageTitle"
          class="ml-[12px] font-sans font-light text-bc-black tracking-[0.02em] text-[16px] tablet:text-[20px] leading-[1.2] line-clamp-2 pointer-events-none"
        >{{ pageTitle }}</p>
      </div>
    </header>
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
    <BcFooter />
  </div>
</template>
