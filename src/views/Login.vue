<template>
   <div>
      <div id="back">
         <BackComp></BackComp>
      </div>
      <div id="ruleForm">
         <loginComp></loginComp>
      </div>
   </div>

</template>

<script>
    import LoginComp from '../components/loginComp'
    import BackComp from '../components/BackComp'
    export default {
        name: "Login",
        components: {
            LoginComp,
            BackComp
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
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
   }
</style>