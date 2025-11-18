<script setup lang="ts">
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import anime from 'animejs';
import { useNuxtApp } from '#app';
import { TextPlugin } from 'gsap/TextPlugin';
import type { Project } from '~/assets/data/projects';
import { projectsData } from '~/assets/data/projects';
//-------------------------------------------------------------------------
const router = useRouter();
const projects = ref<Project[]>(projectsData);

gsap.registerPlugin(TextPlugin);
//-------------------------------------------------------------------------
const jobNameAnimation = () => {
  const jobNameText = document.querySelector('.job-name-text');
  const originalText = jobNameText.textContent;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  let randomText = [...originalText].map(char => 
    char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  jobNameText.textContent = randomText;

  jobNameText.addEventListener('mouseenter', () => {
    gsap.to(jobNameText, {
      duration: 1.5,
      text: {value: originalText},
      ease: "none",
      color: "#044894",
    });
  });

  jobNameText.addEventListener('mouseleave', () => {
    randomText = [...originalText].map(char => 
      char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
    ).join('');

    gsap.to(jobNameText, {
      duration: 1.5,
      text: {value: randomText, rtl: true},
      ease: "none",
      color: "#7ab0ee",
    });
  });
};
//-------------------------------------------------------------------------
const animateNameEnter = () => {
  gsap.to('#first-name-last-name', {
    duration: 0.5,
    scale: 0.9, // Agrandit légèrement
    filter: 'blur(2px)', // Supprime progressivement l'effet de flou
    color: '#044894', // Change la couleur du texte
    textShadow: '0px 0px 15px rgba(0, 0, 0, 0.5)', // Ajoute une ombre portée dynamique
    ease: 'power2.out',
  });
};

const animateNameLeave = () => {
  gsap.to('#first-name-last-name', {
    duration: 0.5,
    scale: 1, // Revient à la taille normale
    filter: 'blur(0px)', // Réapplique un léger effet de flou
    color: '#7ab0ee', // Réinitialise la couleur du texte
    textShadow: '0px 0px 0px rgba(0, 0, 0, 0)', // Supprime l'ombre portée
    ease: 'power2.in',
  });
};
//-------------------------------------------------------------------------
const toggleMenu = () => {
  router.push('/menu');
};
//-------------------------------------------------------------------------
function initPageAnimations() {
  document.getElementById('first-name-last-name').style.color = '#7ab0ee';
  document.getElementById('job-name').style.color = '#7ab0ee';
  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: '#first-name-last-name',
      scale: [0.75, 1],
      opacity: [0, 1],
      translateX: [-250, 0],
      duration: 2000,
    });
  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: '#job-name',
      scale: [0.75, 1],
      opacity: [0, 1],
      translateX: [250, 0],
      duration: 2000,
      delay: 500,
    });

  
}
//-------------------------------------------------------------------------
onMounted(() => {
  // Appeler ces fonctions lors du survol et de la sortie de survol
  initPageAnimations();
  initGSAPAnimations();
  initDocumentListeners();
  
});
//-------------------------------------------------------------------------
const initDocumentListeners = () => {
  document.getElementById('first-name-last-name').addEventListener('mouseenter', animateNameEnter);
  document.getElementById('first-name-last-name').addEventListener('mouseleave', animateNameLeave);
  jobNameAnimation();
};
//-------------------------------------------------------------------------
const initGSAPAnimations = () => {
  const { $gsap: gsap, $ScrollTrigger: ScrollTrigger } = useNuxtApp();

  gsap.registerPlugin(ScrollTrigger);

  const headerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.projects-header',
      start: 'top 85%',
      end: 'bottom center',
      toggleActions: 'play none none reverse'
    }
  });

  headerTimeline
    .from('.eyebrow', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from(
      '#titre-projet',
      {
        opacity: 0,
        y: 80,
        scale: 0.9,
        duration: 1,
        ease: 'power4.out'
      },
      '-=0.3'
    )
    .from(
      '.projects-intro',
      {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
      },
      '-=0.4'
    );

  // Projects animation timeline
  const projectsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#titre-projet',
      start: 'top 8%', // Adjust these values as needed
      end: 'bottom top',
      toggleActions: 'play none none reverse',
    },
    defaults: { duration: 1, ease: 'power3.out' }, // Default animation properties
  });

  // Iterate over each project and add it to the timeline
  projectsTimeline.fromTo(
    '.project-card',
    { y: 80, opacity: 0, rotateX: 12, transformOrigin: 'top center' },
    {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.25
    },
    '-=0.5'
  );


  // quand le #first-name-last-name disparait de on fait une animation et quand il revient on fait une autre animation
  ScrollTrigger.create({
    trigger: '#first-name-last-name',
    start: 'top 80%',
    end: 'bottom 20%',
    onLeave: () => {
      anime({
        targets: '#first-name-last-name',
        scale: 0.75,
        opacity: 0,
        translateX: -250,
        duration: 2000,
      });
    },
    onEnterBack: () => {
      anime({
        targets: '#first-name-last-name',
        scale: 1,
        opacity: 1,
        translateX: 0,
        duration: 2000,
      });
    },
  });

  // quand le #job-name disparait de on fait une animation et quand il revient on fait une autre animation
  ScrollTrigger.create({
    trigger: '#job-name',
    start: 'top 80%',
    end: 'bottom 20%',
    onLeave: () => {
      anime({
        targets: '#job-name',
        scale: 0.75,
        opacity: 0,
        translateX: 250,
        duration: 2000,
      });
    },
    onEnterBack: () => {
      anime({
        targets: '#job-name',
        scale: 1,
        opacity: 1,
        translateX: 0,
        duration: 2000,
      });
    },
  });

};
//-------------------------------------------------------------------------
</script>

