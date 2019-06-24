<template>
	<div class="log-information">
		<el-row>
			<!-- 标题部分 -->
			<el-col :span="24">
				<h3>日志信息</h3>
			</el-col>
			<el-col :span="24">
				<el-timeline>
					<el-timeline-item v-for="(v,i) in informations" :key="i" :timestamp="v.time" placement="top">
						<el-card>
							<h4>{{v.title}}</h4>
							<p>{{v.message}} 操作于 {{v.timestamp}}</p>
						</el-card>
					</el-timeline-item>
					
				</el-timeline>
			</el-col>
		</el-row>
	</div>
</template>

<script>
export default {
    data(){
        return {
            informations:[
                {
                    title:'更新 Github 模板',
                    time:'2018/4/2',
                    timestamp:'2018/4/2 20:46',
                    message:'王小虎'
                },
                {
                    title:'更新 Github 模板',
                    time:'2018/4/3',
                    timestamp:'2018/4/2 20:46',
                    message:'王小虎'
                },
                {
                    title:'更新 Github 模板',
                    time:'2018/4/1',
                    timestamp:'2018/4/2 20:46',
                    message:'王小虎'
                },
            ]
        }
    }
};
</script>

<style lang="less" scoped>
.log-information {
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	margin-top: 20px;
	padding: 10px;
	h3 {
		padding-bottom: 10px;
		margin-bottom: 10px;
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