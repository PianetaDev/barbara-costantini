<!-- Figma: 590:1479 — Contatti: split layout testo + immagine, linea verticale centrale -->
<template>
  <div class="relative min-h-[calc(100vh-107px)] flex flex-col">
    <section class="flex-1 w-full px-bc-page">
      <div class="max-w-[1142px] mx-auto relative">

        <!-- Linea verticale centrale (desktop) -->
        <div class="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-bc-black" aria-hidden="true" />

        <div class="flex flex-col lg:flex-row items-start gap-bc-4xl py-bc-4xl">

          <!-- Colonna sinistra: testo -->
          <div class="flex flex-col gap-bc-2xl lg:w-1/2 lg:pr-bc-4xl">
            <h1 class="font-garamond text-bc-h1 font-semibold text-bc-black tracking-[0.02em]">
              Contatti
            </h1>
            <div class="flex flex-col gap-bc-md">
              <p class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:32px; line-height:1.2;">
                bb.costantini@gmail.com
              </p>
              <p class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:32px; line-height:1.2;">
                +39 349 6718022
              </p>
              <p class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:32px; line-height:1.2;">
                Largo dell'Olgiata 15 -<br />00123 Roma
              </p>
              <p class="font-garamond font-normal text-bc-black tracking-[0.02em]" style="font-size:32px; line-height:1.2;">
                @barbara_costantini
              </p>
            </div>
          </div>

          <!-- Colonna destra: immagine -->
          <div class="lg:w-1/2 lg:pl-bc-4xl flex items-center py-bc-xl lg:py-0">
            <div class="w-full max-w-[443px] aspect-[443/553] overflow-hidden bg-bc-black/10">
              <!-- immagine verrà da CMS -->
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>
