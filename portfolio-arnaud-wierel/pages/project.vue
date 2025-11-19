<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import type { Project } from '~/assets/data/projects';
import { useTheme } from '~/composables/useTheme';

const { data: projectsResponse, pending, error, refresh } = await useFetch<Project[]>('/api/projects');
const projects = computed(() => projectsResponse.value ?? []);
const featuredProject = computed(() => projects.value[0]);

const tags = computed(() => {
  const unique = new Set<string>();
  projects.value.forEach((project) => project.tags.forEach((tag) => unique.add(tag)));
  return ['Tous', ...unique];
});

const activeTag = ref('Tous');

const filteredProjects = computed(() => {
  if (activeTag.value === 'Tous') return projects.value;
  return projects.value.filter((project) => project.tags.includes(activeTag.value));
});

const { isDark, toggleTheme, hydrateTheme } = useTheme();

let gsapCtx: gsap.Context | null = null;

const initProjectAnimations = () => {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);
  gsapCtx = gsap.context(() => {
    gsap.timeline({ defaults: { duration: 0.9, ease: 'power3.out' } })
      .fromTo(
        '.projects-hero .eyebrow',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0 }
      )
      .fromTo(
        '.projects-hero h1',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, onComplete: () => gsap.set('.projects-hero h1', { clearProps: 'opacity,visibility,transform' }) },
        '-=0.4'
      )
      .fromTo(
        '.projects-hero .hero-copy p',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, onComplete: () => gsap.set('.projects-hero .hero-copy p', { clearProps: 'opacity,visibility,transform' }) },
        '-=0.4'
      )
      .fromTo(
        '.projects-hero .hero-cta .btn',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          onComplete: () => gsap.set('.projects-hero .hero-cta .btn', { clearProps: 'opacity,visibility,transform' })
        },
        '-=0.4'
      );

    const fadeUp = (selector: string) => {
      gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 40,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%'
          }
        });
      });
    };

    fadeUp('.featured-project');
    fadeUp('.filter-pill');
    fadeUp('.project-card');
    fadeUp('.process-step');
    fadeUp('.project-cta');
  }, '.projects-page');
};

const handleFilter = (tag: string) => {
  activeTag.value = tag;
};

onMounted(() => {
  hydrateTheme();
  initProjectAnimations();
});

onUnmounted(() => {
  gsapCtx?.revert();
  gsapCtx = null;
});
</script>

