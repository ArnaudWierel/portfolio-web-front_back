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
     <router-link to="/home" class="center-button">Home</router-link>
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

  button.addEventListener('mouseenter', () => {
    isHovering.value = true;

    // Animation de zoom et de rotation lors du survol
    gsap.to('.circular-text-container svg', { scale: 1.1, duration: 0.5, ease: 'power1.out' });
    gsap.to(".rotateLargeCircle", { rotation: "+=45", duration: 2, ease: "power1.out", transformOrigin: "50% 50%" });
    gsap.to(".rotateMediumCircle", { rotation: "-=45", duration: 2, ease: "power1.out", transformOrigin: "50% 50%" });
    gsap.to(".rotateSmallCircle", { rotation: "+=45", duration: 2, ease: "power1.out", transformOrigin: "50% 50%" });
  });

  button.addEventListener('mouseleave', () => {
    isHovering.value = false;

    // Réinitialisation des transformations
    gsap.to('.circular-text-container svg', { scale: 1, duration: 0.5, ease: 'power1.in' });
    gsap.to([".rotateLargeCircle", ".rotateMediumCircle", ".rotateSmallCircle"], { rotation: 0, duration: 0.5, ease: "power1.in", transformOrigin: "50% 50%" });
  });
};

onMounted(() => {
  InitHoverAnimation();
});
</script>



<style scoped>
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
</style>
