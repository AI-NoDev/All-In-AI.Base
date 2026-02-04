import { resolve } from 'node:path';
import type { PluginOptions } from './types';
import { scanPages } from './scanner';
import { generateOutput, writeOutput } from './generator';

export type { PageMeta, PluginOptions, ParsedPage } from './types';

const PLUGIN_NAME = 'vite-plugin-sveltekit-page-meta';

/**
 * 生成页面元信息
 */
async function generate(options: PluginOptions): Promise<void> {
  const { output = 'src/lib/generated-pages.ts' } = options;
  const outputPath = resolve(process.cwd(), output);

  try {
    const pages = await scanPages(options);
    const content = generateOutput(pages, options);
    writeOutput(content, outputPath);

    console.log(`[${PLUGIN_NAME}] Generated ${pages.length} pages to ${output}`);
  } catch (error) {
    console.error(`[${PLUGIN_NAME}] Error:`, error);
  }
}

/**
 * SvelteKit 页面元信息 Vite 插件
 */
export function SvelteKitPageMetaPlugin(options: PluginOptions = {}) {
  const { routesDir = 'src/routes', watch = true } = options;

  return {
    name: PLUGIN_NAME,

    async buildStart() {
      await generate(options);
    },

    configureServer(server: { watcher: { on: (event: string, handler: (file: string) => void) => void } }) {
      if (!watch) return;

      // 监听 +page.ts/js 文件变化
      const watcher = server.watcher;
      const pattern = /\+page\.(ts|js)$/;

      const handleChange = async (file: string) => {
        if (pattern.test(file) && file.includes(routesDir)) {
          console.log(`[${PLUGIN_NAME}] Detected change in ${file}`);
          await generate(options);
        }
      };

      watcher.on('add', handleChange);
      watcher.on('change', handleChange);
      watcher.on('unlink', handleChange);
    },

    async handleHotUpdate(ctx: { file: string }) {
      if (/\+page\.(ts|js)$/.test(ctx.file)) {
        await generate(options);
      }
    },
  };
}

// 默认导出
export default SvelteKitPageMetaPlugin;

// 手动生成函数（用于 CLI 或脚本）
export { generate as generatePageMeta };
