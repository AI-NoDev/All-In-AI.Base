// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module 'html-to-image' {
	interface Options {
		backgroundColor?: string;
		quality?: number;
		width?: number;
		height?: number;
		style?: Record<string, string>;
		filter?: (node: HTMLElement) => boolean;
		cacheBust?: boolean;
		imagePlaceholder?: string;
		pixelRatio?: number;
		skipFonts?: boolean;
		preferredFontFormat?: string;
		fontEmbedCSS?: string;
		skipAutoScale?: boolean;
		type?: string;
	}

	export function toPng(node: HTMLElement, options?: Options): Promise<string>;
	export function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
	export function toSvg(node: HTMLElement, options?: Options): Promise<string>;
	export function toBlob(node: HTMLElement, options?: Options): Promise<Blob | null>;
	export function toCanvas(node: HTMLElement, options?: Options): Promise<HTMLCanvasElement>;
	export function toPixelData(node: HTMLElement, options?: Options): Promise<Uint8ClampedArray>;
}

export {};
