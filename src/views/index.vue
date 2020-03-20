<template>
    <div >
        <el-container >
            <el-header >
                <div>
                    欢迎{{orgName}}
                </div>
                <div>
                    <LogOutComp class="logout"></LogOutComp>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu router>
                        <el-submenu index="1" v-for="(item,index) in $router.options.routes" v-show="item.show" :index="index+''">
                            <template slot="title"><i :class="item.icon"></i>{{item.name}}</template>
                            <el-menu-item v-for="(item2, index2) in item.children" :index="item2.path">{{item2.name}}</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<style>
    .el-header {
        background-color: #fdfbff;
        color: #333;
        line-height: 60px;
    }
</style>
<script>
    import LogOutComp from '../components/logOutComp'
    export default {
        name:'index',
        components:{
            LogOutComp
        },
        data(){
          return{
              orgName:''
          }
        },
        created(){
            this.orgName = this.$route.query.orgName
        }
    }
</script>

<style scoped>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    .logout{
        position: absolute;
        top: 4px;
        right: 1%;
    }
</style>
