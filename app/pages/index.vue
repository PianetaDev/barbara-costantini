<script setup lang="ts">
useHead({ title: 'Barbara Costantini Restauro' })
</script>

<template>
  <div class="w-full">
    <!-- Hero: testo sx + foto quadrata dx -->
    <section class="w-full px-bc-page overflow-hidden">
      <div class="grid grid-cols-1 lg:grid-cols-2 max-w-bc-wrap mx-auto w-full">
        <div class="py-bc-2xl lg:py-[80px] lg:pr-[80px] flex flex-col gap-bc-xl justify-center">
          <h1 v-reveal class="font-sans text-[32px] lg:text-bc-h1 font-normal text-bc-black tracking-[0.02em] leading-[1.5]">
            Barbara Costantini Restauro&nbsp;&nbsp;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.
          </h1>
          <NuxtLink v-reveal="{ delay: '0.1s' }" to="/studio" class="bc-ghost">Scopri il nostro studio →</NuxtLink>
        </div>
        <div v-reveal="{ delay: '0.1s' }" class="aspect-square overflow-hidden my-[32px]">
          <img src="/images/bc-095.jpg" alt="Barbara Costantini restauro" class="w-full h-full object-cover" />
        </div>
      </div>
    </section>

    <BcSectionLavori :border-top="true" />
    <BcSectionServizi>
      <template #image>
        <img src="/images/bc-002.jpg" alt="I servizi" class="w-full h-full object-cover" />
      </template>
    </BcSectionServizi>
  </div>
</template>
