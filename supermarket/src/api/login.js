/* 
*   登录页面的请求封装
*
*   by xpf
*
 */

import req from '@/utils/request';

//登录验证请求
export function userlogin(params){
    return req.post('/login/userlogin',params);
}
