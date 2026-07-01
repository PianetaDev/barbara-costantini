<script setup lang="ts">
useHead({ title: 'Barbara Costantini Restauro' })
</script>

<template>
  <div>
    <BcHero>
      <template #title>Lorem ipsum dolor sit amet</template>
      <template #subtext>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.</template>
      <template #image>
        <img src="/images/bc-095.jpg" alt="Barbara Costantini restauro" class="w-full h-full object-cover" />
      </template>
    </BcHero>
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
