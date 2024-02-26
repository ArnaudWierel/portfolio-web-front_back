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
          <h1 id="first-name-last-name">Arnaud Wierel</h1>
          <h1 id="job-name">Developer Web Front and Back</h1>
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
}

#first-name-last-name{
  margin-left: 5vw;
  font-size: 15em;
  margin-top: -1vh;
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 20vh;
}

#job-name{
  font-size: 8em;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  margin-right: 5vw;
  text-align: right;
}
</style>