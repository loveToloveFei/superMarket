<template>
	<div class="outbound-goods">
		<el-row>
			<!-- 标题部分 -->
			<el-col :span="24">
				<h3>商品出库</h3>
			</el-col>

			<!-- 表单内容 -->
			<el-col :span="24">
				<el-form ref="vipUserForm" :model="vipUserForm" label-width="80px" :rules="rules">
					<el-form-item label="会员名" prop="vipUserName">
						<el-input
							v-model="vipUserForm.vipUserName"
							autofocus
							placeholder="卡号/电话/会员名"
							@blur="vipUserQuery"
						></el-input>
					</el-form-item>
					<el-form-item label="会员优惠">
						<el-input v-model="vipUserForm.vipUserDiscounts" placeholder="会员优惠/折扣" readonly></el-input>
					</el-form-item>
					<el-form-item label="当前积分">
						<el-input v-model="vipUserForm.vipUserIntegral" placeholder="当前已有积分" readonly></el-input>
					</el-form-item>
				</el-form>

				<el-form ref="outBoundDataForm" :model="outBoundDataForm" label-width="80px" :rules="rules">
					<el-form-item label="商品条码" prop="commodityBarCode">
						<el-input v-model="outBoundDataForm.commodityBarCode"></el-input>
					</el-form-item>

					<el-form-item label="商品数量" prop="outNumber">
						<el-input-number
							v-model="outBoundDataForm.outNumber"
							@change="handleChange"
							:min="1"
							:max="100"
							label="商品数量"
						></el-input-number>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="onSubmit('outBoundDataForm')" size="small">加入订单</el-button>
					</el-form-item>
				</el-form>
			</el-col>

			<!-- 表格内容 -->
			<el-col :span="24">
				<el-table
					:data="outBoundDatas"
					stripe
					border
					min-height="500"
					style="width: 100%;"
					:cell-style="{textAlign:'center'}"
					:header-cell-style="{textAlign:'center'}"
				>
					<!-- <el-table-column prop="ordernumber" label="订单编号" width="180"></el-table-column> -->
					<el-table-column prop="commodityBarCode" label="商品条码"></el-table-column>
					<el-table-column prop="commodityName" label="商品名"></el-table-column>
					<el-table-column prop="salePrice" label="销售价格"></el-table-column>
					<el-table-column prop="vipUserDiscounts" label="会员优惠"></el-table-column>
					<el-table-column prop="discountsPrice" label="优惠价格"></el-table-column>
					<el-table-column prop="outNumber" label="数量"></el-table-column>
					<el-table-column prop="subtotal" label="小计"></el-table-column>
					<el-table-column fixed="right" label="操作" width="100">
						<template slot-scope="scope">
							<el-button
								size="mini"
								type="danger"
								@click="handleDelete(scope.$index, scope.row)"
								icon="el-icon-delete"
							>删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<!-- 结算 -->
			<el-col :span="10" class="top20">
				合计金额:&emsp;
				<span class="colorhot">{{totalamount|num}}</span>&emsp;元
			</el-col>
			<el-col :span="10" class="top20">
				<el-button type="danger" @click="settleAccounts">结算</el-button>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { setcomm, vipuser, addoutcomm } from "@/api/outcomm";
