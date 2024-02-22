<template>
    <div class="maintenance">
        <h1>{{ msg }}</h1>
        <p>
        Ce site est en construction, revenez plus tard.
        </p>
    </div>
</template>

<script>
export default {
  name: 'MsgMaintenance',
  props: {
    msg: String
  }
}
</script>

<style scoped>
.maintenance {
  font-family: 'Tusker Grotesk', sans-serif;
  background-color: #c5ddf6ad !important;
  background-size: contain;
  text-align: center;
  padding: 40px;
}

p{
  font-size: 3em;
  font-weight: 500;
  padding: 20px;
}

h1,p {
  color: #033369;
}
</style>
