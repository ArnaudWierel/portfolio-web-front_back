<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import type { Project } from '~/assets/data/projects';

// Définir la page comme route dynamique
definePageMeta({
  layout: false
});

const route = useRoute();
const router = useRouter();

// Récupérer le slug de manière plus robuste
const slug = computed(() => {
  const slugParam = route.params.slug;
  if (Array.isArray(slugParam)) {
    return slugParam[0];
  }
  return slugParam as string;
});

const { isDark, toggleTheme } = useTheme();

const project = ref<Project | null>(null);
const allProjects = ref<Project[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Données enrichies pour le projet (pourraient venir de Supabase plus tard)
const projectDetails = computed(() => {
  if (!project.value) return null;
  
  // Générer des détails basés sur les tags et la description
  const techStack = project.value.tags.filter(tag => 
    ['Nuxt', 'Vue', 'React', 'TypeScript', 'GSAP', 'Three.js', 'WebGL', 'PHP', 'JavaScript'].some(tech => 
      tag.toLowerCase().includes(tech.toLowerCase())
    )
  );
  
  const otherTags = project.value.tags.filter(tag => 
    !techStack.includes(tag)
  );

  return {
    context: `Ce projet a été réalisé en ${project.value.year} dans le cadre de ${project.value.role.toLowerCase()}. ${project.value.description}`,
    challenge: `Le défi principal était de créer une expérience utilisateur exceptionnelle tout en respectant les contraintes techniques et les délais. L'objectif était de ${project.value.description.split('.')[0].toLowerCase()}.`,
    solution: `J'ai développé une solution ${techStack.length > 0 ? 'utilisant ' + techStack.join(', ') : 'sur mesure'} qui répond aux besoins spécifiques du projet. L'approche a été axée sur la performance, l'accessibilité et l'expérience utilisateur.`,
    technologies: techStack.length > 0 ? techStack : project.value.tags,
    features: otherTags.length > 0 ? otherTags : ['Interface moderne', 'Performance optimisée', 'Design responsive'],
    timeline: [
      { phase: 'Découverte', duration: '2 semaines', description: 'Analyse des besoins et définition des objectifs' },
      { phase: 'Conception', duration: '3 semaines', description: 'Design et architecture de la solution' },
      { phase: 'Développement', duration: '6 semaines', description: 'Implémentation et intégration' },
      { phase: 'Tests & Déploiement', duration: '2 semaines', description: 'Validation et mise en production' }
    ],
    results: [
      'Interface utilisateur intuitive et moderne',
      'Performance optimisée pour une expérience fluide',
      'Code maintenable et scalable',
      'Documentation complète du projet'
    ]
  };
});

const relatedProjects = computed(() => {
  if (!project.value || allProjects.value.length === 0) return [];
  return allProjects.value
    .filter(p => p.slug !== project.value?.slug)
    .slice(0, 3);
});

// Fonction pour tronquer le texte
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};


const initAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })
    .from('.site-header .brand', { opacity: 0, y: -20 })
    .from('.site-header .main-nav', { opacity: 0, y: -20 }, '-=0.5')
    .from('.site-header .header-actions', { opacity: 0, y: -20 }, '-=0.5');

  // Animations pour les sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach((section, index) => {
    gsap.from(section, {
      opacity: 0,
      y: 60,
      duration: 0.8,
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });

  // Animation pour la timeline
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    gsap.from(item, {
      opacity: 0,
      x: -30,
      duration: 0.6,
      delay: index * 0.1,
      scrollTrigger: {
        trigger: item,
        start: 'top 85%'
      }
    });
  });

  // Animation pour les résultats
  const resultItems = document.querySelectorAll('.result-item');
  resultItems.forEach((item, index) => {
    gsap.from(item, {
      opacity: 0,
      x: 30,
      duration: 0.6,
      delay: index * 0.1,
      scrollTrigger: {
        trigger: item,
        start: 'top 85%'
      }
    });
  });

  if (project.value?.cover) {
    gsap.from('.project-cover img', {
      opacity: 0,
      scale: 1.1,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.project-cover',
        start: 'top 75%'
      }
    });
  }
};

