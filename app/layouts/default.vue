<template>
  <div class="min-h-screen flex flex-col bg-bc-canvas">
    <BcNav />
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
    <BcFooter />
  </div>
</template>
