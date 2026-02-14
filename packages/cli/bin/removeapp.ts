#!/usr/bin/env bun
import { removeApp } from '../src/index';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: bun run removeapp <app-name>');
  console.error('Example: bun run removeapp example');
  process.exit(1);
}

const appName = args[0];
await removeApp(appName);
