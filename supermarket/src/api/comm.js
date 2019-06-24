/* 
 *   商品相关页面的请求封装
 *
 *   by xpf
 *
 */

import req from '@/utils/request';

//商品批量删除请求
export function removecomms(params) {
    return req.get('/comm/removecomms', params);
}

//点击编辑请求当前点击的数据
export function getsetcomm(params) {
    return req.get('/comm/setcomm', params);
}

//发送请求对商品进行更改
export function setcomm(params) {
    return req.post('/comm/setcomm', params);
}

//删除商品
export function removecomm(params) {
    return req.get('/comm/removecomm', params);
}

//获取商品列表,带分页
export function commList(params) {
    return req.get('/comm/commList', params);
}

//商品添加
export function addcomm(params) {
    return req.post('/comm/addcomm', params);
}