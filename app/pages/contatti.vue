<!-- Figma: 590:1479 desktop / 551:3422 mobile — Contatti -->
<template>
  <div class="relative flex-1 flex flex-col">

    <!-- Linea verticale centrale: da tablet in su, copre tutta l'altezza -->
    <div class="hidden md:block absolute inset-y-0 left-1/2 w-px bg-bc-black" aria-hidden="true" />

    <!-- MOBILE: stack verticale -->
    <div class="md:hidden flex flex-col">
      <!-- Testo -->
      <div class="flex flex-col gap-bc-2xl items-start px-[24px] py-[64px]">
        <h1 v-reveal class="font-garamond text-bc-h1 font-medium text-bc-black tracking-[0.02em] w-full">
          Contatti
        </h1>
        <div v-reveal="{ delay: '0.12s' }" class="flex flex-col gap-bc-md w-full">
          <a href="mailto:bb.costantini@gmail.com" class="font-garamond font-light text-bc-black tracking-[0.02em] hover:font-medium hover:underline" style="font-size:20px; line-height:1.2;">
            bb.costantini@gmail.com
          </a>
          <a href="https://instagram.com/barbara_costantini" target="_blank" rel="noopener noreferrer" class="font-garamond font-light text-bc-black tracking-[0.02em] hover:font-medium hover:underline" style="font-size:20px; line-height:1.2;">
            @barbara_costantini
          </a>
          <p class="font-garamond font-light text-bc-black tracking-[0.02em]" style="font-size:20px; line-height:1.2;">
            +39 349 6718022
          </p>
          <p class="font-garamond font-light text-bc-black tracking-[0.02em]" style="font-size:20px; line-height:1.2;">
            Largo dell'Olgiata 15 -<br />00123 Roma
          </p>
        </div>
      </div>
      <!-- Linea orizzontale separatrice -->
      <div class="w-full h-px bg-bc-black" aria-hidden="true" />
      <!-- Immagine sotto -->
      <div v-reveal="{ delay: '0.15s' }" class="px-[24px] py-[64px]">
        <div class="w-full aspect-[342/427] overflow-hidden bg-bc-black/10">
          <img src="/images/bc-055.jpg" alt="Restauro documenti" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    <!-- TABLET + DESKTOP: split layout a 2 colonne -->
    <section class="hidden md:flex flex-1 w-full px-bc-page">
      <div class="max-w-[1142px] mx-auto w-full h-full">
        <div class="flex flex-row items-center gap-bc-4xl py-[64px] h-full">

          <!-- Colonna sinistra: testo -->
          <div v-reveal class="flex flex-col gap-bc-2xl w-1/2 pr-bc-4xl">
            <h1 class="font-garamond text-bc-h1 font-medium text-bc-black tracking-[0.02em]">
              Contatti
            </h1>
            <div class="flex flex-col gap-bc-md">
              <a href="mailto:bb.costantini@gmail.com" class="font-garamond font-light text-bc-black tracking-[0.02em] hover:font-medium hover:underline" style="font-size:20px; line-height:1.2;">
                bb.costantini@gmail.com
              </a>
              <a href="https://instagram.com/barbara_costantini" target="_blank" rel="noopener noreferrer" class="font-garamond font-light text-bc-black tracking-[0.02em] hover:font-medium hover:underline" style="font-size:20px; line-height:1.2;">
                @barbara_costantini
              </a>
              <p class="font-garamond font-light text-bc-black tracking-[0.02em]" style="font-size:20px; line-height:1.2;">
                +39 349 6718022
              </p>
              <p class="font-garamond font-light text-bc-black tracking-[0.02em]" style="font-size:20px; line-height:1.2;">
                Largo dell'Olgiata 15 -<br />00123 Roma
              </p>
            </div>
          </div>

          <!-- Colonna destra: immagine centrata verticalmente -->
          <div v-reveal="{ delay: '0.15s' }" class="w-1/2 pl-bc-4xl flex justify-start items-center h-full">
            <div class="w-full max-w-[443px] aspect-[443/553] overflow-hidden bg-bc-black/10">
              <img src="/images/bc-055.jpg" alt="Restauro documenti" class="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>
