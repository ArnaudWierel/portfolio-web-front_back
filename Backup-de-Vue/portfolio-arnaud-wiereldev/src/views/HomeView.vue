<template>
  <div class="home">
    <!-- Burger Menu Icon -->
    <div class="burger-menu" @click="toggleMenu">
      <font-awesome-icon icon="bars" />
    </div>

    <!-- Burger Menu Links (Hidden initially) -->
    <div class="burger-menu-links" v-show="isMenuVisible">
      <router-link to="/about">About</router-link>
      <router-link to="/projects">Projects</router-link>
    </div>

    <!-- Landing Page Text -->
    <div class="landing">
      <div class="landing-text">
        <h1>Arnaud Wierel</h1>
        <h2>Developer Web Front and Back</h2>
      </div>
    </div>

    <!-- Projects Section -->
    <div class="projects">
      <h2>Projects</h2>
      <!-- Repeat for each project -->
      <div class="project" v-for="project in projects" :key="project.id">
        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>
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
        // ... more projects
      ],
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible;
    },
  },
};
</script>

<style scoped>
/* Base layout styles */
.home {
  display: flex;
  flex-direction: column;
}

/* Burger menu styles */
.burger-menu {
}

.burger-menu-links {
}

/* Landing page styles */
.landing {
  /* styles for landing section */
}

.landing-text {
  /* styles for text within landing section */
}

/* Projects section styles */
.projects {
  /* styles for projects section */
}

.project {
  /* styles for individual project */
}</style>
