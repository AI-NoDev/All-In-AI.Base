#!/usr/bin/env bun
import { createApp, removeApp } from '../src/index';

const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
Usage:
  startapp <app-name>     创建新的扩展应用
  startapp remove <name>  删除扩展应用

Examples:
  startapp crm            创建 app-crm 扩展应用
  startapp remove crm     删除 app-crm 扩展应用
`);
}

if (!command) {
  showHelp();
  process.exit(1);
}

if (command === 'remove' || command === 'rm') {
  const appName = args[1];
  if (!appName) {
    console.error('Error: 请指定要删除的应用名称');
    console.error('Usage: startapp remove <app-name>');
    process.exit(1);
  }
  await removeApp(appName);
} else if (command === 'help' || command === '-h' || command === '--help') {
  showHelp();
} else {
  // 默认是创建应用
  await createApp(command);
}
