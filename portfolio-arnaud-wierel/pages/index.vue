<template>
  <div class="home">
    <div class="menu">
      <div class="burger-menu">
          <Icon id="menu-burger-icon" name="line-md:menu" size="50" @click="toggleMenu" />
      </div>
    </div>

    <div class="page">
        <div class="landing-text">
          <h1 id="first-name-last-name"
            @mouseenter="animateNameEnter"
            @mouseleave="animateNameLeave">
            Arnaud Wierel
          </h1>

          <h1 id="job-name">Developer Web Front and Back</h1>
      </div>

      <div class="projects">
        <h2>Projects</h2>
        <div class="project" v-for="project in projects" :key="project.id">
          <h3>{{ project.title }}</h3>
          <p>{{ project.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import anime from 'animejs';

const router = useRouter();

// Your data and methods can be defined here
const isMenuVisible = ref(false);
const projects = ref([
  { id: 1, title: 'Project 1', description: 'Project 1 description' },
  { id: 2, title: 'Project 2', description: 'Project 2 description' },
  { id: 3, title: 'Project 3', description: 'Project 3 description' },
]);

// Example of a method
const toggleMenu = () => {
  // Navigate using Nuxt 3's useRouter
  router.push('/menu');
};

// Function to initialize or re-initialize animations on the page
function initPageAnimations() {
  document.getElementById('first-name-last-name').style.color = '#033369';

  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: '#first-name-last-name',
      scale: [0.75, 1],
      opacity: [0, 1],
      translateX: [-250, 0],
      duration: 2000,
    });
}

onMounted(() => {
  initPageAnimations();
});

// Example of using a watcher to react to route changes
// This could be adjusted based on how your routing is set up and when you want animations to re-trigger
  // Check if the newPath is the home page and re-initialize animations
// Adjust the condition based on your app's routing structure

watch(() => router.path, (newPath) => {
  if (newPath === '/') {
    initPageAnimations();
  }
});

const animateNameEnter = () => {
  anime({
    targets: '#first-name-last-name',
    scale: [1, 1.05], // Subtle growth in size
    color: '#0367fc', // Change color to blue
    duration: 800,
    easing: 'easeInOutSine',
    begin: function (anim) {
      const element = document.getElementById('first-name-last-name');
      // Réduire la valeur du textShadow pour un effet moins prononcé
      element.style.textShadow = '0 0 5px #0367fc, 0 0 10px #0367fc';
    },
  });
};

const animateNameLeave = () => {
  anime({
    targets: '#first-name-last-name',
    scale: [1.05, 1], // Shrink back to original size
    color: '#033369', // Change color back to original
    duration: 800,
    easing: 'easeInOutSine',
    complete: function (anim) {
      const element = document.getElementById('first-name-last-name');
      element.style.textShadow = 'none';
    },
  });
};
</script>




<style>

img {
  width: 200px;
  height: 200px;
  margin-bottom: 50px;
}
h1{
  font-family: Tusker Grotesk, sans-serif;
  font-weight: 900;
  color: #2c3e50;
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

.page{
  display: flex;
  flex-direction: column;
  height: 100%;
}

.landing-text{
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
  margin-bottom: clamp(10vh, 10vw, 20vh);
  color: rgba(0, 0, 0, 0); /* Initial state is transparent, animation will fade in */
  transition: text-shadow 0.3s ease-in-out; /* Smooth transition for text-shadow */
  padding: 0 1vw; /* Ajoutez un padding pour réduire la hitbox */
  inline-size: fit-content; /* Limite la largeur à celle du contenu */
  box-sizing: border-box; /* Assurez-vous que le padding est inclus dans la largeur */
}

#job-name {
  /* Utilise clamp pour ajuster la taille tout en gardant le texte responsive */
  font-size: clamp(1.5rem, 20vw, 8rem);
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-right: 5vw;
  text-align: right;
}
</style>