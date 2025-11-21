import type { Project } from '~/assets/data/projects'

export const useProject = async (slug: string): Promise<Project | null> => {
    if (!slug) {
        console.warn('Slug manquant')
        return null
    }

    const { $supabase } = useNuxtApp()

    if (!$supabase) {
        console.warn('Supabase non disponible, utilisation des données statiques')
        // Fallback vers les données statiques si Supabase n'est pas configuré
        const { projectsData } = await import('~/assets/data/projects')
        return projectsData.find(p => p.slug === slug) || null
    }

    try {
        // Essayer de trouver le projet avec le slug exact
        let { data, error } = await $supabase
            .from('projects')
            .select('*')
            .eq('slug', slug)
            .single()

        // Si pas trouvé, essayer avec une recherche insensible à la casse
        if (error && error.code === 'PGRST116') {
            console.log('Projet non trouvé avec slug exact, recherche alternative...')
            const { data: allProjects } = await $supabase
                .from('projects')
                .select('*')

            if (allProjects) {
                data = allProjects.find((p: any) =>
                    p.slug?.toLowerCase() === slug.toLowerCase() ||
                    p.slug?.replace(/-/g, '_') === slug.replace(/-/g, '_')
                ) || null
                error = data ? null : { code: 'PGRST116', message: 'Not found' } as any
            }
        }

        if (error) {
            console.error('Erreur lors de la récupération du projet:', error)
            // Fallback vers les données statiques en cas d'erreur
            const { projectsData } = await import('~/assets/data/projects')
            return projectsData.find(p => p.slug === slug) || null
        }

        if (!data) {
            return null
        }

        // Transformer les données Supabase pour correspondre au type Project
        let tags = data.tags
        if (typeof tags === 'string') {
            try {
                tags = JSON.parse(tags)
            } catch {
                tags = tags.split(',').map((t: string) => t.trim())
            }
        }
        if (!Array.isArray(tags)) {
            tags = []
        }

        // Extraire l'URL de l'image depuis le HTML si nécessaire
        let coverUrl = data.cover || ''
        if (coverUrl && coverUrl.includes('<img')) {
            const imgMatch = coverUrl.match(/<img[^>]+src=['"]([^'"]+)['"]/i)
            if (imgMatch && imgMatch[1]) {
                coverUrl = imgMatch[1]
            }
        }

        return {
            slug: data.slug,
            title: data.title,
            description: data.description,
            tags: tags,
            year: typeof data.year === 'string' ? parseInt(data.year) : (data.year || new Date().getFullYear()),
            role: data.role || '',
            cover: coverUrl,
            link: data.link || undefined
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du projet:', error)
        // Fallback vers les données statiques en cas d'erreur
        const { projectsData } = await import('~/assets/data/projects')
        return projectsData.find(p => p.slug === slug) || null
    }
}

