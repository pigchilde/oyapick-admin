import { type ModuleConfig } from '/@/cool';

export default (): ModuleConfig => {
	return {
		options: {
			index: 'https://oyapick.org',
			api: 'https://service.oyapick.org/api'
		},
		pages: [
			{
				path: '/helper/ai-code',
				meta: {
					label: 'Ai 极速编码',
					keepAlive: true
				},
				component: () => import('./views/ai-code.vue')
			}
		]
	};
};
