<template>
    <el-container style="box-shadow:0px 0px 20px 0 black;min-height:90vh">
        <el-header v-if="isPicturePage" style="background-color:#545c64;;color: #fff">
            <div>
                <el-row>
                    <el-col :span="2">
                        <el-tooltip class="item" effect="dark" content="返回上一级" placement="top-start">
                            <i class="el-icon-back" @click="backTo"></i>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="22">
                       查看： {{albumName}}相册
                    </el-col>
                </el-row>
            </div>
        </el-header>
        <el-header v-else style="background-color:#545c64;color: #fff">
            <h1 style="position: relative;top:-20px;">相册查看</h1>
        </el-header>
        <el-main style="border-left:1px #545c64 solid;border-right: 1px #545c64 solid;border-bottom: 1px #545c64 solid;height: 100hv;">
            <router-view :isPicturePage="isPicturePage" @getHeaderStatus="getStatus"  ></router-view>
        </el-main>
    </el-container>
</template>

<script>
    export default {
        name: "PictureManage",
        data(){
            return {
                isPicturePage:false,
                albumName:''
            }
        },
        methods:{
            backTo(){
                let router = this.$route
                if(router.path === '/album'){
                    this.isPicturePage = false
                    this.albumName = ''
                }else{
                    this.$router.push("/album")
                    this.isPicturePage = false
                    this.albumName = ''
                }
            },
            pictureView(){
                this.isPicturePage = true
                this.$router.push("/picture")

            },
            getStatus(value){
                this.isPicturePage = value.isPicture
                this.albumName = value.albumName
            }
        },
        created(){
            this.$router.push("/album")
        }
    }
</script>

<style scoped>

.le-main{
    background-color:transparent;;
}
</style>