// Charger les données au montage et lors du changement de route
const loadProject = async () => {
  const currentSlug = slug.value;
  
  if (!currentSlug) {
    error.value = 'Slug du projet manquant';
    loading.value = false;
    return;
  }
  
  // Réinitialiser l'état
  loading.value = true;
  error.value = null;
  project.value = null;
  
  try {
    console.log('Chargement du projet avec slug:', currentSlug);
    console.log('Route complète:', route.path);
    
    const [projectData, projectsData] = await Promise.all([
      useProject(currentSlug),
      useProjects()
    ]);
    
    console.log('Projet récupéré:', projectData);
    console.log('Tous les projets:', projectsData);
    
    if (!projectData) {
      error.value = `Aucun projet trouvé avec le slug "${currentSlug}"`;
      loading.value = false;
      return;
    }
    
    project.value = projectData;
    allProjects.value = projectsData;
    loading.value = false;
    error.value = null;
    
    await nextTick();
    initAnimations();
  } catch (err: any) {
    console.error('Erreur lors du chargement du projet:', err);
    error.value = err.message || 'Une erreur est survenue lors du chargement du projet';
    loading.value = false;
  }
};

// Charger au montage
onMounted(() => {
  loadProject();
});

// Recharger si le slug change
watch(() => route.params.slug, () => {
  loadProject();
});
</script>

<template>
  <div class="project-detail-page">
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
      <div v-if="loading" class="loading">
        <p>Chargement du projet...</p>
      </div>

      <div v-else-if="project && projectDetails" class="project-detail">
        <!-- Hero Section -->
        <section class="project-hero">
          <NuxtLink to="/project" class="back-link">
            <Icon name="ph:arrow-left" size="20" />
            Retour aux projets
          </NuxtLink>
          
          <div class="hero-content">
            <p class="eyebrow">projet</p>
            <h1>{{ project.title }}</h1>
            
            <div class="project-meta">
              <span class="meta-item">
                <Icon name="ph:calendar" size="18" />
                {{ project.year }}
              </span>
              <span class="meta-item">
                <Icon name="ph:user" size="18" />
                {{ project.role }}
              </span>
            </div>

            <p class="project-description">{{ project.description }}</p>

            <div class="project-tags">
              <span 
                v-for="tag in project.tags" 
                :key="tag" 
                class="tag"
              >
                {{ tag }}
              </span>
            </div>

            <div v-if="project.link" class="hero-actions">
              <a 
                :href="project.link" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn primary large"
              >
                Voir le projet en ligne
                <Icon name="ph:arrow-square-out" size="20" />
              </a>
            </div>
          </div>

          <div v-if="project.cover" class="project-cover">
            <img :src="project.cover" :alt="project.title" />
          </div>
        </section>

        <!-- Context Section -->
        <section class="content-section">
          <div class="section-header">
            <h2>Contexte</h2>
            <div class="section-divider"></div>
          </div>
          <div class="section-content">
            <p class="large-text">{{ projectDetails.context }}</p>
          </div>
        </section>

        <!-- Challenge & Solution -->
        <section class="content-section two-columns">
          <div class="column">
            <div class="section-header">
              <h3>
                <Icon name="ph:lightbulb" size="24" />
                Le défi
              </h3>
            </div>
            <p>{{ projectDetails.challenge }}</p>
          </div>
          <div class="column">
            <div class="section-header">
              <h3>
                <Icon name="ph:check-circle" size="24" />
                La solution
              </h3>
            </div>
            <p>{{ projectDetails.solution }}</p>
          </div>
        </section>

        <!-- Technologies -->
        <section class="content-section">
          <div class="section-header">
            <h2>Technologies & Outils</h2>
            <div class="section-divider"></div>
          </div>
          <div class="technologies-grid">
            <div 
              v-for="tech in projectDetails.technologies" 
              :key="tech" 
              class="tech-item"
            >
              <Icon name="ph:code" size="24" />
              <span>{{ tech }}</span>
            </div>
          </div>
        </section>

        <!-- Features -->
        <section class="content-section">
          <div class="section-header">
            <h2>Fonctionnalités principales</h2>
            <div class="section-divider"></div>
          </div>
          <div class="features-grid">
            <div 
              v-for="(feature, index) in projectDetails.features" 
              :key="index" 
              class="feature-item"
            >
              <Icon name="ph:check" size="20" />
              <span>{{ feature }}</span>
            </div>
          </div>
        </section>

        <!-- Timeline -->
        <section class="content-section">
          <div class="section-header">
            <h2>Processus de développement</h2>
            <div class="section-divider"></div>
          </div>
          <div class="timeline">
            <div 
              v-for="(item, index) in projectDetails.timeline" 
              :key="index" 
              class="timeline-item"
            >
              <div class="timeline-marker">
                <span class="timeline-number">{{ index + 1 }}</span>
              </div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <h4>{{ item.phase }}</h4>
                  <span class="timeline-duration">{{ item.duration }}</span>
                </div>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Results -->
        <section class="content-section">
          <div class="section-header">
            <h2>Résultats & Impact</h2>
            <div class="section-divider"></div>
          </div>
          <div class="results-grid">
            <div 
              v-for="(result, index) in projectDetails.results" 
              :key="index" 
              class="result-item"
            >
              <Icon name="ph:star" size="24" />
              <span>{{ result }}</span>
            </div>
          </div>
        </section>

        <!-- Related Projects -->
        <section v-if="relatedProjects.length > 0" class="content-section">
          <div class="section-header">
            <h2>Autres projets</h2>
            <div class="section-divider"></div>
          </div>
          <div class="related-projects">
            <NuxtLink 
              v-for="relatedProject in relatedProjects" 
              :key="relatedProject.slug"
              :to="`/project/${relatedProject.slug}`"
              class="related-project-card"
            >
              <div v-if="relatedProject.cover" class="related-cover">
                <img :src="relatedProject.cover" :alt="relatedProject.title" />
              </div>
              <div class="related-content">
                <h3>{{ relatedProject.title }}</h3>
                <p>{{ truncateText(relatedProject.description, 100) }}</p>
                <span class="related-link">
                  Voir le projet
                  <Icon name="ph:arrow-right" size="16" />
                </span>
              </div>
            </NuxtLink>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="content-section cta-section">
          <div class="cta-content">
            <h2>Intéressé par ce type de projet ?</h2>
            <p>Discutons de votre prochain projet et voyons comment je peux vous aider.</p>
            <div class="cta-buttons">
              <NuxtLink to="/contact" class="btn primary large">
                Me contacter
                <Icon name="ph:envelope" size="20" />
              </NuxtLink>
              <NuxtLink to="/project" class="btn ghost large">
                Voir tous les projets
              </NuxtLink>
            </div>
          </div>
        </section>
      </div>

      <div v-else-if="error || (!loading && !project)" class="not-found">
        <Icon name="ph:file-x" size="64" />
        <h2>Projet non trouvé</h2>
        <p v-if="error">{{ error }}</p>
        <p v-else>Le projet avec le slug "{{ slug }}" n'existe pas ou n'a pas pu être chargé.</p>
        <div class="not-found-actions">
          <NuxtLink to="/project" class="btn primary">
            Retour aux projets
            <Icon name="ph:arrow-left" size="20" />
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>


