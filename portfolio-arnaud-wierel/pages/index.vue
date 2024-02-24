<template>
  <div class="home">
    <div class="menu">
      <div class="burger-menu" @click="toggleMenu">
          <Icon id="menu-burger-icon" name="line-md:menu" size="50"/>
      </div>
    </div>

    <div class="page">
      <div class="landing">
        <div class="landing-text">
          <h1>Arnaud Wierel</h1>
          <h1>Developer Web Front and Back</h1>
        </div>
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

<script>
export default {
  data() {
    return {
      isMenuVisible: false,
      projects: [
        { id: 1, title: 'Project 1', description: 'Project 1 description' },
        { id: 2, title: 'Project 2', description: 'Project 2 description' },
        { id: 3, title: 'Project 3', description: 'Project 3 description' },
      ],
    };
  },
  methods: {
    toggleMenu() {
      // aller à la page du menu
      this.$router.push('/menu');
    },
  },
};
</script>

<style>
/* Votre CSS reste inchangé */
</style>


<style>


img {
  width: 200px;
  height: 200px;
  margin-bottom: 50px;
}

.home {
  height: 101vh;
}


h1{
  font-family: Tusker Grotesk, sans-serif;
  font-weight: 900;
  font-size: 8em;
  color: #2c3e50;

}

.menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.page{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>