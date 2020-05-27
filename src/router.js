import Vue from 'vue'
import Router from 'vue-router'
//会默认导入./views/login目录下的index.vue
import Login from './views/login'
import Layout from '@/components/Layout'
import Home from '@/views/home1'
import Good from '@/views/good'
import Member from '@/views/member'
import Staff from '@/views/staff'
import Supplier from '@/views/supplier'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/login',//路由请求地址
            name: 'login',//路由名称
            component: Login//组件对象
        },
        {
            path: '/',//路由请求地址
            name: 'layout',//路由名称
            component: Layout,//组件对象
            redirect: '/home1',
            children: [
                {
                    path: '/home1',//路由请求地址
                    component: Home,//组件对象
                    meta: {
                        title: '首页'
                    }
                },
                
            ]
        },
        {
            path:'/supplier',
            component:Layout,
            children:[
                {
                    path:'/',
                    component:Supplier,
                    meta: {
                        title: '供应商管理'
                    }
                }
            ]
        },
        {
            path:'/good',
            component:Layout,
            children:[
                {
                    path:'/',
                    component:Good,
                    meta: {
                        title: '商品管理'
                    }
                }
            ]
        },
        {
            path:'/member',
            component:Layout,
            children:[
                {
                    path:'/',
                    component:Member,
                    meta: {
                        title: '会员管理'
                    }
                }
            ]
        },
        {
            path:'/staff',
            component:Layout,
            children:[
                {
                    path:'/',
                    component:Staff,
                    meta: {
                        title: '员工管理'
                    }
                }
            ]
        }


    ]
})