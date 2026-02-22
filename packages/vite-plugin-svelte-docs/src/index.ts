import type { Plugin } from 'vite';
import fs from 'fs';
import path from 'path';

export interface DocMeta {
  title?: string;
  description?: string;
  order?: number;
  icon?: string;
  group?: string;
  [key: string]: unknown;
}

export interface DocPage {
  path: string;
  route: string;
  content: string;
  meta: DocMeta;
}

export interface DocsTree {
  name: string;
  path: string;
  route: string;
  meta?: DocMeta;
  children?: DocsTree[];
  isFile?: boolean;
}

export interface SvelteDocsOptions {
  /** Directories to scan (relative to routes), empty = all */
  include?: string[];
  /** Directories to exclude */
  exclude?: string[];
}

const defaultOptions: Required<SvelteDocsOptions> = {
  include: [],
  exclude: ['api', '(auth)', '[...slug]'],
};

export function svelteDocs(userOptions: SvelteDocsOptions = {}): Plugin {
  const options = { ...defaultOptions, ...userOptions };
  const virtualModuleId = 'virtual:svelte-docs';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  let routesDir = '';

  function scanDocsDirectory(dir: string, baseRoute: string = ''): DocsTree[] {
    const result: DocsTree[] = [];
    
    if (!fs.existsSync(dir)) {
      console.warn(`[svelte-docs] Directory not found: ${dir}`);
      return result;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const route = baseRoute ? `${baseRoute}/${entry.name}` : `/${entry.name}`;

      // Skip excluded directories
      if (options.exclude.some(ex => entry.name === ex || entry.name.startsWith(ex))) {
        continue;
      }

      if (entry.isDirectory()) {
        // Check if this directory has +page.md or index.md
        const mdFile = path.join(fullPath, '+page.md');
        const indexMdFile = path.join(fullPath, 'index.md');
        // Support both +page.ts and _meta.ts for meta
        const tsFile = path.join(fullPath, '+page.ts');
        const metaFile = path.join(fullPath, '_meta.ts');
        
        const children = scanDocsDirectory(fullPath, route);
        const hasMd = fs.existsSync(mdFile) || fs.existsSync(indexMdFile);
        const actualMetaFile = fs.existsSync(metaFile) ? metaFile : tsFile;
        
        if (hasMd) {
          const meta = loadMeta(actualMetaFile);
          
          result.push({
            name: entry.name,
            path: fullPath,
            route: route + '/',
            meta,
            children: children.length > 0 ? children : undefined,
            isFile: true,
          });
        } else if (children.length > 0) {
          // Directory without md but has children with docs
          // Check for _meta.ts for group title
          const groupMeta = fs.existsSync(metaFile) ? loadMeta(metaFile) : {};
          result.push({
            name: entry.name,
            path: fullPath,
            route,
            meta: groupMeta,
            children,
            isFile: false,
          });
        }
      }
    }

    // Sort by order in meta, then by name
    result.sort((a, b) => {
      const orderA = a.meta?.order ?? 999;
      const orderB = b.meta?.order ?? 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.name.localeCompare(b.name);
    });

    return result;
  }

  function loadMeta(tsFile: string): DocMeta {
    if (!fs.existsSync(tsFile)) return {};
    
    try {
      const content = fs.readFileSync(tsFile, 'utf-8');
      // Extract meta object from export const _meta = { ... } (underscore prefix for SvelteKit compatibility)
      const metaMatch = content.match(/export\s+const\s+_meta\s*=\s*(\{[\s\S]*?\});?/);
      if (metaMatch && metaMatch[1]) {
        // Simple eval for static object (safe for build-time)
        const metaStr = metaMatch[1];
        // Convert to JSON-like format
        const jsonStr = metaStr
          .replace(/(\w+):/g, '"$1":')
          .replace(/'/g, '"')
          .replace(/,\s*}/g, '}');
        return JSON.parse(jsonStr);
      }
    } catch (e) {
      console.warn(`[svelte-docs] Failed to parse meta from ${tsFile}:`, e);
    }
    return {};
  }

  function collectAllDocs(tree: DocsTree[]): DocPage[] {
    const docs: DocPage[] = [];
    
    function traverse(nodes: DocsTree[]) {
      for (const node of nodes) {
        if (node.isFile) {
          const mdFile = path.join(node.path, '+page.md');
          const indexMdFile = path.join(node.path, 'index.md');
          const actualMdFile = fs.existsSync(mdFile) ? mdFile : indexMdFile;
          
          if (fs.existsSync(actualMdFile)) {
            const content = fs.readFileSync(actualMdFile, 'utf-8');
            docs.push({
              path: node.path,
              route: node.route,
              content,
              meta: node.meta || {},
            });
          }
        }
        if (node.children) {
          traverse(node.children);
        }
      }
    }
    
    traverse(tree);
    return docs;
  }

  return {
    name: 'vite-plugin-svelte-docs',
    enforce: 'pre',

    configResolved(resolvedConfig) {
      // Find routes directory
      const srcDir = path.join(resolvedConfig.root, 'src');
      routesDir = path.join(srcDir, 'routes');
      console.log(`[svelte-docs] Routes directory: ${routesDir}`);
    },

    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
      if (id.startsWith(virtualModuleId + '/')) {
        return '\0' + id;
      }
      return null;
    },

    load(id) {
      if (id === resolvedVirtualModuleId) {
        let tree: DocsTree[] = [];
        
        if (options.include.length > 0) {
          for (const inc of options.include) {
            const dir = path.join(routesDir, inc);
            console.log(`[svelte-docs] Scanning: ${dir}`);
            
            // Get the locale name (last part of the path, e.g., 'zh-CN' from 'docs/zh-CN')
            const localeName = path.basename(inc);
            const baseRoute = '/' + inc;
            
            // Scan the directory contents
            const children = scanDocsDirectory(dir, baseRoute);
            
            // Check if the locale directory itself has an index.md
            const mdFile = path.join(dir, '+page.md');
            const indexMdFile = path.join(dir, 'index.md');
            const metaFile = path.join(dir, '_meta.ts');
            const hasMd = fs.existsSync(mdFile) || fs.existsSync(indexMdFile);
            const meta = fs.existsSync(metaFile) ? loadMeta(metaFile) : {};
            
            // Create a wrapper node for the locale
            tree.push({
              name: localeName,
              path: dir,
              route: baseRoute + '/',
              meta,
              children: children.length > 0 ? children : undefined,
              isFile: hasMd,
            });
          }
        } else {
          tree = scanDocsDirectory(routesDir);
        }

        const docs = collectAllDocs(tree);
        
        console.log(`[svelte-docs] Found ${docs.length} docs, tree nodes: ${tree.length}`);
        
        // Debug: log all routes
        for (const doc of docs) {
          console.log(`[svelte-docs] Route: ${doc.route} - ${doc.meta?.title || 'No title'}`);
        }

        // Create a proper Map initialization
        const mapEntries = docs.map(d => [d.route, d]);
        
        return `
          export const docsTree = ${JSON.stringify(tree, null, 2)};
          export const docsList = ${JSON.stringify(docs, null, 2)};
          
          // Create Map from entries
          const _mapEntries = ${JSON.stringify(mapEntries)};
          export const docsMap = new Map(_mapEntries);
        `;
      }

      return null;
    },

    handleHotUpdate({ file, server }) {
      // Reload when .md or meta .ts files change
      if (file.endsWith('.md') || (file.endsWith('_meta.ts') && file.includes('docs'))) {
        const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          return [mod];
        }
      }
    },
  };
}

export default svelteDocs;
