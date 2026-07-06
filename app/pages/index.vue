<script setup lang="ts">
useHead({ title: 'Barbara Costantini Restauro' })
</script>

<template>
  <div class="w-full">
    <!-- Hero: testo sx + foto quadrata dx -->
    <section class="w-full border-t border-bc-black px-bc-page overflow-hidden">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-[40px] max-w-bc-wrap mx-auto w-full">
        <div class="flex-1 lg:min-w-[442px] py-bc-2xl lg:py-[80px] flex flex-col gap-bc-xl">
          <h1 v-reveal class="font-sans text-[28px] md:text-[34px] lg:text-bc-h1 font-medium text-bc-black tracking-[0.02em]">
            Lorem ipsum dolor sit amet, consectetur
          </h1>
          <p v-reveal="{ delay: '0.1s' }" class="font-garamond text-bc-body1 font-light text-bc-black">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.
          </p>
        </div>
        <div v-reveal="{ delay: '0.1s' }" class="flex-1 min-w-0 aspect-square overflow-hidden my-[32px]">
          <img src="/images/bc-095.jpg" alt="Barbara Costantini restauro" class="w-full h-full object-cover" />
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
