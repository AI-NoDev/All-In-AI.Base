/**
 * 文件图标映射 - 使用 Iconify 图标
 * 图标来源: vscode-icons, mdi, tdesign 等
 */

// 扩展名到图标的映射
export const extensionIconMap: Record<string, string> = {
  // === 代码文件 ===
  // TypeScript
  ts: 'vscode-icons:file-type-typescript',
  tsx: 'vscode-icons:file-type-typescript',
  mts: 'vscode-icons:file-type-typescript',
  cts: 'vscode-icons:file-type-typescript',
  // JavaScript
  js: 'vscode-icons:file-type-js',
  jsx: 'vscode-icons:file-type-js',
  mjs: 'vscode-icons:file-type-js',
  cjs: 'vscode-icons:file-type-js',
  // Web
  html: 'vscode-icons:file-type-html',
  htm: 'vscode-icons:file-type-html',
  css: 'vscode-icons:file-type-css',
  scss: 'vscode-icons:file-type-scss',
  sass: 'vscode-icons:file-type-sass',
  less: 'vscode-icons:file-type-less',
  // 框架
  svelte: 'vscode-icons:file-type-svelte',
  vue: 'vscode-icons:file-type-vue',
  astro: 'vscode-icons:file-type-astro',
  // JSON
  json: 'vscode-icons:file-type-json',
  jsonc: 'vscode-icons:file-type-json',
  json5: 'vscode-icons:file-type-json',
  
  // === 后端语言 ===
  py: 'vscode-icons:file-type-python',
  pyc: 'vscode-icons:file-type-python',
  pyw: 'vscode-icons:file-type-python',
  java: 'vscode-icons:file-type-java',
  class: 'vscode-icons:file-type-java',
  jar: 'vscode-icons:file-type-jar',
  go: 'vscode-icons:file-type-go',
  rs: 'vscode-icons:file-type-rust',
  php: 'vscode-icons:file-type-php',
  rb: 'vscode-icons:file-type-ruby',
  c: 'vscode-icons:file-type-c',
  cpp: 'vscode-icons:file-type-cpp',
  cc: 'vscode-icons:file-type-cpp',
  cxx: 'vscode-icons:file-type-cpp',
  h: 'vscode-icons:file-type-cheader',
  hpp: 'vscode-icons:file-type-cppheader',
  cs: 'vscode-icons:file-type-csharp',
  swift: 'vscode-icons:file-type-swift',
  kt: 'vscode-icons:file-type-kotlin',
  kts: 'vscode-icons:file-type-kotlin',
  dart: 'vscode-icons:file-type-dart',
  lua: 'vscode-icons:file-type-lua',
  r: 'vscode-icons:file-type-r',
  scala: 'vscode-icons:file-type-scala',
  groovy: 'vscode-icons:file-type-groovy',
  
  // === Shell 脚本 ===
  sh: 'vscode-icons:file-type-shell',
  bash: 'vscode-icons:file-type-shell',
  zsh: 'vscode-icons:file-type-shell',
  fish: 'vscode-icons:file-type-shell',
  ps1: 'vscode-icons:file-type-powershell',
  psm1: 'vscode-icons:file-type-powershell',
  bat: 'vscode-icons:file-type-bat',
  cmd: 'vscode-icons:file-type-bat',
  
  // === 配置文件 ===
  yaml: 'vscode-icons:file-type-yaml',
  yml: 'vscode-icons:file-type-yaml',
  toml: 'vscode-icons:file-type-toml',
  xml: 'vscode-icons:file-type-xml',
  ini: 'vscode-icons:file-type-ini',
  conf: 'vscode-icons:file-type-config',
  config: 'vscode-icons:file-type-config',
  env: 'vscode-icons:file-type-dotenv',
  properties: 'vscode-icons:file-type-properties',
  
  // === 文档 ===
  md: 'vscode-icons:file-type-markdown',
  markdown: 'vscode-icons:file-type-markdown',
  mdx: 'vscode-icons:file-type-mdx',
  txt: 'vscode-icons:file-type-text',
  text: 'vscode-icons:file-type-text',
  log: 'vscode-icons:file-type-log',
  pdf: 'vscode-icons:file-type-pdf',
  doc: 'vscode-icons:file-type-word',
  docx: 'vscode-icons:file-type-word',
  xls: 'vscode-icons:file-type-excel',
  xlsx: 'vscode-icons:file-type-excel',
  ppt: 'vscode-icons:file-type-powerpoint',
  pptx: 'vscode-icons:file-type-powerpoint',
  csv: 'vscode-icons:file-type-excel',
  rtf: 'vscode-icons:file-type-text',
  
  // === 图片 ===
  png: 'vscode-icons:file-type-image',
  jpg: 'vscode-icons:file-type-image',
  jpeg: 'vscode-icons:file-type-image',
  gif: 'vscode-icons:file-type-image',
  webp: 'vscode-icons:file-type-image',
  bmp: 'vscode-icons:file-type-image',
  ico: 'vscode-icons:file-type-image',
  tiff: 'vscode-icons:file-type-image',
  tif: 'vscode-icons:file-type-image',
  svg: 'vscode-icons:file-type-svg',
  
  // === 设计文件 ===
  psd: 'vscode-icons:file-type-photoshop',
  ai: 'vscode-icons:file-type-ai',
  sketch: 'mdi:vector-square',
  figma: 'mdi:vector-square',
  xd: 'mdi:vector-square',
  
  // === 音频 ===
  mp3: 'vscode-icons:file-type-audio',
  wav: 'vscode-icons:file-type-audio',
  ogg: 'vscode-icons:file-type-audio',
  flac: 'vscode-icons:file-type-audio',
  aac: 'vscode-icons:file-type-audio',
  m4a: 'vscode-icons:file-type-audio',
  wma: 'vscode-icons:file-type-audio',
  
  // === 视频 ===
  mp4: 'vscode-icons:file-type-video',
  mov: 'vscode-icons:file-type-video',
  avi: 'vscode-icons:file-type-video',
  mkv: 'vscode-icons:file-type-video',
  webm: 'vscode-icons:file-type-video',
  flv: 'vscode-icons:file-type-video',
  wmv: 'vscode-icons:file-type-video',
  m3u8: 'vscode-icons:file-type-video',
  
  // === 压缩包 ===
  zip: 'vscode-icons:file-type-zip',
  rar: 'vscode-icons:file-type-zip',
  '7z': 'vscode-icons:file-type-zip',
  tar: 'vscode-icons:file-type-zip',
  gz: 'vscode-icons:file-type-zip',
  bz2: 'vscode-icons:file-type-zip',
  xz: 'vscode-icons:file-type-zip',
  tgz: 'vscode-icons:file-type-zip',
  
  // === 安装包 ===
  exe: 'mdi:application',
  msi: 'mdi:application',
  apk: 'mdi:android',
  aab: 'mdi:android',
  ipa: 'mdi:apple',
  dmg: 'mdi:apple',
  pkg: 'mdi:package-variant',
  deb: 'mdi:debian',
  rpm: 'mdi:redhat',
  appimage: 'mdi:application',
  
  // === 数据库 ===
  sql: 'vscode-icons:file-type-sql',
  db: 'mdi:database',
  sqlite: 'vscode-icons:file-type-sqlite',
  sqlite3: 'vscode-icons:file-type-sqlite',
  mdb: 'mdi:database',
  accdb: 'mdi:database',
  dump: 'mdi:database-export',
  bak: 'mdi:database-export',
  
  // === 安全/证书 ===
  key: 'mdi:key',
  pem: 'mdi:certificate',
  crt: 'mdi:certificate',
  cer: 'mdi:certificate',
  pfx: 'mdi:certificate',
  p12: 'mdi:certificate',
  csr: 'mdi:certificate',
  keystore: 'mdi:key-chain',
  
  // === 3D/CAD ===
  dwg: 'mdi:cube-outline',
  dxf: 'mdi:cube-outline',
  step: 'mdi:cube-outline',
  stp: 'mdi:cube-outline',
  stl: 'mdi:cube-outline',
  obj: 'mdi:cube-outline',
  fbx: 'mdi:cube-outline',
  blend: 'mdi:blender-software',
  max: 'mdi:cube-outline',
  c4d: 'mdi:cube-outline',
  
  // === 字体 ===
  ttf: 'vscode-icons:file-type-font',
  otf: 'vscode-icons:file-type-font',
  woff: 'vscode-icons:file-type-font',
  woff2: 'vscode-icons:file-type-font',
  eot: 'vscode-icons:file-type-font',
  
  // === 其他 ===
  wasm: 'vscode-icons:file-type-wasm',
  map: 'mdi:map',
  lock: 'mdi:lock',
  license: 'mdi:license',
};

