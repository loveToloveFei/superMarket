<template>
	<div>
		<h3>最近七天支出(含退货)</h3>
		<div class="data-echart" ref="stock"></div>
	</div>
</template>

<script>
var echarts = require("echarts");
export default {
	data() {
		return {
			dataY: [541099, 243150 , 558991 , 872669 , 111239, 179762, 568969 ],
			dataX: [
				"03/06",
				"03/07",
				"03/08",
				"03/09",
				"03/10",
				"03/11",
				"03/12",

			]
		};
	},
	methods: {
		showEcharts() {
			var myChart = echarts.init(this.$refs.stock);
			// 绘制图表
			myChart.setOption({
				xAxis: {
					splitLine: { show: false }, //去除网格线
					splitArea: { show: false }, //保留网格区域
					type: "category",
					data: this.dataX,
					axisLabel: {
						show: true,
						textStyle: {
							color: "#929292"
						}
					},
					axisLine: {
						lineStyle: {
							color: "#cacaca"
						}
					}
				},
				yAxis: {
					splitLine: { show: true, lineStyle: { color: "#f1f1f1" } }, //去除网格线

					splitArea: { show: false }, //保留网格区域
					type: "value",
					axisLabel: {
						formatter: "{value}",
						textStyle: {
							color: "#929292"
						}
					},
					axisLine: {
						lineStyle: {
							color: "#cacaca"
						}
					}
				},
				series: [
					{
						data: this.dataY,
						type: "line",
						splitLine: {
							color: "red"
						},
						symbolSize: 8,
						itemStyle: {
							normal: {
								color: "#60b8f6", //线条颜色
								width: 6, //调整 线条的宽度  5已经很宽啦
								lineStyle: {
									width: 3, //调整 线条的宽度  5已经很宽啦
									color: "#60b8f6" //线条颜色
								}
							}
						}
					}
				]
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
	height: 400px;
}
</style>