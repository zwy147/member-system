import request from "@/utils/request"
export default{
    //分页搜索方法
    //page当前页码，size每页查询条数，searchMap条件查询的条件值
    search(page, size, searchMap) {
        return request({
            url: `/staff/list/search/${page}/${size}`,
            method: 'post',
            data: searchMap
        })
    },
     //新增会员
     add(pojo) {
        return request({
            url: `/staff`,
            method: 'post',
            data: pojo
        })
    },
    //查询会员信息
    getById(id) {
        return request({
            url: `/staff/${id}`,
            method: 'get',
        })
    },
    //更新会员信息
    update(pojo) {
        return request({
            url: `/staff/${pojo.id}`,
            method: 'put',
            data: pojo
        })
    },
    //删除会员
    deleteById(id){
        return request({
            url:`/staff/${id}`,
            method:'delete'
        })
    }
}