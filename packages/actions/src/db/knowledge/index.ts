// Knowledge module actions
export * from './folder';
export * from './file';
export * from './fileVersion';
export * from './resourcePermission';

// Aggregate all knowledge actions
import { folderActions } from './folder';
import { fileActions } from './file';
import { fileVersionActions } from './fileVersion';
import { resourcePermissionActions } from './resourcePermission';

export const knowledgeActions = [
  ...folderActions,
  ...fileActions,
  ...fileVersionActions,
  ...resourcePermissionActions,
];
