import { type ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		views: [
			{
				path: "/free-activity/config",
				meta: {
					label: "免费次数活动"
				},
				component: () => import("./views/config.vue")
			},
			{
				path: "/free-activity/claim-log",
				meta: {
					label: "领取记录"
				},
				component: () => import("./views/claim-log.vue")
			},
			{
				path: "/free-activity/usage-log",
				meta: {
					label: "使用记录"
				},
				component: () => import("./views/usage-log.vue")
			}
		]
	};
};
