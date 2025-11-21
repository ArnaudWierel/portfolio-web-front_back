import coutureLabCover from '~/assets/images/img/1.jpg'
import dataStoriesCover from '~/assets/images/img/4.jpg'
import motionPlaygroundCover from '~/assets/images/img/6.jpg'

export type Project = {
  slug: string
  title: string
  description: string
  tags: string[]
  year: number
  role: string
  cover: string
  link?: string
}

export const projectsData: Project[] = [
  {
    slug: 'couture-lab',
    title: 'Couture Lab',
    description:
      'Plateforme immersive permettant à une maison de couture de présenter ses collections interactives avec narration scrollée et expériences vidéo.',
    tags: ['Nuxt 3', 'GSAP', 'Three.js'],
    year: 2024,
    role: 'Lead Front',
    cover: coutureLabCover,
    link: 'https://www.behance.net/'
  },
  {
    slug: 'data-stories',
    title: 'Data Stories',
    description:
      'Dashboard éditorial mêlant visualisations temps réel et storytelling pour une agence de conseil en innovation.',
    tags: ['Vue 3', 'D3.js', 'TypeScript'],
    year: 2023,
    role: 'Fullstack',
    cover: dataStoriesCover,
    link: 'https://dribbble.com/'
  },
  {
    slug: 'motion-playground',
    title: 'Motion Playground',
    description:
      'Collection d’expériences WebGL et micro-interactions bâties autour de GSAP, Lenis et SplitType pour explorer des concepts UI futuristes.',
    tags: ['Nuxt 3', 'GSAP', 'WebGL'],
    year: 2022,
    role: 'Creative Developer',
    cover: motionPlaygroundCover
  }
]