<style scoped>
.project-detail-page {
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
  max-width: 1400px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

/* Hero Section */
.project-hero {
  margin-bottom: 6rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  text-decoration: none;
  margin-bottom: 2rem;
  transition: color 0.3s ease, transform 0.3s ease;
  font-size: 0.9rem;
}

.back-link:hover {
  color: var(--text-primary);
  transform: translateX(-4px);
}

.hero-content {
  margin-bottom: 3rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.8rem;
  color: var(--text-eyebrow);
  margin-bottom: 0.5rem;
  opacity: 1; /* Assure que l'élément est visible par défaut */
}

.project-hero h1 {
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-family: 'Plus Jakarta Sans', sans-serif;
  line-height: 0.9;
  margin: 0.5rem 0 2rem 0;
  color: var(--text-primary);
}

.project-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.project-description {
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  line-height: 1.8;
  color: var(--text-muted-strong);
  margin-bottom: 2rem;
  max-width: 900px;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.tag {
  border: 1px solid rgba(147, 199, 255, 0.4);
  border-radius: 999px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  color: var(--badge-text);
  background: rgba(89, 166, 254, 0.05);
}

.hero-actions {
  margin-top: 2rem;
}

.project-cover {
  width: 100%;
  max-height: 700px;
  overflow: hidden;
  border-radius: 24px;
  margin-top: 3rem;
  background: var(--card-bg-strong);
  box-shadow: 0 40px 80px rgba(1, 9, 22, 0.45);
}

.project-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Content Sections */
.content-section {
  margin-bottom: 6rem;
}

.section-header {
  margin-bottom: 2.5rem;
}

.section-header h2 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.section-header h3 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 1rem;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), transparent);
  border-radius: 2px;
}

