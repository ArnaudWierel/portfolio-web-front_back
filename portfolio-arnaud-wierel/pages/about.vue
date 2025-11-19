<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useTheme } from '~/composables/useTheme';

const stats = [
  { label: 'Années d’expérience', value: '4+' },
  { label: 'Projets premium livrés', value: '38' },
  { label: 'Clients accompagnés', value: '17' }
];

const timeline = [
  {
    year: '2025',
    title: 'Creative developer — Freelance',
    copy: 'Accompagnement end-to-end pour des studios et marques internationales.'
  },
  {
    year: '2023',
    title: 'Lead front — Studio Neo',
    copy: 'Direction technique sur des expériences immersives (WebGL, GSAP, Nuxt).'
  },
  {
    year: '2021',
    title: 'Product engineer — Agence digitale',
    copy: 'Mise en place de design systems scalables et pipelines CI/CD.'
  }
];

const expertise = [
  {
    title: 'Creative engineering',
    items: ['Nuxt 3 / Vue 3', 'TypeScript strict', 'Animations GSAP', 'WebGL / shaders']
  },
  {
    title: 'Motion & micro-interactions',
    items: ['Storytelling animé', 'Transitions sur-mesure', 'Lenis / SplitType', 'Optimisation 60 FPS']
  },
  {
    title: 'Stack produit & ops',
    items: ['Node / Nitro', 'Supabase', 'CI/CD GitHub', 'Cloudflare Pages']
  }
];

const values = [
  {
    title: 'Qualité obsessionnelle',
    copy: 'Du premier wireframe au dernier pixel, tout est pensé pour délivrer une expérience mémorable.'
  },
  {
    title: 'Collaboration transparente',
    copy: 'Process clair, itérations rapides et rituels hebdo pour garder le rythme sans surprise.'
  },
  {
    title: 'Culture du détail',
    copy: 'Micro-interactions, audio cues subtils, storytelling : le moindre détail raconte quelque chose.'
  }
];

const { isDark, toggleTheme, hydrateTheme } = useTheme();

let gsapCtx: gsap.Context | null = null;

const initAboutAnimations = () => {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  gsapCtx = gsap.context(() => {
    gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
      .from('.hero-meta .eyebrow', { opacity: 0, y: 20 })
      .from('.hero-meta h1', { opacity: 0, y: 40 }, '-=0.4')
      .from('.hero-meta .hero-lead', { opacity: 0, y: 30 }, '-=0.4')
      .fromTo(
        '.hero-cta .btn',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          onComplete: () => gsap.set('.hero-cta .btn', { clearProps: 'opacity,visibility,transform' })
        },
        '-=0.4'
      )
      .from('.hero-panel', { opacity: 0, x: 40 }, '-=0.6');

    const animateStagger = (selector: string) => {
      gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 45,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%'
          }
        });
      });
    };

    animateStagger('.stat-card');
    animateStagger('.story-content > *');
    animateStagger('.expertise-card');
    animateStagger('.timeline-item');
    animateStagger('.value-card');
    animateStagger('.cta');

    gsap.from('.story-media', {
      opacity: 0,
      scale: 0.92,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.story-media',
        start: 'top 80%'
      }
    });

    gsap.from('.quote-card', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.quote-card',
        start: 'top 80%'
      }
    });
  }, '.about');
};

onMounted(() => {
  hydrateTheme();
  initAboutAnimations();
});

onUnmounted(() => {
  gsapCtx?.revert();
  gsapCtx = null;
});
</script>

