import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Cs } from "../types";
import dayjs from "dayjs";
import { service } from "/@/cool";
import { isEmpty, last } from "lodash-es";
import { useSession } from "./session";
import { uuid } from "/@/cool/utils";
import { useTools } from "./tools";
import { dateFormatter } from "../utils";
import { useBase } from "/$/base";

export const useMessage = defineStore("cs.message", () => {
	const session = useSession();
	const tools = useTools();
	const { user } = useBase();

	// 加载中
	const loading = ref(false);

	// 未读消息数
	const unread = ref(0);

	// 所有页
	const data = ref<{ id: string; data: Cs.Msg[] }[]>([]);

	// 列表
	const list = computed(() => {
		data.value.forEach((e) => {
			if (e.data[0]) {
				let date = e.data[0].createTime;

				if (date) {
					e.data.forEach((a, i) => {
						const d = dateFormatter(a.createTime);

						if (i == 0) {
							a.date = d;
						}

						if (dayjs(a.createTime).subtract(10, "minute").isAfter(dayjs(date))) {
							a.date = d;
							date = a.createTime;
						}
					});
				}
			}
		});

		return data.value;
	});

	// 追加消息
	function append(item: Cs.Msg) {
		const list = last(data.value)?.data;

		if (list) {
			list.push({
				sessionId: session.info?.id,
				type: 1,
				nickName: user.info?.name,
				avatarUrl: user.info?.headImg,
				...item
			});

			tools.scrollToBottom();
		}
	}

	// 获取消息
	async function refresh(params?: any) {
		loading.value = true;

		if (params.page == 1) {
			data.value = [];
		}

		await service.cs.msg
			.page({
				sessionId: session.info?.id,
				order: "createTime",
				sort: "desc",
				...params
			})
			.then((res) => {
				if (isEmpty(data.value) || !isEmpty(res.list)) {
					res.list.forEach((e) => {
						if (e.type == 1) {
							e.avatarUrl = e.adminUserHeadImg;
							e.nickName = e.adminUserName;
						}
					});

					data.value.unshift({
						id: uuid(),
						data: res.list.reverse() as any[]
					});
				}
			});

		loading.value = false;
	}

	// 获取未读消息
	function getUnread() {
		service.cs.msg.unreadCount().then((res) => {
			unread.value = res;
		});
	}

	// 读消息
	function read(id: number) {
		service.cs.msg.read({
			msgIds: [id]
		});
	}

	return {
		data,
		list,
		loading,
		unread,
		append,
		refresh,
		read,
		getUnread
	};
});
