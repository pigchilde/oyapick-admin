import { proxy } from './proxy';

export default {
	// 根地址
	host: proxy['/prod/'].target,

	// 请求地址
	get baseUrl() {
		// 生产环境使用当前服务器的 origin
		return location.origin;
	}
};
