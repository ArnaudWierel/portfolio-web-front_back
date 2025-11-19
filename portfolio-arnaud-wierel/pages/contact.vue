<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useTheme } from '~/composables/useTheme';

const contactChannels = [
  {
    label: 'Email direct',
    value: 'hello@arnaudwierel.com',
    description: 'Réponse sous 24h, pièces jointes bienvenues.'
  },
  {
    label: 'Calendly',
    value: 'Planifier un appel de 30 min',
    description: 'Slot vision / cadrage produit, fuseaux Europe & US.'
  },
  {
    label: 'Signal / WhatsApp',
    value: '+33 6 00 00 00 00',
    description: 'Communication temps réel pendant le projet.'
  }
];

const faqs = [
  {
    question: 'Quels types de projets acceptez-vous ?',
    answer: 'Landing premium, sites manifestes, expériences interactives, plateformes produits ou MVP avec un fort accent design.'
  },
  {
    question: 'Travaillez-vous avec des agences ?',
    answer: 'Oui, en renfort créatif ou lead front pour des studios et agences qui veulent internaliser production et motion.'
  },
  {
    question: 'Quels délais prévoir ?',
    answer: '2 à 4 semaines de cadrage, puis 4 à 8 semaines de production selon la portée (design + dev + intégrations).'
  }
];

const { isDark, toggleTheme, hydrateTheme } = useTheme();
const isSubmitting = ref(false);
const submitMessage = ref('');

const form = reactive({
  name: '',
  email: '',
  company: '',
  budget: '',
  message: ''
});

const resetForm = () => {
  form.name = '';
  form.email = '';
  form.company = '';
  form.budget = '';
  form.message = '';
};

const handleSubmit = (event: Event) => {
  event.preventDefault();
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  submitMessage.value = '';

  setTimeout(() => {
    isSubmitting.value = false;
    submitMessage.value = "Merci ! Votre message est bien parti, je reviens vers vous rapidement.";
    resetForm();
  }, 1200);
};

let gsapCtx: gsap.Context | null = null;

const initContactAnimations = () => {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);
  gsapCtx = gsap.context(() => {
    gsap.timeline({ defaults: { duration: 0.9, ease: 'power3.out' } })
      .fromTo(
        '.contact-hero .eyebrow',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0 }
      )
      .fromTo(
        '.contact-hero h1',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, onComplete: () => gsap.set('.contact-hero h1', { clearProps: 'opacity,visibility,transform' }) },
        '-=0.4'
      )
      .fromTo(
        '.contact-hero p',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, onComplete: () => gsap.set('.contact-hero p', { clearProps: 'opacity,visibility,transform' }) },
        '-=0.4'
      )
      .fromTo(
        '.contact-hero .hero-cta .btn',
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          onComplete: () => gsap.set('.contact-hero .hero-cta .btn', { clearProps: 'opacity,visibility,transform' })
        },
        '-=0.4'
      );

    const fadeUp = (selector: string) => {
      gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
        gsap.from(element, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 85%'
          }
        });
      });
    };

    fadeUp('.contact-info-card');
    fadeUp('.contact-channel');
    fadeUp('.contact-form');
    fadeUp('.faq-item');
    fadeUp('.contact-cta');
  }, '.contact');
};

onMounted(() => {
  hydrateTheme();
  initContactAnimations();
});

onUnmounted(() => {
  gsapCtx?.revert();
  gsapCtx = null;
});
</script>

