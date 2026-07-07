// Direttiva v-reveal: fade + slide-up al primo ingresso nel viewport
// Uso: v-reveal  oppure  v-reveal="{ delay: '0.15s' }"
// getSSRProps rende la direttiva compatibile con il SSR di Nuxt
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    getSSRProps() {
      return { style: 'opacity:0;transform:translateY(28px)' }
    },
    mounted(el: HTMLElement, binding) {
      const delay: string = binding.value?.delay ?? '0s'
      const ease = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

      el.style.opacity = '0'
      el.style.transform = 'translateY(28px)'
      el.style.transition = [
        `opacity 0.65s ${ease} ${delay}`,
        `transform 0.65s ${ease} ${delay}`,
      ].join(', ')

      function reveal() {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
        observer.disconnect()
        clearTimeout(fallback)
      }

      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) reveal() },
        { threshold: 0.01, rootMargin: '0px 0px 100px 0px' }
      )

      // fallback: se dopo 900ms l'observer non ha sparato (hydration mismatch, etc.) rivela comunque
      const fallback = setTimeout(reveal, 900)

      // double rAF: garantisce che il browser dipinga opacity:0 prima che l'observer scatti
      requestAnimationFrame(() => requestAnimationFrame(() => observer.observe(el)))
    },
  })
})
