<template>
  <div class="circular-text-container">
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <!-- Grand Cercle et Texte -->
      <circle cx="50" cy="50" r="35" fill="none" stroke="black" stroke-width="0.5" />
      <text>
        <textPath startOffset="50%" xlink:href="#largeCirclePath" style="font-size: 15px;"> <!-- Ajustez la taille de police ici -->
          and Cercle Texte Grand Ce
        </textPath>
      </text>
      <text>
        <textPath startOffset="0%" xlink:href="#largeCirclePath" style="font-size: 15px;"> <!-- Ajustez la taille de police ici -->
          Texte Grand Cercle Text Gr
        </textPath>
      </text>
      <path id="largeCirclePath" d="M50,50 m-35,0 a20,20 0 1,1 70,0 a20,20 0 1,1 -70,0" fill="none" stroke="red" />

      <!-- Cercle Moyen et Texte -->
      <circle cx="50" cy="50" r="35" fill="none" stroke="black" stroke-width="0.5" />
      <text>
        <textPath startOffset="50%" xlink:href="#mediumCirclePath" style="font-size: 2.5px;"> <!-- Ajustez la taille de police ici -->
          Texte Moyen Cercle
        </textPath>
      </text>
      <path id="mediumCirclePath" d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0" fill="none" />

      <!-- Petit Cercle et Texte -->
      <circle cx="50" cy="50" r="20" fill="none" stroke="black" stroke-width="0.5" />
      <text>
        <textPath startOffset="50%" xlink:href="#smallCirclePath" style="font-size: 2px;"> <!-- Ajustez la taille de police ici -->
          Petit Cercle Texte
        </textPath>
      </text>
      <path id="smallCirclePath" d="M50,50 m-20,0 a20,20 0 1,1 40,0 a20,20 0 1,1 -40,0" fill="none" />
    </svg>
  </div>
</template>

<style scoped>
.circular-text-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  font-family:Tusker Grotesk;
}

.circular-text-container svg {
  width: 100%;
  height: 100%;
  max-width: 100vw;
}
</style>
