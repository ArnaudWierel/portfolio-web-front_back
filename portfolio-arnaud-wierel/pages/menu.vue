<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { useRouter } from 'vue-router';
import { useTheme } from '~/composables/useTheme';

const router = useRouter();

const links = [
  { label: 'Home', to: '/home', description: 'Landing immersive & highlights' },
  { label: 'About', to: '/about', description: 'Vision, parcours et expertises' },
  { label: 'Projects', to: '/project', description: 'Sélection de case studies' },
  { label: 'Contact', to: '/contact', description: 'Formulaire & canaux directs' }
];

const socials = [
  { label: 'Instagram', href: 'https://instagram.com/', handle: '@arnaud.w' },
  { label: 'Behance', href: 'https://behance.net/', handle: '/arnaudwierel' },
  { label: 'LinkedIn', href: 'https://linkedin.com/', handle: '/in/arnaudwierel' }
];

const { isDark, toggleTheme, hydrateTheme } = useTheme();

const goTo = (path: string) => {
  router.push(path);
};

let gsapCtx: gsap.Context | null = null;

const initMenuAnimations = () => {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsapCtx = gsap.context(() => {
    gsap.from('.menu-panel', { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' });
    gsap.from('.menu-links li', {
      opacity: 0,
      y: 25,
      stagger: 0.1,
      delay: 0.2,
      duration: 0.6,
      ease: 'power2.out'
    });
    gsap.from('.menu-footer > *', {
      opacity: 0,
      y: 20,
      delay: 0.4,
      duration: 0.6,
      ease: 'power2.out'
    });
  }, '.menu-page');
};

onMounted(() => {
  hydrateTheme();
  initMenuAnimations();
});

onUnmounted(() => {
  gsapCtx?.revert();
  gsapCtx = null;
});
</script>

<template>
  <div class="menu-page">
    <div class="menu-panel">
      <header class="menu-header">
        <div class="brand">
          <span class="brand-mark">AW</span>
          <span class="brand-name">Arnaud Wierel</span>
        </div>
        <div class="header-actions">
          <button class="theme-toggle" @click="toggleTheme" :aria-label="`Basculer en thème ${isDark ? 'clair' : 'sombre'}`">
            <Icon :name="isDark ? 'ph:sun-bold' : 'ph:moon-bold'" size="22" />
          </button>
          <button class="close-btn" @click="goTo('/home')" aria-label="Fermer le menu">
            <Icon name="line-md:menu-to-close-alt-transition" size="32" />
          </button>
        </div>
      </header>

      <section class="menu-content">
        <ul class="menu-links">
          <li v-for="link in links" :key="link.label">
            <button @click="goTo(link.to)">
              <span class="link-label">{{ link.label }}</span>
              <span class="link-description">{{ link.description }}</span>
            </button>
          </li>
        </ul>

        <div class="menu-meta">
          <div>
            <p class="eyebrow">contact direct</p>
            <a href="mailto:hello@arnaudwierel.com" class="contact-link">hello@arnaudwierel.com</a>
            <p>Disponible pour des collaborations Q1 2026 — remote Europe.</p>
          </div>
          <div>
            <p class="eyebrow">réseaux</p>
            <ul class="social-list">
              <li v-for="social in socials" :key="social.label">
                <a :href="social.href" target="_blank" rel="noopener">
                  {{ social.label }} <span>{{ social.handle }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <footer class="menu-footer">
        <p>© {{ new Date().getFullYear() }} — Arnaud Wierel. Creative developer.</p>
        <NuxtLink to="/contact" class="btn primary">Parler d’un projet</NuxtLink>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.menu-page {
  min-height: 100vh;
  background: var(--bg-primary, #010b1b);
  color: var(--text-primary, #d9eaff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 5vw, 3rem);
}

.menu-panel {
  width: min(1100px, 100%);
  border-radius: clamp(1.5rem, 4vw, 3rem);
  padding: clamp(2rem, 5vw, 4rem);
  background: radial-gradient(circle at top, rgba(89, 166, 254, 0.25), transparent),
    var(--hero-bg, rgba(4, 16, 35, 0.9));
  border: 1px solid rgba(89, 166, 254, 0.2);
  box-shadow: 0 35px 80px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.85rem;
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(89, 166, 254, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--accent, #59a6fe);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-toggle,
.close-btn {
  background: rgba(89, 166, 254, 0.12);
  border: 1px solid rgba(89, 166, 254, 0.25);
  border-radius: 999px;
  padding: 0.4rem 0.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--accent, #59a6fe);
  transition: background 0.3s ease, border 0.3s ease;
}

.theme-toggle:hover,
.close-btn:hover {
  background: rgba(89, 166, 254, 0.25);
  border-color: rgba(89, 166, 254, 0.35);
}

.menu-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}

.menu-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.menu-links li button {
  width: 100%;
  text-align: left;
  border: 1px solid rgba(89, 166, 254, 0.25);
  border-radius: 1.8rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  color: inherit;
  cursor: pointer;
  transition: transform 0.3s ease, border 0.3s ease, background 0.3s ease;
}

.menu-links li button:hover {
  transform: translateX(6px);
  border-color: rgba(89, 166, 254, 0.5);
  background: rgba(89, 166, 254, 0.08);
}

.link-label {
  display: block;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.link-description {
  font-size: 0.9rem;
  color: var(--text-muted, #9fbff7);
}

.menu-meta {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-link {
  font-size: 1.2rem;
  color: var(--accent, #59a6fe);
}

.social-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.social-list a {
  color: var(--text-primary, #d9eaff);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.8rem;
  display: flex;
  justify-content: space-between;
}

.menu-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
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

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  color: var(--text-eyebrow, rgba(217, 234, 255, 0.6));
}

:global(:root[data-theme='light']) .menu-page {
  background: var(--bg-primary, #f4f6fb);
  color: var(--text-primary, #0c1b32);
}

:global(:root[data-theme='light']) .menu-panel {
  background: radial-gradient(circle at top, rgba(0, 82, 204, 0.15), transparent),
    rgba(255, 255, 255, 0.95);
  border-color: rgba(12, 27, 50, 0.08);
}

:global(:root[data-theme='light']) .menu-links li button {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(12, 27, 50, 0.08);
  color: var(--text-primary, #0c1b32);
}

:global(:root[data-theme='light']) .menu-links li button:hover {
  background: rgba(0, 82, 204, 0.08);
  border-color: rgba(0, 82, 204, 0.3);
}

:global(:root[data-theme='light']) .social-list a {
  color: var(--text-primary, #0c1b32);
}

@media (max-width: 640px) {
  .menu-panel {
    padding: 1.5rem;
  }

  .menu-links li button {
    border-radius: 1.2rem;
    padding: 0.9rem 1.2rem;
  }

  .menu-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>