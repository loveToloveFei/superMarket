<template>
	<div class="sales-list">
		<el-row>
			<!-- 标题部分 -->
			<el-col :span="24">
				<h3>销售列表</h3>
			</el-col>
			<!-- 筛选 -->
			<el-form :inline="true" :model="seach" class="demo-form-inline ml20">
				<el-form-item label="商品">
					<el-input v-model="seach.commodityName" placeholder="请输入商品名或条码"></el-input>
				</el-form-item>
				<!-- <el-form-item label="商品分类">
					<el-select v-model="seach.commodityClassify" placeholder="请输入商品分类">
						<el-option label="全部分类" value="全部分类"></el-option>
						<el-option label="计生用品" value="计生用品"></el-option>
						<el-option label="食品" value="食品"></el-option>
						<el-option label="生活用品" value="生活用品"></el-option>
						<el-option label="其他" value="其他"></el-option>
					</el-select>
				</el-form-item>-->
				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>

			<!-- 
				//ordernumber //订单编号
			// commodityName //商品
			// commodityBarCode //条码
			// salePrice //销售价格
			// discountsPrice //优惠后单价
			// discount //折扣
			// outNumber //数量
			// status //状态
			//commodityTotol //总价
			-->

			<!-- 表格内容 -->
			<el-col :span="24">
				<el-table
					:data="commList"
					stripe
					border
					min-height="500"
					style="width: 100%;"
					:cell-style="{textAlign:'center'}"
					:header-cell-style="{textAlign:'center'}"
					ref="commList"
					
				>
					<el-table-column prop="ordernumber" label="订单编号"></el-table-column>
					<!-- <el-table-column prop="commodityInPrice" label="成本价"></el-table-column>
					<el-table-column prop="commodityOutPrice" label="售价"></el-table-column>-->
					<el-table-column prop="commodityName" label="商品"></el-table-column>
					<el-table-column prop="commodityBarCode" label="条码"></el-table-column>
					<el-table-column prop="salePrice" label="销售价格"></el-table-column>
					<el-table-column prop="discountsPrice" label="优惠后单价"></el-table-column>
					<el-table-column prop="outNumber" label="数量"></el-table-column>
					<el-table-column prop="totol" label="小计"></el-table-column>
					<el-table-column prop="status" label="状态"></el-table-column>
				</el-table>
			</el-col>
		</el-row>

		<!-- 分页 -->
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="currentPage"
			:page-sizes="[10, 30, 50, 100]"
			:page-size="pageSize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
			class="ml20 mb20"
		></el-pagination>
	</div>
</template>

<script>
import { getoutcommList } from "@/api/outcomm";
export default {
	data() {
		return {
			//更改表单的验证

			commList: [],

			currentPage: 1, //当前页码
			pageSize: 10, //每页条数
			total: 0, //总条数
			seach: {
				commodityName: ""
				// commodityClassify: ""
			}
		};
	},
	methods: {
		//每页条数改变函数触发
		handleSizeChange(pageSize) {
			this.pageSize = pageSize;
			this.getoutcommList();
		},

		//页码改变触发函数
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
			this.getoutcommList();
		},

		//模糊查询
		onSubmit() {
			this.getoutcommList();
		},

		//获取商品列表
		getoutcommList() {
			let params = {
				currentPage: this.currentPage,
				pageSize: this.pageSize,
				commodityName: this.seach.commodityName
			};
			getoutcommList(params)
				.then(response => {
					this.commList=[]
					for (let i = 0; i < response.data.length; i++) {
						for (let j = 0; j < JSON.parse(response.data[i].discount).length; j++) {
							let obj = {
								ordernumber: response.data[i].ordernumber,
								commodityBarCode: JSON.parse(response.data[i].commodityBarCode)[j],
								salePrice: JSON.parse(response.data[i].salePrice)[j],
								discountsPrice: JSON.parse(response.data[i].discountsPrice)[j],
								outNumber: JSON.parse(response.data[i].outNumber)[j],
								commodityName: JSON.parse(response.data[i].commodityName)[j],
								totol: (JSON.parse(response.data[i].discountsPrice)[j]*JSON.parse(response.data[i].outNumber)[j].toFixed(2)),
								status: response.data[i].status
							};
							this.commList.push(obj)
						}
					}
					this.total = this.commList.length;
					//处理上页删除完毕获取数据时会出现无数据的现象
					if (response.data.length === 0 && this.currentPage !== 1) {
						this.currentPage -= 1;
						this.getcommList();
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		}
	},

	created() {
		this.getoutcommList();
	}
};
</script>

<style lang="less" scoped>
.sales-list {
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	.ml20 {
		margin-left: 20px;
	}
	.mt0 {
		margin-top: 0 !important;
	}
	.mb20{
		padding-bottom: 20px !important;
	}
	.el-row {
		margin-top: 20px;
		padding: 10px;
		h3 {
			padding-bottom: 10px;
			border-bottom: 1px solid #f1f1f1;
		}
		.el-form {
			.el-form-item {
				margin-top: 20px;
				margin-bottom: 10px;
				.el-form-item__content {
					.el-input {
						width: 160px;
					}
					.el-date-editor {
						width: 240px;
					}
					.el-select {
						.el-input {
							width: 150px;
						}
					}
				}
			}
		}

		.el-pagination {
			margin-top: 10px;
		}
	}
}
</style>