<template>
  <div class="contact">
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
        <NuxtLink to="/project" class="btn primary small">Voir mes projets</NuxtLink>
      </div>
    </header>

    <main class="contact-page">
      <section class="contact-hero">
        <div class="hero-copy">
          <p class="eyebrow">contact</p>
          <h1>Parlons de votre prochaine expérience digitale.</h1>
          <p>
            Projet clé en main, renfort motion/front ou simple audit : dites-m’en plus sur votre vision et les objectifs à atteindre.
          </p>
          <div class="hero-cta">
            <a href="mailto:hello@arnaudwierel.com" class="btn primary">Écrire un email</a>
            <NuxtLink to="/project" class="btn ghost">Voir les références</NuxtLink>
          </div>
        </div>
        <div class="contact-info">
          <article class="contact-info-card">
            <p class="eyebrow">disponibilité</p>
            <h3>Ouvert aux nouveaux projets Q1 2026</h3>
            <p>Slot rapide possible pour cadrer la vision, définir la stack et planifier le lancement.</p>
          </article>
          <article class="contact-info-card">
            <p class="eyebrow">formats</p>
            <ul>
              <li>Landing immersive / site manifeste</li>
              <li>Produit digital / MVP + design system</li>
              <li>Installation interactive, pitch deck live</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="contact-grid">
        <div class="contact-channels">
          <h2>Mes canaux privilégiés.</h2>
          <p class="section-copy">
            Choisissez le mode d’échange qui vous convient : un email pour cadrer, un call pour brainstormer, ou un canal direct pendant la mission.
          </p>
          <div class="channels-list">
            <article v-for="channel in contactChannels" :key="channel.label" class="contact-channel">
              <h3>{{ channel.label }}</h3>
              <p class="channel-value">{{ channel.value }}</p>
              <p>{{ channel.description }}</p>
            </article>
          </div>
        </div>

        <form class="contact-form" @submit="handleSubmit">
          <p class="eyebrow">formulaire</p>
          <h2>Décrivez votre projet.</h2>
          <div class="form-grid">
            <label>
              Nom / Prénom *
              <input v-model="form.name" type="text" name="name" required placeholder="Jean Dupont" />
            </label>
            <label>
              Email *
              <input v-model="form.email" type="email" name="email" required placeholder="vous@studio.com" />
            </label>
            <label>
              Société / Studio
              <input v-model="form.company" type="text" name="company" placeholder="Studio Nova" />
            </label>
            <label>
              Budget estimé
              <select v-model="form.budget" name="budget">
                <option value="">Sélectionner</option>
                <option value="15-25k">15 — 25k €</option>
                <option value="25-40k">25 — 40k €</option>
                <option value="40-60k">40 — 60k €</option>
                <option value="60k+">60k € et +</option>
              </select>
            </label>
          </div>
          <label class="full-row">
            Quelques détails *
            <textarea
              v-model="form.message"
              name="message"
              rows="5"
              required
              placeholder="Objectifs, deadline, inspirations, contraintes techniques…"
            ></textarea>
          </label>
          <button type="submit" class="btn primary submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Envoi…' : 'Envoyer le message' }}
          </button>
          <p v-if="submitMessage" class="form-feedback">{{ submitMessage }}</p>
        </form>
      </section>

      <section class="faq">
        <div class="section-heading">
          <p class="eyebrow">faq</p>
          <h2>Questions fréquentes.</h2>
        </div>
        <div class="faq-list">
          <article v-for="item in faqs" :key="item.question" class="faq-item">
            <h3>{{ item.question }}</h3>
            <p>{{ item.answer }}</p>
          </article>
        </div>
      </section>

      <section class="contact-cta">
        <div>
          <p class="eyebrow">next move</p>
          <h2>Besoin d’un partenaire créatif fiable ?</h2>
          <p>Motion, engineering et design dans une même boucle courte. Disponible pour accompagner vos clients premium.</p>
        </div>
        <div class="cta-actions">
          <a href="mailto:hello@arnaudwierel.com" class="btn primary">Écrire directement</a>
          <NuxtLink to="/project" class="btn ghost">Voir les études de cas</NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.contact {
  min-height: 100vh;
  background: var(--bg-primary, #010b1b);
  color: var(--text-primary, #d9eaff);
}

.contact-page {
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

.contact-hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
  border-radius: clamp(1.5rem, 4vw, 3rem);
  padding: clamp(2rem, 5vw, 4rem);
  background: linear-gradient(135deg, rgba(4, 16, 35, 0.95), rgba(5, 36, 78, 0.9));
  position: relative;
  overflow: hidden;
}
.contact-hero .hero-copy :is(h1, p, .eyebrow) {
  color: #f8fbff;
}

.contact-hero .hero-copy .btn.ghost {
  color: #f8fbff;
  border-color: rgba(248, 251, 255, 0.5);
}

.contact-info {
  display: grid;
  gap: 1rem;
}

.contact-info-card {
  border-radius: clamp(1rem, 3vw, 2rem);
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.2));
  background: var(--card-bg, rgba(0, 11, 28, 0.7));
  padding: clamp(1.2rem, 3vw, 2rem);
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
}

