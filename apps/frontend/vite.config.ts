import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPageMetaPlugin } from 'vite-plugin-sveltekit-page-meta';

export default defineConfig({
    plugins: [
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
        noExternal: ['bits-ui', 'mode-watcher', 'svelte-toolbelt'],
    },
    optimizeDeps: {
        // 排除 svelte，避免预优化创建重复实例
        exclude: ['svelte'],
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
