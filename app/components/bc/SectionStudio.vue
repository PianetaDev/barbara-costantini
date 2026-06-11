<!-- Figma: 590:1405 — section 1 "Lo studio" — h=713, border top+bottom, divider verticale -->
<template>
  <section class="w-full border-t border-b border-bc-black">
    <div class="mx-auto max-w-bc-content flex items-center justify-between h-[713px]">
      <!-- Testo + CTA -->
      <div class="flex flex-col gap-bc-xl items-start justify-center w-[442px]">
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
      <!-- Divider verticale -->
      <div class="self-stretch w-px bg-bc-black/20 mx-bc-2xl shrink-0" />
      <!-- Immagine -->
      <div class="flex items-center py-bc-4xl">
        <div class="w-[443px] h-[553px] bg-bc-black/10 overflow-hidden">
          <slot name="image">
            <img src="" alt="Lo studio" class="w-full h-full object-cover" />
          </slot>
        </div>
      </div>
    </div>
  </section>
</template>
