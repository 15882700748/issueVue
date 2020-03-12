<template>
    
</template>

<script>
    export default {
        name: "redirectPage",
        created(){
            window.location.href = this.$route.query.pageName
        }
    }
</script>

<style scoped>

</style>