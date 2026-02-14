/**
 * 同步清单管理
 * 用于跟踪已同步的文件，支持增量更新和清理
 */

import * as path from 'node:path';
import type { SyncManifest, SyncRecord } from './types';
import { fileExists, readFile, writeFile, deleteFile, removeEmptyDirs } from './utils';

const MANIFEST_FILENAME = '.extends-app-manifest.json';
const MANIFEST_VERSION = '1.0.0';

/**
 * 获取清单文件路径
 */
export function getManifestPath(routesDir: string): string {
  return path.join(routesDir, MANIFEST_FILENAME);
}

/**
 * 读取清单文件
 */
export function readManifest(routesDir: string): SyncManifest {
  const manifestPath = getManifestPath(routesDir);
  
  if (!fileExists(manifestPath)) {
    return {
      version: MANIFEST_VERSION,
      updatedAt: new Date().toISOString(),
      records: [],
    };
  }

  try {
    const content = readFile(manifestPath);
    return JSON.parse(content) as SyncManifest;
  } catch {
    return {
      version: MANIFEST_VERSION,
      updatedAt: new Date().toISOString(),
      records: [],
    };
  }
}

/**
 * 写入清单文件
 */
export function writeManifest(routesDir: string, manifest: SyncManifest): void {
  const manifestPath = getManifestPath(routesDir);
  manifest.updatedAt = new Date().toISOString();
  writeFile(manifestPath, JSON.stringify(manifest, null, 2));
}

/**
 * 添加同步记录
 */
export function addSyncRecord(
  manifest: SyncManifest,
  source: string,
  target: string,
  packageName: string
): void {
  // 检查是否已存在
  const existingIndex = manifest.records.findIndex(
    (r) => r.target === target
  );

  const record: SyncRecord = {
    source,
    target,
    package: packageName,
    syncedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    manifest.records[existingIndex] = record;
  } else {
    manifest.records.push(record);
  }
}

/**
 * 移除同步记录
 */
export function removeSyncRecord(manifest: SyncManifest, target: string): void {
  manifest.records = manifest.records.filter((r) => r.target !== target);
}

/**
 * 获取包的所有同步记录
 */
export function getPackageRecords(manifest: SyncManifest, packageName: string): SyncRecord[] {
  return manifest.records.filter((r) => r.package === packageName);
}

/**
 * 清理已删除源文件对应的目标文件
 */
export function cleanOrphanedFiles(
  manifest: SyncManifest,
  routesDir: string,
  sourceFiles: Set<string>,
  packageName: string
): string[] {
  const cleaned: string[] = [];
  const packageRecords = getPackageRecords(manifest, packageName);

  for (const record of packageRecords) {
    if (!sourceFiles.has(record.source)) {
      // 源文件已删除，清理目标文件
      if (fileExists(record.target)) {
        deleteFile(record.target);
        removeEmptyDirs(path.dirname(record.target), routesDir);
        cleaned.push(record.target);
      }
      removeSyncRecord(manifest, record.target);
    }
  }

  return cleaned;
}

/**
 * 检查目标文件是否由插件管理
 */
export function isManagedFile(manifest: SyncManifest, targetPath: string): boolean {
  return manifest.records.some((r) => r.target === targetPath);
}
