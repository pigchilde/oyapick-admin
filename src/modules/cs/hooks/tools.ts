import { defineStore } from "pinia";
import { nextTick, ref } from "vue";

export const useTools = defineStore("cs.tools", () => {
	// 是否展开
	const isExpand = ref(true);

	// 收起、展开
	function expand(value?: boolean) {
		isExpand.value = value === undefined ? !isExpand.value : value;
	}

	// 滚动到底部
	async function scrollToBottom() {
		await nextTick();

		document.querySelector(".cs-message .el-scrollbar__wrap")?.scroll({
			top: 9999,
			behavior: "smooth"
		});
	}

	return {
		isExpand,
		expand,
		scrollToBottom
	};
});
