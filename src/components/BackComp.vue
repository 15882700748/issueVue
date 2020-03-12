<template>
    <div id="BackComp">
        <el-tooltip class="item" effect="dark" content="返回上一级" placement="top-start">
            <i class="el-icon-back" @click="backTo"></i>
        </el-tooltip>

    </div>
</template>

<script>
    export default {
        name: "BackComp",
        methods:{
            backTo(){
                history.go(-1)
            }
        }
    }
</script>

<style scoped>

</style>