<template>
  <div class="home">
    <VideoBackground />
    <div class="menu">
      <div class="burger-menu">
        <Icon id="menu-burger-icon" name="line-md:menu" style="" size="50" @click="toggleMenu" />
      </div>
    </div>

    <div class="page">
      <div class="landing-text">
        <h1 id="first-name-last-name" @mouseenter="animateNameEnter" @mouseleave="animateNameLeave">
          Arnaud Wierel
        </h1>

        <h1 id="job-name">
  <span class="job-name-text">Developer Web Front and Back</span>
</h1>

      </div>

      <section class="projects">
        <div class="projects-header">
          <p class="eyebrow">Sélection</p>
          <h1 id="titre-projet">Projects</h1>
          <p class="projects-intro">
            Quelques réalisations représentatives mêlant motion design, expériences immersives et interfaces produit. Chaque projet est pensé comme une histoire interactive.
          </p>
        </div>
        <div
          class="project-card"
          v-for="project in projects"
          :key="project.slug"
          :id="`project-${project.slug}`"
        >
          <NuxtImg
            :src="project.cover"
            :alt="`Mockup du projet ${project.title}`"
            format="webp"
            class="project-cover"
            width="1200"
            height="800"
          />
          <div class="project-content">
            <div class="project-meta">
              <span class="project-year">{{ project.year }}</span>
              <span class="project-role">{{ project.role }}</span>
            </div>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
            <div class="project-actions">
              <NuxtLink
                v-if="project.link"
                :to="project.link"
                target="_blank"
                rel="noopener"
                class="project-link"
              >
                Voir le case study
              </NuxtLink>
              <NuxtLink :to="`/project/${project.slug}`" class="project-link secondary">
                Détails
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style>

section.projects {
  min-height: 100vh;
  padding: clamp(2rem, 6vw, 6rem);
  margin-top: clamp(4rem, 12vw, 18rem);
  position: relative;
}
img {
  width: 200px;
  height: 200px;
  margin-bottom: 50px;
}

h1 {
  font-family: Tusker Grotesk, sans-serif;
  font-weight: 900;
  color: #93c7ff;
}

#titre-projet {
  font-size: clamp(4rem, 12vw, 10rem);
  margin-bottom: 1.5rem;
  color: #044894;
  display: block;
  text-align: left;
}

.projects-header {
  max-width: 960px;
  margin: 0 auto 4rem auto;
  text-align: left;
  position: relative;
  padding-left: clamp(0rem, 3vw, 2.5rem);
}

