<!-- Figma: 590:1395 — footer -->
<template>
  <footer class="bc-container py-8 border-t border-bc-black/10 mt-bc-xl">
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <p class="font-garamond text-bc-base font-medium">Barbara Costantini Restauro Srl</p>
        <p class="font-sans text-bc-xs text-bc-black/50 mt-1">© 2026 Barbara Costantini Restauro Srl</p>
      </div>
      <nav class="flex items-center gap-6">
        <NuxtLink to="/cookie-policy" class="font-sans text-bc-xs text-bc-black/50 hover:text-bc-black transition-colors">Cookie Policy</NuxtLink>
        <NuxtLink to="/privacy-policy" class="font-sans text-bc-xs text-bc-black/50 hover:text-bc-black transition-colors">Privacy Policy</NuxtLink>
      </nav>
    </div>
  </footer>
</template>
