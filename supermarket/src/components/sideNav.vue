<template>
	<div class="sideNav">
		<el-menu
			:default-active="$route.path"
			class="el-menu-vertical-demo"
			unique-opened
			@open="handleOpen"
			@close="handleClose"
			router
		>
			<!-- 12346 -->
			<h1 class="img"></h1>

			<!-- 首页 -->
			<el-menu-item index="/home/homecontent">
				<i :class="{'iconfont':true,'icon-shouye':true}"></i>
				<span slot="title">首页</span>
			</el-menu-item>

			<!-- 优化及方便权限控制 -->
			<el-submenu :index="i+2+''" v-for="(v,i) in sildeNav" :key="i">
				<template slot="title">
					<i :class="v.iconFontClass"></i>
					<span slot="title">{{v.navTitle}}</span>
				</template>
				<el-menu-item-group>
					<el-menu-item :index="v.path" v-for="(v,i) in v.childrenMsgs" :key="i">{{v.title}}</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
import { getInfo } from "@/api/user";
export default {
	methods: {
		handleOpen(key, keyPath) {
			// console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			// console.log(key, keyPath);
		}
	},
	data() {
		return {
			sildeNav: []
		};
	},
	created() {
		getInfo()
			.then(res => {
				// 接收数据
				let { data } = res;
				// 获取账号
				let { userGroup } = data[0];
				let nav = [
					{
						iconFontClass: "iconfont icon-shangpin3",
						navTitle: "商品管理",
						rule: ["超级管理员", "管理员", "组长", "成员"],
						childrenMsgs: [
							{
								path: "/home/commoditymanagement",
								title: "商品管理"
							}
						]
					},
					{
						iconFontClass: "iconfont icon-jinhuo",
						navTitle: "进货管理",
						rule: ["超级管理员", "管理员"],
						childrenMsgs: [
							{
								path: "/home/stockcontrol",
								title: "库存管理"
							},
							{
								path: "/home/addinventory",
								title: "添加库存"
							}
						]
					},
					{
						iconFontClass: "iconfont icon-chuhuodingdan",
						navTitle: "出货管理",
						rule: ["超级管理员", "管理员", "组长", "成员"],
						childrenMsgs: [
							{
								path: "/home/saleslist",
								title: "销售列表"
							},
							{
								path: "/home/outboundgoods",
								title: "商品出库"
							},
							{
								path: "/home/goodsreturn",
								title: "商品退货"
							}
						]
					},
					// {
					// 	iconFontClass: "iconfont icon-statistics",
					// 	navTitle: "统计管理",
					// 	childrenMsgs: [
					// 		{
					// 			path: "/home/salesstatistics",
					// 			title: "销售统计"
					// 		},
					// 		{
					// 			path: "/home/stockstatistics",
					// 			title: "进货统计"
					// 		}
					// 	]
					// },
					{
						iconFontClass: "iconfont icon-icon_account",
						navTitle: "账号管理",
						rule: ["超级管理员", "管理员"],
						childrenMsgs: [
							{
								path: "/home/accountmanagement",
								title: "账号管理"
							},
							{
								path: "/home/addaccount",
								title: "添加账号"
							},
							{
								path: "/home/changepassword",
								title: "密码修改"
							}
						]
					},
					{
						iconFontClass: "iconfont icon-huiyuan",
						navTitle: "会员管理",
						rule: ["超级管理员", "管理员"],
						childrenMsgs: [
							{
								path: "/home/membermanagement",
								title: "会员账号管理"
							},
							{
								path: "/home/addmember",
								title: "添加会员账号"
							}
						]
					},
					{
						iconFontClass: "iconfont icon-xitong1",
						navTitle: "系统管理",
						rule: ["超级管理员"],
						childrenMsgs: [
							// {
							// 	path: "/home/systeminformation",
							// 	title: "系统信息"
							// },
							{
								path: "/home/loginformation",
								title: "日志信息"
							}
						]
					}
				];

				// 过滤导航
				this.sildeNav = nav.filter(v => v.rule.includes(userGroup));
			})
			.catch(err => {
				console.log(err);
			});
	}
};
</script>

<style lang="less" scoped>
.sideNav {
	.el-submenu {
		.el-menu-item {
			min-width: 198px;
		}
	}
	.img {
		height: 90px;
		background: url("../assets/logo.png") no-repeat;
		background-size: 60%;
		background-position: center;
	}
}
</style>