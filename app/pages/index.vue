<script setup lang="ts">
useHead({ title: 'Barbara Costantini Restauro' })
</script>

<template>
  <div class="w-full">
    <!-- Hero: foto full-width, altezza fissa 500px -->
    <section class="w-full overflow-hidden relative" style="height:500px;">
      <img src="/images/bc-095.jpg" alt="Barbara Costantini restauro" class="absolute inset-0 w-full h-full object-cover" />
    </section>

    <!-- Hero testo: 2 colonne con divider centrale -->
    <section class="w-full border-t border-bc-black px-bc-page overflow-hidden">
      <div class="flex flex-col lg:flex-row lg:items-stretch max-w-bc-wrap mx-auto w-full">
        <div v-reveal class="flex items-center lg:w-1/2 py-bc-2xl lg:py-[64px]">
          <h1 class="font-sans text-[28px] md:text-[34px] lg:text-bc-h1 font-medium text-bc-black tracking-[0.02em] lg:max-w-[443px]">
            Lorem ipsum dolor sit amet, consectetur
          </h1>
        </div>
        <div class="hidden lg:block self-stretch w-px bg-bc-black shrink-0" />
        <div v-reveal="{ delay: '0.1s' }" class="flex items-center lg:w-1/2 lg:pl-[105px] py-bc-2xl lg:py-[64px]">
          <p class="font-garamond text-bc-body1 font-light text-bc-black lg:max-w-[442px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.
          </p>
        </div>
      </div>
    </section>

    <BcSectionStudio>
      <template #image>
        <img src="/images/bc-097.jpg" alt="Lo studio" class="w-full h-full object-cover" />
      </template>
    </BcSectionStudio>
    <BcSectionLavori />
    <BcSectionServizi>
      <template #image>
        <img src="/images/bc-002.jpg" alt="I servizi" class="w-full h-full object-cover" />
      </template>
    </BcSectionServizi>
  </div>
</template>
