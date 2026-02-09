/**
 * Generate TypeScript declaration files for Paraglide messages
 */
import { writeFileSync } from 'fs';
import { join } from 'path';

const paraglideDir = join(import.meta.dir, '../paraglide');

// Generate messages.d.ts
const messagesDts = `/* eslint-disable */
import type { LocalizedString } from './runtime.js';

export type MessageFunction = (inputs?: Record<string, unknown>, options?: { locale?: 'en' | 'zh-Hans' }) => LocalizedString;

export type Messages = {
  [key: string]: MessageFunction;
};

export const m: Messages;

// Re-export all message functions
export * from './messages/_index.js';
`;

// Generate runtime.d.ts
const runtimeDts = `/* eslint-disable */
export type Locale = 'en' | 'zh-Hans';
export type LocalizedString = string & { __brand: 'LocalizedString' };

export function getLocale(): Locale;
export function setLocale(locale: Locale, options?: { reload?: boolean }): void;
export function trackMessageCall(messageId: string, locale: Locale): void;

export const experimentalMiddlewareLocaleSplitting: boolean;
export const isServer: boolean;
export const experimentalStaticLocale: Locale | undefined;
`;

writeFileSync(join(paraglideDir, 'messages.d.ts'), messagesDts);
writeFileSync(join(paraglideDir, 'runtime.d.ts'), runtimeDts);

console.log('✔ Generated TypeScript declaration files');
