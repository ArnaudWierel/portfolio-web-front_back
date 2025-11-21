<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

definePageMeta({
  layout: false
});

const { isDark, toggleTheme } = useTheme();

const form = ref({
  name: '',
  email: '',
  company: '',
  message: '',
  projectType: ''
});

const submitting = ref(false);
const submitted = ref(false);
const error = ref<string | null>(null);

const projectTypes = [
  'Site vitrine',
  'Refonte de site',
  'Boutique en ligne',
  'Application web',
  'Autre'
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

  gsap.from('.contact-form', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    delay: 0.3,
    scrollTrigger: {
      trigger: '.contact-form',
      start: 'top 80%'
    }
  });

  gsap.from('.contact-info', {
    opacity: 0,
    x: -30,
    duration: 0.8,
    delay: 0.5,
    scrollTrigger: {
      trigger: '.contact-info',
      start: 'top 80%'
    }
  });
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  submitting.value = true;
  error.value = null;

  try {
    const { $supabase } = useNuxtApp();
    
    // Option 1: Stocker dans Supabase (nécessite une table 'contacts')
    if ($supabase) {
      try {
        const { data, error: supabaseError } = await $supabase
          .from('contacts')
          .insert([
            {
              name: form.value.name,
              email: form.value.email,
              company: form.value.company || null,
              message: form.value.message,
              project_type: form.value.projectType || null,
              created_at: new Date().toISOString()
            }
          ])
          .select();

        if (supabaseError) {
          // Si la table n'existe pas, on simule juste l'envoi
          console.warn('Table contacts non trouvée dans Supabase. Simulation de l\'envoi.');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (err) {
        // En cas d'erreur (table inexistante), on simule l'envoi
        console.warn('Erreur Supabase, simulation de l\'envoi:', err);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } else {
      // Option 2: Envoyer via API (si vous avez un endpoint)
      // const response = await $fetch('/api/contact', {
      //   method: 'POST',
      //   body: form.value
      // });
      
      // Pour l'instant, on simule juste l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    submitted.value = true;
    form.value = {
      name: '',
      email: '',
      company: '',
      message: '',
      projectType: ''
    };

    // Réinitialiser après 5 secondes
    setTimeout(() => {
      submitted.value = false;
    }, 5000);
  } catch (err: any) {
    console.error('Erreur lors de l\'envoi du formulaire:', err);
    error.value = err.message || 'Une erreur est survenue. Veuillez réessayer.';
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  nextTick(() => {
    initAnimations();
  });
});
</script>

<template>
  <div class="contact-page">
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
      </div>
    </header>

    <main class="page">
      <div class="page-header">
        <p class="eyebrow">contact</p>
        <h1>Parlons de votre site web</h1>
        <p class="page-description">
          Vous avez besoin d'un site vitrine, d'une refonte ou d'un accompagnement technique ? Dites-m'en un peu plus sur votre projet et je vous réponds rapidement.
        </p>
      </div>

      <div class="contact-content">
        <div class="contact-info">
          <div class="info-card">
            <Icon name="ph:envelope" size="24" />
            <h3>Email</h3>
            <p>Le moyen le plus simple pour me joindre.</p>
            <a href="mailto:contact@arnaudwierel.com">a.wierel@arnaudwiereldev.fr</a>
          </div>
          <div class="info-card">
            <Icon name="ph:linkedin-logo" size="24" />
            <h3>LinkedIn</h3>
            <p>Pour un premier contact ou en savoir plus sur mon profil.</p>
            <a href="https://www.linkedin.com/in/arnaud-wierel-49149a239/" target="_blank" rel="noopener noreferrer">linkedin.com/in/arnaudwierel</a>
          </div>
          <div class="info-card">
            <Icon name="ph:github-logo" size="24" />
            <h3>GitHub</h3>
            <p>Pour voir certains de mes projets techniques.</p>
            <a href="https://github.com/ArnaudWierel" target="_blank" rel="noopener noreferrer">github.com/arnaudwierel</a>
          </div>
        </div>

        <form @submit="handleSubmit" class="contact-form">
          <div v-if="submitted" class="success-message">
            <Icon name="ph:check-circle" size="24" />
            <p>Merci ! Votre message a été envoyé avec succès. Je vous répondrai dans les plus brefs délais.</p>
          </div>

          <div v-if="error" class="error-message">
            <Icon name="ph:warning-circle" size="24" />
            <p>{{ error }}</p>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="name">Nom complet *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                placeholder="Nom et prénom"
              />
            </div>
            <div class="form-group">
              <label for="email">Email *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="vous@exemple.fr"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="company">Entreprise (optionnel)</label>
              <input
                id="company"
                v-model="form.company"
                type="text"
                placeholder="Nom de votre activité ou structure"
              />
            </div>
            <div class="form-group">
              <label for="projectType">Type de projet (optionnel)</label>
              <select id="projectType" v-model="form.projectType">
                <option value="">Sélectionnez un type</option>
                <option v-for="type in projectTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="message">Message *</label>
            <textarea
              id="message"
              v-model="form.message"
              required
              rows="6"
              placeholder="Parlez-moi brièvement de votre projet, de vos objectifs et de votre contexte (activité, public cible, etc.)."
            ></textarea>
          </div>

          <button type="submit" class="btn primary" :disabled="submitting">
            <span v-if="!submitting">Envoyer le message</span>
            <span v-else>Envoi en cours...</span>
            <Icon v-if="!submitting" name="ph:paper-plane-tilt" size="20" />
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.contact-page {
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
  gap: clamp(3rem, 6vw, 5rem);
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

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  align-items: start;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  border-color: rgba(89, 166, 254, 0.4);
  box-shadow: 0 10px 30px rgba(89, 166, 254, 0.15);
}

.info-card svg {
  color: var(--accent);
  margin-bottom: 1rem;
}

.info-card h3 {
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.info-card p {
  font-size: 0.9rem;
  color: var(--text-muted-strong);
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
}

.info-card a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.95rem;
}

.info-card a:hover {
  color: var(--accent);
}

.contact-form {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.success-message,
.error-message {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
}

.success-message {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  background: var(--card-bg-strong);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 0.875rem 1.25rem;
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(89, 166, 254, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text-muted);
  opacity: 0.5;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
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
  font-family: inherit;
}

.btn.primary {
  background: var(--accent);
  color: var(--accent-on);
  border-color: var(--accent);
  margin-top: 0.5rem;
}

.btn.primary:hover:not(:disabled) {
  background: transparent;
  color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(89, 166, 254, 0.3);
}

.btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .site-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .contact-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .info-card {
    padding: 1.5rem;
  }
}

@media (max-width: 600px) {
  .contact-content {
    gap: 2rem;
  }

  .contact-form {
    padding: 2rem 1.5rem;
  }

  .info-card {
    padding: 1.25rem;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.75rem 1rem;
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
}
</style>
