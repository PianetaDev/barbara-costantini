<script setup lang="ts">
useHead({ title: 'Barbara Costantini Restauro' })
</script>

<template>
  <div>
    <BcHero>
      <template #image>
        <img src="/images/bc-095.jpg" alt="Barbara Costantini restauro" class="w-full h-full object-cover" />
      </template>
    </BcHero>
    <BcSectionStudio>
      <template #image>
        <img src="/images/bc-096.jpg" alt="Lo studio" class="w-full h-full object-cover" />
      </template>
    </BcSectionStudio>
    <BcSectionLavori />
    <BcSectionServizi>
      <template #image>
        <img src="/images/bc-090.jpg" alt="I servizi" class="w-full h-full object-cover" />
      </template>
    </BcSectionServizi>
  </div>
</template>
