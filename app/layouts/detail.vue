<template>
  <div class="min-h-screen flex flex-col bg-bc-canvas">
    <!-- Torna indietro bar — sticky, stessa altezza di BcNav -->
    <header class="w-full border-b border-bc-black sticky top-0 z-40 bg-bc-canvas">
      <div class="flex items-center px-bc-page py-[24px]">
        <NuxtLink
          to="/lavori"
          class="font-sans text-bc-nav font-light text-bc-black tracking-[0.02em] hover:font-semibold"
        >
          Torna indietro
        </NuxtLink>
      </div>
    </header>
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
    <BcFooter />
  </div>
</template>
