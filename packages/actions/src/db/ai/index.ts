// AI module actions
export * from './provider';
export * from './model';
export * from './agent';
export * from './aiSession';
export * from './aiSessionMessage';
export * from './mcpServer';
export * from './apiKey';
export * from './userMemory';
// Legacy exports (deprecated)
export * from './agentSession';
export * from './agentMessage';
export * from './toolGroup';

// Aggregate all AI actions
import { providerActions } from './provider';
import { modelActions } from './model';
import { agentActions } from './agent';
import { aiSessionActions } from './aiSession';
import { aiSessionMessageActions } from './aiSessionMessage';
import { mcpServerActions } from './mcpServer';
import { apiKeyActions } from './apiKey';
import { userMemoryActions } from './userMemory';
// Legacy actions (deprecated)
import { agentSessionActions } from './agentSession';
import { agentMessageActions } from './agentMessage';
import { toolGroupActions } from './toolGroup';

export const aiActions = [
  ...providerActions,
  ...modelActions,
  ...agentActions,
  ...aiSessionActions,
  ...aiSessionMessageActions,
  ...mcpServerActions,
  ...apiKeyActions,
  ...userMemoryActions,
  // Legacy actions (deprecated)
  ...agentSessionActions,
  ...agentMessageActions,
  ...toolGroupActions,
];
