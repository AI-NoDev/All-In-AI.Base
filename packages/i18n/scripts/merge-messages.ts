import { readFile, writeFile, readdir, stat } from 'fs/promises';
import { join } from 'path';

const messagesDir = join(import.meta.dir, '../messages');

async function mergeMessages(locale: string) {
  const merged: Record<string, string> = {};
  
  // Simple subdirs (single level)
  const simpleSubdirs = [
    'common', 
    'error', 
    'validation', 
    'schemaEditor', 
    'nav',
  ];
  
  // Nested subdirs (db/xxx, page/xxx)
  const nestedParents = ['db', 'page'];
  
  // Process simple subdirs
  for (const subdir of simpleSubdirs) {
    const filePath = join(messagesDir, subdir, `${locale}.json`);
    try {
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      for (const [key, value] of Object.entries(data)) {
        merged[`${subdir}_${key}`] = value as string;
      }
    } catch (e) {
      console.log(`Skipping ${filePath}`);
    }
  }
  
  // Process nested subdirs (db/system, db/ai, page/login, page/dashboard, etc.)
  for (const parent of nestedParents) {
    const parentDir = join(messagesDir, parent);
    try {
      const entries = await readdir(parentDir);
      for (const entry of entries) {
        const entryPath = join(parentDir, entry);
        const entryStat = await stat(entryPath);
        
        if (entryStat.isDirectory()) {
          // It's a subdirectory like db/system or page/login
          const filePath = join(entryPath, `${locale}.json`);
          try {
            const content = await readFile(filePath, 'utf-8');
            const data = JSON.parse(content);
            const prefix = `${parent}_${entry}`;
            
            for (const [key, value] of Object.entries(data)) {
              merged[`${prefix}_${key}`] = value as string;
            }
          } catch (e) {
            console.log(`Skipping ${filePath}`);
          }
        } else if (entry === `${locale}.json`) {
          // It's a direct file like page/zh-Hans.json (legacy, skip if subdirs exist)
          // We'll skip these as we're moving to modular structure
          console.log(`Skipping legacy file ${entryPath}`);
        }
      }
    } catch (e) {
      console.log(`Skipping parent dir ${parentDir}`);
    }
  }
  
  await writeFile(join(messagesDir, `${locale}.json`), JSON.stringify(merged, null, 2));
  console.log(`Merged ${Object.keys(merged).length} messages for ${locale}`);
}

await mergeMessages('zh-Hans');
await mergeMessages('en');
