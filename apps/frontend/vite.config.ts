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
