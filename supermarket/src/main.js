import Vue from 'vue'
import App from './App.vue'
import router from './router'
//样式重置
import '@/assets/css/base.css';
// 公共样式
import '@/assets/css/common.css';
//element-ui引入
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//字体图标引入
import '@/assets/icon/iconfont.css'
//echart报表引入
import echarts from 'echarts';


//在vue原型上挂载echarts
Vue.prototype.$echarts = echarts


Vue.use(ElementUI);

Vue.config.productionTip = false



// 路由守卫 拦截所有路由
router.beforeEach((to, from, next) => {
  // 获取token
  const token = window.localStorage.getItem('myusertoken')
  // 判断
  if (token) { // 如果有token 直接放行
    next()
  } else {
    // a. 如果去的是登录 直接放行
    if (to.path === '/login') {
      next()
    } else {
      next({
        path: '/login'
      }) //  b. 如果去的是其他页面，直接跳转到登录页面。
    }
  }
})




new Vue({
  router,
  render: h => h(App)
}).$mount('#app')