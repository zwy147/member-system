import request from '@/utils/request'

export default {
    //获取会员列表属性
    getList() {
        return request({
            url: '/member/list',
            methods: 'get'
        })
    },
    //分页搜索方法
    //page当前页码，size每页查询条数，searchMap条件查询的条件值
    search(page, size, searchMap) {
        return request({
            url: `/member/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
    //新增会员
    add(pojo) {
        return request({
            url: `/member`,
            method: 'post',
            data: pojo
        })
    },
    //查询会员信息
    getById(id) {
        return request({
            url: `/member/${id}`,
            method: 'get',
        })
    },
    //更新会员信息
    update(pojo) {
        return request({
            url: `/member/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },
    //删除会员
    deleteById(id){
        return request({
            url:`/member/${id}`,
            method:'delete'
        })
    }
}