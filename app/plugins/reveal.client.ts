// Direttiva v-reveal: fade + slide-up al primo ingresso nel viewport
// Uso: v-reveal  oppure  v-reveal="{ delay: '0.15s' }"
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    mounted(el: HTMLElement, binding) {
      const delay: string = binding.value?.delay ?? '0s'
      const ease = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

      el.style.opacity = '0'
      el.style.transform = 'translateY(28px)'
      el.style.transition = [
        `opacity 0.65s ${ease} ${delay}`,
        `transform 0.65s ${ease} ${delay}`,
      ].join(', ')

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1'
            el.style.transform = 'translateY(0)'
            observer.disconnect()
          }
        },
        { threshold: 0.07, rootMargin: '0px 0px -48px 0px' }
      )
      observer.observe(el)
    },
  })
})
