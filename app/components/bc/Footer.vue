<!-- Figma: 590:1427 — Footer Desktop — border-top, 1440×179 -->
<!-- Mobile 590:1897: colonna singola centrata -->
<!-- Tablet 590:2197: two-column (sx info, dx link) -->
<template>
  <footer class="w-full border-t border-bc-black mt-auto px-bc-page">
    <div>
      <!-- Riga principale -->
      <div class="flex flex-col items-center md:flex-row md:items-end md:justify-between
                  py-bc-xl gap-bc-xl md:gap-0">
        <!-- Info legali -->
        <div class="flex flex-col gap-bc-xs text-center md:text-left">
          <p class="font-sans text-bc-nav font-bold text-bc-black tracking-[0.02em]">
            Barbara Costantini Restauro Srl
          </p>
          <div class="flex flex-col gap-[8px]">
            <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]">P.IVA 14529501000</p>
            <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em]">C.F. CSTBBR83M45H501C</p>
          </div>
        </div>
        <!-- Link legali + copyright -->
        <div class="flex flex-col items-center md:items-end gap-[8px]">
          <div class="flex items-center gap-[6px]">
            <NuxtLink to="/cookie-policy" class="font-sans text-bc-label2 font-light text-bc-black underline tracking-[0.02em]">Cookie Policy</NuxtLink>
            <span class="font-sans text-bc-label2 font-light text-bc-black">|</span>
            <NuxtLink to="/privacy-policy" class="font-sans text-bc-label2 font-light text-bc-black underline tracking-[0.02em]">Privacy Policy</NuxtLink>
          </div>
          <p class="font-sans text-bc-label2 font-light text-bc-black tracking-[0.02em] text-center md:text-right">
            © 2026, Barbara Costantini Restauro Srl · All Rights Reserved
          </p>
        </div>
      </div>
      <!-- Divider + credits -->
      <div class="border-t border-bc-black/20" />
      <div class="flex justify-center py-[16px]">
        <p class="font-sans text-bc-label2 font-light text-bc-black/60 text-center tracking-[0.02em]">
          Energy Class A+ GreenMeter · Designed by Pianeta.studio
        </p>
      </div>
    </div>
  </footer>
</template>
