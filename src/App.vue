<template>
  <div id="app">
    <router-view></router-view>
  </div>

</template>

<script>

export default {
  name: 'app',
  components: {
  },
    data(){
        return {
            ak: "XSdzkf0NfDrhjsltQ2IQGTdA9GBXTr2K",
        }
    },
}
</script>

<style >
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  overflow-y: scroll;
}
  #footer{
    position: relative;
    width: 99%;
    bottom:20px;
  }

</style>
