<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  page: string
  initialContent: Record<string, any>
}>()

const isOpen = ref(false)
const content = ref<Record<string, any>>({ ...props.initialContent })

function syncFromForm() {
  const form = document.getElementById('page-form') as HTMLFormElement | null
  if (!form) return
  const fd = new FormData(form)
  const next: Record<string, any> = {}
  for (const [k, v] of fd.entries()) {
    if (typeof v === 'string') {
      try { next[k] = JSON.parse(v) } catch { next[k] = v }
    }
  }
  content.value = next
}

// gruppi/partner come array (dopo parse JSON)
const gruppi = computed(() => Array.isArray(content.value.gruppi) ? content.value.gruppi : [])
const partner = computed(() => Array.isArray(content.value.partner) ? content.value.partner : [])

let timer: ReturnType<typeof setInterval>
onMounted(() => {
  syncFromForm()
  document.getElementById('page-form')?.addEventListener('input', syncFromForm)
  // Polling per i hidden input gestiti dai Vue CRUD components
  timer = setInterval(syncFromForm, 400)
})
onUnmounted(() => {
  clearInterval(timer)
  document.getElementById('page-form')?.removeEventListener('input', syncFromForm)
})
</script>

<template>
  <!-- Toggle fisso in basso a destra -->
  <button
    @click="isOpen = !isOpen"
    class="fixed bottom-[32px] right-[32px] z-50 flex items-center gap-[8px] px-[16px] py-[10px] bg-bc-black text-bc-canvas font-sans text-[13px] font-light tracking-[0.04em] uppercase hover:opacity-80 transition-opacity shadow-lg"
    :aria-expanded="isOpen"
  >
    <span v-if="!isOpen">◎ Preview</span>
    <span v-else>✕ Chiudi</span>
  </button>

  <!-- Pannello laterale -->
  <Transition name="slide">
    <aside
      v-if="isOpen"
      class="fixed top-0 right-0 z-40 h-screen w-[440px] bg-bc-canvas border-l border-bc-black overflow-y-auto flex flex-col"
    >
      <!-- Header pannello -->
      <div class="px-[24px] py-[20px] border-b border-bc-black flex items-center justify-between shrink-0">
        <p class="font-sans text-[11px] uppercase tracking-widest text-bc-black/40">
          Live Preview — {{ page }}
        </p>
        <p class="font-sans text-[11px] text-bc-black/30">aggiornato ogni 400ms</p>
      </div>

      <!-- Contenuto preview -->
      <div class="flex-1 overflow-y-auto">

        <!-- HOME -->
        <template v-if="page === 'home'">
          <div class="px-[32px] py-[40px] border-b border-bc-black/10">
            <p class="font-sans text-[10px] uppercase tracking-widest text-bc-black/30 mb-[16px]">Hero</p>
            <h1 class="font-sans text-[22px] font-normal text-bc-black tracking-[0.02em] leading-[1.5] mb-[16px]">
              {{ content.hero_titolo || 'Titolo' }}
            </h1>
            <p v-if="content.hero_testo" class="font-sans text-[14px] font-light text-bc-black tracking-[0.02em] leading-[1.5]">
              {{ content.hero_testo }}
            </p>
          </div>
        </template>

        <!-- STUDIO -->
        <template v-else-if="page === 'studio'">
          <div class="px-[32px] py-[40px] border-b border-bc-black/10">
            <p class="font-sans text-[10px] uppercase tracking-widest text-bc-black/30 mb-[16px]">Hero</p>
            <h1 class="font-sans text-[22px] font-normal text-bc-black tracking-[0.02em] leading-[1.5] mb-[12px]">
              {{ content.hero_titolo || 'Lo studio' }}
            </h1>
            <p v-if="content.hero_testo" class="font-sans text-[14px] font-light text-bc-black tracking-[0.02em] leading-[1.5]">
              {{ content.hero_testo }}
            </p>
          </div>
          <div class="px-[32px] py-[32px]">
            <p class="font-sans text-[10px] uppercase tracking-widest text-bc-black/30 mb-[16px]">Bio</p>
            <p class="font-sans text-[12px] font-light text-bc-black/50 tracking-widest uppercase mb-[4px]">
              {{ content.bio_ruolo }}
            </p>
            <p class="font-sans text-[14px] font-light text-bc-black tracking-[0.02em] leading-[1.5]">
              {{ content.bio_testo }}
            </p>
          </div>
        </template>

        <!-- LAVORI -->
        <template v-else-if="page === 'lavori'">
          <div class="px-[32px] py-[40px]">
            <p class="font-sans text-[10px] uppercase tracking-widest text-bc-black/30 mb-[16px]">Hero</p>
            <h1 class="font-sans text-[22px] font-normal text-bc-black tracking-[0.02em] leading-[1.5] mb-[12px]">
              {{ content.hero_titolo || 'I lavori' }}
            </h1>
            <p v-if="content.hero_testo" class="font-sans text-[14px] font-light text-bc-black tracking-[0.02em] leading-[1.5]">
              {{ content.hero_testo }}
            </p>
          </div>
        </template>

        <!-- CONTATTI -->
        <template v-else-if="page === 'contatti'">
          <div class="px-[32px] py-[40px]">
            <p class="font-sans text-[10px] uppercase tracking-widest text-bc-black/30 mb-[16px]">Contatti</p>
            <div class="flex flex-col gap-[12px]">
              <div v-if="content.email">
                <p class="font-sans text-[11px] text-bc-black/40 mb-[2px]">Email</p>
                <p class="font-sans text-[14px] font-light text-bc-black">{{ content.email }}</p>
              </div>
              <div v-if="content.instagram">
                <p class="font-sans text-[11px] text-bc-black/40 mb-[2px]">Instagram</p>
                <p class="font-sans text-[14px] font-light text-bc-black">{{ content.instagram }}</p>
              </div>
              <div v-if="content.telefono">
                <p class="font-sans text-[11px] text-bc-black/40 mb-[2px]">Telefono</p>
                <p class="font-sans text-[14px] font-light text-bc-black">{{ content.telefono }}</p>
              </div>
              <div v-if="content.indirizzo">
                <p class="font-sans text-[11px] text-bc-black/40 mb-[2px]">Indirizzo</p>
                <p class="font-sans text-[14px] font-light text-bc-black">{{ content.indirizzo }}</p>
              </div>
            </div>
          </div>
        </template>

        <!-- SERVIZI -->
        <template v-else-if="page === 'servizi'">
          <div class="px-[32px] py-[32px] border-b border-bc-black/10">
            <p class="font-sans text-[10px] uppercase tracking-widest text-bc-black/30 mb-[12px]">Hero</p>
            <h1 class="font-sans text-[20px] font-normal text-bc-black tracking-[0.02em] leading-[1.5] mb-[8px]">
              {{ content.hero_titolo || 'I servizi' }}
            </h1>
            <p v-if="content.hero_testo" class="font-sans text-[13px] font-light text-bc-black/70 leading-[1.5]">
              {{ content.hero_testo }}
            </p>
          </div>
          <div class="px-[32px] py-[24px] border-b border-bc-black/10">
            <p class="font-sans text-[10px] uppercase tracking-widest text-bc-black/30 mb-[16px]">
              Gruppi ({{ gruppi.length }})
            </p>
            <div class="flex flex-col gap-[16px]">
              <div v-for="(g, gi) in gruppi" :key="gi" class="border-l-2 border-bc-black/20 pl-[12px]">
                <p class="font-sans text-[14px] font-normal text-bc-black mb-[4px]">{{ g.titolo || '—' }}</p>
                <p class="font-sans text-[11px] text-bc-black/40">
                  {{ (g.servizi ?? []).length }} voci ·
                  {{ g.immagine || 'nessuna immagine' }}
                </p>
                <ul class="mt-[6px] flex flex-col gap-[2px]">
                  <li v-for="(s, si) in (g.servizi ?? []).slice(0, 4)" :key="si"
                      class="font-sans text-[12px] font-light text-bc-black/60">
                    · {{ s.titolo || '—' }}
                  </li>
                </ul>
              </div>
              <p v-if="gruppi.length === 0" class="font-sans text-[13px] text-bc-black/30">
                Nessun gruppo
              </p>
            </div>
          </div>
          <div class="px-[32px] py-[24px] border-b border-bc-black/10">
            <p class="font-sans text-[10px] uppercase tracking-widest text-bc-black/30 mb-[16px]">
              Partner ({{ partner.length }})
            </p>
            <div class="flex flex-col gap-[8px]">
              <div v-for="(p, pi) in partner" :key="pi" class="flex items-center gap-[12px]">
                <p class="font-sans text-[13px] font-normal text-bc-black">{{ p.titolo || '—' }}</p>
                <p class="font-sans text-[11px] text-bc-black/40">{{ p.immagine || '' }}</p>
              </div>
              <p v-if="partner.length === 0" class="font-sans text-[13px] text-bc-black/30">
                Nessun partner
              </p>
            </div>
          </div>
          <div class="px-[32px] py-[24px]">
            <p class="font-sans text-[10px] uppercase tracking-widest text-bc-black/30 mb-[8px]">CTA</p>
            <p class="font-sans text-[13px] font-light text-bc-black">{{ content.cta_testo || '—' }}</p>
          </div>
        </template>

        <!-- FOOTER -->
        <template v-else-if="page === 'footer'">
          <div class="px-[32px] py-[40px]">
            <p class="font-sans text-[10px] uppercase tracking-widest text-bc-black/30 mb-[16px]">Footer</p>
            <div class="flex flex-col gap-[6px]">
              <p class="font-sans text-[14px] font-normal text-bc-black">{{ content.ragione_sociale }}</p>
              <p class="font-sans text-[12px] font-light text-bc-black/60">P.IVA {{ content.piva }}</p>
              <p class="font-sans text-[12px] font-light text-bc-black/60">C.F. {{ content.cf }}</p>
              <p class="font-sans text-[12px] font-light text-bc-black/60">© {{ content.anno_copyright }}</p>
            </div>
          </div>
        </template>

        <!-- PRIVACY / COOKIE -->
        <template v-else>
          <div class="px-[32px] py-[40px]">
            <p class="font-sans text-[13px] text-bc-black/40">
              Preview non disponibile per questa pagina.
            </p>
          </div>
        </template>

      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
