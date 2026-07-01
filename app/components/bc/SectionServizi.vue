<!-- Figma: 590:1417 — section 3 "I servizi" — immagine sx + divider + testo dx -->
<!-- Tablet 590:2197: due colonne da md (768px) -->
<template>
  <section class="w-full px-bc-page overflow-hidden">
    <div class="mx-auto max-w-bc-content
                flex flex-col md:flex-row md:items-center md:justify-between
                py-bc-2xl md:py-0 lg:h-[713px]
                gap-bc-xl md:gap-0">
      <!-- Immagine -->
      <div
        v-reveal
        class="flex items-center md:flex-1 lg:flex-none lg:shrink-0 md:py-bc-2xl lg:py-[64px]"
      >
        <div class="w-full lg:w-[442px] aspect-[442/553] bg-bc-black/10 overflow-hidden">
          <slot name="image">
            <img src="" alt="I servizi" class="w-full h-full object-cover" />
          </slot>
        </div>
      </div>
      <!-- Divider verticale (da tablet in su) -->
      <div class="hidden md:block self-stretch w-px bg-bc-black mx-bc-xl lg:mx-0 shrink-0" />
      <!-- Testo + CTA -->
      <div
        v-reveal="{ delay: '0.15s' }"
        class="flex flex-col gap-bc-xl items-start md:flex-1 lg:flex-none lg:w-[437px] md:py-bc-2xl lg:py-0"
      >
        <div class="flex flex-col gap-bc-xl">
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
