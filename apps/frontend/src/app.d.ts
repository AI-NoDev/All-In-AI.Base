// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

declare module 'emojis-list' {
  const emojis: string[];
  export default emojis;
}


declare module 'virtual:svelte-docs' {
	interface DocMeta {
		title?: string;
		description?: string;
		order?: number;
		icon?: string;
		group?: string;
		[key: string]: unknown;
	}

	interface DocPage {
		path: string;
		route: string;
		content: string;
		html: string;
		meta: DocMeta;
	}

	interface DocsTree {
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
	export type { DocMeta, DocPage, DocsTree };
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
