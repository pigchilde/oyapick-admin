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

// service 数据集合
export const service: Eps.Service = hmr.getData('service', {
	request: new BaseService().request,
	base: {
		open: createBaseOpenService()
	}
});

export * from './base';
