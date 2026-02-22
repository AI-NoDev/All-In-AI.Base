import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx', '.md'],
	kit: {
		adapter: adapter({
			fallback: 'index.html'
		}),
		alias: {
			'@/*': './src/*'
		},
		prerender: {
			entries: []
		}
	},
	preprocess: mdsvex({ 
		extensions: ['.svx', '.md'],
		layout: {
			// zh: "./src/docs/zh/layout.svelte",
			// article: "./src/docs/en/layout.svelte"
		}
	 })
};

export default config;
