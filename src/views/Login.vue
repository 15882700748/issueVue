<template>
   <div >
      <canvasGarden style="width: 100vw;height: 100vh;position: absolute;transform: translateX(-50%);left: 50%"></canvasGarden>
      <div id="ruleForm">
         <loginComp></loginComp>
      </div>
   </div>

</template>

<script>
    import LoginComp from '../components/loginComp'
    import BackComp from '../components/BackComp'
    import canvasGarden from '../views/tool/canvasGarden'
    export default {
        name: "Login",
        components: {
            LoginComp,
            BackComp,
            canvasGarden
        },
        data(){
           return {
               identifyCodeSrc:'',
               ruleForm:{
                   code:''
               }
           }
        },
        methods: {
            /**
             * 窗口代码
             * @param {Boolean} bRefresh 是否刷新
             */
            getIdentifyingCode: function (bRefresh) {
                let identifyCodeSrc = axios.defaults.baseURL+"getVerify";
                if (bRefresh) {
                    identifyCodeSrc =  axios.defaults.baseURL+"/getVerify?" + Math.random();
                }
                let objs = document.getElementById("imgIdentifyingCode");
                objs.src = identifyCodeSrc;
            },
        },
        created(){
            this.identifyCodeSrc = axios.defaults.baseURL+"/getVerify"
        }
    }
</script>

<style scoped>
   #ruleForm{
      width: 350px;
      height: 450px;
      position: absolute;
      left: 80%;
      top: 25%;
      transform: translate(-80%,-25%);
   }
   .background{
      width: 100%;
      height: 97vh;
      background-image: url("https://192.168.1.19:8080/imgs/download.jpg");
      background-repeat: no-repeat;
      background-size: 100% 100%  ;
   }
</style>