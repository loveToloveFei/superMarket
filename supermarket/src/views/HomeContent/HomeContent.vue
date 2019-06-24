<template>
	<div class="home-content">
		<div class="toptitle">
			<i class="box"></i>
			<span class="title">业绩总览</span>
		</div>
		<div class="show">
			<div class="data-information" :class="[ v.minstyel]" v-for="(v,i) in showbox" :key="i">
				<div class="data-title">
					<span>{{v.datatitle}}</span>
					<span>{{v.datapercentage}}</span>
				</div>
				<h2>{{v.datanum}}</h2>
			</div>
		</div>
		<!-- <div class="meg">
			<el-alert :title="meg.success" type="success" show-icon></el-alert>
			<el-alert :title="meg.info" type="info" show-icon></el-alert>
			<el-alert :title="meg.warning" type="warning" show-icon></el-alert>
			<el-alert :title="meg.error" type="error" show-icon></el-alert>
		</div> -->

		<div class="data-echarts mt20">
			<dataecharts></dataecharts>
			<stock></stock>

			<!-- 收入利润查询计算较为复杂,暂缓 -->
			<!-- <profit></profit> -->
		</div>
	</div>
</template>
<script>
import dataecharts from "@/components/DataEcharts.vue";
import stock from "@/components/Stock.vue";
import profit from "@/components/Profit.vue";
export default {
	components: {
		dataecharts,stock,profit
	},
	data() {
		return {
			showbox: [
				{
					minstyel: "blue-box",
					datatitle: "今日售出金额",
					datapercentage: "上浮4.12%",
					datanum: 127463.12
				},
				{
					minstyel: "red-box",
					datatitle: "今日退货金额",
					datapercentage: "上浮4.12%",
					datanum: 789163.12
				},
				{
					minstyel: "deeppink-box",
					datatitle: "今日进购金额",
					datapercentage: "上浮4.12%",
					datanum: 79158634.4
				},
				{
					minstyel: "yellow-box",
					datatitle: "今日利润金额",
					datapercentage: "上浮4.12%",
					datanum: 78934738.12
				}
			],
			meg: {
				success: "今日销售额为77855657.12元,盈利68785.55元",
				info: "进货金额为789634.75",
				warning: "今日商品数据有敏感操作,请前往系统管理中查看日志",
				error: "今日退款金额为897254.75元"
			}
		};
	}
};
</script>

<style lang="less" scoped>
.home-content {
	margin-top: 20px;
	.mt20{
		margin-top: 40px;
	}
	.toptitle {
		display: flex;
		justify-content: flex-start;
		.box {
			display: inline-block;
			width: 6px;
			height: 26px;
			background: #1989fa;
			margin-right: 10px;
		}
		.title {
			color: #1989fa;
			line-height: 26px;
			font-size: 18px;
		}
	}
	.meg {
		margin-top: 40px;
		.el-alert {
			margin-bottom: 10px;
		}
	}
	.show {
		display: flex;
		justify-content: space-between;
		margin-top: 20px;
		.data-information {
			width: 200px;
			height: 76px;
			border-radius: 8px;
			.data-title,
			h2 {
				margin: 12px;
				color: #fff;
			}
			h2 {
				text-align: center;
			}
			.data-title {
				display: flex;
				justify-content: space-between;
			}
			&.blue-box {
				background-color: #60b8f6;
				box-shadow: 3px 27px 36px -15px #60b8f6;
			}
			&.red-box {
				background-color: #fe787a;
				box-shadow: 3px 27px 36px -15px #fe787a;
			}
			&.deeppink-box {
				background-color: #ec92e0;
				box-shadow: 3px 27px 36px -15px #ec92e0;
			}
			&.yellow-box {
				background-color: #fbbb6e;
				box-shadow: 3px 27px 36px -15px #fbbb6e;
			}
		}
	}
}
</style>