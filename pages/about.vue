<script setup lang="ts">
import { onMounted, nextTick } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

definePageMeta({
  layout: false
});

const { isDark, toggleTheme } = useTheme();

const skills = [
  { category: 'Web & intégration', items: ['WordPress', 'Elementor', 'JetEngine', 'Nuxt 3', 'Vue 3', 'HTML / CSS', 'JavaScript / TypeScript'] },
  { category: 'Animation', items: ['GSAP', 'Micro-interactions', 'Animations au scroll', 'Design responsive'] },
  { category: 'Backend & données', items: ['Node.js', 'PHP (WordPress)', 'Supabase', 'PostgreSQL'] },
  { category: 'Outils & workflow', items: ['Git', 'Figma', 'OVH', 'Cloudflare', 'Vite', 'Notion'] }
];

const experiences = [
  {
    year: 'Depuis 2021',
    title: 'Créateur de sites web',
    company: 'Auto-entrepreneur · Strasbourg',
    description: 'Création de sites vitrines, pages de présentation et petites plateformes sur-mesure pour indépendants, associations et entreprises locales. WordPress, Elementor, JetEngine, Nuxt 3.'
  },
  {
    year: '2024–2025',
    title: 'Technicien Support – Division audio premium',
    company: 'CPM International · Bratislava',
    description: 'Support technique Europe pour des marques audio haut de gamme (Denon, Marantz, Bowers & Wilkins) : diagnostic de pannes, gestion de tickets et communication client en français et en anglais.'
  },
  {
    year: '2023',
    title: 'Développeur web / Technicien IT',
    company: 'SIEHR · Strasbourg',
    description: 'Développement de sites WordPress et de plugins PHP/SQL, support utilisateurs et maintenance du parc informatique.'
  }
];

const initAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);

  gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })
    .from('.site-header .brand', { opacity: 0, y: -20 })
    .from('.site-header .main-nav', { opacity: 0, y: -20 }, '-=0.5')
    .from('.site-header .header-actions', { opacity: 0, y: -20 }, '-=0.5');

  gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
    .fromTo('.page-header .eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0 })
    .fromTo('.page-header h1', { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, '-=0.4')
    .fromTo('.page-header p', { opacity: 0, y: 30 }, { opacity: 1, y: 0 }, '-=0.5');

  gsap.utils.toArray('.about-section').forEach((section: any) => {
    gsap.fromTo(section,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  gsap.utils.toArray('.section-header').forEach((header: any) => {
    gsap.fromTo(header,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  gsap.utils.toArray('.skill-card').forEach((card: any) => {
    gsap.fromTo(card, 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  gsap.utils.toArray('.experience-item').forEach((item: any) => {
    gsap.fromTo(item,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
};

onMounted(() => {
  nextTick(() => {
    initAnimations();
  });
});
</script>

<template>
  <div class="about-page">
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
        <p class="eyebrow">à propos</p>
        <h1>Créateur de sites web modernes pour votre activité</h1>
        <p class="page-description">
          Je conçois des sites web clairs, modernes et efficaces, pensés pour mettre en valeur votre activité et donner une image professionnelle en ligne.
        </p>
      </div>

      <section class="about-section">
        <div class="section-content">
          <h2>Mon parcours</h2>
          <div class="text-content">
            <p>
              Passionné par le web, je crée des sites depuis 2021 en tant que freelance et auto-entrepreneur. J'ai commencé par des projets pour mon entourage, puis pour des indépendants, associations et petites entreprises. Chaque projet est pour moi l'occasion de comprendre un métier, une histoire et de la traduire en interface claire et professionnelle.
            </p>
            <p>
              Mon expertise s'articule aujourd'hui autour de WordPress (Elementor, JetEngine) et de technologies modernes comme Nuxt 3 ou Vue 3. Je construis des sites rapides, élégants et faciles à administrer, pensés pour durer dans le temps et rester simples à gérer au quotidien.
            </p>
            <p>
              En parallèle de mon activité, je suis élève-ingénieur en informatique au CESI Strasbourg, avec une spécialisation en cybersécurité et systèmes/réseaux. J'ai également travaillé comme développeur web, technicien IT, consultant digitalisation et technicien support pour des marques audio premium. Cette expérience terrain me permet d'aborder chaque projet web avec rigueur, méthode et une vraie exigence de qualité.
            </p>
          </div>
        </div>
      </section>

      <section class="about-section">
        <div class="section-header">
          <p class="eyebrow">compétences</p>
          <h2>Stack & Outils</h2>
        </div>
        <div class="skills-grid">
          <div v-for="skill in skills" :key="skill.category" class="skill-card">
            <h3>{{ skill.category }}</h3>
            <div class="skill-items">
              <span v-for="item in skill.items" :key="item" class="skill-tag">{{ item }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="about-section">
        <div class="section-header">
          <p class="eyebrow">expérience</p>
          <h2>Parcours professionnel</h2>
        </div>
        <div class="experiences-list">
          <div v-for="(exp, index) in experiences" :key="index" class="experience-item">
            <div class="experience-year">{{ exp.year }}</div>
            <div class="experience-content">
              <h3>{{ exp.title }}</h3>
              <p class="experience-company">{{ exp.company }}</p>
              <p class="experience-description">{{ exp.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="about-section cta-section">
        <div class="cta-content">
          <h2>Travaillons ensemble</h2>
          <p>Vous avez besoin d'un site web professionnel ou d'une refonte ? Discutons de la meilleure façon de le concevoir, de le développer et de le mettre en ligne.</p>
          <NuxtLink to="/contact" class="btn primary">
            Me contacter
            <Icon name="ph:arrow-right" size="20" />
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.about-page {
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
  gap: clamp(4rem, 8vw, 6rem);
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
  opacity: 1;
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

.about-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-header {
  margin-bottom: 1rem;
  opacity: 0;
}

.section-header h2 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--text-primary);
  margin: 0.5rem 0 0 0;
}

.section-content h2 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--text-primary);
  margin: 0 0 2rem 0;
}

.text-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
}

.text-content p {
  font-size: clamp(1rem, 2vw, 1.15rem);
  line-height: 1.8;
  color: var(--text-muted-strong);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  gap: 1.5rem;
}

.skill-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  opacity: 0;
}

.skill-card:hover {
  transform: translateY(-4px);
  border-color: rgba(89, 166, 254, 0.4);
  box-shadow: 0 10px 30px rgba(89, 166, 254, 0.15);
}

.skill-card h3 {
  font-size: 1.25rem;
  margin: 0 0 1.25rem 0;
  color: var(--text-primary);
  font-weight: 600;
}

.skill-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-tag {
  border: 1px solid rgba(147, 199, 255, 0.4);
  border-radius: 999px;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  color: var(--badge-text);
  background: rgba(89, 166, 254, 0.05);
}

.experiences-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.experience-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 2rem;
  padding: 2rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  transition: all 0.3s ease;
  opacity: 0;
}

.experience-item:hover {
  transform: translateX(8px);
  border-color: rgba(89, 166, 254, 0.4);
  box-shadow: 0 10px 30px rgba(89, 166, 254, 0.15);
}

.experience-year {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--accent);
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.experience-content h3 {
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.experience-company {
  font-size: 1rem;
  color: var(--accent-muted);
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.experience-description {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-muted-strong);
  margin: 0;
}

.cta-section {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  padding: 4rem 3rem;
  text-align: center;
}

.cta-content h2 {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.cta-content p {
  font-size: 1.15rem;
  color: var(--text-muted-strong);
  margin: 0 0 2rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  font-family: inherit;
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
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(89, 166, 254, 0.3);
}

@media (max-width: 900px) {
  .site-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .about {
    grid-template-columns: 1fr;
  }

  .skills-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .experience-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .experience-year {
    font-size: 0.95rem;
  }

  .cta-section {
    padding: 3rem 2rem;
  }
}

@media (max-width: 600px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .skill-card {
    padding: 1.5rem;
  }

  .experience-item {
    padding: 1.5rem;
  }

  .cta-section {
    padding: 2rem 1.5rem;
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
