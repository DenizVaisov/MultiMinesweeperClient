<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Exo+2|Roboto|Source+Sans+Pro|Oswald&display=swap');

#app {
  font-family: 'Roboto', sans-serif;
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* text-align: center; */
}
</style>
