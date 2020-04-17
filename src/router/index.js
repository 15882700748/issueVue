import Vue from 'vue'
import VueRouter from 'vue-router'
import org from '../views/org.vue'
import addOrg from '../views/addOrg.vue'
import Index from '../views/index.vue'
import Register from '../views/register'
import ArticleConfig from '../views/ArticleConfig'
import ArticleManage from '../views/ArticleManage'
import ColumConfig from '../views/ColumConfig'
import ColumManage from '../views/ColumManage'
import HomeConfig from '../views/HomeConfig'
import Login from '../views/Login'
import MessageManage from '../views/MessageManage'
import PictureManage from '../views/PictureManage'
import SponManage from '../views/SponManage'
import ForgetPassword from '../views/ForgetPassword'
import RedirectPage from  '../views/tool/redirectPage'
import AlbumComp from '../components/picture/albumComp'
import pictureComp from '../components/picture/pictureComp'
import IssueManage from '../views/issue/issueManage'
import Map from "../views/tool/map"
Vue.use(VueRouter)

const routes = [
    {
        path:'/index',
        name: '样式配置',
        component:Index,
        redirect:'/HomeConfig',
        show:true,
        isDivider:false,
        icon:'el-icon-reading',
        children:[
            {
                show:true,
                path:'/HomeConfig',
                name: '首页样式',
                component:HomeConfig,
            },
            // {
            //     show:true,
            //     path:'/columConfig',
            //     name:'栏目样式',
            //     component:ColumConfig,
            // },
            // {
            //     show:true,
            //     path:'/articleConfig',
            //     name:'文章样式',
            //     component:ArticleConfig,
            // },


        ]
    },
    // {
    //     path:'/index4',
    //     name: '栏目配置',
    //     component:Index,
    //     redirect:'/ColumConfig',
    //     show:true,
    //     isDivider:true,
    //     icon:'el-icon-document',
    //     children:[
    //
    //     ]
    // },
    {
        path:'/index5',
        name: '会议管理',
        component:Index,
        redirect:'/issueManage',
        show:true,
        isDivider:false,
        icon:'el-icon-notebook-2',
        children:[
            {
                show:true,
                path:'/issueManage',
                name:'会议',
                component:IssueManage,
            },
            {
                show:false,
                path:'/columManage',
                name:'会议栏目',
                component:ColumManage,
            },
            {
                show:false,
                path:'/ArticleManage',
                name:'文章管理',
                component:ArticleManage,
            }
        ]
    },
    {
        path:'/index6',
        name: '赞助管理',
        component:Index,
        redirect:'/SponManage',
        show:true,
        isDivider:false,
        icon:'el-icon-office-building',
        children:[
            {
                show:true,
                path:'/SponManage',
                name:'赞助商管理',
                component:SponManage,
            }
        ]
    },
    {
        path:'/index7',
        name: '基础信息管理',
        component:Index,
        redirect:'/MessageManage',
        show:true,
        isDivider:false,
        icon:'el-icon-user',
        children:[
            {
                show:true,
                path:'/MessageManage',
                name:'信息管理',
                component:MessageManage,
            }
        ]
    },
    {
        path:'/index8',
        name: '照片管理',
        component:Index,
        redirect:'/MessageManage',
        show:true,
        isDivider:false,
        icon:'el-icon-picture-outline',
        children:[
            {
                show:true,
                path:'/PictureManage',
                name:'图片管理',
                redirect:'/album',
                children:[
                    {
                        path:"/album",
                        name:"相册",
                        component:AlbumComp
                    },
                    {
                        path:"/picture",
                        name:"图片",
                        component:pictureComp
                    },
                ],
                component:PictureManage,
            }
        ]
    },
    {
        path:'/register',
        name:'注册',
        show:false,
        component:Register
    },
    {
        path:'/login',
        name:'登录',
        show:false,
        component:Login
    },
    {
        path:'/forgetPassword',
        name:'忘记密码',
        show:false,
        component:ForgetPassword
    },
    {
        path:'/redirectPage',
        name:'页面跳转',
        show:false,
        component:RedirectPage
    },
    {
        path:'/map',
        name:'地图',
        show:false,
        component:Map
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) =>{
    let token = window.sessionStorage.getItem('token')
    let paths = ['/login','/register','/forgetPassword','/redirectPage']
    if (paths.indexOf(to.path)!== -1) return next();
    if(!token) return next('/login')
    next()
})

export default router
