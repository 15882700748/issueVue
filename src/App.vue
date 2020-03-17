<template>
  <div id="app">
    <router-view></router-view>
  </div>

</template>

<script>

import Org from './views/org'
export default {
  name: 'app',
  components: {
    Org
  }
}
</script>

<style >
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
  #footer{
    position: relative;
    width: 99%;
    bottom:20px;
  }

</style>
