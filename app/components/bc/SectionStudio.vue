<!-- Figma: 759:2799 — section 1 "Lo studio" — full-width, split 50/50, divider centrale -->
<template>
  <section class="w-full border-t border-b border-bc-black px-bc-page overflow-hidden">
    <div class="flex flex-col lg:flex-row lg:items-stretch max-w-bc-wrap mx-auto w-full">

      <!-- Testo + CTA sx -->
      <div
        v-reveal
        class="flex flex-col gap-bc-xl justify-center lg:w-1/2 py-bc-2xl lg:py-[80px]"
      >
        <div class="flex flex-col gap-bc-xl lg:max-w-[442px]">
          <h2 class="font-garamond text-bc-h2 font-medium text-bc-black tracking-[0.02em]">
            <slot name="title">Lo studio</slot>
          </h2>
          <p class="font-garamond text-bc-body1 font-light text-bc-black tracking-[0.02em]">
            <slot name="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.</slot>
          </p>
        </div>
        <NuxtLink to="/studio" class="bc-btn"><slot name="cta">Scopri lo studio</slot></NuxtLink>
      </div>

      <!-- Divider verticale (solo lg) -->
      <div class="hidden lg:block self-stretch w-px bg-bc-black shrink-0" />

      <!-- Immagine dx -->
      <div
        v-reveal="{ delay: '0.15s' }"
        class="flex items-center lg:w-1/2 lg:pl-[105px] py-bc-2xl lg:py-[80px]"
      >
        <div class="w-full aspect-[559/553] bg-bc-black/10 overflow-hidden">
          <slot name="image">
            <img src="" alt="Lo studio" class="w-full h-full object-cover" />
          </slot>
        </div>
      </div>

    </div>
  </section>
</template>
