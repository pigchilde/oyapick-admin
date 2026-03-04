export const OrderStatus = [
	{ label: "待付款", value: 0, type: "info" },
	{ label: "待发货", value: 1, type: "warning" },
	{ label: "待收货", value: 2 },
	{ label: "待评价", value: 3, type: "success" },
	{ label: "交易完成", value: 4, type: "success" },
	{ label: "退款中", value: 5, type: "danger" },
	{ label: "已退款", value: 6, type: "danger" },
	{ label: "已关闭", value: 7, type: "danger" }
];

export const PayType = [
	{ label: "待支付", value: 0, type: "info" },
	{ label: "微信", value: 1, color: "#2aae67" },
	{ label: "支付宝", value: 2, color: "#1678FF" }
];
