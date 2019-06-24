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
			<!-- 首页 -->
			<el-menu-item index="/home/homecontent">
				<i :class="{'iconfont':true,'icon-shouye':true}"></i>
				<span slot="title">首页</span>
			</el-menu-item>

			<!-- 优化及方便权限控制 -->
			<el-submenu index="2">
				<template slot="title">
					<i class="iconfont icon-shangpin3"></i>
					<span slot="title">商品管理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/home/commoditymanagement">商品管理</el-menu-item>
					<el-menu-item index="/home/addmerchandise">添加商品</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			
			<!-- 商品管理 -->
			<el-submenu index="2">
				<template slot="title">
					<i class="iconfont icon-shangpin3"></i>
					<span slot="title">商品管理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/home/commoditymanagement">商品管理</el-menu-item>
					<el-menu-item index="/home/addmerchandise">添加商品</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<!-- 进货管理 -->
			<el-submenu index="3">
				<template slot="title">
					<i class="iconfont icon-jinhuo"></i>
					<span slot="title">进货管理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/home/stockcontrol">库存管理</el-menu-item>
					<el-menu-item index="/home/addinventory">添加库存</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<!-- 出货管理 -->
			<el-submenu index="4">
				<template slot="title">
					<i class="iconfont icon-chuhuodingdan"></i>
					<span slot="title">出货管理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/home/saleslist">销售列表</el-menu-item>
					<el-menu-item index="/home/outboundgoods">商品出库</el-menu-item>
					<el-menu-item index="/home/goodsreturn">商品退货</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<!-- 统计系统 -->
			<el-submenu index="5">
				<template slot="title">
					<i class="iconfont icon-statistics"></i>
					<span slot="title">统计管理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/home/salesstatistics">销售统计</el-menu-item>
					<el-menu-item index="/home/stockstatistics">进货统计</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<!-- 账号管理 -->
			<el-submenu index="6">
				<template slot="title">
					<i class="iconfont icon-icon_account"></i>
					<span slot="title">账号管理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/home/accountmanagement">账号管理</el-menu-item>
					<el-menu-item index="/home/addaccount">添加账号</el-menu-item>
					<el-menu-item index="/home/changepassword">密码修改</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<!-- 会员管理 -->
			<el-submenu index="7">
				<template slot="title">
					<i class="iconfont icon-huiyuan"></i>
					<span slot="title">会员管理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/home/membermanagement">会员账号管理</el-menu-item>
					<el-menu-item index="/home/addmember">添加会员账号</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
			<!-- 系统管理 -->
			<el-submenu index="8">
				<template slot="title">
					<i class="iconfont icon-xitong1"></i>
					<span slot="title">系统管理</span>
				</template>
				<el-menu-item-group>
					<el-menu-item index="/home/systeminformation">系统信息</el-menu-item>
					<el-menu-item index="/home/loginformation">日志信息</el-menu-item>
				</el-menu-item-group>
			</el-submenu>
		</el-menu>
	</div>
</template>

<script>
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
			sildeNav: [
				{
					iconFontClass: "iconfont icon-shangpin3",
					navTitle: "商品管理",
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
				{
					iconFontClass: "iconfont icon-statistics",
					navTitle: "统计管理",
					childrenMsgs: [
						{
							path: "/home/salesstatistics",
							title: "销售统计"
						},
						{
							path: "/home/stockstatistics",
							title: "进货统计"
						}
					]
				},
				{
					iconFontClass: "iconfont icon-icon_account",
					navTitle: "账号管理",
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
					childrenMsgs: [
						{
							path: "/home/systeminformation",
							title: "系统信息"
						},
						{
							path: "/home/loginformation",
							title: "日志信息"
						}
					]
				}
			]
		};
	}
};
</script>

<style lang="less" scoped>
</style>