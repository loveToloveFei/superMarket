<template>
	<div class="change-password">
		<el-row>
			<!-- 标题部分 -->
			<el-col :span="24">
				<h3>添加账号</h3>
			</el-col>

			<!-- 表单内容 -->
			<el-col :span="24">
				<el-form ref="resetUserPwd" :model="resetUserPwd" label-width="100px" :rules="rules">
					<el-form-item label="原密码" prop="olduserpwd">
						<el-input v-model="resetUserPwd.olduserpwd" type="password"></el-input>
					</el-form-item>

					<el-form-item label="新密码" prop="newuserpwd">
						<el-input v-model="resetUserPwd.newuserpwd" type="password"></el-input>
					</el-form-item>

					<el-form-item label="确认新密码" prop="newuserpwdtwo">
						<el-input v-model="resetUserPwd.newuserpwdtwo" type="password"></el-input>
					</el-form-item>

					<el-form-item>
						<el-button type="primary" @click="onSubmit('resetUserPwd')">立即更改</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import {resetuserpwd} from '@/api/user'
export default {
	data() {
		//密码格式
		var validateOldPass = (rule, value, callback) => {
			let pwdRule = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;
			if (value === "") {
				callback(new Error("密码不能为空"));
			} else if (!pwdRule.test(value) === true) {
				callback(
					new Error("只能输入5-20个以字母开头、可带数字、“_”、“.”")
				);
			} else {
				if (this.resetUserPwd.newuserpwd !== "") {
					this.$refs.resetUserPwd.validateField("newuserpwd"); //触发表单中的checkPass字段验证
				}
				callback();
			}
		};

		//第一次新密码
		var validateNewPass = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("密码不能为空"));
			} else if (
				value.toString().length < 3 ||
				value.toString().length > 12
			) {
				callback(new Error("密码长度为4-12位"));
			} else if (value === this.resetUserPwd.olduserpwd) {
				callback(new Error("新旧密码不能相同"));
			} else {
				if (this.resetUserPwd.newuserpwdtwo !== "") {
					this.$refs.resetUserPwd.validateField("newuserpwdtwo"); //触发表单中的checkPass字段验证
				}
				callback();
			}
		};

		//第二次新密码
		var validateNewPass2 = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请再次输入密码"));
			} else if (value !== this.resetUserPwd.newuserpwd) {
				callback(new Error("两次输入密码不一致!"));
			} else {
				callback();
			}
		};
		return {
			resetUserPwd: {
				olduserpwd: "",
				newuserpwd: "",
				newuserpwdtwo: ""
			},
			rules: {
				olduserpwd: [
					{
						required: true,
						validator: validateOldPass,
						trigger: "blur"
					}
				],
				newuserpwd: [
					{
						required: true,
						validator: validateNewPass,
						trigger: "blur"
					}
				],
				newuserpwdtwo: [
					{
						required: true,
						validator: validateNewPass2,
						trigger: "blur"
					}
				]
			}
		};
	},
	methods: {
		onSubmit(resetUserPwd) {
			this.$refs[resetUserPwd].validate(valid => {
				if (valid) {
					let _this = this;
					// alert('登录成功!')
					// console.log(_this.loginForm);

					let userdata = {
						id: localStorage.getItem("myuserid"),
						passWord: _this.resetUserPwd.olduserpwd,
						newuserpwd: _this.resetUserPwd.newuserpwd
					};

					// this.axios
					// 	.post(
					// 		`${this.serverurl}/user/resetuserpwd`,
					// 		_this.qs.stringify(userdata)
					// 	)
					resetuserpwd(userdata)
						.then(response => {
							let { code, message } = response.data;
							if (code === true) {
								//成功弹窗
								this.$message({
									showClose: code,
									message: message,
									type: "success"
								});
								// 路由跳转,清除用户信息
								localStorage.removeItem("myusertoken");
								localStorage.removeItem("myusername");
								localStorage.removeItem("myuserid");
								setTimeout(this.$router.push("/login"), 1000);
							} else {
								//失败弹窗
								this.$message.error(message);
							}
						})
						.catch(function(error) {
							console.log(error);
						});
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		}
	}
};
</script>

<style lang="less" scoped>
.change-password {
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