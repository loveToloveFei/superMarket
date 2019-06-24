<template>
	<div class="commodity-management">
		<el-row :gutter="20">
			<!-- 标题部分 -->
			<el-col :span="24">
				<h3>商品管理</h3>
			</el-col>
			<!-- 筛选 -->

			<el-form :inline="true" :model="seach" class="demo-form-inline ml20">
				<el-form-item label="商品">
					<el-input v-model="seach.commodityName" placeholder="请输入商品名或条码"></el-input>
				</el-form-item>
				<el-form-item label="商品分类">
					<el-select v-model="seach.commodityClassify" placeholder="请输入商品分类">
						<el-option label="全部分类" value="全部分类"></el-option>
						<el-option label="计生用品" value="计生用品"></el-option>
						<el-option label="食品" value="食品"></el-option>
						<el-option label="生活用品" value="生活用品"></el-option>
						<el-option label="其他" value="其他"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit">查询</el-button>
				</el-form-item>
			</el-form>
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
					@selection-change="selectionChange"
					ref="commList"
				>
					<!--选项框 -->
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="commodityName" label="商品名"></el-table-column>
					<el-table-column prop="commodityInPrice" label="成本价"></el-table-column>
					<el-table-column prop="commodityOutPrice" label="售价"></el-table-column>
					<el-table-column prop="commodityMarketPrice" label="市场价"></el-table-column>
					<el-table-column prop="commodityInStock" label="库存"></el-table-column>
					<el-table-column prop="commodityUnit" label="单位"></el-table-column>
					<el-table-column prop="commodityClassify" label="分类"></el-table-column>
					<!-- <el-table-column prop="commodityBarCode" label="条码" width="160"></el-table-column> -->

					<el-table-column fixed="right" label="操作" width="190">
						<template slot-scope="scope">
							<!-- @click="handleEdit(scope.$index, scope.row)"  -->
							<el-button size="mini" @click="reset(scope.row.id)" icon="el-icon-edit">编辑</el-button>
							<!-- @click="handleDelete(scope.$index, scope.row)" -->
							<el-button size="mini" type="danger" @click="del(scope.row.id)" icon="el-icon-delete">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-col>

			<!-- 用户修改弹窗 -->
			<el-dialog
				title="商品修改"
				:visible.sync="resetShow"
				width="30%"
				center
				lock-scroll
				close-on-click-modal:false
				@close="closeReset('resetUserForm')"
			>
				<el-form :model="resetUserForm" :rules="rules" ref="resetUserForm">
					<el-form-item label="商品名" label-width="80px" center prop="commodityName">
						<el-input v-model="resetUserForm.commodityName" autocomplete="off"></el-input>
					</el-form-item>

					<el-form-item label="分类" label-width="80px" center prop="commodityClassify">
						<el-select v-model="resetUserForm.commodityClassify" placeholder="请选择商品分类">
							<el-option label="计生用品" value="计生用品"></el-option>
							<el-option label="食品" value="食品"></el-option>
							<el-option label="生活用品" value="生活用品"></el-option>
							<el-option label="其他" value="其他"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="售价" label-width="80px" center prop="commodityOutPrice">
						<el-input v-model="resetUserForm.commodityOutPrice" autocomplete="off"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="resetShow = false">取 消</el-button>
					<el-button type="primary" @click="resetUser('resetUserForm')">确 定</el-button>
				</div>
			</el-dialog>
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
		></el-pagination>

		<!-- 批量删除按钮 -->
		<el-row class="mt0">
			<el-button @click="removeUsers()" type="danger" size="small">批量删除</el-button>
			<el-button @click="toggleSelection()" type="primary" size="small">取消选择</el-button>
		</el-row>
	</div>
