import request from "@/utils/request"

export default{
    //校验密码,userId,password旧密码
    checkPwd(userId,password){
        return request({
            url:'/user/pwd',
            method: 'post',
            data: {
                userId,
                password
            },
        })
    },
    //修改密码userId,password新密码
    updatePwd(userId,password){
        return request({
            url:'/user/pwd',
            method:'put',
            data: {
                userId,
                password
            },
        })
    }
}