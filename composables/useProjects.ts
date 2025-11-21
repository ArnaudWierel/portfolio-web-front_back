import type { Project } from '~/assets/data/projects'

export const useProjects = async (): Promise<Project[]> => {
  const { $supabase } = useNuxtApp()

  if (!$supabase) {
    console.warn('Supabase non disponible, utilisation des données statiques')
    // Fallback vers les données statiques si Supabase n'est pas configuré
    const { projectsData } = await import('~/assets/data/projects')
    return projectsData
  }

  try {
    const { data, error } = await $supabase
      .from('projects')
      .select('*')
      .order('year', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des projets:', error)
      console.error('Détails de l\'erreur:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      // Fallback vers les données statiques en cas d'erreur
      const { projectsData } = await import('~/assets/data/projects')
      return projectsData
    }

    // Vérifier si data est null ou vide
    if (!data || data.length === 0) {
      console.warn('Aucun projet trouvé dans Supabase. Vérifiez les permissions RLS (Row Level Security).')
      // Fallback vers les données statiques
      const { projectsData } = await import('~/assets/data/projects')
      return projectsData
    }

    console.log('Projets récupérés depuis Supabase:', data.length)

    // Transformer les données Supabase pour correspondre au type Project
    const projects: Project[] = data.map((project: any) => {
      // Gérer les tags : dans Supabase c'est text[] donc déjà un tableau
      let tags = project.tags
      if (typeof tags === 'string') {
        try {
          // Si c'est une chaîne JSON, parser
          tags = JSON.parse(tags)
        } catch {
          // Si le parsing échoue, essayer de splitter
          tags = tags.split(',').map((t: string) => t.trim())
        }
      }
      // S'assurer que tags est un tableau
      if (!Array.isArray(tags)) {
        tags = []
      }

      // Extraire l'URL de l'image depuis le HTML si nécessaire
      let coverUrl = project.cover || ''
      if (coverUrl && coverUrl.includes('<img')) {
        // Extraire l'URL depuis l'attribut src de la balise img
        const imgMatch = coverUrl.match(/<img[^>]+src=['"]([^'"]+)['"]/i)
        if (imgMatch && imgMatch[1]) {
          coverUrl = imgMatch[1]
        }
      }

      return {
        slug: project.slug,
        title: project.title,
        description: project.description,
        tags: tags,
        year: typeof project.year === 'string' ? parseInt(project.year) : (project.year || new Date().getFullYear()),
        role: project.role || '',
        cover: coverUrl,
        link: project.link || undefined
      }
    })

    return projects
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error)
    // Fallback vers les données statiques en cas d'erreur
    const { projectsData } = await import('~/assets/data/projects')
    return projectsData
  }
}

