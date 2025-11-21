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
      // Fallback vers les données statiques en cas d'erreur
      const { projectsData } = await import('~/assets/data/projects')
      return projectsData
    }

    // Transformer les données Supabase pour correspondre au type Project
    const projects: Project[] = data.map((project: any) => ({
      slug: project.slug,
      title: project.title,
      description: project.description,
      tags: typeof project.tags === 'string' ? JSON.parse(project.tags) : project.tags,
      year: typeof project.year === 'string' ? parseInt(project.year) : project.year,
      role: project.role,
      cover: project.cover,
      link: project.link || undefined
    }))

    return projects
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error)
    // Fallback vers les données statiques en cas d'erreur
    const { projectsData } = await import('~/assets/data/projects')
    return projectsData
  }
}

