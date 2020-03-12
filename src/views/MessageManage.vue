<template>
    <InfoCardComp id="InfoCardComp"></InfoCardComp>
</template>

<script>
    import InfoCardComp from '../components/organization/InfoCardComp'
    export default {
        name: "MessageManage",
        components:{
            InfoCardComp
        }

    }
</script>

<style scoped>

    #InfoCardComp{
        width: 100%;
        height: auto;
    }
</style>