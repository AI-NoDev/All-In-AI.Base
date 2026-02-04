// System module actions
export * from './user';
export * from './config';
export * from './department';
export * from './dict';
export * from './dictGroup';
export * from './job';
export * from './jobLog';
export * from './loginInfo';
export * from './menu';
export * from './notice';
export * from './operationLog';
export * from './post';
export * from './role';
export * from './roleDepartment';
export * from './roleMenu';
export * from './token';
export * from './userPost';
export * from './userRole';

// Aggregate all system actions
import { userActions } from './user';
import { configActions } from './config';
import { departmentActions } from './department';
import { dictActions } from './dict';
import { dictGroupActions } from './dictGroup';
import { jobActions } from './job';
import { jobLogActions } from './jobLog';
import { loginInfoActions } from './loginInfo';
import { menuActions } from './menu';
import { noticeActions } from './notice';
import { operationLogActions } from './operationLog';
import { postActions } from './post';
import { roleActions } from './role';
import { roleDepartmentActions } from './roleDepartment';
import { roleMenuActions } from './roleMenu';
import { tokenActions } from './token';
import { userPostActions } from './userPost';
import { userRoleActions } from './userRole';

export const systemActions = [
  ...userActions,
  ...configActions,
  ...departmentActions,
  ...dictActions,
  ...dictGroupActions,
  ...jobActions,
  ...jobLogActions,
  ...loginInfoActions,
  ...menuActions,
  ...noticeActions,
  ...operationLogActions,
  ...postActions,
  ...roleActions,
  ...roleDepartmentActions,
  ...roleMenuActions,
  ...tokenActions,
  ...userPostActions,
  ...userRoleActions,
];
