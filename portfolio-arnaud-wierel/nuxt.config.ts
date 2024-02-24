// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    shim: false
  },
  css: ['~/assets/css/main.scss'],
  modules: [
    '@nuxt/image',
    'nuxt-icon'
  ],
  image: {
    dir: '~/assets/images'
  },
  
})
