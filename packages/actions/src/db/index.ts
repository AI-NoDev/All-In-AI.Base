// DB Actions - All modules
export * from './system';
export * from './ai';
export * from './knowledge';
export * from './im';

// Aggregate all DB actions
import { systemActions } from './system';
import { aiActions } from './ai';
import { knowledgeActions } from './knowledge';
import { imActions } from './im';

export const dbActions = [
  ...systemActions,
  ...aiActions,
  ...knowledgeActions,
  ...imActions,
];
