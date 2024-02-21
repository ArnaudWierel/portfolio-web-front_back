<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.svg">
    <MsgMaintenance msg="Ce site est en construction"/>
  </div>
</template>

<script>
// @ is an alias to /src
import MsgMaintenance from '@/components/Maintenance.vue'

export default {
  name: 'HomeView',
  components: {
    MsgMaintenance
  }
}
</script>

<style scoped>
img {
  width: 200px;
  height: 200px;
  margin-bottom: 50px;
}

.home {
  background-image: url("../assets/images/maintenance-background.jpg");
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>