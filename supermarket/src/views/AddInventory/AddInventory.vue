<template>
	<div class="add-inventory">
		<el-row>
			<!-- 标题部分 -->
			<el-col :span="24">
				<h3>库存添加</h3>
			</el-col>

			<!-- 表单内容 -->
			<el-col :span="24">
				<el-form ref="addCommForm" :model="addCommForm" :rules="rules" label-width="80px">
					<el-form-item label="分类" label-width="80px" center prop="commodityClassify">
						<el-select v-model="addCommForm.commodityClassify" placeholder="请选择商品分类">
							<el-option label="计生用品" value="计生用品"></el-option>
							<el-option label="食品" value="食品"></el-option>
							<el-option label="生活用品" value="生活用品"></el-option>
							<el-option label="其他" value="其他"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="商品名称" prop="commodityName">
						<el-input v-model="addCommForm.commodityName"></el-input>
					</el-form-item>

					<el-form-item label="商品条码" prop="commodityBarCode">
						<el-input v-model="addCommForm.commodityBarCode"></el-input>
					</el-form-item>

					<el-form-item label="商品数量" prop="commodityInStock">
						<el-input-number v-model="addCommForm.commodityInStock" :min="1" :max="10000" label="商品数量"></el-input-number>
					</el-form-item>

					<el-form-item label="单位" prop="commodityUnit">
						<el-input v-model="addCommForm.commodityUnit" placeholder="入库价格"></el-input>
					</el-form-item>

					<el-form-item label="入库价格" prop="commodityInPrice">
						<el-input v-model="addCommForm.commodityInPrice" placeholder="入库价格"></el-input>
					</el-form-item>

					<el-form-item label="市场价格" prop="commodityMarketPrice">
						<el-input v-model="addCommForm.commodityMarketPrice" placeholder="入库价格"></el-input>
					</el-form-item>

					<el-form-item label="销售价格" prop="commodityOutPrice">
						<el-input v-model="addCommForm.commodityOutPrice" placeholder="入库价格"></el-input>
					</el-form-item>

					<el-form-item label="商品描述" prop="commodityDesc">
						<el-input type="textarea" v-model="addCommForm.commodityDesc"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmit('addCommForm')">立即入库</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { addcomm } from "@/api/comm";
export default {
	data() {
		
		return {
			//更改表单的验证
			rules: {
				commodityClassify: [
					{
						required: true,
						message: "请选择商品分类",
						trigger: "change"
					}
				],

				commodityName: [
					{
						required: true,
						message: "商品名不能为空",
						trigger: "blur"
					}
				],

				commodityInStock: [
					{ required: true, message: "数量不能为空", trigger: "blur" }
				],
				commodityBarCode: [
					{
						required: true,
						message: "商品条码不能为空",
						trigger: "blur"
					}
				],
				commodityInPrice: [
					{ required: true, message: "价格不能为空", trigger: "blur" }
				],
				commodityOutPrice: [
					{ required: true, message: "价格不能为空", trigger: "blur" }
				],
				commodityMarketPrice: [
					{ required: true, message: "价格不能为空", trigger: "blur" }
				],
				commodityUnit: [
					{ required: true, message: "单位不能为空", trigger: "blur" }
				]
			},
			addCommForm: {
				commodityName: "", //商品名
				commodityBarCode: "", //条码
				commodityInPrice: "", //入库价格
				commodityInStock: "1", //入库数量
				commodityClassify: "", //商品种类
				commodityDesc: "", //商品描述
				commodityOutPrice: "", //出库价格
				commodityMarketPrice: "", //市场价格
				commodityUnit: "" //单位
			}
		};
	},
	methods: {
		onSubmit(addCommForm) {
			let _this = this;
			this.$refs[addCommForm].validate(valid => {
				if (valid) {
					// _this.axios
					// 	.post(
					// 		`${_this.serverurl}/comm/addcomm`,
					// 		_this.qs.stringify(_this.addCommForm)
					// 	)
					addcomm(_this.addCommForm)
						.then(response => {
							let { code, message } = response;
							if (code === true) {
								//成功弹窗
								this.$message({
									showClose: code,
									message: message,
									type: "success"
								});
								_this.$refs[addCommForm].resetFields(); //成功过后重置用户列表
							} else {
								//失败弹窗
								this.$message.error(message);
							}
						})
						.catch(function(error) {
							console.log(error);
						});
				} else {
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.add-inventory {
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