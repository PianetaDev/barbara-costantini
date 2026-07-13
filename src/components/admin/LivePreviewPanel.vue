<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{ src: string }>()

const isOpen = ref(false)
const iframeRef = ref<HTMLIFrameElement>()

function reload() {
  if (iframeRef.value) {
    iframeRef.value.src = iframeRef.value.src
  }
}

onMounted(() => window.addEventListener('preview-refresh', reload))
onUnmounted(() => window.removeEventListener('preview-refresh', reload))
</script>

<template>
  <button
    @click="isOpen = !isOpen"
    class="fixed bottom-[32px] right-[32px] z-50 flex items-center gap-[8px] px-[16px] py-[10px] bg-bc-black text-bc-canvas font-sans text-[13px] font-light tracking-[0.04em] uppercase hover:opacity-80 transition-opacity shadow-lg"
  >
    <span v-if="!isOpen">◎ Preview</span>
    <span v-else>✕ Chiudi</span>
  </button>

  <Transition name="slide">
    <aside v-if="isOpen" class="fixed top-0 right-0 z-40 h-screen w-[600px] bg-white border-l border-bc-black flex flex-col shadow-2xl">
      <div class="px-[20px] py-[14px] border-b border-bc-black flex items-center justify-between shrink-0">
        <p class="font-sans text-[11px] uppercase tracking-widest text-bc-black/40">Preview — {{ src }}</p>
        <button @click="reload" class="font-sans text-[11px] text-bc-black/60 hover:text-bc-black underline underline-offset-2">
          ↺ Ricarica
        </button>
      </div>
      <iframe
        ref="iframeRef"
        :src="src"
        class="flex-1 w-full border-none"
        title="preview"
      />
    </aside>
  </Transition>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 0.2s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