<template>
  <div class="projects">
    <header class="site-header">
      <div class="brand">
        <span class="brand-mark">AW</span>
        <span class="brand-name">Arnaud Wierel</span>
      </div>
      <nav class="main-nav" aria-label="Navigation principale">
        <NuxtLink to="/home" class="nav-link">Home</NuxtLink>
        <NuxtLink to="/about" class="nav-link">About</NuxtLink>
        <NuxtLink to="/project" class="nav-link">Projects</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">Contact</NuxtLink>
      </nav>
      <div class="header-actions">
        <button class="theme-toggle" @click="toggleTheme" :aria-label="`Basculer en thème ${isDark ? 'clair' : 'sombre'}`">
          <Icon :name="isDark ? 'ph:sun-bold' : 'ph:moon-bold'" size="22" />
        </button>
        <NuxtLink to="/contact" class="btn primary small">Discuter d’un projet</NuxtLink>
      </div>
    </header>

    <main class="projects-page">
      <section class="projects-hero">
        <div class="hero-copy">
          <p class="eyebrow">selected work</p>
          <h1>Des expériences digitales pensées comme des manifestes.</h1>
          <p>
            Sélection de projets où motion, narration et ingénierie s’entremêlent pour créer des expériences premium.
          </p>
          <div class="hero-cta">
            <NuxtLink to="/contact" class="btn primary">Démarrer une collaboration</NuxtLink>
            <a href="mailto:hello@arnaudwierel.com" class="btn ghost">Écrire un email</a>
          </div>
        </div>
        <div class="featured-project" v-if="featuredProject">
          <p class="eyebrow">highlight</p>
          <h3>{{ featuredProject.title }}</h3>
          <p>{{ featuredProject.description }}</p>
          <ul class="project-meta">
            <li v-for="tag in featuredProject.tags" :key="tag">{{ tag }}</li>
          </ul>
          <p class="project-year">{{ featuredProject.year }} — {{ featuredProject.role }}</p>
          <NuxtLink v-if="featuredProject.link" :to="featuredProject.link" class="btn ghost" target="_blank">Voir en détail</NuxtLink>
        </div>
      </section>

      <section class="filters">
        <p class="eyebrow">filtrer</p>
        <div class="filter-pills">
          <button
            v-for="tag in tags"
            :key="tag"
            class="filter-pill"
            :class="{ active: activeTag === tag }"
            @click="handleFilter(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </section>

      <section v-if="pending" class="projects-state">
        <p>Chargement des projets…</p>
      </section>

      <section v-else-if="error" class="projects-state">
        <p>Impossible de récupérer les projets pour le moment.</p>
        <button class="btn ghost" @click="refresh()">Réessayer</button>
      </section>

      <section v-else class="projects-grid">
        <article v-for="project in filteredProjects" :key="project.slug" class="project-card">
          <div class="project-cover">
            <img :src="project.cover" :alt="project.title" loading="lazy" />
          </div>
          <div class="project-content">
            <div class="project-headline">
              <p class="project-year">{{ project.year }}</p>
              <p class="project-role">{{ project.role }}</p>
            </div>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <ul class="project-tags">
              <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
            </ul>
            <div class="project-actions">
              <NuxtLink v-if="project.link" :to="project.link" target="_blank" class="btn ghost">Case study</NuxtLink>
              <NuxtLink to="/contact" class="btn primary">Parler du projet</NuxtLink>
            </div>
          </div>
        </article>
      </section>

      <section class="process">
        <div class="section-heading">
          <p class="eyebrow">process</p>
          <h2>Un accompagnement end-to-end.</h2>
        </div>
        <div class="process-steps">
          <article class="process-step">
            <span>01</span>
            <h3>Vision & cadrage</h3>
            <p>Workshops, moodboards, définition du ton, KPIs et architecture motion.</p>
          </article>
          <article class="process-step">
            <span>02</span>
            <h3>Design & prototypage</h3>
            <p>Design system, prototypage haute fidélité, transitions GSAP documentées.</p>
          </article>
          <article class="process-step">
            <span>03</span>
            <h3>Build & delivery</h3>
            <p>Nuxt 3, WebGL, automatisation CI/CD, handover complet avec monitoring.</p>
          </article>
        </div>
      </section>

      <section class="project-cta">
        <div>
          <p class="eyebrow">next project</p>
          <h2>Vous avez une idée forte à mettre en scène ?</h2>
          <p>Je travaille avec les studios, agences et marques sur des dispositifs premium. Parlons-en.</p>
        </div>
        <div class="cta-actions">
          <NuxtLink to="/contact" class="btn primary">Prendre contact</NuxtLink>
          <a href="mailto:hello@arnaudwierel.com" class="btn ghost">Envoyer un email</a>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.projects {
  min-height: 100vh;
  background: var(--bg-primary, #010b1b);
  color: var(--text-primary, #d9eaff);
}

.projects-page {
  padding: clamp(2rem, 6vw, 5rem);
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vw, 3.5rem);
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: clamp(1rem, 4vw, 2rem);
  position: sticky;
  top: 0;
  z-index: 30;
  backdrop-filter: blur(24px);
  background: var(--header-bg, rgba(1, 11, 27, 0.85));
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.brand-mark {
  display: inline-flex;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(89, 166, 254, 0.2);
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--accent, #59a6fe);
}

.brand-name {
  color: var(--text-primary, #d9eaff);
}

.main-nav {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.nav-link {
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.75rem;
  color: var(--text-muted, #9fbff7);
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-primary, #d9eaff);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.theme-toggle {
  background: rgba(89, 166, 254, 0.15);
  border: 1px solid rgba(89, 166, 254, 0.3);
  border-radius: 999px;
  padding: 0.4rem 0.7rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
  color: var(--accent, #59a6fe);
}

.theme-toggle:hover {
  background: rgba(89, 166, 254, 0.3);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.8rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.85rem;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.btn.primary {
  background: var(--accent, #59a6fe);
  color: var(--accent-on, #011a36);
  border-color: var(--accent, #59a6fe);
}

.btn.primary:hover {
  background: transparent;
  color: var(--accent, #59a6fe);
}

.btn.ghost {
  border-color: rgba(89, 166, 254, 0.4);
  color: var(--text-primary, #d9eaff);
}

.btn.ghost:hover {
  background: rgba(89, 166, 254, 0.1);
}

.btn.small {
  padding: 0.6rem 1.2rem;
  font-size: 0.75rem;
}

.projects-hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
  border-radius: clamp(1.5rem, 4vw, 3rem);
  padding: clamp(2rem, 5vw, 4rem);
  background: linear-gradient(135deg, rgba(4, 16, 35, 0.95), rgba(5, 36, 78, 0.9));
  position: relative;
  overflow: hidden;
}

.projects-hero .hero-copy :is(h1, p, .eyebrow) {
  color: #f8fbff;
}

.projects-hero .hero-copy .btn.ghost {
  color: #f8fbff;
  border-color: rgba(248, 251, 255, 0.6);
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
}

.featured-project {
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.3));
  border-radius: clamp(1rem, 3vw, 2rem);
  padding: clamp(1.5rem, 4vw, 3rem);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.featured-project {
  color: #f8fbff;
}

.featured-project .btn.ghost,
.projects-hero .hero-cta .btn {
  color: #f8fbff;
  border-color: rgba(248, 251, 255, 0.6);
}

.project-meta,
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.project-meta li,
.project-tags li {
  border: 1px solid rgba(89, 166, 254, 0.35);
  border-radius: 999px;
  padding: 0.3rem 0.9rem;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-pill {
  border-radius: 999px;
  border: 1px solid rgba(89, 166, 254, 0.3);
  padding: 0.45rem 1.4rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.75rem;
  background: transparent;
  color: var(--text-primary, #d9eaff);
  transition: all 0.3s ease;
}

.filter-pill.active {
  background: var(--accent, #59a6fe);
  border-color: var(--accent, #59a6fe);
  color: #011a36;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
}

.projects-state {
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.3));
  border-radius: clamp(1rem, 3vw, 2rem);
  padding: clamp(1.5rem, 4vw, 3rem);
  background: var(--card-bg, rgba(0, 11, 28, 0.7));
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.project-card {
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.25));
  border-radius: clamp(1rem, 3vw, 2rem);
  overflow: hidden;
  background: var(--card-bg, rgba(0, 11, 28, 0.7));
  display: flex;
  flex-direction: column;
}

.project-cover {
  position: relative;
  padding-top: 60%;
}

.project-cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
}

.project-headline {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-eyebrow, rgba(217, 234, 255, 0.6));
}

.project-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.process-step {
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.25));
  border-radius: 20px;
  padding: 1.5rem;
  background: var(--card-bg, rgba(0, 11, 28, 0.7));
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.process-step span {
  font-size: 0.9rem;
  letter-spacing: 0.3em;
  color: var(--text-eyebrow, rgba(217, 234, 255, 0.6));
}

.project-cta {
  border-radius: clamp(1.5rem, 4vw, 3rem);
  padding: clamp(2rem, 5vw, 4rem);
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.3));
  background: var(--card-bg, rgba(0, 11, 28, 0.8));
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem;
  align-items: center;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.8rem;
  color: var(--text-eyebrow, rgba(217, 234, 255, 0.6));
}

:global(:root[data-theme='light']) .projects {
  background: var(--bg-primary, #f4f6fb);
  color: var(--text-primary, #0c1b32);
}

:global(:root[data-theme='light']) .projects-hero {
  background: linear-gradient(135deg, rgba(233, 240, 255, 0.95), rgba(255, 255, 255, 0.95));
}

:global(:root[data-theme='light']) .projects-hero .hero-copy :is(h1, p, .eyebrow) {
  color: var(--text-primary, #0c1b32);
}

:global(:root[data-theme='light']) .projects-hero .hero-copy .btn.ghost {
  color: var(--text-primary, #0c1b32);
  border-color: rgba(12, 27, 50, 0.15);
}

:global(:root[data-theme='light']) :is(.featured-project, .project-card, .process-step, .project-cta) {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(12, 27, 50, 0.08);
  color: var(--text-primary, #0c1b32);
}

:global(:root[data-theme='light']) .filter-pill {
  border-color: rgba(12, 27, 50, 0.15);
  color: var(--text-primary, #0c1b32);
}

:global(:root[data-theme='light']) .filter-pill.active {
  color: #f7fbff;
}

@media (max-width: 640px) {
  .projects-page {
    padding: 1.5rem;
  }

  .site-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>