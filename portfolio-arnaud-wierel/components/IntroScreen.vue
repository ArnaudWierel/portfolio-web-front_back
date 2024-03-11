<template>
  <div class="circular-text-container">
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <!-- Grand Cercle et Texte -->
      <!-- <circle cx="50" cy="50" r="35" fill="none" stroke="black" stroke-width="0.5" /> -->
      <g class="rotateLargeCircle">
      <text>
        <textPath class="texteGrandCercle" startOffset="1%" xlink:href="#largeCirclePath" style="font-size: 15px; font-weight: bold;"> <!-- Ajustez la taille de police ici -->
          BIENVENUE SUR LE PORTFOLIO B
        </textPath>
      </text>
      <text>
        <textPath class="texteGrandCercle" startOffset="55.5%" xlink:href="#largeCirclePath" style="font-size: 15px; font-weight: bold;"> <!-- Ajustez la taille de police ici -->
          IENVENUE SUR LE PORTFOL
        </textPath>
      </text>
      <path id="largeCirclePath" d="M50,50 m-35,0 a20,20 0 1,1 70,0 a20,20 0 1,1 -70,0" fill="none" stroke="none" />
      </g>

      <!-- Cercle Moyen et Texte -->
      <!-- <circle cx="50" cy="50" r="20" fill="none" stroke="black" stroke-width="0.5" /> -->
      <g class="rotateMediumCircle">
      <text>
        <textPath class="texteMoyenCercle" startOffset="0%" xlink:href="#mediumCirclePath" style="font-size: 10px; font-weight: bold;"> <!-- Ajustez la taille de police ici -->
          DE ARNAUD WIEREL DE A
        </textPath>
      </text>
      <text>
        <textPath class="texteMoyenCercle" startOffset="50%" xlink:href="#mediumCirclePath" style="font-size: 10px; font-weight: bold;"> <!-- Ajustez la taille de police ici -->
          RNAUD WIEREL DE ARNA
        </textPath>
      </text>
      <path id="mediumCirclePath" d="M50,50 m-20,0 a15,15 0 1,1 40,0 a15,15 0 1,1 -40,0" fill="none" stroke="none" />
      </g>

      <!-- Petit Cercle et Texte -->
      <!-- <circle cx="50" cy="50" r="10" fill="none" stroke="black" stroke-width="0.5" /> -->
      <g class="rotateSmallCircle">
      <text>
        <textPath class="textePetitCercle" startOffset="0%" xlink:href="#smallCirclePath" style="font-size: 5px; font-weight: bold;"> <!-- Ajustez la taille de police ici -->
          CLIQUEZ SUR LE BOUTON
        </textPath>
      </text>
      <text>
        <textPath class="textePetitCercle" startOffset="50%" xlink:href="#smallCirclePath" style="font-size: 5px; font-weight: bold;"> <!-- Ajustez la taille de police ici -->
          CLIQUEZ SUR LE BOUTON
        </textPath>
      </text>
      <path id="smallCirclePath" d="M50,50 m-10,0 a10,10 0 1,1 20,0 a10,10 0 1,1 -20,0" fill="none" />
      </g>
    </svg>
      <button @click="goToHome" class="center-button">Home</button>
  </div>
</template>


<script setup>
import { onMounted, ref } from 'vue';
import { useNuxtApp } from '#app';

// Références pour contrôler l'état de survol
const isHovering = ref(false);



