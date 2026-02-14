import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * 确保目录存在
 */
export function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 递归获取目录下所有文件
 */
export function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
}

/**
 * 计算相对路径
 */
export function getRelativePath(from: string, to: string): string {
  return path.relative(from, to);
}

/**
 * 规范化路径分隔符
 */
export function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

/**
 * 检查文件是否存在
 */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

/**
 * 读取文件内容
 */
export function readFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * 写入文件
 */
export function writeFile(filePath: string, content: string): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * 复制文件
 */
export function copyFile(source: string, target: string): void {
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
}

/**
 * 删除文件
 */
export function deleteFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * 删除空目录（递归向上）
 */
export function removeEmptyDirs(dirPath: string, stopAt: string): void {
  if (!fs.existsSync(dirPath) || dirPath === stopAt) return;
  
  const files = fs.readdirSync(dirPath);
  if (files.length === 0) {
    fs.rmdirSync(dirPath);
    removeEmptyDirs(path.dirname(dirPath), stopAt);
  }
}
