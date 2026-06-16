export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
    ['@nuxtjs/sanity', { projectId: process.env.SANITY_PROJECT_ID || '', dataset: process.env.SANITY_DATASET || 'production', apiVersion: '2024-01-01', useCdn: true }],
  ],

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: process.env.NITRO_PRESET || 'vercel',
  },

  app: {
    head: {
      title: 'Barbara Costantini Restauro',
      htmlAttrs: { lang: 'it' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Barbara Costantini Restauro — restauro conservativo di opere d\'arte e beni culturali.' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Public+Sans:wght@300;400;500;600;700&display=swap' },
      ],
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
