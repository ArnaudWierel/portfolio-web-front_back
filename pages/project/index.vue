<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import type { Project } from '~/assets/data/projects';

const { isDark, toggleTheme } = useTheme();

const projects = ref<Project[]>([]);
const loading = ref(true);
const maxDescriptionLength = 150;
const selectedYear = ref<string | null>(null);
const selectedTag = ref<string | null>(null);

// Fonction pour tronquer le texte
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Statistiques
const stats = computed(() => {
  const totalProjects = projects.value.length;
  const uniqueYears = [...new Set(projects.value.map(p => p.year))].sort((a, b) => b - a);
  const allTags = projects.value.flatMap(p => p.tags);
  const uniqueTags = [...new Set(allTags)];
  
  return {
    total: totalProjects,
    years: uniqueYears,
    tags: uniqueTags,
    latestYear: uniqueYears[0] || new Date().getFullYear()
  };
});

// Projets filtrés
const filteredProjects = computed(() => {
  let filtered = projects.value;
  
  if (selectedYear.value) {
    filtered = filtered.filter(p => p.year.toString() === selectedYear.value);
  }
  
  if (selectedTag.value) {
    filtered = filtered.filter(p => p.tags.includes(selectedTag.value!));
  }
  
  return filtered;
});

// Réinitialiser les filtres
const clearFilters = () => {
  selectedYear.value = null;
  selectedTag.value = null;
};

const initAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })
    .from('.site-header .brand', { opacity: 0, y: -20 })
    .from('.site-header .main-nav', { opacity: 0, y: -20 }, '-=0.5')
    .from('.site-header .header-actions', { opacity: 0, y: -20 }, '-=0.5');

  gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
    .fromTo('.page-header .eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0 })
    .fromTo('.page-header h1', { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, '-=0.4')
    .fromTo('.page-header p', { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, '-=0.5')
    .fromTo('.stats-section', { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, '-=0.4')
    .fromTo('.filters-section', { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, '-=0.3');

  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    gsap.from(card, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      delay: index * 0.1,
      scrollTrigger: {
        trigger: card,
        start: 'top 85%'
      }
    });
  });
};

onMounted(async () => {
  const projectsData = await useProjects();
  projects.value = projectsData;
  loading.value = false;
  
  await nextTick();
  initAnimations();
});
</script>

<template>
  <div class="projects-page">
    <header class="site-header">
      <div class="brand">
        <NuxtLink to="/home" class="brand-link">
          <span class="brand-mark">AW</span>
          <span class="brand-name">Arnaud Wierel</span>
        </NuxtLink>
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
        <NuxtLink to="/contact" class="btn primary small">Parler d'un projet</NuxtLink>
      </div>
    </header>

    <main class="page">
      <div class="page-header">
        <p class="eyebrow">portfolio</p>
        <h1>Mes réalisations</h1>
        <p class="page-description">
          Sélection de projets qui illustrent mon approche entre storytelling, motion design et rigueur technique. 
          Chaque projet représente une collaboration unique où l'innovation rencontre l'excellence.
        </p>
      </div>

      <!-- Stats Section -->
      <section v-if="!loading && projects.length > 0" class="stats-section">
        <div class="stat-card">
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">Projets</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.years.length }}</div>
          <div class="stat-label">Années</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.tags.length }}</div>
          <div class="stat-label">Technologies</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.latestYear }}</div>
          <div class="stat-label">Dernière réalisation</div>
        </div>
      </section>

      <!-- Filters Section -->
      <section v-if="!loading && projects.length > 0" class="filters-section">
        <div class="filters-header">
          <h3>Filtrer les projets</h3>
          <button v-if="selectedYear || selectedTag" @click="clearFilters" class="clear-filters">
            Réinitialiser
            <Icon name="ph:x" size="16" />
          </button>
        </div>
        <div class="filters">
          <div class="filter-group">
            <label>Année</label>
            <div class="filter-buttons">
              <button
                v-for="year in stats.years"
                :key="year"
                @click="selectedYear = selectedYear === year.toString() ? null : year.toString()"
                :class="['filter-btn', { active: selectedYear === year.toString() }]"
              >
                {{ year }}
              </button>
            </div>
          </div>
          <div class="filter-group">
            <label>Technologie</label>
            <div class="filter-buttons">
              <button
                v-for="tag in stats.tags.slice(0, 10)"
                :key="tag"
                @click="selectedTag = selectedTag === tag ? null : tag"
                :class="['filter-btn', { active: selectedTag === tag }]"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div v-if="loading" class="loading">
        <p>Chargement des projets...</p>
      </div>

      <div v-else-if="filteredProjects.length > 0" class="projects-section">
        <div class="projects-header">
          <h2>
            {{ filteredProjects.length }} projet{{ filteredProjects.length > 1 ? 's' : '' }} 
            <span v-if="selectedYear || selectedTag">filtré{{ filteredProjects.length > 1 ? 's' : '' }}</span>
          </h2>
        </div>
        <div class="projects-grid">
          <article 
            v-for="project in filteredProjects" 
            :key="project.slug" 
            class="project-card"
          >
            <div v-if="project.cover" class="project-cover">
              <img :src="project.cover" :alt="project.title" />
              <div class="project-overlay">
                <NuxtLink :to="`/project/${project.slug}`" class="overlay-link">
                  <Icon name="ph:eye" size="24" />
                  Voir les détails
                </NuxtLink>
              </div>
            </div>
            <div class="project-content">
              <div class="project-meta">
                <span class="project-year">
                  <Icon name="ph:calendar" size="14" />
                  {{ project.year }}
                </span>
                <span class="project-role">
                  <Icon name="ph:user" size="14" />
                  {{ project.role }}
                </span>
              </div>
              <h2>{{ project.title }}</h2>
              <p class="project-description">{{ truncateText(project.description, maxDescriptionLength) }}</p>
              <div class="project-tags">
                <span 
                  v-for="tag in project.tags.slice(0, 5)" 
                  :key="tag" 
                  class="tag"
                >
                  {{ tag }}
                </span>
                <span v-if="project.tags.length > 5" class="tag more">
                  +{{ project.tags.length - 5 }}
                </span>
              </div>
              <div class="project-actions">
                <NuxtLink :to="`/project/${project.slug}`" class="btn primary">
                  Voir le projet
                  <Icon name="ph:arrow-right" size="16" />
                </NuxtLink>
                <a 
                  v-if="project.link" 
                  :href="project.link" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="btn ghost"
                  @click.stop
                >
                  Lien externe
                  <Icon name="ph:link" size="16" />
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-else-if="projects.length === 0" class="empty-state">
        <Icon name="ph:folder-open" size="64" />
        <h2>Aucun projet disponible</h2>
        <p>Les projets seront bientôt disponibles.</p>
      </div>

      <div v-else class="empty-state">
        <Icon name="ph:magnifying-glass" size="64" />
        <h2>Aucun projet trouvé</h2>
        <p>Aucun projet ne correspond à vos filtres.</p>
        <button @click="clearFilters" class="btn primary">
          Réinitialiser les filtres
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.projects-page {
  position: relative;
  min-height: 100vh;
  color: var(--text-primary);
  background: var(--bg-primary);
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
  z-index: 20;
  backdrop-filter: blur(24px);
  background: var(--header-bg);
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

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: inherit;
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
  color: var(--text-muted);
  transition: color 0.3s ease;
  text-decoration: none;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-primary);
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
  color: var(--accent-muted);
}

.theme-toggle:hover {
  background: rgba(89, 166, 254, 0.3);
}

.page {
  position: relative;
  z-index: 5;
  padding: clamp(2rem, 8vw, 6rem);
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 6vw, 4rem);
}

.page-header {
  max-width: 900px;
  margin-bottom: 1rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.8rem;
  color: var(--text-eyebrow);
  margin-bottom: 0.5rem;
  opacity: 1; /* Assure que l'élément est visible par défaut */
}

.page-header h1 {
  font-size: clamp(3rem, 8vw, 6rem);
  font-family: 'Plus Jakarta Sans', sans-serif;
  line-height: 0.9;
  margin: 0.5rem 0 1.5rem 0;
  color: var(--text-primary);
}

.page-description {
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.7;
  color: var(--text-muted-strong);
  max-width: 700px;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(89, 166, 254, 0.4);
  box-shadow: 0 10px 30px rgba(89, 166, 254, 0.15);
}

