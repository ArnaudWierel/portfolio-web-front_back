<script setup lang="ts">
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import type { Project } from '~/assets/data/projects';

useHead({
  title: 'Accueil'
});

const projects = ref<Project[]>([]);

// Charger les projets depuis Supabase
onMounted(async () => {
  const projectsData = await useProjects();
  projects.value = projectsData;
});
const highlights = ref([
  {
    title: 'Design moderne & animations fluides',
    description: 'Création de sites élégants avec animations maîtrisées, micro-interactions et transitions fluides pour une expérience de navigation agréable.',
    badge: 'Motion / GSAP'
  },
  {
    title: 'Sites rapides & performants',
    description: 'Développement sur-mesure avec des technologies modernes pour garantir vitesse, stabilité et un référencement naturel optimisé.',
    badge: 'Front & Back'
  },
  {
    title: 'Accompagnement complet',
    description: "De l'idée au site en ligne : conseil, design, développement, mise en ligne, SEO de base et formation pour gérer votre site en autonomie.",
    badge: 'End-to-end'
  }
]);

const timelineMilestones = ref([
  '2021 — Début de l\'activité · Création de premiers sites vitrines',
  '2023 — Collaborations avec créateurs & petites entreprises',
  '2025 — Studio indépendant · Ouvert aux nouveaux projets'
]);

const { isDark, toggleTheme } = useTheme();

const initAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })
    .from('.site-header .brand', { opacity: 0, y: -20 })
    .from('.site-header .main-nav', { opacity: 0, y: -20 }, '-=0.5')
    .from('.site-header .header-actions', { opacity: 0, y: -20 }, '-=0.5');

  gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
    .fromTo('.hero .eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0 })
    .fromTo('.hero-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, '-=0.4')
    .fromTo('.hero-lead', { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, '-=0.5')
    .fromTo(
      '.hero-cta .btn',
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, stagger: 0.1 },
      '-=0.5'
    );

  const animateCards = (selector: string) => {
    gsap.utils.toArray<HTMLElement>(selector).forEach((element, index) => {
      gsap.from(element, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        delay: index * 0.05,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%'
        }
    });
  });
};

  animateCards('.about-media');
  animateCards('.about-content');
  animateCards('.highlight-card');
  animateCards('.project-card');
  animateCards('.contact-cta');

  const stackSection = document.querySelector('.stack');
  const projectsSection = document.querySelector('.projects');
  if (stackSection && projectsSection) {
    const cards = stackSection.querySelectorAll('.stack-card');
    gsap.set(cards, { opacity: 0.2, scale: 0.92 });
    gsap.set(projectsSection, { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0 });

    const stackTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: stackSection,
        start: 'top 20%',
        end: () => '+=' + cards.length * 260,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        pinSpacing: true
      }
    });

    cards.forEach((card, index) => {
      stackTimeline
        .to(
          card,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out'
          },
          index
        )
        .to(
          card,
          {
            opacity: 0.15,
            scale: 0.9,
            duration: 0.6,
            ease: 'power2.in'
          },
          index + 0.6
    );
  });

    stackTimeline
      .to(
        stackSection,
        {
          opacity: 0.3,
          scale: 0.85,
          yPercent: -10,
          filter: 'blur(6px)',
          duration: 0.8,
          ease: 'power2.inOut'
        },
        cards.length - 0.3
      )
      .to(
        projectsSection,
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 0.9,
          ease: 'power2.out'
        },
        cards.length - 0.4
      );
  }
};

onMounted(() => {
  initAnimations();
});
</script>

