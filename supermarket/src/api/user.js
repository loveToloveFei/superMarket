/* 
 *   用户相关页面的请求封装
 *
 *   by xpf
 *
 */

import req from '@/utils/request';

//用户批量删除
export function removeusers(params) {
    return req.get('/user/removeusers', params);
}

//用户编辑前请求编辑用户的数据
export function getsetuser(params) {
    return req.get('/user/setuser', params);
}

//用户编辑请求发送
export function setuser(params) {
    return req.post('/user/setuser', params);
}


//删除用户
export function removeuser(params) {
    return req.get('/user/removeuser', params);
}


//获取用户列表
export function userlist(params) {
    return req.get('/user/userlist', params);
}

//用户存在验证
export function getuser(params) {
    return req.get('/user/useradd', params);
}

//用户添加/注册
export function useradd(params) {
    return req.post('/user/useradd', params);
}

//密码修改
export function resetuserpwd(params) {
    return req.post('/user/resetuserpwd', params);
}

/* 获取当前登录的用户信息 */
export function getInfo() {
    return req.get('/user/info')
}

//发送文件
// export function imageUpload(params) {
//     return req.post('/user/imageupload', params);
// }