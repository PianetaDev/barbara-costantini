<script setup lang="ts">
useHead({ title: 'Lo Studio — Barbara Costantini Restauro' })
</script>
<template>
  <div>
    <BcHero>
      <template #title>Lo studio</template>
      <template #image>
        <img src="/images/bc-097.jpg" alt="Lo studio di restauro" class="w-full h-full object-cover" />
      </template>
    </BcHero>
    <BcSectionBio>
      <template #image>
        <img src="/images/bc-030.jpg" alt="Barbara Costantini" class="w-full h-full object-cover" />
      </template>
    </BcSectionBio>
    <BcSectionTeam />
  </div>
</template>
