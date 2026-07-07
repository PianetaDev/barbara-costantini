<script setup lang="ts">
useHead({ title: 'Lo Studio — Barbara Costantini Restauro' })
</script>
<template>
  <div>
    <!-- Hero: stessa struttura della home — testo sx + foto quadrata dx -->
    <section class="w-full px-[24px] tablet:px-bc-page overflow-hidden">
      <div class="grid grid-cols-1 tablet:grid-cols-2 tablet:items-center max-w-bc-wrap mx-auto w-full">
        <div class="pt-[48px] pb-0 tablet:py-[80px] tablet:pr-[80px] flex flex-col gap-bc-xl justify-center">
          <h1 v-reveal="{ delay: '0.2s' }" class="font-sans text-[28px] lg:text-bc-h1 font-normal text-bc-black tracking-[0.02em] leading-[1.5]">
            Lo studio&nbsp;&nbsp;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia.
          </h1>
        </div>
        <div v-reveal="{ delay: '0.35s' }" class="aspect-square overflow-hidden my-[32px]">
          <img src="/images/bc-097.jpg" alt="Lo studio di restauro" class="w-full h-full object-cover" />
        </div>
      </div>
    </section>
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
