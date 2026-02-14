import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPageMetaPlugin } from 'vite-plugin-sveltekit-page-meta';
import { extendsAppPlugin } from 'vite-plugin-sveltekit-extends-app';

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        SvelteKitPageMetaPlugin({
            output: 'src/lib/generated-pages.ts',
            ignore: [/components/],
        }),
        // 扩展应用插件 - 自动同步 monorepo 扩展包的路由
        // 示例配置：
        // extendsAppPlugin({
        //     apps: [
        //         { package: '@qiyu-allinai/app-crm', basePath: '/dashboard/crm' },
        //         { package: '@qiyu-allinai/app-erp', basePath: '/dashboard/erp' },
        //     ],
        // }),
        extendsAppPlugin({
            apps: [
                { package: '@qiyu-allinai/app-server-monitor' }
            ],
        })
    ],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3030',
                changeOrigin: true,
            },
        },
    },
});
