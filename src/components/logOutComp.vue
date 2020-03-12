<template>
    <el-row>
        <el-col :span="1">
            <el-tooltip class="item" effect="dark" content="注销" placement="top">
                <i class="el-icon-circle-close logout " @click="logout">退出</i>
            </el-tooltip>

        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "logOutComp",
        methods:{
            logout(){
                window.sessionStorage.removeItem('token')
                this.$message({
                    message:"退出成功",
                    type: "success"
                })
                this.$router.push('/login');
            }
        }
    }
</script>

<style scoped>

    .logout{
        cursor: pointer;
        width: 50px;
    }
</style>