</template>

				
<script>
import {
	removecomms,
	getsetcomm,
	setcomm,
	removecomm,
	commList
} from "@/api/comm";

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
				]
			},
			commList: [],
			filtrates: {},
			totalamount: 566375.45,
			resetShow: false, //false
			resetUserForm: {
				commodityClassify: "", // 分类
				commodityName: "", //商品名
				// passWord: "", //密码
				// checkPass: "", //确认密码
				commodityInStock: "", //库存
				commodityOutPrice: "", //	出库价格

				resetUserId: ""
			},
			currentPage: 1, //当前页码
			pageSize: 10, //每页条数
			total: 0, //总条数
			removeUsersId: [], //批量删除的数据的ID数组
			seach: {
				commodityName: "",
				commodityClassify: ""
			}
		};
	},
	methods: {
		//用户多选触发函数
		selectionChange(selection) {
			this.removeUsersId = selection.map(v => v.id);
			// console.log(selection.map(v => v.id));
		},
		//清除所有已选中
		toggleSelection(rows) {
			if (rows) {
				rows.forEach(row => {
					this.$refs.commList.toggleRowSelection(row);
				});
			} else {
				this.$refs.commList.clearSelection();
			}
		},

		//批量删除
		removeUsers() {
			//选项为空则提示选择
			if (this.removeUsersId.length === 0) {
				this.$message.error("请选择您要删除的数据");
				return;
			}

			//弹窗提示确认删除
			this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(() => {
					// this.axios
					// 	.get(`${this.serverurl}/comm/removecomms`, {
					// 		params: {
					// 			id: this.removeUsersId
					// 		}
					// 	})
					removecomms({ id: this.removeUsersId })
						.then(response => {
							let { code, message } = response;
							if (code) {
								//成功弹窗
								this.getcommList();
								this.$message({
									showClose: code,
									message: message,
									type: "success"
								});
							} else {
								//失败弹窗
								this.$message.error(message);
							}
						})
						.catch(function(error) {
							console.log(error);
						});
				})
				.catch(() => {
					this.$message({
						type: "info",
						message: "已取消删除"
					});
				});
		},

		//每页条数改变函数触发
		handleSizeChange(pageSize) {
			this.pageSize = pageSize;
			this.getcommList();
		},

		//页码改变触发函数
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
			this.getcommList();
		},

		//模糊查询
		onSubmit() {
			this.getcommList();
		},

		//页面关闭时回调函数
		closeReset(resetUserForm) {
			this.$refs[resetUserForm].resetFields(); //将表单进行重置
		},

		//点击编辑请求当前点击的数据
		reset(userId) {
			this.resetShow = true;
			this.resetUserForm.resetUserId = userId;
			// console.log(userId);
			// console.log(this.resetUserForm.resetUserId);

			// this.axios
			// 	.get(`${this.serverurl}/comm/setcomm`, {
			// 		params: {
			// 			id: userId
			// 		}
			// 	})

			getsetcomm({ id: userId })
				.then(response => {
					let {
						commodityClassify,
						commodityName,
						commodityInStock,
						commodityOutPrice
					} = response[0];
					// console.log(response.data);
					if (response.length > 0) {
						// callback(new Error("用户名已存在"));
						this.resetUserForm = {
							commodityClassify,
							commodityName,
							commodityInStock,
							commodityOutPrice,
							resetUserId: userId
							// passWord: "",
							// checkPass: ""
						};
					} else {
						console.log("出现了错误");
						// callback();
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		},

		//验证通过是发送请求对商品进行更改
		resetUser(resetUserForm) {
			let _this = this;
			this.$refs[resetUserForm].validate(valid => {
				// console.log(this.resetUserForm.resetUserId);
				if (valid) {
					// _this.axios
					// 	.post(
					// 		`${_this.serverurl}/comm/setcomm`,
					// 		_this.qs.stringify(_this.resetUserForm)
					// 	)
					setcomm(_this.resetUserForm)
						.then(response => {
							let { code, message } = response;
							if (code === true) {
								//成功弹窗
								this.$message({
									showClose: code,
									message: message,
									type: "success"
								});
								// setTimeout(_this.removeUserForm='',1000)
								_this.resetShow = false; //将弹窗设置为隐藏
								_this.$refs[resetUserForm].resetFields(); //成功过后重置用户列表
								_this.getcommList(); //成功过后页面数据重新请求刷新
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
		},

		//删除商品
		del(userId) {
			this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
				center: true
			})
				.then(() => {
					// this.axios
					// 	.get(`${this.serverurl}/comm/removecomm`, {
					// 		params: {
					// 			id: userId
					// 		}
					// 	})
					removecomm({ id: userId })
						.then(response => {
							let { code, message } = response;
							if (code === true) {
								//重新请求页面数据
								this.getcommList();
								//删除成功弹窗
								this.$message({
									type: "success",
									message: message
								});
							} else {
								this.$message({
									type: "success",
									message: message
								});
								// console.log(code);
							}
						})
						.catch(function(error) {
							console.log(error);
						});

					// console.log(userId);
				})
				.catch(() => {
					this.$message({
						type: "info",
						message: "已取消删除"
					});
				});
		},

		//获取商品列表
		getcommList() {
			//带分页数据
			let params = {
				currentPage: this.currentPage,
				pageSize: this.pageSize,
				commodityName: this.seach.commodityName,
				commodityClassify: this.seach.commodityClassify
			};
			// this.axios
			// 	.get(`${this.serverurl}/comm/commList`, { params })
			commList(params)
				.then(response => {
					let { data, total } = response;
					this.commList = data;
					this.total = total;
					//处理上页删除完毕获取数据时会出现无数据的现象
					if (data.length === 0 && this.currentPage !== 1) {
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
		this.getcommList();
	}
};
</script>

<style lang="less" scoped>
.commodity-management {
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	.mt0 {
		margin-top: 0 !important;
	}
	.ml20 {
		margin-left: 20px;
	}
	.el-row {
		margin-top: 20px;
		padding: 10px;
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
		h3 {
			padding-bottom: 10px;
			border-bottom: 1px solid #f1f1f1;
		}
		.el-pagination {
			margin-top: 10px;
		}
	}
}
</style>