.projects-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15%;
  width: clamp(60px, 12vw, 140px);
  height: clamp(60px, 12vw, 140px);
  background: radial-gradient(circle at 30% 30%, rgba(89, 166, 254, 0.45), transparent 65%);
  filter: blur(12px);
  z-index: -1;
}

.projects-header::after {
  content: '';
  position: absolute;
  left: clamp(-3rem, -2vw, -1rem);
  top: 50%;
  width: clamp(120px, 35vw, 360px);
  height: 2px;
  background: linear-gradient(90deg, rgba(89, 166, 254, 0), rgba(89, 166, 254, 0.9), rgba(89, 166, 254, 0));
  opacity: 0.6;
}

.projects-intro {
  color: #9ec5ff;
  font-size: clamp(1rem, 2vw, 1.4rem);
  line-height: 1.5;
}

.eyebrow {
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: #59a6fe;
  margin-bottom: 0.5rem;
}

.burger-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 20px;
  /* mettre l'icône au premier plan */
  z-index: 100;
  position: relative;
}

.icon {
  cursor: pointer;
}

.page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.landing-text {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
}

#first-name-last-name {
  margin-left: 5vw;
  font-size: clamp(2rem, 25vw, 15rem);
  margin-top: -7vh;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: clamp(30vh, 10vw, 20vh);
  color: rgba(0, 0, 0, 0);
  /* Initial state is transparent, animation will fade in */
  transition: text-shadow 0.3s ease-in-out;
  /* Smooth transition for text-shadow */
  padding: 0 1vw;
  /* Ajoutez un padding pour réduire la hitbox */
  inline-size: fit-content;
  /* Limite la largeur à celle du contenu */
  box-sizing: border-box;
  /* Assurez-vous que le padding est inclus dans la largeur */
  filter: blur(0px); /* État initial légèrement flou */
}

#job-name {
  /* Utilise clamp pour ajuster la taille tout en gardant le texte responsive */
  font-size: clamp(1.5rem, 20vw, 8rem);
  color: rgba(0, 0, 0, 0);
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-right: 5vw;
  text-align: right;
  z-index: 20;
}

#menu-burger-icon {
  color: #7ab0ee;
}

.typing-cursor {
  animation: blinkCursor 0.75s step-end infinite;
}

@keyframes blinkCursor {
  from, to { color: transparent; }
  50% { color: black; }
}

#job-name span {
  display: inline-block;
  vertical-align: middle;
}

.project-card {
  background: rgba(0, 11, 28, 0.6);
  border: 1px solid rgba(89, 166, 254, 0.2);
  border-radius: 32px;
  padding: clamp(1.5rem, 4vw, 3rem);
  margin-bottom: clamp(2rem, 5vw, 4rem);
  backdrop-filter: blur(20px);
  transition: transform 0.4s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-10px);
  border-color: #59a6fe;
}

.project-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(130deg, rgba(89, 166, 254, 0.18), transparent 60%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.project-card:hover::before {
  opacity: 1;
}

.project-cover {
  border-radius: 24px;
  width: 100%;
  height: clamp(240px, 40vw, 420px);
  object-fit: cover;
  margin-bottom: 1.5rem;
}

.project-content h3 {
  font-size: clamp(2rem, 4vw, 3rem);
  color: #f3f7ff;
  margin-bottom: 0.75rem;
}

.project-content p {
  color: #c8dcff;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.project-meta {
  display: flex;
  gap: 1rem;
  color: #7ab0ee;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.tag {
  padding: 0.35rem 0.85rem;
  border: 1px solid rgba(147, 199, 255, 0.4);
  border-radius: 999px;
  color: #c2dcff;
  font-size: 0.9rem;
}

.project-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.project-link {
  font-family: 'Tusker Grotesk', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.9rem;
  padding: 0.85rem 1.5rem;
  border-radius: 999px;
  border: 1px solid #59a6fe;
  color: #011a36;
  background: #59a6fe;
  transition: background 0.3s ease, color 0.3s ease;
}

.project-link:hover {
  background: transparent;
  color: #59a6fe;
}

.project-link.secondary {
  background: transparent;
  color: #59a6fe;
}

.project-link.secondary:hover {
  background: rgba(89, 166, 254, 0.15);
}


</style>