.contact-channels {
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.25));
  border-radius: clamp(1.5rem, 3vw, 2.5rem);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  background: var(--card-bg, rgba(0, 11, 28, 0.7));
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.contact-channels h2,
.contact-form h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin: 0.4rem 0;
}

.section-copy {
  color: var(--text-muted, #9fbff7);
  max-width: 520px;
}

.channels-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.contact-channel {
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.25));
  border-radius: 20px;
  padding: 1.5rem;
  background: var(--card-bg, rgba(1, 11, 27, 0.7));
}

.channel-value {
  font-size: 1.1rem;
  font-weight: 600;
}

.contact-form {
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.25));
  border-radius: clamp(1.5rem, 3vw, 2.5rem);
  padding: clamp(1.5rem, 4vw, 2.5rem);
  background: var(--card-bg-strong, rgba(1, 11, 27, 0.8));
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.9rem;
  letter-spacing: 0.05em;
}

input,
select,
textarea {
  border-radius: 16px;
  border: 1px solid rgba(89, 166, 254, 0.3);
  background: rgba(1, 9, 22, 0.6);
  color: var(--text-primary, #d9eaff);
  padding: 0.85rem 1rem;
  font-size: 1rem;
  font-family: inherit;
  transition: border 0.3s ease, background 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  border-color: var(--accent, #59a6fe);
  outline: none;
}

.full-row {
  grid-column: 1 / -1;
}

.form-feedback {
  color: var(--accent, #59a6fe);
  margin: 0;
}

.submit-btn {
  align-self: flex-start;
}

.faq-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.2rem;
}

.faq-item {
  border: 1px solid var(--card-border, rgba(89, 166, 254, 0.2));
  border-radius: 20px;
  padding: 1.5rem;
  background: var(--card-bg, rgba(0, 11, 28, 0.7));
}

.contact-cta {
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

:global(:root[data-theme='light']) .contact {
  background: var(--bg-primary, #f4f6fb);
  color: var(--text-primary, #0c1b32);
}

:global(:root[data-theme='light']) .contact-hero {
  background: linear-gradient(135deg, rgba(233, 240, 255, 0.95), rgba(255, 255, 255, 0.95));
}

:global(:root[data-theme='light']) .contact-hero .hero-copy :is(h1, p, .eyebrow) {
  color: var(--text-primary, #0c1b32);
}

:global(:root[data-theme='light']) .contact-hero .hero-copy .btn.ghost {
  color: var(--text-primary, #0c1b32);
  border-color: rgba(12, 27, 50, 0.15);
}

:global(:root[data-theme='light']) :is(.contact-channels, .contact-info-card, .contact-channel, .contact-form, .faq-item, .contact-cta) {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(12, 27, 50, 0.08);
}

:global(:root[data-theme='light']) input,
:global(:root[data-theme='light']) select,
:global(:root[data-theme='light']) textarea {
  background: rgba(255, 255, 255, 0.85);
  color: var(--text-primary, #0c1b32);
}

@media (max-width: 640px) {
  .contact-page {
    padding: 1.5rem;
  }

  .site-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>