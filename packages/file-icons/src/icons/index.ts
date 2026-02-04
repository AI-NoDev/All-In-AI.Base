// 导出所有图标
export * from './code';
export * from './backend';
export * from './config';
export * from './document';
export * from './image';
export * from './media';
export * from './archive';
export * from './installer';
export * from './database';
export * from './security';
export * from './design';
export * from './folder';
export * from './unknown';

import * as code from './code';
import * as backend from './backend';
import * as config from './config';
import * as document from './document';
import * as image from './image';
import * as media from './media';
import * as archive from './archive';
import * as installer from './installer';
import * as database from './database';
import * as security from './security';
import * as design from './design';
import * as folder from './folder';
import * as unknown from './unknown';

// 图标映射表
export const iconMap: Record<string, string> = {
  // code
  code: code.code, txt: code.txt, log: code.log, env: code.env, ini: code.ini, conf: code.conf,
  html: code.html, css: code.css, scss: code.scss, less: code.less,
  js: code.js, mjs: code.mjs, cjs: code.cjs, ts: code.ts, tsx: code.tsx, jsx: code.jsx,
  json: code.json, map: code.map, wasm: code.wasm,
  // backend
  py: backend.py, pyc: backend.pyc, java: backend.java, class: backend.classFile, jar: backend.jar,
  go: backend.go, rs: backend.rs, php: backend.php, rb: backend.rb,
  sh: backend.sh, bash: backend.bash, zsh: backend.zsh, ps1: backend.ps1, bat: backend.bat, cmd: backend.cmd,
  c: backend.c, cpp: backend.cpp, h: backend.h, hpp: backend.hpp, cs: backend.cs,
  swift: backend.swift, kt: backend.kt, dart: backend.dart, lua: backend.lua, r: backend.r, scala: backend.scala,
  // config
  yaml: config.yaml, yml: config.yml, toml: config.toml, xml: config.xml, properties: config.properties,
  lock: config.lock, gradle: config.gradle, pom: config.pom, makefile: config.makefile,
  dockerfile: config.dockerfile, dockerignore: config.dockerignore, gitignore: config.gitignore,
  npmrc: config.npmrc, editorconfig: config.editorconfig, eslintrc: config.eslintrc, prettierrc: config.prettierrc,
  // document
  md: document.md, markdown: document.markdown, pdf: document.pdf,
  doc: document.doc, docx: document.docx, xls: document.xls, xlsx: document.xlsx,
  ppt: document.ppt, pptx: document.pptx, csv: document.csv, rtf: document.rtf,
  jsonc: document.jsonc, geojson: document.geojson, ndjson: document.ndjson, avro: document.avro, parquet: document.parquet,
  // image
  image: image.image, png: image.png, jpg: image.jpg, jpeg: image.jpeg, gif: image.gif,
  webp: image.webp, svg: image.svg, bmp: image.bmp, ico: image.ico, tiff: image.tiff,
  psd: image.psd, ai: image.ai, sketch: image.sketch, figma: image.figma, xd: image.xd,
  // media
  audio: media.audio, mp3: media.mp3, wav: media.wav, ogg: media.ogg, flac: media.flac, aac: media.aac, m4a: media.m4a,
  video: media.video, mp4: media.mp4, mov: media.mov, avi: media.avi, mkv: media.mkv,
  webm: media.webm, flv: media.flv, wmv: media.wmv, m3u8: media.m3u8,
  // archive
  zip: archive.zip, rar: archive.rar, '7z': archive.sevenZ, tar: archive.tar, gz: archive.gz, bz2: archive.bz2, xz: archive.xz,
  // installer
  exe: installer.exe, msi: installer.msi, apk: installer.apk, aab: installer.aab, ipa: installer.ipa,
  dmg: installer.dmg, pkg: installer.pkg, deb: installer.deb, rpm: installer.rpm, appimage: installer.appimage,
  // database
  sql: database.sql, db: database.db, sqlite: database.sqlite, sqlite3: database.sqlite3,
  mdb: database.mdb, accdb: database.accdb, dump: database.dump, bak: database.bak,
  // security
  key: security.key, pem: security.pem, crt: security.crt, cer: security.cer,
  pfx: security.pfx, p12: security.p12, csr: security.csr, keystore: security.keystore,
  // design
  dwg: design.dwg, dxf: design.dxf, step: design.step, stp: design.stp, stl: design.stl,
  obj: design.obj, fbx: design.fbx, blend: design.blend, max: design.max, c4d: design.c4d,
  // folder
  folder: folder.folder, 'folder-open': folder.folderOpen, 'folder-code': folder.folderCode,
  'folder-image': folder.folderImage, 'folder-video': folder.folderVideo,
  'folder-audio': folder.folderAudio, 'folder-config': folder.folderConfig,
  // unknown
  unknown: unknown.unknown,
};

// 根据文件扩展名获取图标
export function getIconByExtension(ext: string): string {
  const normalizedExt = ext.toLowerCase().replace(/^\./, '');
  return iconMap[normalizedExt] || iconMap.unknown;
}

// 根据文件名获取图标
export function getIconByFilename(filename: string): string {
  const ext = filename.split('.').pop() || '';
  return getIconByExtension(ext);
}
