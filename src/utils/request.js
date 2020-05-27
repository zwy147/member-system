import axios from 'axios';
import { Loading, Message } from 'element-ui';



const loading = {
    loadingInstence: null,
    // 打开加载
    open: function () {
        // 创建实例，而且会打开加载窗口
        if (this.loadingInstence === null) {
            // 如果实例为空，则创建
            console.log("创建加载实例")
            this.loadingInstence = Loading.service({
                target: '.main',
                text: '拼命加载中......',
                background: "rgba(0,0,0,0.5)"
            });
        }
    },
    // 关闭加载
    close: function () {
        if (this.loadingInstence !== null) {
            this.loadingInstence.close()
        }
        this.loadingInstence = null
    }
}

// axios.get('/db.json').then(response=>{
//     const data=response.data
//     console.log(data)
// })

const request = axios.create({
    //  /db.json =>通过 axios => /dev-api/db.json=>通过代理转发（vue.config.js）=>http://localhost:8001/db.json
    // baseURL:'/dev-api',
    //baseURL: '/',
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000,//请求超时，5000ms
})
//请求拦截器
request.interceptors.request.use(config => {
    // 打开加载窗口
    loading.open()
    //请求拦截

    return config
}, error => {
    // 关闭加载窗口
    loading.close()
    //出现异常
    return Promise.reject(error)
}
)
//响应拦截器
request.interceptors.response.use(response => {
    // response.data
    // 关闭加载窗口
    loading.close()

    const resp = response.data

    // 后台正常响应的状态是2000，如果不是，说明后台有问题
    if (resp.code !== 2000) {
        Message({
            message: resp.message,
            type: 'warning',
            duration: 5 * 1000
        })
    }
    return response
}, error => {
    // 关闭加载窗口
    loading.close()
    console.log('response.error', error.response.status)
    Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error)
})
// request.get('/db.json').then(response => {
//     const data = response.data
//     console.log(data)
// })

export default request//导出自定义创建axios对象