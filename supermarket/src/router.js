import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/login',
      name: '页面重定向登录页面'
    },
    {
      path: '/login',
      name: '登录',
      component: () => import('./views/Login/Login.vue'),
    },
    {
      path: '/home',
      name: '主页',
      component: () => import('./views/Home/Home.vue'),
      redirect:'/home/homecontent',
      children:[
        {
          path: '/home/homecontent',
          name: '主页内容',
          component: () => import('./views/HomeContent/HomeContent.vue'),
        },
        //账号管理
        {
          path: '/home/accountmanagement',
          name: '账号管理',
          component: () => import('./views/AccountManagement/AccountManagement.vue'),
        },
        //添加账号
        {
          path: '/home/addaccount',
          name: '添加账号',
          component: () => import('./views/AddAccount/AddAccount.vue'),
        },
        //添加库存
        {
          path: '/home/addinventory',
          name: '添加库存',
          component: () => import('./views/AddInventory/AddInventory.vue'),
        },
        //添加会员
        {
          path: '/home/addmember',
          name: '添加会员',
          component: () => import('./views/AddMember/AddMember.vue'),
        },
        //添加商品
        {
          path: '/home/addmerchandise',
          name: '添加商品',
          component: () => import('./views/AddMerchandise/AddMerchandise.vue'),
        },
        //更改密码
        {
          path: '/home/changepassword',
          name: '更改密码',
          component: () => import('./views/ChangePassword/ChangePassword.vue'),
        },
        //商品管理
        {
          path: '/home/commoditymanagement',
          name: '商品管理',
          component: () => import('./views/CommodityManagement/CommodityManagement.vue'),
        },
        //商品退货
        {
          path: '/home/goodsreturn',
          name: '商品退货',
          component: () => import('./views/GoodsReturn/GoodsReturn.vue'),
        },
        //日志信息
        {
          path: '/home/loginformation',
          name: '日志信息',
          component: () => import('./views/LogInformation/LogInformation.vue'),
        },
        //会员管理
        {
          path: '/home/membermanagement',
          name: '会员管理',
          component: () => import('./views/MemberManagement/MemberManagement.vue'),
        },
        //商品出库
        {
          path: '/home/outboundgoods',
          name: '商品出库',
          component: () => import('./views/OutboundGoods/OutboundGoods.vue'),
        },
        //销售列表
        {
          path: '/home/saleslist',
          name: '销售列表',
          component: () => import('./views/SalesList/SalesList.vue'),
        },
        //销售统计
        {
          path: '/home/salesstatistics',
          name: '销售统计',
          component: () => import('./views/SalesStatistics/SalesStatistics.vue'),
        },
        //库存管理
        {
          path: '/home/stockcontrol',
          name: '库存管理',
          component: () => import('./views/StockControl/StockControl.vue'),
        },
        //进货统计
        {
          path: '/home/stockstatistics',
          name: '进货统计',
          component: () => import('./views/StockStatistics/StockStatistics.vue'),
        },
        //系统信息
        {
          path: '/home/systeminformation',
          name: '系统信息',
          component: () => import('./views/SystemInformation/SystemInformation.vue'),
        }
      ]
    },
  ]
})