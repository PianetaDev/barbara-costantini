<!-- Figma: 590:1417 — section 3 "I servizi" — immagine sx + divider + testo dx -->
<template>
  <section class="w-full">
    <div class="mx-auto max-w-bc-content flex items-center justify-between h-[713px]">
      <!-- Immagine -->
      <div class="flex items-center py-bc-4xl shrink-0">
        <div class="w-[442px] h-[553px] bg-bc-black/10 overflow-hidden">
          <slot name="image">
            <img src="" alt="I servizi" class="w-full h-full object-cover" />
          </slot>
        </div>
      </div>
      <!-- Divider verticale -->
      <div class="self-stretch w-px bg-bc-black/20 shrink-0" />
      <!-- Testo + CTA -->
      <div class="flex flex-col gap-bc-xl items-start w-[437px]">
        <div class="flex flex-col gap-bc-xl">
          <h2 class="font-garamond text-bc-h2 font-semibold text-bc-black tracking-[0.02em]">
            <slot name="title">I servizi</slot>
          </h2>
          <p class="font-garamond text-bc-body1 font-normal text-bc-black tracking-[0.02em]">
            <slot name="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.</slot>
          </p>
        </div>
        <NuxtLink to="/servizi" class="bc-btn"><slot name="cta">Scopri i servizi</slot></NuxtLink>
      </div>
    </div>
  </section>
</template>
