<!-- Figma: 761:3281 — section 3 "I servizi" — full-width, immagine sx + divider + testo dx -->
<template>
  <section class="w-full border-t border-b border-bc-black px-bc-page overflow-hidden">
    <div class="flex flex-col lg:flex-row lg:items-stretch">

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

      <!-- Divider verticale (solo lg) -->
      <div class="hidden lg:block self-stretch w-px bg-bc-black shrink-0" />

      <!-- Testo + CTA dx -->
      <div
        v-reveal="{ delay: '0.15s' }"
        class="flex flex-col gap-bc-xl justify-center lg:w-1/2 lg:pl-[105px] py-bc-2xl lg:py-[80px]"
      >
        <div class="flex flex-col gap-bc-xl lg:max-w-[442px]">
          <h2 class="font-garamond text-bc-h2 font-medium text-bc-black tracking-[0.02em]">
            <slot name="title">I servizi</slot>
          </h2>
          <p class="font-garamond text-bc-body1 font-light text-bc-black tracking-[0.02em]">
            <slot name="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.</slot>
          </p>
        </div>
        <NuxtLink to="/servizi" class="bc-btn"><slot name="cta">Scopri i servizi</slot></NuxtLink>
      </div>

    </div>
  </section>
</template>
