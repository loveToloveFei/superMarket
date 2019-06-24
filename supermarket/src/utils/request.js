/* 
*   页面请求的封装
*
*   2019-4-20 by xpf
*
 */

//引入axios
import axios from 'axios';
//引入qs,用于post请求数据传输转换
import qs from 'qs';


// import {
//     promises
// } from 'fs';    未知的东西.....暂留

//采用axios可以这么写
// const instance = axios.create();
// const token = window.localStorage.getItem('myusertoken');
// console.log(window.localStorage.getItem('myusertoken'));

//设置请求拦截器
// instance.interceptors.request.use(function(config) {
//     config.headers.authorization = `Bearer ${token}` 
//     return config;
// })

axios.interceptors.request.use(config => {
    // 获取token
    let token = window.localStorage.getItem('myusertoken');
    // 请求头携带token
    config.headers.authorization = `Bearer ${token}` 
    return config;
})


axios.defaults.baseURL = 'http://127.0.0.1:9527';

export default {
    get(url, params = {}) {
        return new Promise((res, rej) => {
            axios.get(url, {
                    params
                })
                .then(response => {
                    res(response.data)
                })
                .catch(err => {
                    rej(err)
                })
        })
    },
    post(url, params = {}) {
        return new Promise((res, rej) => {

        
            axios.post(url, qs.stringify(params))
                .then(response => {
                    res(response.data);
                })
                .catch(err => {
                    rej(err);
                })
        })
    }

}