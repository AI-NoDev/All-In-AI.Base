// AI module actions
export * from './provider';
export * from './model';
export * from './agent';
export * from './agentSession';
export * from './agentMessage';
export * from './toolGroup';

// Aggregate all AI actions
import { providerActions } from './provider';
import { modelActions } from './model';
import { agentActions } from './agent';
import { agentSessionActions } from './agentSession';
import { agentMessageActions } from './agentMessage';
import { toolGroupActions } from './toolGroup';

export const aiActions = [
  ...providerActions,
  ...modelActions,
  ...agentActions,
  ...agentSessionActions,
  ...agentMessageActions,
  ...toolGroupActions,
];
