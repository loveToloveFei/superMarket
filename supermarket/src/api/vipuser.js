/* 
 *   会员相关页面的请求封装
 *
 *   by xpf
 *
 */

import req from '@/utils/request';

//会员是否存在
export function getvipuser(params) {
    return req.get('/vipuser/vipuseradd', params);
}

//会员批量删除
export function removevipusers(params) {
    return req.get('/vipuser/removevipusers', params);
}

//获取会员信息
export function getvipusernew(params) {
    return req.get('/vipuser/setvipuser', params);
}

//会员更改,编辑
export function setvipuser(params) {
    return req.post('/vipuser/setvipuser', params);
}

//删除会员
export function removevipuser(params) {
    return req.get('/vipuser/removevipuser', params);
}

//全部会员列表
export function vipUserList(params) {
    return req.get('/vipuser/vipUserList', params);
}

//会员添加
export function vipuseradd(params) {
    return req.post('/vipuser/vipuseradd', params);
}