<template>
    <InfoCardComp id="InfoCardComp" style="box-shadow:0px 0px 20px 0 black;min-height:90vh"></InfoCardComp>
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