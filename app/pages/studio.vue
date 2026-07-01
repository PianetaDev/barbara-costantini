<script setup lang="ts">
useHead({ title: 'Lo Studio — Barbara Costantini Restauro' })
</script>
<template>
  <div>
    <BcHero>
      <template #title>Lorem ipsum dolor sit amet</template>
      <template #subtext>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.</template>
      <template #image>
        <img src="/images/bc-097.jpg" alt="Lo studio di restauro" class="w-full h-full object-cover" />
      </template>
    </BcHero>
    <BcSectionBio>
      <template #image>
        <img src="/images/bc-030.jpg" alt="Barbara Costantini" class="w-full h-full object-cover" />
      </template>
    </BcSectionBio>
    <BcSectionTeam :membri="[
      { nome: 'Nome Cognome 1', ruolo: 'Ruolo', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula.', image: '/images/bc-066.jpg' },
      { nome: 'Nome Cognome 2', ruolo: 'Ruolo', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula.', image: '/images/bc-066.jpg' },
      { nome: 'Nome Cognome 3', ruolo: 'Ruolo', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis. Ut elementum mi eu dui tincidunt laoreet. Proin neque lorem, dapibus eu eros in, hendrerit laoreet erat. Mauris euismod orci in mauris vehicula vehicula.', image: '/images/bc-066.jpg' },
    ]" />
  </div>
</template>