<template>
  <div class="home">
    <header class="site-header">
      <div class="brand">
        <span class="brand-mark">AW</span>
        <span class="brand-name">Arnaud Wierel</span>
      </div>
      <nav class="main-nav" aria-label="Navigation principale">
        <NuxtLink to="/" class="nav-link">Home</NuxtLink>
        <NuxtLink to="/about" class="nav-link">About</NuxtLink>
        <NuxtLink to="/project" class="nav-link">Projects</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">Contact</NuxtLink>
      </nav>
      <div class="header-actions">
        <button class="theme-toggle" @click="toggleTheme" :aria-label="`Basculer en thème ${isDark ? 'clair' : 'sombre'}`">
          <Icon :name="isDark ? 'ph:sun-bold' : 'ph:moon-bold'" size="22" />
        </button>
        <NuxtLink to="/contact" class="btn primary small">Parler d’un projet</NuxtLink>
      </div>
    </header>

    <main class="page">
      <section class="hero">
        <div class="hero-media" aria-hidden="true">
          <VideoBackground scoped />
          <div class="hero-media__gradient"></div>
    </div>

        <p class="eyebrow">creative developer</p>
        <h1 class="hero-title">Arnaud Wierel</h1>
        <p class="hero-lead">
          Je crée des sites web professionnels, modernes et performants. Design soigné, animations élégantes et développement propre pour donner une vraie identité à votre entreprise.
        </p>
        <div class="hero-cta">
          <NuxtLink to="/contact" class="btn primary">Commencer un projet ensemble</NuxtLink>
          <NuxtLink to="/project" class="btn ghost">Découvrir mes réalisations</NuxtLink>
        </div>
      </section>

      <section class="about">
        <div class="about-media">
          <img src="/assets/aboutmedia.png" alt="Disponible pour de nouveaux projets" />
        </div>
        <div class="about-content">
          <p class="eyebrow">à propos</p>
          <h2>Créateur de sites web dédiés aux entreprises</h2>
          <p>
            Je crée des sites web sur-mesure pour donner une présence en ligne claire, moderne et professionnelle. Mon approche combine design, optimisation et animations maîtrisées pour offrir un site agréable, efficace et simple à gérer. J'accompagne entrepreneurs, artisans, associations et petites entreprises pour valoriser leur activité en ligne.
          </p>
          <div class="about-timeline">
            <div class="about-timeline__item" v-for="milestone in timelineMilestones" :key="milestone">
              {{ milestone }}
            </div>
      </div>
    </div>
      </section>

      <section class="highlights">
        <p class="eyebrow">ce que je fais</p>
        <h2 class="highlights-title">Créer des expériences numériques soignées</h2>
        <div class="highlights-grid">
          <article
            v-for="(highlight, index) in highlights"
            :key="highlight.title"
            class="highlight-card"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            <span class="highlight-badge">{{ highlight.badge }}</span>
            <h3>{{ highlight.title }}</h3>
            <p>{{ highlight.description }}</p>
          </article>
        </div>
      </section>

      <section class="stack">
        <p class="eyebrow">stack & outils</p>
        <h2 class="stack-title">Technologies utilisées pour créer vos sites web</h2>
        <div class="stack-grid">
          <article class="stack-card">
            <h3>Web & Design</h3>
            <p>WordPress · Elementor · JetEngine · Nuxt 3 · HTML/CSS · Tailwind · Figma.</p>
          </article>
          <article class="stack-card">
            <h3>Animations & UX</h3>
            <p>GSAP · micro-interactions · transitions fluides · design responsive.</p>
          </article>
          <article class="stack-card">
            <h3>Gestion & optimisation</h3>
            <p>SEO de base · optimisation des performances · Cloudflare Pages · OVH · bonnes pratiques techniques.</p>
          </article>
        </div>
      </section>

      <section class="projects">
        <div class="section-heading">
          <p class="eyebrow">portfolio</p>
          <h2>Projets finalisés</h2>
          <p class="section-copy">
            Sélection de réalisations terminées qui illustrent mon approche entre storytelling, motion design et rigueur technique.
          </p>
      </div>

        <div class="projects-grid">
          <article v-for="project in projects" :key="project.slug" class="project-card">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
            <ul class="project-tags">
              <li v-for="tag in project.tags" :key="tag">{{ tag }}</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="contact-cta">
        <div>
          <p class="eyebrow">discutons</p>
          <h2>Prêt à imaginer votre prochain projet ?</h2>
          <p>J’accompagne studios et marques sur des expériences premium. Nous pouvons parler d’un projet en cours ou d’une idée.</p>
      </div>
        <div class="contact-actions">
          <NuxtLink to="/contact" class="btn primary">Planifier un call</NuxtLink>
          <NuxtLink to="/project" class="btn ghost">Voir mon travail</NuxtLink>
    </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home {
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

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.8rem;
  color: var(--text-eyebrow);
  opacity: 1; /* Assure que l'élément est visible par défaut */
}