<template>
  <div class="about">
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
        <NuxtLink to="/contact" class="btn primary small">Parler d’un projet</NuxtLink>
      </div>
    </header>

    <main class="about-page">
    <header class="about-hero">
      <div class="hero-meta">
        <p class="eyebrow">about</p>
        <h1>Construire des expériences immersives qui marquent.</h1>
        <p class="hero-lead">
          Je design et développe des interfaces premium pour les marques ambitieuses. Mon approche mêle storytelling,
          motion design et ingénierie robuste pour livrer des projets qui durent.
        </p>
        <div class="hero-cta">
          <NuxtLink to="/project" class="btn primary">Voir les projets</NuxtLink>
          <NuxtLink to="/contact" class="btn ghost">Discuter ensemble</NuxtLink>
        </div>
      </div>

      <div class="hero-panel">
        <div class="hero-panel__gradient"></div>
        <p class="panel-eyebrow">Disponibilité</p>
        <h3>Ouvert aux nouvelles collaborations Q1 2026</h3>
        <p>
          Motion websites, produits digitaux, installations interactives, identité numérique complète.
        </p>
        <ul class="panel-tags">
          <li>Freelance</li>
          <li>Remote / Europe</li>
          <li>Français & anglais</li>
        </ul>
      </div>
    </header>

    <section class="stats">
      <article v-for="stat in stats" :key="stat.label" class="stat-card">
        <p class="stat-value">{{ stat.value }}</p>
        <p class="stat-label">{{ stat.label }}</p>
      </article>
    </section>

    <section class="story">
      <div class="story-media">
        <img src="/assets/aboutmedia.png" alt="Studio créatif Arnaud Wierel" loading="lazy" />
      </div>
      <div class="story-content">
        <p class="eyebrow">méthodologie</p>
        <h2>Du concept à la livraison avec la même exigence.</h2>
        <p>
          Chaque projet démarre par une phase de direction artistique (moodboards, narration). Je construis ensuite un
          design system modulaire avant d’aborder l’intégration GSAP/Nuxt. Les déploiements sont automatisés pour rester
          agiles jusqu’au go-live.
        </p>
        <div class="story-grid">
          <div>
            <h4>Workshops</h4>
            <p>Vision, tonalité, interactions clés, définition des KPI.</p>
          </div>
          <div>
            <h4>Design system</h4>
            <p>Typographie, grille modulaire, tokens et states.</p>
          </div>
          <div>
            <h4>Engineering</h4>
            <p>Nuxt 3, démos interactives, revue perf & accessibilité.</p>
          </div>
          <div>
            <h4>Delivery</h4>
            <p>CI/CD, observabilité, handover détaillé.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="expertise">
      <div class="section-heading">
        <p class="eyebrow">expertises</p>
        <h2>Les terrains sur lesquels j’interviens.</h2>
      </div>
      <div class="expertise-grid">
        <article v-for="area in expertise" :key="area.title" class="expertise-card">
          <h3>{{ area.title }}</h3>
          <ul>
            <li v-for="item in area.items" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="timeline">
      <div class="section-heading">
        <p class="eyebrow">parcours</p>
        <h2>Chapitres clés.</h2>
      </div>
      <div class="timeline-list">
        <article v-for="item in timeline" :key="item.year" class="timeline-item">
          <p class="timeline-year">{{ item.year }}</p>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.copy }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="values">
      <div class="section-heading">
        <p class="eyebrow">manifeste</p>
        <h2>Ce qui drive ma façon de travailler.</h2>
      </div>
      <div class="values-grid">
        <article v-for="value in values" :key="value.title" class="value-card">
          <h3>{{ value.title }}</h3>
          <p>{{ value.copy }}</p>
        </article>
      </div>
      <div class="quote-card">
        <p class="quote">
          “Arnaud comprend instantanément l’ADN d’une marque et le traduit en interactions haut de gamme. Chaque livrable
          est millimétré.”
        </p>
        <p class="quote-author">— Studio Neo</p>
      </div>
    </section>

    <section class="cta">
      <div>
        <p class="eyebrow">next project</p>
        <h2>Prêt à imaginer la prochaine expérience ?</h2>
        <p>Envie d’un site manifeste, d’un produit digital ou d’un pitch interactif ? Parlons-en.</p>
      </div>
      <div class="cta-actions">
        <NuxtLink to="/contact" class="btn primary">Planifier un call</NuxtLink>
        <NuxtLink to="/project" class="btn ghost">Voir les projets</NuxtLink>
      </div>
    </section>
    </main>
  </div>
</template>

<style scoped>
.about {
  min-height: 100vh;
  background: var(--bg-primary, #010b1b);
  color: var(--text-primary, #d9eaff);
}

.about-page {
  padding: clamp(2rem, 6vw, 5rem);
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vw, 3.5rem);
}

.about-hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: clamp(1.5rem, 4vw, 3.5rem);
  border-radius: clamp(1.5rem, 4vw, 3rem);
  padding: clamp(2rem, 5vw, 4rem);
  background: linear-gradient(135deg, rgba(4, 16, 35, 0.95), rgba(5, 36, 78, 0.9));
  position: relative;
  overflow: hidden;
}

.about-hero::after {
  content: '';
  position: absolute;
  inset: -20% auto auto 40%;
  width: 40%;
  height: 140%;
  background: radial-gradient(circle, rgba(89, 166, 254, 0.35), transparent 65%);
  filter: blur(40px);
  opacity: 0.7;
}

.hero-meta {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  color: var(--text-primary, #d9eaff);
}

.hero-meta :is(h1, h2, h3, h4) {
  color: inherit;
}

.hero-meta h1 {
  font-size: clamp(2.8rem, 8vw, 4.5rem);
  margin: 0;
  line-height: 1;
}

.hero-lead {
  font-size: clamp(1rem, 2vw, 1.3rem);
  line-height: 1.6;
  color: var(--text-muted, #9fbff7);
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.hero-panel {
  position: relative;
  z-index: 2;
  border-radius: clamp(1rem, 3vw, 2rem);
  padding: clamp(1.5rem, 4vw, 3rem);
  background: var(--card-bg-strong, rgba(1, 11, 27, 0.8));
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.2));
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  backdrop-filter: blur(18px);
  color: var(--text-primary, #d9eaff);
}

.hero-panel :is(h3, p, .panel-eyebrow, .panel-tags li) {
  color: inherit;
}

.hero-panel__gradient {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(89, 166, 254, 0.15), transparent 65%);
  z-index: -1;
}

.panel-eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  color: var(--text-eyebrow, rgba(217, 234, 255, 0.6));
}

