import { hmr } from '../hooks';
import { BaseService } from './base';

function createBaseOpenService() {
	const open = new BaseService('/admin/base/open');

	return {
		namespace: '/admin/base/open',
		eps(data?: any) {
			return open.request({
				url: '/eps',
				params: data
			});
		},
		html(data?: any) {
			return open.request({
				url: '/html',
				params: data
			});
		},
		captcha(data?: any) {
			return open.request({
				url: '/captcha',
				params: data
			});
		},
		refreshToken(data?: any) {
			return open.request({
				url: '/refreshToken',
				params: data
			});
		},
		login(data?: any) {
			return open.request({
				url: '/login',
				method: 'POST',
				data
			});
		}
	};
}

function createBaseCommService() {
	const comm = new BaseService('/admin/base/comm');

	return {
		namespace: '/admin/base/comm',
		personUpdate(data?: any) {
			return comm.request({
				url: '/personUpdate',
				method: 'POST',
				data
			});
		},
		uploadMode(data?: any) {
			return comm.request({
				url: '/uploadMode',
				params: data
			});
		},
		permmenu(data?: any) {
			return comm.request({
				url: '/permmenu',
				params: data
			});
		},
		program(data?: any) {
			return comm.request({
				url: '/program',
				params: data
			});
		},
		person(data?: any) {
			return comm.request({
				url: '/person',
				params: data
			});
		},
		upload(data?: any) {
			return comm.request({
				url: '/upload',
				method: 'POST',
				data
			});
		},
		logout(data?: any) {
			return comm.request({
				url: '/logout',
				method: 'POST',
				data
			});
		}
	};
}

// service 数据集合
export const service: Eps.Service = hmr.getData('service', {
	request: new BaseService().request,
	base: {
		open: createBaseOpenService(),
		comm: createBaseCommService()
	}
});

export * from './base';
