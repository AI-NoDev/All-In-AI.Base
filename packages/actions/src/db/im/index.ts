// IM module actions
export * from './conversation';
export * from './message';
export * from './groupMember';
export * from './conversationRead';
export * from './conversationHidden';
export * from './tempFile';

// Aggregate all IM actions
import { conversationActions } from './conversation';
import { messageActions } from './message';
import { groupMemberActions } from './groupMember';
import { conversationReadActions } from './conversationRead';
import { conversationHiddenActions } from './conversationHidden';
import { tempFileActions } from './tempFile';

export const imActions = [
  ...conversationActions,
  ...messageActions,
  ...groupMemberActions,
  ...conversationReadActions,
  ...conversationHiddenActions,
  ...tempFileActions,
];
