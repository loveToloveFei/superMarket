<template>
	<div class="system-information">
		<el-row>
			<!-- 标题部分 -->
			<el-col :span="24">
				<h3>系统信息</h3>
			</el-col>
			<el-col :span="24"></el-col>
		</el-row>
	</div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.system-information {
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	margin-top: 20px;
	padding: 10px;
	h3 {
		padding-bottom: 10px;
		border-bottom: 1px solid #f1f1f1;
	}
	.el-form {
		margin-top: 20px;
		width: 600px;
		.line {
			text-align: center;
		}
	}
}
</style>