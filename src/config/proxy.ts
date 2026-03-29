const proxy = {
	'/dev/': {
		target: 'http://127.0.0.1:7076',
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/dev/, '')
	},

	'/prod/': {
		target: 'https://show.cool-admin.com',
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/prod/, '/api')
	}
};

const value = 'dev';
const envValue =
	(typeof process !== 'undefined' ? process.env.VITE_PROXY_ENV : '') ||
	(import.meta as any)?.env?.VITE_PROXY_ENV ||
	'';
const current = envValue || value;

if (current !== value && proxy[`/${current}/`]) {
	const currentProxy = proxy[`/${current}/`];
	proxy[`/${value}/`] = {
		...currentProxy,
		rewrite: (path: string) => {
			const normalizePath = path.replace(new RegExp(`^\\/${value}`), `/${current}`);
			return currentProxy.rewrite(normalizePath);
		}
	};
}

const host = proxy[`/${current}/`]?.target;

export { proxy, host, value, current };
