<script setup>
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import anime from 'animejs';
import { useNuxtApp } from '#app';
import { TextPlugin } from "gsap/TextPlugin";
//-------------------------------------------------------------------------
const router = useRouter();
const isMenuVisible = ref(false);
const projects = ref([
  { id: 1, title: 'Project 1', description: 'Project 1 description' },
  { id: 2, title: 'Project 2', description: 'Project 2 description' },
  { id: 3, title: 'Project 3', description: 'Project 3 description' },
]);

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

  projects.value.forEach((project, index) => {
    gsap.fromTo(`#project-${project.id}`,
      { y: 50, opacity: 0, scale: 0.5 }, // Commence avec une opacité de 0 et une échelle réduite
      {
        y: 0,
        opacity: 1,
        scale: 1, // Animer vers une opacité complète et l'échelle normale
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: `#project-${project.id}`,
          start: 'top 30%', // Commence l'animation un peu plus tôt
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
          markers: true,
        }
      });
  });


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

  // Animation avec ScrollTrigger pour #titre-projet
  gsap.from('#titre-projet', {
    scrollTrigger: {
      trigger: '#titre-projet',
      start: 'top 10%', // Démarre l'animation un peu plus tôt
      end: 'top center', // Définit la fin de l'animation pour mieux contrôler sa réversibilité
      toggleActions: 'play none none reverse', // Joue l'animation à l'entrée et la réinitialise quand on remonte
      markers: true, // À enlever ou commenter en production
    },
    opacity: 0,
    y: -50,
    duration: 0.5,
    ease: 'power3.out',
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

      <div class="projects">
        <h1 id="titre-projet" class="project">Projects</h1>
        <div class="project listproject" v-for="project in projects" :key="project.id" :id="`project-${project.id}`">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

.projects {
  min-height: 150vh; /* Assurez-vous que chaque projet est assez haut pour le défilement */
  /*faire un margin top négtif pour que le titre du projet soit en haut de la page, mais il faut qu'il s'adapt à la taille de l'écran*/
  transform: translateY(-300px);
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
  font-size: 10rem;
  margin-bottom: 50px;
  color : #044894;
  display: block;
  text-align: center;
  position: sticky;
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

.project {
  font-size: 1.2rem;
  /* Ajustez la taille de la police */
  margin: 20px 0;
  /* Ajoutez de la marge autour de chaque projet */
  transition: transform 0.3s ease-out;
  /* Animation fluide */
}

.listproject{
  display: flex;
  flex-direction: column;
}

.project h3 {
  font-size: 2rem;
  /* Taille de la police pour le titre du projet */
  color: #044894;
  /* Couleur du titre */
}

.project p {
  margin-top: 10px;
  /* Espace entre le titre et la description */
}


</style>