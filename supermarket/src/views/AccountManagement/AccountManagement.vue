<template>
	<div class="account-management">
		<el-row>
			<el-col :span="24">
				<h3>账号管理</h3>
			</el-col>
			<!-- 筛选 -->
			<el-form ref="filtrate" :model="userList.ordernumber" label-width="80px">
				<el-col :span="8" class="mt20">
					<el-form-item label="用户:">
						<el-input placeholder="账号/用户名/手机号码" v-model="userList.ordernumber" clearable></el-input>
					</el-form-item>
				</el-col>
				<el-button type="primary" @click="onSubmit" class="mt20 ml20">查询</el-button>
			</el-form>

			<!-- 表格内容 -->
			<el-col :span="24">
				<el-table
					:data="userList"
					stripe
					border
					min-height="500"
					style="width: 100%;"
					:cell-style="{textAlign:'center'}"
					:header-cell-style="{textAlign:'center'}"
					@selection-change="selectionChange"
					ref="userList"
				>
					<!--选项框 -->
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column prop="userName" label="用户名"></el-table-column>
					<el-table-column prop="userTel" label="电话号码" width="180"></el-table-column>
					<el-table-column prop="userGroup" label="账户分组"></el-table-column>
					<el-table-column label="创建时间">
						<template slot-scope="scope">{{ scope.row.ctime | filterCtime }}</template>
					</el-table-column>
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
				title="用户修改"
				:visible.sync="resetShow"
				width="30%"
				center
				lock-scroll
				close-on-click-modal:false
				@close="closeReset('resetUserForm')"
			>
				<el-form :model="resetUserForm" :rules="rules" ref="resetUserForm">
					<el-form-item label="用户名" label-width="80px" center prop="userName">
						<el-input v-model="resetUserForm.userName" autocomplete="off"></el-input>
					</el-form-item>

					<el-form-item label="用户分组" label-width="80px" center prop="userGroup">
						<el-select v-model="resetUserForm.userGroup" placeholder="请选择账号分组">
							<el-option label="超级管理员" value="超级管理员"></el-option>
							<el-option label="管理员" value="管理员"></el-option>
							<el-option label="组长" value="组长"></el-option>
							<el-option label="成员" value="成员"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="用户电话" label-width="80px" center prop="userTel">
						<el-input v-model="resetUserForm.userTel" autocomplete="off"></el-input>
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
		<el-row class="mt20">
			<el-button @click="removeUsers()" type="danger" size="small">批量删除</el-button>
			<el-button @click="toggleSelection()" type="primary" size="small">取消选择</el-button>
		</el-row>
	</div>
</template>

