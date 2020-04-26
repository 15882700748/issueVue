<template>
    <div class="background">
        <!--<canvasGarden style="width: 100vw;height: 100vh;position: absolute;transform: translateX(-50%);left: 50%"></canvasGarden>-->
        <div id="reg">
            <template>
                <registerForm></registerForm>
            </template>
        </div>
    </div>
</template>

<script>
    import registerForm from '../components/register'
    import BackComp from '../components/BackComp'
    import canvasGarden from '../views/tool/canvasGarden'
    export default {
        name: 'reg',
        components: {
            registerForm,
            BackComp,
            canvasGarden
        }
    }
</script>
<style scoped>
    #reg{
        width: 400px;
        height: 500px;
        position: absolute;
        left: 50%;
        top: 1%;
        transform: translate(-50%,-1%);
    }
    .background{
        width: 100%;
        height: 100vh;
        background-image: url("https://192.168.1.19:8080/imgs/download.jpg");
        background-repeat: no-repeat;
        background-size: 100% 100%  ;
    }
</style>