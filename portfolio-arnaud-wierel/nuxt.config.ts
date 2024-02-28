// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    shim: false
  },
  css: ['~/assets/css/main.scss'],
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
    provide: false
  }
})