<script>
import {
	removeusers,
	getsetuser,
	setuser,
	removeuser,
	userlist,
	getuser
} from "@/api/user";
var moment = require("moment");
export default {
	data() {
		//用户名的自定义验证
		var userName = (rule, value, callback) => {
			if (!value) {
				callback(new Error("用户名不能为空"));
			} else if (value.toString().length < 3) {
				// this.userAuthentication(value);
				callback(new Error("用户名至少3位"));
			}
			// else if (this.userAuthentication(value)) {
			// }
			else {
				let _this = this;
				// this.axios
				// 	.get(`${this.serverurl}/user/useradd`, {
				// 		params: {
				// 			user: value
				// 		}
				// 	})
				getuser({
					user: value
				})
					.then(response => {
						let { code, message } = response;
						if (code === true) {
							// console.log(code);
							callback(new Error("用户名已存在"));
						} else {
							// console.log(code);
							callback();
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			}
		};
		//电话号码格式验证
		var userTel = (rule, value, callback) => {
			let telRule = /^1[3456789]\d{9}$/;
			if (value === "") {
				callback(new Error("电话号码不能为空"));
			} else if (!telRule.test(value)) {
				callback(new Error("您的电话号码格式不正确"));
			} else {
				callback();
			}
		};
		return {
			//更改表单的验证
			rules: {
				userGroup: [
					{
						required: true,
						message: "请选择账号分组",
						trigger: "change"
					}
				],

				userName: [
					{ required: true, validator: userName, trigger: "blur" }
				],

				userTel: [
					{ required: true, validator: userTel, trigger: "blur" }
				]
			},
			userList: [],
			// {
			// 	userName: "", //用户名
			// 	userGroup: "", // 分组
			// 	userTel: "", //用户电话
			// 	ctime: "" //用户创建时间
			// },

			totalamount: 566375.45,
			resetShow: false, //false
			resetUserForm: {
				userGroup: "", // 分组
				userName: "", //用户名
				// passWord: "", //密码
				// checkPass: "", //确认密码
				userTel: "", //用户电话
				resetUserId: ""
			},
			currentPage: 1, //当前页码
			pageSize: 10, //每页条数
			total: 0, //总条数
			removeUsersId: [] //批量删除的数据的ID数组
		};
	},
	methods: {
		//用户多选触发函数
		selectionChange(selection) {
			this.removeUsersId = selection.map(v => v.id);
			console.log(selection.map(v => v.id));
		},
		//清除所有已选中
		toggleSelection(rows) {
			if (rows) {
				rows.forEach(row => {
					this.$refs.userList.toggleRowSelection(row);
				});
			} else {
				this.$refs.userList.clearSelection();
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
					// 	.get(`${this.serverurl}/user/removeusers`, {
					// 		params: {
					// 			id: this.removeUsersId
					// 		}
					// 	})
					removeusers({
						id: this.removeUsersId
					})
						.then(response => {
							let { code, message } = response;
							if (code) {
								//成功弹窗
								this.getUserList();
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
			this.getUserList();
		},

		//页码改变触发函数
		handleCurrentChange(currentPage) {
			this.currentPage = currentPage;
			this.getUserList();
		},

		//模糊查询
		onSubmit() {
			console.log("submit!");
		},

		//页面关闭时回调函数
		closeReset(resetUserForm) {
			this.$refs[resetUserForm].resetFields(); //将表单进行重置
		},

		//点击编辑请求当前点击用户数据
		reset(userId) {
			this.resetShow = true;
			this.resetUserForm.resetUserId = userId;
			// console.log(userId);

			// this.axios
			// 	.get(`${this.serverurl}/user/setuser`, {
			// 		params: {
			// 			id: userId
			// 		}
			// 	})

			getsetuser({
				id: userId
			})
				.then(response => {
					let { userGroup, userName, userTel } = response[0];
					// console.log(response.data);
					if (response.length > 0) {
						// callback(new Error("用户名已存在"));
						this.resetUserForm = {
							userGroup,
							userName,
							userTel,
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

		//验证通过是发送请求对用户进行更改
		resetUser(resetUserForm) {
			let _this = this;
			this.$refs[resetUserForm].validate(valid => {
				if (valid) {
					// _this.axios
					// 	.post(
					// 		`${_this.serverurl}/user/setuser`,
					// 		_this.qs.stringify(_this.resetUserForm)
					// 	)
					setuser(_this.resetUserForm)
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
								_this.getUserList(); //成功过后页面数据重新请求刷新
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

		//删除用户
		del(userId) {
			this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
				center: true
			})
				.then(() => {
					// this.axios
					// 	.get(`${this.serverurl}/user/removeuser`, {
					// 		params: {
					// 			id: userId
					// 		}
					// 	})
					removeuser({
						id: userId
					})
						.then(response => {
							let { code, message } = response;
							if (code === true) {
								//重新请求页面数据
								this.getUserList();
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

				})
				.catch(() => {
					this.$message({
						type: "info",
						message: "已取消删除"
					});
				});
		},

		//获取用户列表
		getUserList() {
			//获取全部用户数据
			// this.axios
			// 	.get(`${this.serverurl}/user/userlist`)
			// 	.then(response => {
			// 		// console.log(response);
			// 		this.userList = response.data;
			// 	})
			// 	.catch(function(error) {
			// 		console.log(error);
			// 	});

			//带分页数据
			let params = {
				currentPage: this.currentPage,
				pageSize: this.pageSize
			};
			// this.axios
			// 	.get(`${this.serverurl}/user/userlist`, { params })
			userlist(params)
				.then(response => {
					let { data, total } = response;
					this.userList = data;
					this.total = total;
					//处理上页删除完毕获取数据时会出现无数据的现象
					if (data.length === 0 && this.currentPage !== 1) {
						this.currentPage -= 1;
						this.getUserList();
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		}
	},

	created() {
		this.getUserList();
	},
	filters: {
		filterCtime(ctime) {
			// 过滤时间
			return moment(ctime).format("YYYY-MM-DD hh:mm:ss");
		}
	}
};
</script>

<style lang="less" scoped>
.account-management {
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	padding: 10px;
	h3 {
		padding-bottom: 10px;
		border-bottom: 1px solid #f1f1f1;
	}
	.mt20 {
		margin-top: 10px;
	}
	.ml20 {
		margin-left: 20px;
	}
}
</style>