.section-content {
  max-width: 900px;
}

.large-text {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  line-height: 1.9;
  color: var(--text-muted-strong);
}

/* Two Columns */
.two-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-top: 2rem;
}

.column {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 2.5rem;
}

.column p {
  line-height: 1.8;
  color: var(--text-muted-strong);
  font-size: 1.05rem;
}

/* Technologies Grid */
.technologies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.tech-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.tech-item:hover {
  border-color: rgba(89, 166, 254, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(89, 166, 254, 0.15);
}

.tech-item span {
  font-weight: 500;
  color: var(--text-primary);
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  color: var(--text-primary);
}

.feature-item svg {
  color: var(--accent);
  flex-shrink: 0;
}

/* Timeline */
.timeline {
  position: relative;
  padding-left: 2rem;
  border-left: 2px solid var(--card-border);
}

.timeline-item {
  position: relative;
  margin-bottom: 3rem;
  padding-left: 2rem;
}

.timeline-marker {
  position: absolute;
  left: -2.5rem;
  top: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid var(--bg-primary);
}

.timeline-number {
  color: var(--accent-on);
  font-weight: 700;
  font-size: 1rem;
}

.timeline-content {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 2rem;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.timeline-header h4 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin: 0;
}

.timeline-duration {
  padding: 0.4rem 1rem;
  background: rgba(89, 166, 254, 0.15);
  border-radius: 999px;
  font-size: 0.85rem;
  color: var(--accent);
  font-weight: 500;
}

.timeline-content p {
  color: var(--text-muted-strong);
  line-height: 1.7;
  margin: 0;
}

/* Results Grid */
.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.result-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 2rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.result-item:hover {
  border-color: rgba(89, 166, 254, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(89, 166, 254, 0.15);
}

.result-item svg {
  color: var(--accent);
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.result-item span {
  color: var(--text-primary);
  line-height: 1.6;
}

/* Related Projects */
.related-projects {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.related-project-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.related-project-card:hover {
  transform: translateY(-8px);
  border-color: rgba(89, 166, 254, 0.5);
  box-shadow: 0 20px 50px rgba(89, 166, 254, 0.2);
}

.related-cover {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: var(--card-bg-strong);
}

.related-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.related-project-card:hover .related-cover img {
  transform: scale(1.05);
}

.related-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.related-content h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
}

.related-content p {
  color: var(--text-muted-strong);
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
}

.related-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent);
  font-weight: 500;
  font-size: 0.9rem;
}

/* CTA Section */
.cta-section {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  padding: 4rem 3rem;
  text-align: center;
}

.cta-content h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.cta-content p {
  font-size: 1.1rem;
  color: var(--text-muted-strong);
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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

.btn.large {
  padding: 1rem 2.5rem;
  font-size: 1rem;
}

.btn.primary {
  background: var(--accent);
  color: var(--accent-on);
  border-color: var(--accent);
}

.btn.primary:hover {
  background: transparent;
  color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(89, 166, 254, 0.3);
}

.btn.ghost {
  border-color: rgba(89, 166, 254, 0.4);
  color: var(--text-primary);
  background: transparent;
}

.btn.ghost:hover {
  background: rgba(89, 166, 254, 0.1);
  border-color: rgba(89, 166, 254, 0.6);
}

.not-found {
  text-align: center;
  padding: 6rem 2rem;
  color: var(--text-muted);
}

.not-found svg {
  margin-bottom: 1.5rem;
  opacity: 0.5;
  color: var(--text-muted);
}

.not-found h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.not-found p {
  color: var(--text-muted);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.not-found-actions {
  margin-top: 2rem;
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

  .two-columns {
    grid-template-columns: 1fr;
  }

  .timeline {
    padding-left: 1.5rem;
  }

  .timeline-item {
    padding-left: 1.5rem;
  }

  .timeline-marker {
    left: -2rem;
    width: 2.5rem;
    height: 2.5rem;
  }

  .cta-section {
    padding: 3rem 2rem;
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
