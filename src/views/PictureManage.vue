<template>
    <el-container>
        <el-header v-if="isPicturePage">
            <div>
                <el-tooltip class="item" effect="dark" content="返回上一级" placement="top-start">
                    <i class="el-icon-back" @click="backTo"></i>
                </el-tooltip>
            </div>
        </el-header>
        <el-header v-else>
            <h1>相册查看</h1>
        </el-header>
        <el-main>
            <router-view :isPicturePage="isPicturePage" @getHeaderStatus="getStatus"></router-view>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "PictureManage",
        data(){
            return {
                isPicturePage:false
            }
        },
        methods:{
            backTo(){
                let router = this.$route
                if(router.path === '/album'){
                    this.isPicturePage = false
                }else{
                    this.$router.push("/album")
                    this.isPicturePage = false
                }
            },
            pictureView(){
                this.isPicturePage = true
                this.$router.push("/picture")
            },
            getStatus(value){
                this.isPicturePage = value
            }
        },
        created(){
            this.$router.push("/album")
        }
    }
</script>

<style scoped>

</style>