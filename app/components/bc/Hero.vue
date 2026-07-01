<!-- Figma: 590:1413 — Hero, y=107, 1376×1101 -->
<!-- H1 56px SemiBold centrato + immagine 1142×642 + subtext 440px centrato -->
<template>
  <section class="flex flex-col items-center py-bc-2xl lg:py-[64px] px-bc-page max-w-bc-wrap mx-auto">
    <h1
      v-reveal
      class="font-sans text-[28px] md:text-[34px] lg:text-bc-h1 font-medium text-center text-bc-black tracking-[0.02em] max-w-[908px] mb-[24px]"
    >
      <slot name="title">Titolo Lorem Ipsum</slot>
    </h1>
    <p
      v-reveal="{ delay: '0.12s' }"
      class="font-garamond text-bc-body1 font-light text-center text-bc-black max-w-[440px] mb-[48px]"
    >
      <slot name="subtext">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris rhoncus ipsum vel commodo lacinia. Etiam gravida sapien arcu, ac convallis elit bibendum quis.</slot>
    </p>
    <div
      v-reveal="{ delay: '0.24s' }"
      class="w-full max-w-[1142px] aspect-[1142/642] bg-bc-black/10 overflow-hidden"
    >
      <slot name="image">
        <img src="" alt="" class="w-full h-full object-cover" />
      </slot>
    </div>
  </section>
</template>
