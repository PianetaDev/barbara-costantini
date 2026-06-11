export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/icon'],
  app: {
    head: {
      title: 'Barbara Costantini Restauro',
      htmlAttrs: { lang: 'it' },
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Public+Sans:wght@300;400;500;600;700&display=swap' },
      ],
    },
  },
})
