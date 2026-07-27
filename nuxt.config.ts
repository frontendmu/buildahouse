export default defineNuxtConfig({
  // Relative, not '~/': in Nuxt 4 '~' resolves to app/, not the project root.
  modules: ['./modules/wiki-links', '@nuxt/content', '@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://buildahouse.mu',
    name: 'buildahouse.mu',
  },

  content: {
    build: {
      markdown: {
        toc: { depth: 3 },
      },
    },
  },

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  compatibilityDate: '2025-07-15',
})
