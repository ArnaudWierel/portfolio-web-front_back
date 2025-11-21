// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  typescript: {
    shim: false
  },

  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap'
        }
      ]
    }
  },

  css: ['~/assets/css/main.scss', '~/assets/css/base.css'],

  modules: [
    '@nuxt/image',
    'nuxt-icon',
    '@hypernym/nuxt-anime',
    '@hypernym/nuxt-gsap'
  ],

  image: {
    dir: '~/assets/images'
  },

  anime: {
    composables: true
  },

  gsap: {
    composables: true,
    provide: false
  },

  nitro: {
    prerender: {
      ignore: ['/home', '/project', '/project/**'], // Exclude `/home` and `/project` routes from prerendering
      crawlLinks: false
    }
  },

  // S'assurer que les routes dynamiques sont bien générées
  router: {
    options: {
      strict: false
    }
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_ANON_KEY || ''
    }
  },

  compatibilityDate: '2025-02-11'
})