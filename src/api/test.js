// 等价于import axios from '@/utils/request'
import request from '@/utils/request'

// request.get('/db.json').then(response=>{
//     const data=response.data
//     console.log(data)
// })
const BASE_URL = process.env.VUE_APP_BASE_API
//测试2，以对象配置的方式进行指定请求方式
request({
    method: 'get',
    // url: BASE_URL + '/db.json'
    url:'/db.json'
}).then(response => {
    console.log('get2', response.data)
})

export default {
    getList() {
        const req = request({
            method: 'get',
            //url: BASE_URL + '/db.json'
            url:'/db.json'
        })
        return req
    }
}