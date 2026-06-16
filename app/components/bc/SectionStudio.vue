<!-- Figma: 590:1405 — section 1 "Lo studio" — h=713, border top+bottom, divider verticale -->
<!-- Tablet 590:2197: due colonne da md (768px) -->
<template>
  <section class="w-full border-t border-b border-bc-black px-bc-page overflow-hidden">
    <div class="mx-auto max-w-bc-content
                flex flex-col md:flex-row md:items-center md:justify-between
                py-bc-2xl md:py-0 lg:h-[713px]
                gap-bc-xl md:gap-0">
      <!-- Testo + CTA -->
      <div class="flex flex-col gap-bc-xl items-start justify-center md:flex-1 lg:flex-none lg:w-[442px] md:py-bc-2xl lg:py-0">
        <div class="flex flex-col gap-bc-xl">
          <h2 class="font-garamond text-bc-h2 font-semibold text-bc-black tracking-[0.02em]">
            <slot name="title">Lo studio</slot>
          </h2>
          <p class="font-garamond text-bc-body1 font-normal text-bc-black tracking-[0.02em]">
            <slot name="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.</slot>
          </p>
        </div>
        <NuxtLink to="/studio" class="bc-btn"><slot name="cta">Scopri lo studio</slot></NuxtLink>
      </div>
      <!-- Divider verticale (da tablet in su) -->
      <div class="hidden md:block self-stretch w-px bg-bc-black mx-bc-xl lg:mx-bc-2xl shrink-0" />
      <!-- Immagine -->
      <div class="flex items-center md:flex-1 lg:flex-none md:py-bc-2xl lg:py-bc-4xl">
        <div class="w-full lg:w-[443px] aspect-[443/553] bg-bc-black/10 overflow-hidden">
          <slot name="image">
            <img src="" alt="Lo studio" class="w-full h-full object-cover" />
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>
