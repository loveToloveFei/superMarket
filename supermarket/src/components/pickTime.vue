<template>
	<div class="block">
		<el-date-picker
			v-model="value2"
			type="datetime"
			placeholder="选择日期时间"
			align="right"
			:picker-options="pickerOptions"
			@change="send"
            format="yyyy-MM-dd hh:mm"
            value-format="yyyy-MM-dd hh:mm"
		></el-date-picker>
	</div>
</template>

<script>
export default {
	data() {
		return {
			pickerOptions: {
				shortcuts: [
					{
						text: "今天",
						onClick(picker) {
							picker.$emit("pick", new Date());
						}
					},
					{
						text: "昨天",
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit("pick", date);
						}
					},
					{
						text: "一周前",
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit("pick", date);
						}
					}
				]
			},
			value1: "",
			value2: "",
			value3: ""
		};
	},
	methods: {
		send() {
			this.$emit("pick", this.value2);
			// console.log(this.value2);
		}
	}
};
</script>

<style lang="scss" scoped>
</style>