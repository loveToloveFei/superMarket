/* 
 *   商品出库相关页面的请求封装
 *
 *   by xpf
 *
 */

import req from '@/utils/request';

//商品查询
export function setcomm(params) {
    return req.get('/outcomm/setcomm', params);
}

//会员查询
export function vipuser(params) {
    return req.get('/outcomm/vipuser', params);
}

//商品出库
export function addoutcomm(params){
    return req.post('/outcomm/addoutcomm', params);
}


//商品出库列表查询
export function getoutcommList(params) {
    return req.get('/outcomm/outcommList', params);
}

//商品退货列表查询
export function getoutcommLists(params) {
    return req.get('/outcomm/outcommLists', params);
}

//商品退货
export function returncomm(params){
    return req.post('/outcomm/returncomm', params);
}