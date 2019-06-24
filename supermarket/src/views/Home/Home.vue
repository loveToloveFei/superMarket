<template>
	<div class="home page-container">
		<el-container>
			<el-aside width="200px" height="100%">
				<sideNav></sideNav>
			</el-aside>
			<el-container>
				<el-header>
					<headtop></headtop>
				</el-header>
				<el-main>
					<router-view></router-view>
				</el-main>
				<!-- <el-footer>
					<p></p>
				</el-footer> -->
			</el-container>
		</el-container>
	</div>
</template>

<script>
import sideNav from "@/components/sideNav.vue";
import headtop from "@/components/Header.vue";
export default {
	components: {
		sideNav,
		headtop
	}
};
</script>

<style lang="less">
@import "./Home.less";
</style>