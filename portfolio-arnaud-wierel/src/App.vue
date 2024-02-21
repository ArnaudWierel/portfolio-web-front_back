<template>

  <router-view/>
</template>

<style>
@font-face {
            font-family: 'Tusker Grotesk';
            src: url('./assets/font/TuskerGroteskFont/TuskerGrotesk-3500Medium.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        @font-face {
            font-family: 'Neue Montreal';
            src: url('./assets/font/NeueMontreal/NeueMontreal-Regular.otf') format('opentype');
            font-weight: 500;
            font-style: normal;
        }

        @font-face {
            font-family: 'Migra';
            src: url('./assets/font/Migra/Migra-Extralight.woff2') format('woff2');
            font-weight: 600;
            font-style: normal;
        }

        @font-face {
            font-family: 'Maelstrom';
            src: url('./assets/font/Maelstrom/MaelstromBold.ttf') format('truetype');
            font-weight: bold;
            font-style: normal;
        }

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

html, body {
  overflow: hidden; /* Cela supprimera la barre de défilement pour toute l'application */
  margin: 0;
}

html{
  background-image: url("./assets/images/maintenance-background.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

h1{
  font-family: Tusker Grotesk, sans-serif;
  font-weight: 900;
  font-size: 8em;
  color: #2c3e50;

}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

</style>
