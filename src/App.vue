<template>
  <div id="app">
    <router-view></router-view>
  </div>

</template>

<script>

import Org from './views/org'
import { MP } from '../map'
export default {
  name: 'app',
  components: {
    Org
  },
    data(){
        return {
            ak: "XSdzkf0NfDrhjsltQ2IQGTdA9GBXTr2K",
        }
    },
    async mounted(){
        await MP(this.ak);
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
