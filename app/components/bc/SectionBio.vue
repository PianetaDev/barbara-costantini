<!-- Figma: 817:528 — section 1 bio: immagine 443px sx + divider + testo 443px dx, container bc-content centrato -->
<template>
  <section class="w-full border-t border-bc-black px-[24px] tablet:px-bc-page overflow-hidden">
    <div class="mx-auto max-w-bc-content w-full
                flex flex-col tablet:flex-row tablet:items-center
                py-[48px] tablet:py-0
                gap-y-bc-xl tablet:gap-y-0">

      <!-- Immagine: flex-1 a tablet, 443px fissi da lg -->
      <div v-reveal class="flex items-center tablet:flex-1 lg:flex-none lg:shrink-0 tablet:py-[80px]">
        <div class="w-full lg:w-[443px] aspect-[443/553] bg-bc-black/10 overflow-hidden">
          <slot name="image">
            <img src="" alt="" class="w-full h-full object-cover" />
          </slot>
        </div>
      </div>

      <!-- Divider verticale (da tablet in su) — margine orizzontale a tablet, azzerato a lg -->
      <div class="hidden tablet:block self-stretch w-px bg-bc-black shrink-0 mx-[32px] lg:mx-0" />

      <!-- Testo: flex-1 a tablet, 443px fissi da lg -->
      <div v-reveal="{ delay: '0.15s' }" class="flex flex-col gap-[64px] items-start tablet:flex-1 lg:flex-none lg:w-[443px] lg:shrink-0">
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
