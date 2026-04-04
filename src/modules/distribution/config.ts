import { type ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		views: [
			{
				path: "/distribution/config",
				meta: {
					label: "分销配置"
				},
				component: () => import("./views/config.vue")
			},
			{
				path: "/distribution/distributor",
				meta: {
					label: "分销商管理"
				},
				component: () => import("./views/distributor.vue")
			},
			{
				path: "/distribution/commission",
				meta: {
					label: "佣金订单"
				},
				component: () => import("./views/commission.vue")
			},
			{
				path: "/distribution/withdrawal",
				meta: {
					label: "提现审核"
				},
				component: () => import("./views/withdrawal.vue")
			},
			{
				path: "/distribution/statistics",
				meta: {
					label: "资金统计"
				},
				component: () => import("./views/statistics.vue")
			}
		]
	};
};