.stat-number {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: var(--accent);
  margin-bottom: 0.5rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Filters Section */
.filters-section {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters-header h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin: 0;
}

.clear-filters {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--card-border);
  border-radius: 999px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.clear-filters:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-group label {
  display: block;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-btn {
  padding: 0.5rem 1.25rem;
  background: transparent;
  border: 1px solid var(--card-border);
  border-radius: 999px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.filter-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.filter-btn.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--accent-on);
}

/* Projects Section */
.projects-section {
  margin-top: 2rem;
}

.projects-header {
  margin-bottom: 2rem;
}

.projects-header h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--text-primary);
  margin: 0;
}

.projects-header h2 span {
  color: var(--text-muted);
  font-weight: 400;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: clamp(2rem, 4vw, 3rem);
}

.project-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  overflow: hidden;
  transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-8px);
  border-color: rgba(89, 166, 254, 0.45);
  box-shadow: 0 25px 65px rgba(2, 15, 36, 0.35);
}

.project-cover {
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: var(--card-bg-strong);
  position: relative;
}

.project-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: rgba(1, 11, 27, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-card:hover .project-cover img {
  transform: scale(1.1);
}

.overlay-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--accent);
  color: var(--accent-on);
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.overlay-link:hover {
  transform: scale(1.05);
}

.project-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.project-meta {
  display: flex;
  gap: 1.5rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.project-year,
.project-role {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.project-content h2 {
  font-size: 1.75rem;
  margin: 0;
  color: var(--text-primary);
  line-height: 1.2;
}

.project-description {
  color: var(--text-muted-strong);
  line-height: 1.6;
  flex: 1;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  border: 1px solid rgba(147, 199, 255, 0.4);
  border-radius: 999px;
  padding: 0.25rem 0.8rem;
  font-size: 0.8rem;
  color: var(--badge-text);
  background: rgba(89, 166, 254, 0.05);
}

.tag.more {
  opacity: 0.7;
  font-style: italic;
}

.project-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.project-actions .btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.85rem;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  text-decoration: none;
  cursor: pointer;
}

.project-actions .btn.primary {
  background: var(--accent);
  color: var(--accent-on);
  border-color: var(--accent);
}

.project-actions .btn.primary:hover {
  background: transparent;
  color: var(--accent);
  transform: translateX(4px);
}

.project-actions .btn.ghost {
  border-color: rgba(89, 166, 254, 0.4);
  color: var(--text-primary);
  background: transparent;
}

.project-actions .btn.ghost:hover {
  background: rgba(89, 166, 254, 0.1);
  border-color: rgba(89, 166, 254, 0.6);
}

.empty-state {
  text-align: center;
  padding: 6rem 2rem;
  color: var(--text-muted);
}

.empty-state svg {
  margin-bottom: 1.5rem;
  opacity: 0.5;
}

.empty-state h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
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
  text-decoration: none;
  cursor: pointer;
}

.btn.small {
  padding: 0.6rem 1.2rem;
  font-size: 0.75rem;
}

.btn.primary {
  background: var(--accent);
  color: var(--accent-on);
  border-color: var(--accent);
}

.btn.primary:hover {
  background: transparent;
  color: var(--accent);
}

@media (max-width: 900px) {
  .site-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

<style>
:root {
  --bg-primary: #010b1b;
  --text-primary: #d9eaff;
  --text-muted: #9fbff7;
  --text-muted-strong: #a9c7ff;
  --text-eyebrow: rgba(217, 234, 255, 0.6);
  --card-bg: rgba(0, 11, 28, 0.7);
  --card-bg-strong: rgba(0, 11, 28, 0.8);
  --card-border: rgba(89, 166, 254, 0.2);
  --header-bg: rgba(1, 11, 27, 0.85);
  --accent: #59a6fe;
  --accent-on: #011a36;
  --accent-muted: #7ab0ee;
  --badge-text: #9ec7ff;
}

:root[data-theme='light'] {
  --bg-primary: #f4f6fb;
  --text-primary: #0c1b32;
  --text-muted: #53617a;
  --text-muted-strong: #3f4c63;
  --text-eyebrow: rgba(12, 27, 50, 0.5);
  --card-bg: rgba(255, 255, 255, 0.9);
  --card-bg-strong: rgba(255, 255, 255, 0.97);
  --card-border: rgba(12, 27, 50, 0.08);
  --header-bg: rgba(255, 255, 255, 0.9);
  --accent: #0052cc;
  --accent-on: #f7fbff;
  --accent-muted: #1f3f84;
  --badge-text: #1f3f84;
}
</style>

