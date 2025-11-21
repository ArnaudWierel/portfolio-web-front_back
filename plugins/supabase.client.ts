import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const supabaseUrl = useRuntimeConfig().public.supabaseUrl
  const supabaseKey = useRuntimeConfig().public.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL ou Key manquantes. Vérifiez vos variables d\'environnement.')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  return {
    provide: {
      supabase
    }
  }
})