.hero-title {
  font-size: clamp(3rem, 15vw, 10rem);
  font-family: 'Plus Jakarta Sans', sans-serif;
  line-height: 0.9;
  margin: 0.5rem 0;
  color: #f8fbff;
}

.hero {
  position: relative;
  padding: clamp(2rem, 4vw, 3rem);
  border-radius: clamp(1.5rem, 4vw, 3rem);
  overflow: hidden;
  background: var(--hero-bg);
}

.hero-media {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  z-index: 0;
}

.hero-media__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(1, 11, 27, 0.5), rgba(1, 11, 27, 0.95) 60%);
}

.hero > *:not(.hero-media) {
  position: relative;
  z-index: 2;
}

.hero-lead {
  max-width: 560px;
  font-size: clamp(1rem, 2vw, 1.4rem);
  line-height: 1.5;
  color: var(--text-muted);
}

.hero .eyebrow {
  color: rgba(247, 250, 255, 0.7);
}

.hero .hero-lead {
  color: #d4e7ff;
}

.hero .btn.primary {
  background: #59a6fe;
  border-color: #59a6fe;
  color: #011a36;
}

.hero .btn.primary:hover {
  background: transparent;
  color: #59a6fe;
}

.hero .btn.ghost {
  border-color: rgba(247, 250, 255, 0.5);
  color: #f7faff;
}

.hero .btn.ghost:hover {
  background: rgba(247, 250, 255, 0.15);
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
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

.btn.ghost {
  border-color: rgba(89, 166, 254, 0.4);
  color: var(--text-primary);
}

.btn.ghost:hover {
  background: rgba(89, 166, 254, 0.1);
}

.about {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: center;
}

.about-media {
  position: relative;
  min-height: 360px;
  border-radius: 32px;
  overflow: hidden;
  background: var(--card-bg-strong);
  animation: aboutGlow 2.5s ease-in-out infinite alternate;
}

.about-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.about-content h2 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin: 0.5rem 0;
}

.about-content p {
  color: var(--text-muted-strong);
  line-height: 1.6;
}

.about-timeline {
  margin-top: 1.5rem;
  display: grid;
  gap: 0.75rem;
}

.about-timeline__item {
  border-left: 2px solid rgba(89, 166, 254, 0.5);
  padding-left: 1rem;
  color: var(--text-primary);
  font-weight: 500;
}

.highlights {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.highlights-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  margin: 0;
}

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}

.highlight-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  padding: clamp(1rem, 3vw, 2rem);
  animation: highlightReveal 0.8s ease forwards;
  opacity: 0;
  transform: translateY(30px);
  transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
}

.highlight-card:hover {
  transform: translateY(-6px) scale(1.01);
  border-color: rgba(89, 166, 254, 0.4);
  box-shadow: 0 25px 70px rgba(2, 15, 36, 0.35);
}

.highlight-badge {
  display: inline-flex;
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(147, 199, 255, 0.5);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--badge-text);
}

.highlight-card h3 {
  margin: 0.8rem 0 0.4rem 0;
  font-size: 1.4rem;
}

.highlight-card p {
  color: var(--text-muted-strong);
  line-height: 1.5;
}

.stack {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 50vh;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);
  width: min(100%);
  margin-left: auto;
  margin-right: auto;
  background: var(--stack-bg);
  border-radius: clamp(0.5rem, 2vw, 2rem);
  overflow: hidden;
  isolation: isolate;
  box-shadow: 0 40px 80px rgba(1, 9, 22, 0.45);
  z-index: 5;
  margin-top: clamp(-2rem, -2vw, -1rem);
  margin-bottom: clamp(-2rem, -2vw, -1rem);
}

.stack::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(89, 166, 254, 0.18), transparent 65%);
  filter: blur(80px);
  opacity: 0.9;
  z-index: -1;
}