.panel-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.panel-tags li {
  border: 1px solid rgba(89, 166, 254, 0.35);
  border-radius: 999px;
  padding: 0.3rem 0.9rem;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  color: var(--text-primary, #d9eaff);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-card {
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.2));
  border-radius: 20px;
  padding: 1.5rem;
  background: var(--card-bg, rgba(1, 11, 27, 0.7));
}

.stat-value {
  font-size: clamp(2rem, 5vw, 3rem);
  margin: 0;
}

.stat-label {
  margin: 0.3rem 0 0;
  color: var(--text-muted, #9fbff7);
}

.story {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: center;
}

.story-media {
  border-radius: 28px;
  overflow: hidden;
  position: relative;
  background: var(--card-bg-strong, rgba(0, 11, 28, 0.8));
}

.story-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.story-content h2 {
  font-size: clamp(2.2rem, 6vw, 3.5rem);
  margin: 0.5rem 0;
}

.story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.story-grid h4 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-eyebrow, rgba(217, 234, 255, 0.6));
}

.expertise {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-heading h2 {
  margin: 0.4rem 0 0;
  font-size: clamp(2rem, 5vw, 3.5rem);
}

.expertise-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.2rem;
}

.expertise-card {
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.25));
  border-radius: 24px;
  padding: clamp(1.2rem, 3vw, 2rem);
  background: var(--card-bg, rgba(0, 11, 28, 0.7));
}

.expertise-card ul {
  margin: 1rem 0 0;
  padding-left: 1.2rem;
  color: var(--text-muted-strong, #a9c7ff);
}

.timeline-list {
  border-left: 2px solid rgba(89, 166, 254, 0.4);
  margin-left: 0.8rem;
  display: grid;
  gap: 1.5rem;
}

.timeline-item {
  padding-left: 1.5rem;
}

.timeline-year {
  font-size: 0.9rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--text-eyebrow, rgba(217, 234, 255, 0.6));
}

.values {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem;
}

.value-card {
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.2));
  border-radius: 24px;
  padding: clamp(1.2rem, 3vw, 2rem);
  background: var(--card-bg, rgba(1, 11, 27, 0.75));
}

.quote-card {
  border-radius: clamp(1.5rem, 3vw, 2.5rem);
  padding: clamp(1.5rem, 4vw, 3rem);
  background: linear-gradient(135deg, rgba(89, 166, 254, 0.15), var(--card-bg, rgba(2, 15, 38, 0.85)));
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.35));
}

.quote {
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  margin: 0;
  line-height: 1.5;
}

.quote-author {
  margin: 1rem 0 0;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-size: 0.9rem;
  color: var(--text-eyebrow, rgba(217, 234, 255, 0.6));
}

.cta {
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

.hero-cta .btn.ghost {
  color: #f8fbff;
  border-color: rgba(248, 251, 255, 0.5);
}

:global(:root[data-theme='light']) .hero-cta .btn.ghost {
  color: #0c1b32;
  border-color: rgba(12, 27, 50, 0.15);
}

.btn.small {
  padding: 0.6rem 1.2rem;
  font-size: 0.75rem;
}

.about :is(h1, h2, h3, h4) {
  color: var(--text-primary, #d9eaff);
}

.about-hero {
  color: #f8fbff;
}

.about-hero :is(h1, h2, h3, h4) {
  color: #f8fbff;
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

:global(:root[data-theme='light']) .about {
  background: var(--bg-primary, #f4f6fb);
  color: var(--text-primary, #0c1b32);
}

:global(:root[data-theme='light']) .about-page {
  background: transparent;
}

:global(:root[data-theme='light']) .about-hero {
  background: linear-gradient(135deg, rgba(233, 240, 255, 0.9), rgba(255, 255, 255, 0.95));
  color: var(--text-primary, #0c1b32);
}

:global(:root[data-theme='light']) .hero-meta {
  color: var(--text-primary, #0c1b32);
}

:global(:root[data-theme='light']) .hero-meta :is(h1, h2, h3, h4) {
  color: inherit;
}

:global(:root[data-theme='light']) .quote-card {
  background: linear-gradient(135deg, rgba(0, 82, 204, 0.1), var(--card-bg, rgba(255, 255, 255, 0.95)));
}

@media (max-width: 640px) {
  .about-page {
    padding: 1.5rem;
  }

  .timeline-list {
    margin-left: 0;
    border-left: none;
  }

  .timeline-item {
    padding-left: 0;
    border-top: 1px solid rgba(89, 166, 254, 0.2);
    padding-top: 1rem;
  }

  .hero-panel {
    order: -1;
  }

  .site-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>