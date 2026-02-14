// Knowledge module actions
export * from './folder';
export * from './file';
export * from './fileVersion';
export * from './favorite';

// Aggregate all knowledge actions
import { folderActions } from './folder';
import { fileActions } from './file';
import { fileVersionActions } from './fileVersion';
import { favoriteActions } from './favorite';

export const knowledgeActions = [
  ...folderActions,
  ...fileActions,
  ...fileVersionActions,
  ...favoriteActions,
];
