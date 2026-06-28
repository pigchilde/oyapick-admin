import { BaseService } from "/@/cool";

type AdminService = {
	request(options: any): Promise<any>;
	freeActivity?: any;
};

function makeService(
	namespace: string,
	permissions: string[]
) {
	const service = new BaseService(namespace) as any;
	service.permission = {};
	service._permission = {};

	permissions.forEach(name => {
		service.permission[name] = `${namespace.replace("/admin/", "")}/${name}`.replace(/\//g, ":");
		service._permission[name] = true;
	});

	service.page = function (data?: any) {
		return this.request({
			url: "/page",
			method: "POST",
			data
		});
	};

	service.info = function (data?: any) {
		return this.request({
			url: "/info",
			method: "GET",
			params: data
		});
	};

	service.update = function (data?: any) {
		return this.request({
			url: "/update",
			method: "POST",
			data
		});
	};

	service.updateConfig = function (data?: any) {
		return this.request({
			url: "/update",
			method: "POST",
			data
		});
	};

	return service;
}

export function useFreeActivityService(service: AdminService) {
	return {
		config: makeService("/admin/freeActivity/config", ["info", "update"]),
		claimLog: makeService("/admin/freeActivity/claimLog", ["page", "info"]),
		usageLog: makeService("/admin/freeActivity/usageLog", ["page", "info"])
	};
}