.stack-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  margin: 0;
}

.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: clamp(0.8rem, 2vw, 1.5rem);
}

.stack-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  padding: clamp(0.6rem, 1.5vw, 1.2rem);
  box-shadow: 0 20px 60px rgba(1, 11, 27, 0.2);
  transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  position: relative;
  overflow: hidden;
}

.stack-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(89, 166, 254, 0.2), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stack-card:hover {
  transform: translateY(-4px);
  border-color: rgba(89, 166, 254, 0.4);
  box-shadow: 0 30px 70px rgba(1, 11, 27, 0.35);
}

.stack-card:hover::after {
  opacity: 1;
}

.section-heading {
  max-width: 720px;
}

.section-heading h2 {
  font-size: clamp(2rem, 6vw, 4rem);
  margin: 0.5rem 0;
}

.section-copy {
  color: var(--text-muted-strong);
  line-height: 1.5;
}

.projects {
  position: relative;
  z-index: 4;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
}

.project-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  padding: 1.5rem;
  transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
}

.project-card:hover {
  transform: translateY(-6px);
  border-color: rgba(89, 166, 254, 0.45);
  box-shadow: 0 25px 65px rgba(2, 15, 36, 0.35);
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0;
  list-style: none;
}

.project-tags li {
  border: 1px solid rgba(147, 199, 255, 0.4);
  border-radius: 999px;
  padding: 0.25rem 0.8rem;
  font-size: 0.8rem;
  color: var(--badge-text);
}

.contact-cta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.5rem;
  padding: clamp(2rem, 4vw, 3rem);
  border-radius: clamp(1.5rem, 4vw, 3rem);
  border: 1px solid var(--card-border);
  background: var(--card-bg);
  align-items: center;
}

.contact-cta h2 {
  margin: 0.4rem 0;
  font-size: clamp(2rem, 5vw, 3rem);
}

.contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
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

  .hero-cta {
    flex-direction: column;
  }

  .hero-cta .btn {
    width: 100%;
    justify-content: center;
  }

  .about {
    grid-template-columns: 1fr;
  }

  .highlights-grid {
    grid-template-columns: 1fr;
  }

  .stack-grid {
    grid-template-columns: 1fr;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .contact-cta {
    flex-direction: column;
    text-align: center;
  }

  .contact-actions {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: clamp(2rem, 12vw, 4rem);
  }

  .about-media {
    min-height: 280px;
  }

  .highlight-card {
    padding: 1.5rem;
  }

  .stack-card {
    padding: 1rem;
  }

  .project-card {
    padding: 1.25rem;
  }

  .contact-cta {
    padding: 2rem 1.5rem;
  }
}

@keyframes aboutGlow {
  from {
    box-shadow: 0 20px 60px rgba(3, 25, 63, 0.8);
  }
  to {
    box-shadow: 0 30px 70px rgba(3, 25, 63, 0.9);
  }
}

@keyframes floatingGlow {
  from {
    transform: translate3d(-5%, -5%, 0) scale(1);
  }
  to {
    transform: translate3d(5%, 5%, 0) scale(1.1);
  }
}

@keyframes highlightReveal {
  to {
    opacity: 1;
    transform: translateY(0);
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
  --hero-bg: rgba(1, 11, 27, 0.5);
  --card-bg: rgba(0, 11, 28, 0.7);
  --card-bg-strong: rgba(0, 11, 28, 0.8);
  --card-border: rgba(89, 166, 254, 0.2);
  --header-bg: rgba(1, 11, 27, 0.85);
  --stack-bg: #010b1b;
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
  --hero-bg: rgba(255, 255, 255, 0.9);
  --card-bg: rgba(255, 255, 255, 0.9);
  --card-bg-strong: rgba(255, 255, 255, 0.97);
  --card-border: rgba(12, 27, 50, 0.08);
  --header-bg: rgba(255, 255, 255, 0.9);
  --stack-bg: #f6f8ff;
  --accent: #0052cc;
  --accent-on: #f7fbff;
  --accent-muted: #1f3f84;
  --badge-text: #1f3f84;
}
</style>