import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import { Cs } from "../types";
import { service } from "/@/cool";

export const useSession = defineStore("cs.session", () => {
	// 详情
	const info = ref<Cs.Session>();

	// 列表
	const list = ref<Cs.Session[]>([]);

	// 是否加载完
	const loaded = ref(false);

	// 加载状态
	const loading = ref(false);

	// 分页
	const pagination = reactive({
		page: 1,
		size: 20
	});

	// 请求参数
	const reqParams = {
		order: "updateTime",
		sort: "desc"
	};

	// 刷新
	async function refresh(params?: any) {
		loading.value = true;

		// 合并参数
		Object.assign(reqParams, params);

		// 请求
		await service.cs.session
			.page({
				...pagination,
				...reqParams
			})
			.then((res) => {
				// 设置分页
				Object.assign(pagination, res.pagination);

				if (res.pagination.page == 1) {
					list.value = res.list;
				} else {
					list.value.push(...res.list);
				}

				// 是否加载完成
				loaded.value = res.pagination.total <= list.value.length;

				// 默认第一个
				if (!info.value) {
					set(list.value[0]);
				}
			});

		loading.value = false;
	}

	// 设置会话
	function set(data?: Cs.Session) {
		if (data) {
			data.adminUnreadCount = 0;
		}

		info.value = data;
	}

	// 通过id设置会话
	function setById(sessionId: number) {
		const item = list.value.find((e) => e.id == sessionId);
		set(item);
	}

	// 清空会话
	function clear() {
		info.value = undefined;
	}

	return {
		info,
		list,
		set,
		setById,
		clear,
		pagination,
		loaded,
		loading,
		refresh
	};
});
