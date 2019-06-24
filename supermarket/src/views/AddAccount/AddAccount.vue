<template>
	<div class="add-account">
		<el-row>
			<!-- 标题部分 -->
			<el-col :span="24">
				<h3>添加账号</h3>
			</el-col>

			<!-- 表单内容 -->
			<el-col :span="24">
				<el-form ref="removeUserForm" :model="removeUserForm" :rules="rules" label-width="80px">
					<el-form-item label="账号分组" prop="group">
						<el-select v-model="removeUserForm.group" placeholder="请选择账号分组">
							<el-option label="超级管理员" value="超级管理员"></el-option>
							<el-option label="管理员" value="管理员"></el-option>
							<el-option label="组长" value="组长"></el-option>
							<el-option label="成员" value="成员"></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="用户名" prop="userName">
						<el-input v-model="removeUserForm.userName" type="text"></el-input>
					</el-form-item>

					<el-form-item label="密码" prop="passWord">
						<el-input v-model="removeUserForm.passWord" type="password"></el-input>
					</el-form-item>

					<el-form-item label="确认密码" prop="checkPass">
						<el-input v-model="removeUserForm.checkPass" type="password"></el-input>
					</el-form-item>

					<el-form-item label="电话号码" prop="userTel">
						<el-input v-model="removeUserForm.userTel" type="text"></el-input>
					</el-form-item>

					<el-form-item label="备注">
						<el-input type="textarea" v-model="removeUserForm.userDesc"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="onSubmit('removeUserForm')">立即注册</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import { getuser, useradd } from "@/api/user";
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
						let { code, message } = response.data;
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

		//第一次密码的自定义验证
		var validatePass = (rule, value, callback) => {
			let pwdRule = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;
			if (value === "") {
				callback(new Error("密码不能为空"));
			} else if (!pwdRule.test(value) === true) {
				callback(
					new Error("只能输入5-20个以字母开头、可带数字、“_”、“.”")
				);
			} else {
				if (this.removeUserForm.checkPass !== "") {
					this.$refs.removeUserForm.validateField("checkPass"); //触发表单中的checkPass字段验证
				}
				callback();
			}
		};

		//第二次密码的验证
		var validatePass2 = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请再次输入密码"));
			} else if (value !== this.removeUserForm.passWord) {
				callback(new Error("两次输入密码不一致!"));
			} else {
				callback();
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
			removeUserForm: {
				group: "", // 分组
				userName: "", //用户名
				passWord: "", //密码
				checkPass: "", //确认密码
				userTel: "", //用户电话
				userDesc: "" //用户描述
			},
			userLive: "",
			rules: {
				group: [
					{
						required: true,
						message: "请选择账号分组",
						trigger: "change"
					}
				],
				passWord: [
					{ required: true, validator: validatePass, trigger: "blur" }
				],
				checkPass: [
					{
						required: true,
						validator: validatePass2,
						trigger: "blur"
					}
				],
				userName: [
					{ required: true, validator: userName, trigger: "blur" }
				],
				userTel: [
					{ required: true, validator: userTel, trigger: "blur" }
				]
			}
		};

		// return {
		// 	form: {
		// 		commodity: "", //商品名
		// 		articlenumbering: "", //条码
		// 		treasuryprices: "", //入库价格
		// 		desc: "" //商品描述
		// 	}
		// };
	},
	methods: {
		onSubmit(removeUserForm) {
			// console.log("submit!");
			let _this = this;
			this.$refs[removeUserForm].validate(valid => {
				// console.log(1);
				if (valid) {
					// _this.axios
					// 	.post(
					// 		`${_this.serverurl}/user/useradd`,
					// 		_this.qs.stringify(_this.removeUserForm)
					// 	)
					useradd(_this.removeUserForm)
						.then(response => {
							let { code, message } = response.data;
							if (code === true) {
								//成功弹窗
								this.$message({
									showClose: code,
									message: message,
									type: "success"
								});
								// setTimeout(_this.removeUserForm='',1000)
								_this.$refs[removeUserForm].resetFields();
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
.add-account {
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