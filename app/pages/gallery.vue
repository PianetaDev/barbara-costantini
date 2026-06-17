<!-- Figma: 590:1571 — Gallery aperta -->
<script setup lang="ts">
useHead({ title: 'Gallery — Barbara Costantini Restauro' })
</script>
<template>
  <div>
    <!-- Hero gallery: title + description centrati -->
    <section class="w-full border-b border-bc-black px-bc-page py-bc-4xl">
      <div class="mx-auto max-w-[908px] flex flex-col items-center gap-bc-2xl text-center">
        <h1 v-reveal class="font-garamond text-[36px] md:text-[44px] lg:text-bc-h1 font-semibold text-bc-black tracking-[0.02em] leading-[1.2]">
          Gallery fotografica
        </h1>
        <p v-reveal="{ delay: '0.12s' }" class="font-garamond text-bc-sub font-normal text-bc-black tracking-[0.02em] max-w-[438px]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.
        </p>
      </div>
    </section>
    <BcSectionGallery />
  </div>
</template>
