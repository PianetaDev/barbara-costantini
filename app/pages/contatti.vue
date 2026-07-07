<!-- Figma: 791:8385 — Contatti: testo sx + immagine square dx -->
<template>
  <div>
    <section class="w-full px-[24px] tablet:px-bc-page overflow-hidden">
      <div class="grid grid-cols-1 tablet:grid-cols-2 tablet:items-center max-w-bc-wrap mx-auto w-full">

        <!-- Testo sx: allineato più internamente (pl cresce da tablet a lg) -->
        <div class="pt-[48px] pb-0 tablet:py-[80px] tablet:pl-[40px] lg:pl-[80px]">
          <div v-reveal class="flex flex-col gap-[32px]">
            <h1 class="font-sans text-[32px] lg:text-bc-h1 font-normal text-bc-black tracking-[0.02em] leading-[1.5]">
              Contatti
            </h1>
            <div v-reveal="{ delay: '0.15s' }" class="flex flex-col gap-[16px]">
              <a
                href="mailto:bb.costantini@gmail.com"
                class="font-sans text-bc-body1 font-light text-bc-black tracking-[0.02em] leading-[1.5] hover:underline"
              >
                bb.costantini@gmail.com
              </a>
              <p class="font-sans text-bc-body1 font-light text-bc-black tracking-[0.02em] leading-[1.5]">
                +39 349 6718022
              </p>
              <p class="font-sans text-bc-body1 font-light text-bc-black tracking-[0.02em] leading-[1.5]">
                Largo dell'Olgiata 15 -<br />00123 Roma
              </p>
              <a
                href="https://instagram.com/barbara_costantini"
                target="_blank"
                rel="noopener noreferrer"
                class="font-sans text-bc-body1 font-light text-bc-black tracking-[0.02em] leading-[1.5] hover:underline"
              >
                @barbara_costantini
              </a>
            </div>
          </div>
        </div>

        <!-- Immagine dx: aspect-square, come home hero -->
        <div v-reveal="{ delay: '0.35s' }" class="aspect-square overflow-hidden my-[32px] tablet:my-0">
          <img src="/images/bc-055.jpg" alt="Restauro" class="w-full h-full object-cover" />
        </div>

      </div>
    </section>
  </div>
</template>
