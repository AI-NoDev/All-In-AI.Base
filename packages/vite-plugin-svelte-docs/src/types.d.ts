declare module 'virtual:svelte-docs' {
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
    html: string;
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

  export const docsTree: DocsTree[];
  export const docsList: DocPage[];
  export const docsMap: Map<string, DocPage>;
}

declare module 'virtual:svelte-docs/*' {
  export const content: string;
  export const html: string;
  export const meta: import('virtual:svelte-docs').DocMeta;
}
