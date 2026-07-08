<!-- Banner cookie GDPR — si mostra al primo accesso, ricorda la scelta in localStorage -->
<!-- Porta 1:1 da app/components/bc/CookieBanner.vue — resta Vue island (stato localStorage).
     NuxtLink -> <a>, aggiunti import espliciti ref/onMounted (niente auto-import Nuxt). -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const visible = ref(false)

onMounted(() => {
  if (!localStorage.getItem('bc_cookie_consent')) {
    visible.value = true
  }
})

function accept() {
  localStorage.setItem('bc_cookie_consent', 'accepted')
  visible.value = false
}

function reject() {
  localStorage.setItem('bc_cookie_consent', 'rejected')
  visible.value = false
}
</script>

<template>
  <Transition name="bc-cookie">
    <div
      v-if="visible"
      class="fixed bottom-[16px] right-[16px] z-50 w-[calc(100vw-32px)] tablet:bottom-[24px] tablet:right-[24px] tablet:w-[442px]
             bg-bc-canvas border border-bc-black p-[24px] flex flex-col gap-[24px]"
      role="dialog"
      aria-label="Preferenze cookie"
    >
        <!-- Testo -->
        <p class="font-sans text-bc-body2 font-light text-bc-black tracking-[0.02em] leading-[1.5]">
          Questo sito utilizza cookie tecnici necessari al funzionamento.
          Per maggiori informazioni consulta la
          <a href="/cookie-policy" class="underline hover:opacity-60">Cookie Policy</a>
          e la
          <a href="/privacy-policy" class="underline hover:opacity-60">Privacy Policy</a>.
        </p>

        <!-- Azioni -->
        <div class="flex items-center gap-[24px]">
          <button
            class="font-sans text-bc-btn font-light text-bc-black tracking-[0.02em] underline hover:opacity-60 transition-opacity duration-200"
            @click="reject"
          >
            Rifiuta
          </button>
          <button
            class="font-sans text-bc-btn font-normal text-bc-black tracking-[0.02em]
                   border border-bc-black px-[24px] py-[10px]
                   hover:bg-bc-black hover:text-bc-canvas transition-colors duration-200"
            @click="accept"
          >
            Accetta
          </button>
        </div>
    </div>
  </Transition>
</template>

<style scoped>
.bc-cookie-enter-active,
.bc-cookie-leave-active {
  transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1),
              opacity 0.35s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.bc-cookie-enter-from,
.bc-cookie-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
