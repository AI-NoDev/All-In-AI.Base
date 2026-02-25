

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const universal = {
  "prerender": true,
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.Dulxr-H7.js","_app/immutable/chunks/Bwz-2ork.js","_app/immutable/chunks/kb1Zw2Dh.js","_app/immutable/chunks/C-ll5XXO.js","_app/immutable/chunks/Brqi6Ulu.js"];
export const stylesheets = [];
export const fonts = [];