// 特殊文件名到图标的映射
export const filenameIconMap: Record<string, string> = {
  // Git
  '.gitignore': 'vscode-icons:file-type-git',
  '.gitattributes': 'vscode-icons:file-type-git',
  '.gitmodules': 'vscode-icons:file-type-git',
  // Docker
  'dockerfile': 'vscode-icons:file-type-docker',
  'docker-compose.yml': 'vscode-icons:file-type-docker',
  'docker-compose.yaml': 'vscode-icons:file-type-docker',
  '.dockerignore': 'vscode-icons:file-type-docker',
  // Package managers
  'package.json': 'vscode-icons:file-type-npm',
  'package-lock.json': 'vscode-icons:file-type-npm',
  'yarn.lock': 'vscode-icons:file-type-yarn',
  'pnpm-lock.yaml': 'vscode-icons:file-type-pnpm',
  'bun.lockb': 'vscode-icons:file-type-bun',
  'bun.lock': 'vscode-icons:file-type-bun',
  // Config files
  'tsconfig.json': 'vscode-icons:file-type-tsconfig',
  'jsconfig.json': 'vscode-icons:file-type-jsconfig',
  '.eslintrc': 'vscode-icons:file-type-eslint',
  '.eslintrc.js': 'vscode-icons:file-type-eslint',
  '.eslintrc.json': 'vscode-icons:file-type-eslint',
  'eslint.config.js': 'vscode-icons:file-type-eslint',
  'eslint.config.mjs': 'vscode-icons:file-type-eslint',
  '.prettierrc': 'vscode-icons:file-type-prettier',
  '.prettierrc.js': 'vscode-icons:file-type-prettier',
  '.prettierrc.json': 'vscode-icons:file-type-prettier',
  'prettier.config.js': 'vscode-icons:file-type-prettier',
  '.editorconfig': 'vscode-icons:file-type-editorconfig',
  '.npmrc': 'vscode-icons:file-type-npm',
  '.nvmrc': 'vscode-icons:file-type-node',
  '.env': 'vscode-icons:file-type-dotenv',
  '.env.local': 'vscode-icons:file-type-dotenv',
  '.env.development': 'vscode-icons:file-type-dotenv',
  '.env.production': 'vscode-icons:file-type-dotenv',
  '.env.example': 'vscode-icons:file-type-dotenv',
  // Build tools
  'vite.config.ts': 'vscode-icons:file-type-vite',
  'vite.config.js': 'vscode-icons:file-type-vite',
  'webpack.config.js': 'vscode-icons:file-type-webpack',
  'rollup.config.js': 'vscode-icons:file-type-rollup',
  'turbo.json': 'vscode-icons:file-type-turbo',
  // Framework configs
  'svelte.config.js': 'vscode-icons:file-type-svelte',
  'next.config.js': 'vscode-icons:file-type-next',
  'nuxt.config.ts': 'vscode-icons:file-type-nuxt',
  'astro.config.mjs': 'vscode-icons:file-type-astro',
  // Others
  'makefile': 'vscode-icons:file-type-makefile',
  'readme.md': 'vscode-icons:file-type-markdown',
  'readme': 'vscode-icons:file-type-markdown',
  'changelog.md': 'vscode-icons:file-type-markdown',
  'license': 'mdi:license',
  'license.md': 'mdi:license',
  'license.txt': 'mdi:license',
};

