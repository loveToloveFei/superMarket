<template>
	<div>
		<h3>最近十天支出收入及利润</h3>
		<div class="data-echart" ref="profit"></div>
	</div>
</template>

<script>
var echarts = require("echarts");
export default {
	data() {
		return {
			dataName: [
				"直接访问",
				"邮件营销",
				"联盟广告",
				"视频广告",
				"搜索引擎"
			],
			data: [
				{ value: 335, name: "直接访问" },
				{ value: 310, name: "邮件营销" },
				{ value: 234, name: "联盟广告" },
				{ value: 135, name: "视频广告" },
				{ value: 1548, name: "搜索引擎" }
			]
		};
	},
	methods: {
		showEcharts() {
			var myChart = echarts.init(this.$refs.profit);
			// 绘制图表
			myChart.setOption({
				title: {
					text: "",
					subtext: "",
					x: ""
				},
				tooltip: {
					trigger: "item",
					formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
					orient: "vertical",
					left: "left",
					data: this.dataName
				},
				series: [
					{
						name: "实时更新数据",
						type: "pie",
						radius: "55%",
						center: ["50%", "60%"],
						data: this.data,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: "rgba(0, 0, 0, 0.5)"
							}
						}
					}
				],
				color: ["#67C23A", "#E6A23C", "#F56C6C", "#909399", "#409EFF"]
			});
		}
	},
	mounted() {
		// 基于准备好的dom，初始化echarts实例
		// var myChart = echarts.init(document.querySelector(".data-echar"));
		// console.log(this.$refs.echart);

		this.showEcharts();
	}
};
</script>

<style lang="less" scoped>
h3 {
	margin-top: 20px;
	text-align: center;
	color: #fe787a;
}
.data-echart {
	width: 900px;
	height: 300px;
}
</style>