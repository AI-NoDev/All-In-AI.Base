export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.D7S3PHkI.js",app:"_app/immutable/entry/app.DLW-B3fk.js",imports:["_app/immutable/entry/start.D7S3PHkI.js","_app/immutable/chunks/CwrnQ-ik.js","_app/immutable/chunks/kb1Zw2Dh.js","_app/immutable/chunks/DptGH899.js","_app/immutable/entry/app.DLW-B3fk.js","_app/immutable/chunks/kb1Zw2Dh.js","_app/immutable/chunks/DqdJUl4k.js","_app/immutable/chunks/Bwz-2ork.js","_app/immutable/chunks/DptGH899.js","_app/immutable/chunks/gg3H3LJU.js","_app/immutable/chunks/Brqi6Ulu.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
