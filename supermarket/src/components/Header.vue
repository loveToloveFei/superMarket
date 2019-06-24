<template>
	<div class="headtop">
		<el-row>
			<el-col :span="15">
				<div class="grid-content bg-purple">
					<h1>来点新鲜超市后台管理系统</h1>
				</div>
			</el-col>

			<el-col :span="2" title="点击更换头像">
				<el-upload
					class="avatar-uploader"
					action="#"
					ref="upload"
					:show-file-list="false"
					:http-request="uploadSectionFile"
				>
					<img :src="userInfo" alt>
				</el-upload>
				<!-- <div class="grid-content bg-purple">
					<i class="head-portrait"></i>
				</div>-->
			</el-col>
			<el-col :span="7">
				<div class="grid-content bg-purple-light">
					欢迎：
					<span class="username">{{userName}}</span>
					<el-button type="danger" @click="outLogin">退出登录</el-button>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import axios from "axios";
import { getInfo, imageUpload } from "@/api/user";
export default {
	data() {
		return {
			userName: localStorage.getItem("myusername"),
			userInfo: ""
		};
	},
	methods: {
		uploadSectionFile(params) {
			const isImage =
				params.file.type === "image/jpeg" ||
				"/image/png" ||
				"/image/jpg";
			console.log(params.file.type);

			const isLt2M = params.file.size / 1024 / 1024 < 2;
			// 这里常规检验，看项目需求而定
			if (!isImage) {
				this.$message.error("只能上传图片格式png、jpg、gif!");
				return;
			}
			if (!isLt2M) {
				this.$message.error("只能上传图片大小小于2M");
				return;
			}
			// 根据后台需求数据格式
			var form = new FormData();
			// 文件对象
			form.append("file", params.file);
			// 本例子主要要在请求时添加特定属性，所以要用自己方法覆盖默认的action
			// form.append("clientType", "xxx");
			// 项目封装的请求方法，下面做简单介绍

			// imageUpload(form)
			axios
				.post("/user/imageupload", form)
				.then(res => {
					this.userInfo =
						"http://127.0.0.1:9527" + res.data.avatarUrl;
					//成功再次调用头像图片获取函数
					this.getInfo();
				})
				.catch(() => {
					// xxx
				});
		},
		outLogin() {
			localStorage.removeItem("myusertoken");
			localStorage.removeItem("myusername");
			localStorage.removeItem("myuserid");
			setTimeout(this.$router.push("/login"), 1000);
		},

		getUserInfo() {
			// 发送请求 获取用户信息
			getInfo()
				.then(res => {
					// 接收数据
					let { data } = res;
					// 获取账号
					let { userInfo } = data[0];
					this.userInfo = "http://127.0.0.1:9527" + userInfo; // 渲染头像地址
				})
				.catch(err => {
					console.log(err);
				});
		}
	},
	created() {
		// 请求当前登录的用户信息
		this.getUserInfo();
	}
};
</script>

<style lang="less" scoped>
.avatar-uploader {
	border: 1px dashed #d9d9d9;
	width: 60px;
	height: 60px;
	border-radius: 50%;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	img {
		width: 100%;
		// height: 100%;
	}
}
.headtop {
	margin-top: 10px;
	padding-bottom: 10px;
	border-bottom: 1px solid rgb(228, 228, 228);
	line-height: 60px;
	.el-button {
		margin-left: 20px;
		padding: 8px 14px;
	}
	.head-portrait {
		display: inline-block;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: #f1f1f1;
		background: url(../assets/images/h.png) no-repeat;
		background-size: cover;
	}
	.grid-content {
		height: 60px;
	}
}
</style>