// 文件夹图标
export const folderIcons = {
  folder: 'tdesign:folder',
  folderOpen: 'tdesign:folder-open',
  folderCode: 'vscode-icons:folder-type-src',
  folderImage: 'vscode-icons:folder-type-images',
  folderVideo: 'vscode-icons:folder-type-video',
  folderAudio: 'vscode-icons:folder-type-audio',
  folderConfig: 'vscode-icons:folder-type-config',
  folderDocs: 'vscode-icons:folder-type-docs',
  folderTest: 'vscode-icons:folder-type-test',
  folderComponent: 'vscode-icons:folder-type-component',
};

// 默认图标
export const defaultIcon = 'tdesign:file';
export const defaultFolderIcon = 'tdesign:folder';
export const defaultFolderOpenIcon = 'tdesign:folder-open';

/**
 * 根据文件扩展名获取图标
 */
export function getIconByExtension(ext: string): string {
  const normalizedExt = ext.toLowerCase().replace(/^\./, '');
  return extensionIconMap[normalizedExt] || defaultIcon;
}

/**
 * 根据文件名获取图标
 */
export function getIconByFilename(filename: string): string {
  const lowerFilename = filename.toLowerCase();
  
  // 先检查完整文件名
  if (filenameIconMap[lowerFilename]) {
    return filenameIconMap[lowerFilename];
  }
  
  // 再检查扩展名
  const ext = filename.split('.').pop() || '';
  return getIconByExtension(ext);
}

/**
 * 获取文件夹图标
 */
export function getFolderIcon(folderName?: string, isOpen = false): string {
  if (!folderName) {
    return isOpen ? defaultFolderOpenIcon : defaultFolderIcon;
  }
  
  const lowerName = folderName.toLowerCase();
  
  // 特殊文件夹名称映射
  const specialFolders: Record<string, string> = {
    src: folderIcons.folderCode,
    source: folderIcons.folderCode,
    lib: folderIcons.folderCode,
    images: folderIcons.folderImage,
    img: folderIcons.folderImage,
    assets: folderIcons.folderImage,
    videos: folderIcons.folderVideo,
    video: folderIcons.folderVideo,
    audio: folderIcons.folderAudio,
    music: folderIcons.folderAudio,
    config: folderIcons.folderConfig,
    configs: folderIcons.folderConfig,
    docs: folderIcons.folderDocs,
    documentation: folderIcons.folderDocs,
    test: folderIcons.folderTest,
    tests: folderIcons.folderTest,
    '__tests__': folderIcons.folderTest,
    components: folderIcons.folderComponent,
    component: folderIcons.folderComponent,
  };
  
  return specialFolders[lowerName] || (isOpen ? defaultFolderOpenIcon : defaultFolderIcon);
}
