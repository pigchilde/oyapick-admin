import type { ModuleConfig } from "/@/cool";

export default (): ModuleConfig => {
	return {
		toolbar: {
			order: 2,
			component: import("./components/index.vue")
		}
	};
};
