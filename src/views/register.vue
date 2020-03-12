<template>
    <div >
        <div id="back">
            <template>
                <BackComp></BackComp>
            </template>
        </div>
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
    export default {
        name: 'reg',
        components: {
            registerForm,
            BackComp
        }
    }
</script>
<style scoped>
    #reg{
        width: 400px;
        height: 500px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
</style>