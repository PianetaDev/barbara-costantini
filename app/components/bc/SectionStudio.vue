<!-- Figma: 590:1429 — Lo studio: testo sx + immagine dx -->
<template>
  <section class="bc-container bc-section border-t border-bc-black/10">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="font-garamond text-bc-2xl mb-6">Lo studio</h2>
        <p class="font-sans text-bc-base text-bc-black/80 leading-relaxed mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <NuxtLink to="/studio" class="bc-btn">Scopri lo studio</NuxtLink>
      </div>
      <div class="aspect-[4/3] bg-bc-black/10 overflow-hidden">
        <img src="" alt="Lo studio" class="w-full h-full object-cover" />
      </div>
    </div>
  </section>
</template>
