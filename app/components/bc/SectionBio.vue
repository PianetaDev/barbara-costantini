<!-- Figma: 590:1429 section 1 — bio persona: immagine sx + divider + nome/ruolo/testo dx -->
<!-- fs: nome=38 fw600, ruolo=24 fw600, bio=22 fw400 (Garamond) -->
<template>
  <section class="w-full border-t border-bc-black px-bc-page overflow-hidden">
    <div class="mx-auto max-w-bc-content
                flex flex-col md:flex-row md:items-center md:justify-between
                py-bc-2xl md:py-0 lg:h-[713px]
                gap-bc-xl md:gap-0">
      <!-- Immagine -->
      <div class="flex items-center md:flex-1 lg:flex-none lg:shrink-0 md:py-bc-2xl lg:py-bc-4xl">
        <div class="w-full lg:w-[443px] aspect-[443/553] bg-bc-black/10 overflow-hidden">
          <slot name="image">
            <img src="" alt="" class="w-full h-full object-cover" />
          </slot>
        </div>
      </div>
      <!-- Divider verticale (da tablet in su) -->
      <div class="hidden md:block self-stretch w-px bg-bc-black mx-bc-xl lg:mx-0 shrink-0" />
      <!-- Testo -->
      <div class="flex flex-col gap-bc-xl items-start md:flex-1 lg:flex-none lg:w-[442px] md:py-bc-2xl lg:py-0">
        <div class="flex flex-col gap-bc-md">
          <!-- Nome -->
          <h2 class="font-garamond text-bc-h2 font-semibold text-bc-black tracking-[0.02em] leading-[1.2]">
            <slot name="nome">Barbara Costantini</slot>
          </h2>
          <!-- Ruolo -->
          <p class="font-garamond text-bc-h4 font-semibold text-bc-black tracking-[0.02em]">
            <slot name="ruolo">Ruolo</slot>
          </p>
        </div>
        <!-- Bio -->
        <p class="font-garamond text-bc-body1 font-normal text-bc-black tracking-[0.02em]">
          <slot name="bio">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula.</slot>
        </p>
      </div>
    </div>
  </section>
</template>