const InitHoverAnimation = () => {
  const { $gsap: gsap, $MotionPathPlugin: MotionPathPlugin } = useNuxtApp();

  // Assurez-vous que GSAP est bien chargé avec le plugin MotionPath
  gsap.registerPlugin(MotionPathPlugin);

  const button = document.querySelector('.center-button');

  // Initialisation des états d'animation avec l'opacité et l'échelle à 0 pour le SVG et le bouton
  gsap.set(['.circular-text-container svg', '.center-button'], { scale: 0, opacity: 0 });

  // Animation d'entrée pour le SVG
  gsap.to('.circular-text-container svg', {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: 'power1.out',
    delay: 0.3
  });

  // Animation d'entrée pour le bouton, potentiellement avec un délai différent pour créer un effet coordonné
  gsap.to('.center-button', {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    ease: 'power1.out',
    delay: 0.5 // Ajustez ce délai au besoin
  });


  // Initialisation des états d'animation
  gsap.set('.circular-text-container svg', { scale: 0 });
  gsap.set([".rotateLargeCircle", ".rotateMediumCircle", ".rotateSmallCircle"], { rotation: 0, transformOrigin: "50% 50%" });
  gsap.set('.center-button', { scale: 1, backgroundColor: '#033369', color: '#59a6fe' });

  // Animation d'entrée
  gsap.to('.circular-text-container svg', { scale: 1, duration: 0.5, ease: 'power1.out', delay: 0.3 });


  button.addEventListener('mouseenter', () => {
    isHovering.value = true;

    // animation du bouton lors du survol (zoom et changement de couleur)
    gsap.to('.center-button', { scale: 1.1, duration: 0.5, ease: 'power1.out' });
    gsap.to('.center-button', { backgroundColor: '#59a6fe', color: '#033369', duration: 0.25, ease: 'power1.out' });

    // Animation de zoom et de rotation lors du survol
    gsap.to('.circular-text-container svg', { scale: 1.1, duration: 0.5, ease: 'power1.out' });
    gsap.to(".rotateLargeCircle", { rotation: "+=45", duration: 2, ease: "power1.out", transformOrigin: "50% 50%" });
    gsap.to(".rotateMediumCircle", { rotation: "-=45", duration: 2, ease: "power1.out", transformOrigin: "50% 50%" });
    gsap.to(".rotateSmallCircle", { rotation: "+=120", duration: 2, ease: "power1.out", transformOrigin: "50% 50%" });
  });

  button.addEventListener('mouseleave', () => {
    isHovering.value = false;

    // Réinitialisation des transformations
    gsap.to('.circular-text-container svg', { scale: 1, duration: 0.5, ease: 'power1.in' });
    gsap.to([".rotateLargeCircle", ".rotateMediumCircle", ".rotateSmallCircle"], { rotation: 0, duration: 0.5, ease: "power1.in", transformOrigin: "50% 50%" });
    gsap.to('.center-button', { scale: 1, duration: 0.5, ease: 'power1.in' });
    gsap.to('.center-button', { backgroundColor: '#033369', color: '#59a6fe', duration: 0.25, ease: 'power1.in' });
  });
};

const goToHome = () => {
  const { $router } = useNuxtApp();
  const { $gsap: gsap } = useNuxtApp();

  // transition entre les pages quand on clique sur le bouton
  gsap.to('.circular-text-container svg', { scale: 0, duration: 0.5, ease: 'power1.in', onComplete: () => $router.push('/home') });
};

onMounted(() => {
  InitHoverAnimation();
});
</script>



<style scoped>
.circular-text-container svg {
  opacity: 0; /* ou `visibility: hidden;` */
}

.center-button {
  opacity: 0; /* ou `visibility: hidden;` */
}

.circular-text-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  font-family: 'Tusker Grotesk', sans-serif;
}

.circular-text-container svg {
  width: 100%;
  height: 100%;
  max-width: 100vw;
}

.center-button {
  position: absolute;
  border: none;
  background-color: #033369;
  color: #59a6fe;
  text-decoration: none;
  font-family: 'Maelstrom';
  font-size: 16px; /* Ajusté pour correspondre à la taille du bouton */
  font-weight: bold;
  border-radius: 50%;
  width: 100px; /* Ajustement pour un cercle plus grand */
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
}

/* overflow: hidden pour eviter le scroll vertical */
body {
  overflow: hidden;
}
</style>
