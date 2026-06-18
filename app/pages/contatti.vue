<!-- Figma: 590:1479 desktop / 551:3422 mobile — Contatti -->
<template>
  <div class="relative flex-1 flex flex-col">

    <!-- Linea verticale centrale: solo desktop, copre tutta l'altezza -->
    <div class="hidden lg:block absolute inset-y-0 left-1/2 w-px bg-bc-black" aria-hidden="true" />

    <!-- MOBILE / TABLET: stack verticale -->
    <div class="lg:hidden flex flex-col">
      <!-- Testo centrato -->
      <div class="flex flex-col gap-bc-2xl items-start px-[24px] py-bc-4xl">
        <h1 v-reveal class="font-garamond text-bc-h1 font-semibold text-bc-black tracking-[0.02em] w-full">
          Contatti
        </h1>
        <div v-reveal="{ delay: '0.12s' }" class="flex flex-col gap-bc-md w-full">
          <a href="mailto:bb.costantini@gmail.com" class="font-garamond font-normal text-bc-black tracking-[0.02em] hover:opacity-60 transition-opacity" style="font-size:32px; line-height:1.2;">
            bb.costantini@gmail.com
          </a>
          <p class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:32px; line-height:1.2;">
            +39 349 6718022
          </p>
          <p class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:32px; line-height:1.2;">
            Largo dell'Olgiata 15 -<br />00123 Roma
          </p>
          <a href="https://instagram.com/barbara_costantini" target="_blank" rel="noopener noreferrer" class="font-garamond font-normal text-bc-black tracking-[0.02em] hover:opacity-60 transition-opacity" style="font-size:32px; line-height:1.2;">
            @barbara_costantini
          </a>
        </div>
      </div>
      <!-- Linea orizzontale separatrice -->
      <div class="w-full h-px bg-bc-black" aria-hidden="true" />
      <!-- Immagine sotto -->
      <div v-reveal="{ delay: '0.15s' }" class="px-[24px] py-bc-4xl">
        <div class="w-full aspect-[342/427] overflow-hidden bg-bc-black/10">
          <img src="/images/bc-003.jpg" alt="Restauro documenti" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    <!-- DESKTOP: split layout -->
    <section class="hidden lg:flex flex-1 w-full px-bc-page">
      <div class="max-w-[1142px] mx-auto w-full h-full">
        <div class="flex flex-row items-center gap-bc-4xl py-bc-4xl h-full">

          <!-- Colonna sinistra: testo -->
          <div v-reveal class="flex flex-col gap-bc-2xl w-1/2 pr-bc-4xl">
            <h1 class="font-garamond text-bc-h1 font-semibold text-bc-black tracking-[0.02em]">
              Contatti
            </h1>
            <div class="flex flex-col gap-bc-md">
              <a href="mailto:bb.costantini@gmail.com" class="font-garamond font-normal text-bc-black tracking-[0.02em] hover:opacity-60 transition-opacity" style="font-size:32px; line-height:1.2;">
                bb.costantini@gmail.com
              </a>
              <p class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:32px; line-height:1.2;">
                +39 349 6718022
              </p>
              <p class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:32px; line-height:1.2;">
                Largo dell'Olgiata 15 -<br />00123 Roma
              </p>
              <a href="https://instagram.com/barbara_costantini" target="_blank" rel="noopener noreferrer" class="font-garamond font-normal text-bc-black tracking-[0.02em] hover:opacity-60 transition-opacity" style="font-size:32px; line-height:1.2;">
                @barbara_costantini
              </a>
            </div>
          </div>

          <!-- Colonna destra: immagine -->
          <div v-reveal="{ delay: '0.15s' }" class="w-1/2 pl-bc-4xl flex justify-start items-center">
            <div class="w-full max-w-[443px] aspect-[443/553] overflow-hidden bg-bc-black/10">
              <img src="/images/bc-003.jpg" alt="Restauro documenti" class="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>