export default {
	data() {
		//会员存在自定义验证,并赋值
		var vipUserName = (rule, value, callback) => {
			if (!value) {
				callback(new Error("不能为空"));
			} else {
				let _this = this;
				// this.axios
				// 	.get(`${this.serverurl}/outcomm/vipuser`, {
				// 		params: {
				// 			vipUserNum: value
				// 		}
				// 	})
				vipuser({
					vipUserNum: value
				})
					.then(response => {
						let { code, message, data } = response;
						if (code !== true) {
							callback(new Error("该会员不存在"));
						} else {
							this.vipUserForm = {
								vipUserNum: data.vipUserNum,
								vipUserName: data.vipUserName,
								vipUserDiscounts: data.vipUserDiscounts,
								vipUserIntegral: data.vipUserIntegral
							};
							callback();
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			}
		};
		return {
			rules: {
				vipUserName: [
					{ required: true, validator: vipUserName, trigger: "blur" }
				],
				commodityBarCode: [
					{ required: true, message: "不能为空", trigger: "blur" }
				]
			},
			//会员信息
			vipUserForm: {
				vipUserNum: "", //会员号
				vipUserDiscounts: "", //会员优惠
				vipUserIntegral: "", //积分
				vipUserName: "" //会员名
			},

			outBoundDataForm: {
				//出库数据
				commodityBarCode: "", //条码
				outNumber: "" //数量
			},

			//出库表单单条数据
			outBoundData: {
				ordernumber: "", //订单编号
				commodityBarCode: "", //商品条码
				salePrice: "", //销售价格
				vipUserDiscounts: "", //会员优惠
				discountsPrice: "", //优惠价格
				outNumber: "", //数量
				subtotal: "" ,//小计
				commodityName:''
			},

			outBoundDatas: [], //表格中的全部数据

			totalamount: 0
		};
	},
	filters: {
		num: function(data) {
			return (data * 1).toFixed(2);
		}
	},

	methods: {
		// onSubmit() {
		// 	console.log(this.outBoundData.subtotal);
		// },
		onSubmit(outBoundDataForm) {
			let _this = this;
			let commodityBarCode = this.outBoundDataForm.commodityBarCode;
			//赋值
			this.outBoundData.commodityBarCode = commodityBarCode; //条码
			this.outBoundData.outNumber = this.outBoundDataForm.outNumber; //数量
			this.outBoundData.vipUserDiscounts = this.vipUserForm.vipUserDiscounts; //会员优惠
			this.outBoundData.ordernumber = new Date().getTime(); //订单号,当前时间戳,不重复且唯一
			this.$refs[outBoundDataForm].validate(valid => {
				if (valid) {
					this.$refs["vipUserForm"].validate(valid => {
						if (valid) {
							// _this.axios
							// 	.get(`${_this.serverurl}/outcomm/setcomm`, {
							// 		params: {
							// 			commodityBarCode
							// 		}
							// 	})
							setcomm({
								commodityBarCode
							})
								.then(response => {
									let data = response;
									if (data.length > 0) {
										// console.log(data);

										//成功弹窗
										this.$message({
											showClose: true,
											message: "添加成功",
											type: "success"
										});
										_this.outBoundData.salePrice =
											data[0].commodityOutPrice;
											_this.outBoundData.commodityName=data[0].commodityName;
										_this.$refs[
											outBoundDataForm
										].resetFields(); //成功过后重置用户列表

										//添加到全部出库
										_this.outBoundDatas.unshift(
											_this.outBoundData
										);

										let allPrice = 0;
										this.outBoundDatas.forEach(v => {
											v.discountsPrice = (
												(v.salePrice *
													v.vipUserDiscounts) /
												10
											).toFixed(2);

											v.subtotal = (
												((v.salePrice *
													v.vipUserDiscounts) /
													10) *
												v.outNumber
											).toFixed(2);

											allPrice += v.subtotal * 1;
											_this.totalamount = allPrice.toFixed(
												2
											);
										
										});
										_this.outBoundData = {
											//出库数据
											commodityBarCode: "", //条码
											outNumber: "" //数量
										};

										// console.log(_this.outBoundDatas);
									} else {
										//失败弹窗
										this.$message.error(
											"添加失败,暂无此商品"
										);
									}
								})
								.catch(function(error) {
									console.log(error);
								});
						}
					});
				} else {
				}
			});
		},
		handleChange(value) {
			// console.log(value);
		},
		handleDelete(index) {
			this.outBoundDatas.splice(index, 1);
			let allPrice = 0;
			this.outBoundDatas.forEach(v => {
				// 再次计算总价
				allPrice += v.subtotal * 1;
				this.totalamount = allPrice.toFixed(2);
			});
			if (this.outBoundDatas.length === 0) {
				this.totalamount = 0;
			}
		},
		vipUserQuery() {
			// console.log(this.vipUserForm.vipUserNum);
			// console.log('1');
		},
		//结算
		settleAccounts() {
			//收集数据
			//ordernumber //订单编号
			// commodityName //商品
			// commodityBarCode //条码
			// salePrice //销售价格
			// discountsPrice //优惠后单价
			// discount //折扣
			// outNumber //数量
			// status //状态
			//commodityTotol //总价
			// commodityName
			let commodityBarCode = this.outBoundDatas.map(
				v => v.commodityBarCode
			);
			let salePrice = this.outBoundDatas.map(v => v.salePrice);
			let discountsPrice = this.outBoundDatas.map(v => v.discountsPrice);
			let discount = this.outBoundDatas.map(v => v.vipUserDiscounts);
			let outNumber = this.outBoundDatas.map(v => v.outNumber);
			let commodityName=this.outBoundDatas.map(v=>v.commodityName)
			let commodityTotol = 0;
			this.outBoundDatas.forEach(v => {
				commodityTotol = commodityTotol * 1 + v.subtotal * 1;
			});

			let params = {
				ordernumber: new Date().getTime(),
				commodityBarCode: JSON.stringify(commodityBarCode),
				salePrice: JSON.stringify(salePrice),
				discountsPrice: JSON.stringify(discountsPrice),
				discount: JSON.stringify(discount),
				outNumber: JSON.stringify(outNumber),
				commodityTotol: JSON.stringify(commodityTotol),
				commodityName:JSON.stringify(commodityName),
				status: "已售出"
			};
			console.log("params", params);
			addoutcomm(params)
				.then(response => {
					let { code, message } = response;
					if (code === true) {
						//成功弹窗
						this.$message({
							showClose: code,
							message: message,
							type: "success"
						});
						this.outBoundDatas = []; //重置信息
						this.totalamount = 0;
					} else {
						//失败弹窗
						this.$message.error(message);
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		}
	}
};
</script>

<style lang="less" scoped>
.outbound-goods {
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
		.top20 {
			margin-top: 20px;
			line-height: 40px;
			margin-left: 20px;
			margin-bottom: 20px;
			.colorhot {
				color: #f56c6c;
			}
		}
	}
}
</style>