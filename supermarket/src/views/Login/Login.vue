<template>
	<div class="login">
		<div class="loginBox">
			<h3>超市登录系统</h3>
			<el-form
				:model="loginForm"
				status-icon
				:rules="rules"
				ref="loginForm"
				label-width="100px"
				class="demo-ruleForm"
			>
				<el-form-item label="用户名" prop="userName">
					<el-input type="text" v-model.number="loginForm.userName"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="passWord">
					<el-input type="password" v-model="loginForm.passWord" autocomplete="off"></el-input>
				</el-form-item>
				<!-- <el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="loginForm.checkPass" autocomplete="off"></el-input>
				</el-form-item>-->
				<el-form-item>
					<el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
					<el-button @click="resetForm('loginForm')">清除</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import {userlogin} from '@/api/login'
export default {
	data() {
		var userName = (rule, value, callback) => {
			if (!value) {
				callback(new Error("用户名不能为空"));
			} else if (value.toString().length < 3) {
				callback(new Error("用户名至少3位"));
			} else {
				callback();
			}
		};
		var validatePass = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("密码不能为空"));
			} else if (
				value.toString().length < 3 ||
				value.toString().length > 12
			) {
				callback(new Error("密码长度为4-12位"));
			} else {
				if (this.loginForm.checkPass !== "") {
					this.$refs.loginForm.validateField("checkPass"); //触发表单中的checkPass字段验证
				}
				callback();
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请再次输入密码"));
			} else if (value !== this.loginForm.passWord) {
				callback(new Error("两次输入密码不一致!"));
			} else {
				callback();
			}
		};
		return {
			loginForm: {
				passWord: "",
				checkPass: "",
				userName: ""
			},
			rules: {
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
				]
			}
		};
	},
	methods: {
		submitForm(formName) {
			// 页面中使用ref属性声明的标签dom，可以使用 this.$refs.ref属性的值 获取
			// element内置了验证方法 validate 传入一个函数 函数中的变量如果是true就验证通过 否则验证不通过
			this.$refs[formName].validate(valid => {
				if (valid) {
					let _this = this;
					// alert('登录成功!')
					// console.log(_this.loginForm);


					// this.axios
					// 	.post(
					// 		`${this.serverurl}/login/userlogin`,
					// 		_this.qs.stringify(_this.loginForm)
					// 	)
						userlogin(_this.loginForm)
						.then(response => {
							let {
								code,
								message,
								token,
								username,
								userid
							} = response;
							// console.log(token);

							if (code === true) {
								localStorage.setItem("myusertoken", token);
								localStorage.setItem("myusername", username);
								localStorage.setItem("myuserid", userid);
								//成功弹窗
								this.$message({
									showClose: code,
									message: message,
									type: "success"
								});
								// 路由跳转
								setTimeout(this.$router.push("/home"), 1000);
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
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		}
	}
};
</script>

<style lang="less">
@import "./Login.less";
</style>