import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const messagesDir = join(import.meta.dir, '../messages');

async function mergeMessages(locale: string) {
  const merged: Record<string, string> = {};
  
  const subdirs = ['common', 'error', 'validation', 'schemaEditor', 'db/base', 'db/system', 'db/ai', 'db/im', 'db/knowledge'];
  
  for (const subdir of subdirs) {
    const filePath = join(messagesDir, subdir, `${locale}.json`);
    try {
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      const prefix = subdir.replace(/\//g, '_');
      
      for (const [key, value] of Object.entries(data)) {
        merged[`${prefix}_${key}`] = value as string;
      }
    } catch (e) {
      console.log(`Skipping ${filePath}`);
    }
  }
  
  await writeFile(join(messagesDir, `${locale}.json`), JSON.stringify(merged, null, 2));
  console.log(`Merged ${Object.keys(merged).length} messages for ${locale}`);
}

await mergeMessages('zh-Hans');
await mergeMessages('en');
