<!-- Figma: 761:3281 — section 3 "I servizi" — full-width, immagine sx + testo dx -->
<template>
  <section class="w-full px-[24px] tablet:px-bc-page overflow-hidden">
    <div class="grid grid-cols-1 tablet:grid-cols-2 gap-y-[24px] tablet:gap-y-0 py-[48px] tablet:py-0 max-w-bc-wrap mx-auto w-full">

      <!-- Immagine sx: riempie la colonna, quadrata -->
      <div
        v-reveal
        class="flex items-center tablet:py-[32px]"
      >
        <div class="w-full aspect-square bg-bc-black/10 overflow-hidden">
          <slot name="image">
            <img src="" alt="I servizi" class="w-full h-full object-cover" />
          </slot>
        </div>
      </div>

      <!-- Testo + CTA dx: centrato nella colonna dx -->
      <div class="flex items-center justify-center tablet:pl-[40px] lg:pl-0">
      <div
        v-reveal="{ delay: '0.15s' }"
        class="flex flex-col gap-bc-xl justify-center lg:w-[442px] tablet:py-[80px]"
      >
        <p class="font-sans text-bc-body1 font-light text-bc-black tracking-[0.02em]">
          <slot name="body">I Servizi Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.</slot>
        </p>
        <NuxtLink to="/servizi" class="bc-ghost"><slot name="cta">Scopri i servizi →</slot></NuxtLink>
      </div>
      </div>

    </div>
  </section>
</template>
