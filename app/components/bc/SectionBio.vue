<!-- Figma: 590:1429 section 1 — bio persona: immagine sx + divider + nome/ruolo/testo dx -->
<!-- fs: nome=38 fw600, ruolo=24 fw600, bio=22 fw400 (Garamond) -->
<template>
  <section class="w-full border-t border-bc-black px-[24px] tablet:px-bc-page overflow-hidden">
    <div class="mx-auto max-w-bc-wrap w-full
                grid grid-cols-1 tablet:grid-cols-[1fr_1px_1fr]
                py-[48px] tablet:py-0
                gap-y-bc-xl tablet:gap-y-0">
      <!-- Immagine -->
      <div class="flex items-center tablet:py-[80px]">
        <div class="w-full aspect-[443/553] bg-bc-black/10 overflow-hidden">
          <slot name="image">
            <img src="" alt="" class="w-full h-full object-cover" />
          </slot>
        </div>
      </div>
      <!-- Divider verticale (da tablet in su) -->
      <div class="hidden tablet:block self-stretch bg-bc-black" />
      <!-- Testo -->
      <div class="flex flex-col gap-bc-xl items-start justify-center tablet:pl-[80px] tablet:py-[80px]">
        <div class="flex flex-col gap-bc-md">
          <!-- Nome -->
          <h2 class="font-garamond text-[28px] lg:text-bc-h2 font-normal text-bc-black tracking-[0.02em] leading-[1.5]">
            <slot name="nome">Barbara Costantini</slot>
          </h2>
          <!-- Ruolo -->
          <p class="font-garamond text-bc-h4 font-normal text-bc-black tracking-[0.02em]">
            <slot name="ruolo">Ruolo</slot>
          </p>
        </div>
        <!-- Bio -->
        <p class="font-garamond text-bc-body1 font-light text-bc-black tracking-[0.02em]">
          <slot name="bio">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula.</slot>
        </p>
      </div>
    </div>
  </section>
</template>
