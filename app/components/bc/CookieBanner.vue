<!-- Banner cookie GDPR — si mostra al primo accesso, ricorda la scelta in localStorage -->
<script setup lang="ts">
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
      class="fixed bottom-0 left-0 right-0 z-50 bg-bc-canvas border-t border-bc-black
             px-[24px] tablet:px-bc-page py-[24px]"
      role="dialog"
      aria-label="Preferenze cookie"
    >
      <div class="max-w-bc-wrap mx-auto flex flex-col tablet:flex-row tablet:items-center
                  gap-[16px] tablet:gap-[40px]">

        <!-- Testo -->
        <p class="font-sans text-bc-body2 font-light text-bc-black tracking-[0.02em] leading-[1.5] flex-1">
          Questo sito utilizza cookie tecnici necessari al funzionamento.
          Per maggiori informazioni consulta la
          <NuxtLink to="/cookie-policy" class="underline hover:opacity-60">Cookie Policy</NuxtLink>
          e la
          <NuxtLink to="/privacy-policy" class="underline hover:opacity-60">Privacy Policy</NuxtLink>.
        </p>

        <!-- Azioni -->
        <div class="flex items-center gap-[24px] shrink-0">
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
