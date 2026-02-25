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
        dedupe: [
            'svelte', 
            'bits-ui', 
            'mode-watcher', 
            'svelte-toolbelt', 
            '@xyflow/svelte', 
            '@xyflow/system',
            // Lexical 相关包 - 防止多实例问题
            'lexical',
            'svelte-lexical',
            '@lexical/clipboard',
            '@lexical/code',
            '@lexical/dragon',
            '@lexical/extension',
            '@lexical/file',
            '@lexical/hashtag',
            '@lexical/history',
            '@lexical/html',
            '@lexical/link',
            '@lexical/list',
            '@lexical/mark',
            '@lexical/markdown',
            '@lexical/offset',
            '@lexical/overflow',
            '@lexical/plain-text',
            '@lexical/rich-text',
            '@lexical/selection',
            '@lexical/table',
            '@lexical/text',
            '@lexical/utils',
            '@lexical/yjs',
        ],
    },
    ssr: {
        // 不外部化这些包，确保 SSR 时使用同一实例
        noExternal: ['bits-ui', 'mode-watcher', 'svelte-toolbelt', '@qiyu-allinai/vite-plugin-svelte-docs', '@xyflow/svelte', '@xyflow/system', '@qiyu-allinai/flow-editor'],
    },
    optimizeDeps: {
        // 排除 svelte 和虚拟模块，避免预优化创建重复实例
        exclude: ['svelte', 'virtual:svelte-docs'],
        // 包含这些包以确保正确预优化
        include: [
            '@xyflow/svelte', 
            '@xyflow/system',
            'lexical',
            'svelte-lexical',
            '@lexical/list',
            '@lexical/link',
            '@lexical/rich-text',
            '@lexical/history',
            '@lexical/markdown',
            '@lexical/selection',
            '@lexical/utils',
        ],
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
