// 权限校验
// vue router 中的前置钩子函数beforeEach(to,from,next)
// 当进行路由跳转时，进行判断是否已经登录，若已登录允许访问非登录页面，否则返回登录页
//to:即将进入的路由对象
//from:即将离开的路由对象
//next:是一个方法，可以指定路由地址，进行路由跳转

import router from './router'
import { getUserInfo } from './api/login'
import store from './store'

router.beforeEach((to, from, next) => {
    //1.获取token
    // const token = localStorage.getItem("zhu-member-token")
    const token = store.state.user.token
    if (!token) {
        //1.1如果没有获取到，要访问非登录页面，则不让访问，加载到登录页面/login
        if (to.path !== '/login') {
            next({ path: '/login' })
        } else {
            next()
        }
    } else {
        //1.2获取到token
        //1.2.1请求路由/login，那就去目标路由
        if (to.path === '/login') {
            next()
        } else {
            //1.2.2请求路由非登录页面，先在本地查看是否有用户信息
            // const userInfo = localStorage.getItem("zhu-member-user")
            const userInfo=store.state.user.user
            console.log('userInfo',userInfo)
            if (userInfo) {
                //本地获取到，去目标路由
                next()
            } else {
                //如果本地没有用户信息，就通过token获取用户信息
                store.dispatch('GetUserInfo').then(response => {
                    if (response.flag) {
                        next()
                    } else {
                        next({ path: '/login' })
                    }
                }).catch(error => {

                })
            }
        }
    }
})