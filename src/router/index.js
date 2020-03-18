import Vue from 'vue'
import VueRouter from 'vue-router'
import org from '../views/org.vue'
import addOrg from '../views/addOrg.vue'
import Index from '../views/index.vue'
import Register from '../views/register'
import ArticleConfig from '../views/ArticleConfig'
import ArticleManage from '../views/ArticleManage'
import ColumConfig from '../views/ColumConfig'
import HomeConfig from '../views/HomeConfig'
import Login from '../views/Login'
import MessageManage from '../views/MessageManage'
import PictureManage from '../views/PictureManage'
import SponManage from '../views/SponManage'
import ForgetPassword from '../views/ForgetPassword'
import RedirectPage from  '../views/tool/redirectPage'
import AlbumComp from '../components/picture/albumComp'
import pictureComp from '../components/picture/pictureComp'
Vue.use(VueRouter)

const routes = [
    {
        path:'/index',
        name: '首页配置',
        component:Index,
        redirect:'/HomeConfig',
        show:true,
        isDivider:false,
        icon:'el-icon-s-home',
        children:[
            {
                path:'/HomeConfig',
                name: 'HomeConfig',
                component:HomeConfig,
            }
        ]
    },
    {
        path:'/index3',
        name: '文章配置',
        component:Index,
        redirect:'/ArticleConfig',
        show:true,
        isDivider:false,
        icon:'el-icon-reading',
        children:[
            {
                path:'/ArticleConfig',
                name:'文章配置',
                component:ArticleConfig,
            }
        ]
    },
    {
        path:'/index4',
        name: '栏目配置',
        component:Index,
        redirect:'/ColumConfig',
        show:true,
        isDivider:true,
        icon:'el-icon-document',
        children:[
            {
                path:'/ColumConfig',
                name:'ColumConfig',
                component:ColumConfig,
            }
        ]
    },
    {
        path:'/index5',
        name: '文章管理',
        component:Index,
        redirect:'/ArticleManage',
        show:true,
        isDivider:false,
        icon:'el-icon-notebook-2',
        children:[
            {
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
