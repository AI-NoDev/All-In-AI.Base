import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPageMetaPlugin } from 'vite-plugin-sveltekit-page-meta';
import { svelteDocs } from '@qiyu-allinai/vite-plugin-svelte-docs';

export default defineConfig({
    plugins: [
        svelteDocs({
            include: ['docs/zh-CN', 'docs/en'],
            exclude: ['api', '(auth)', 'dashboard'],
        }),
        tailwindcss(),
        sveltekit(),
        SvelteKitPageMetaPlugin({
            output: 'src/lib/generated-pages.ts',
            ignore: [/components/],
        }),
    ],
    resolve: {
        // 确保所有包使用同一个 Svelte 实例
        dedupe: ['svelte', 'bits-ui', 'mode-watcher', 'svelte-toolbelt'],
    },
    ssr: {
        // 不外部化这些包，确保 SSR 时使用同一实例
        noExternal: ['bits-ui', 'mode-watcher', 'svelte-toolbelt', '@qiyu-allinai/vite-plugin-svelte-docs'],
    },
    optimizeDeps: {
        // 排除 svelte 和虚拟模块，避免预优化创建重复实例
        exclude: ['svelte', 'virtual:svelte-docs'],
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3030',
                changeOrigin: true,
            },
        },
    },
});
