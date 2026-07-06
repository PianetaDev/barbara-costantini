<!-- Figma: 761:3281 — section 3 "I servizi" — full-width, immagine sx + divider + testo dx -->
<template>
  <section class="w-full px-bc-page overflow-hidden border-t border-bc-black">
    <div class="flex flex-col lg:flex-row lg:items-stretch max-w-bc-wrap mx-auto w-full">

      <!-- Immagine sx -->
      <div
        v-reveal
        class="flex items-center lg:w-1/2 lg:pr-[105px] py-bc-2xl lg:py-[80px]"
      >
        <div class="w-full aspect-[559/553] bg-bc-black/10 overflow-hidden">
          <slot name="image">
            <img src="" alt="I servizi" class="w-full h-full object-cover" />
          </slot>
        </div>
      </div>

      <!-- Testo + CTA dx -->
      <div
        v-reveal="{ delay: '0.15s' }"
        class="flex flex-col gap-bc-xl justify-center lg:w-1/2 lg:pl-[40px] py-bc-2xl lg:py-[80px]"
      >
        <p class="font-sans text-bc-body1 font-normal text-bc-black tracking-[0.02em] lg:max-w-[442px]">
          <slot name="body">I Servizi Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.</slot>
        </p>
        <NuxtLink to="/servizi" class="bc-ghost"><slot name="cta">Scopri i servizi →</slot></NuxtLink>
      </div>

    </div>
  </section>
</template>
