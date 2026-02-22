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
export * from './noticeRead';
export * from './operationLog';
export * from './post';
export * from './role';
export * from './roleDepartment';
export * from './roleMenu';
export * from './userPost';
export * from './userRole';
export * from './permission';
export * from './casbinRule';

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
import { noticeReadActions } from './noticeRead';
import { operationLogActions } from './operationLog';
import { postActions } from './post';
import { roleActions } from './role';
import { roleDepartmentActions } from './roleDepartment';
import { roleMenuActions } from './roleMenu';
import { userPostActions } from './userPost';
import { userRoleActions } from './userRole';
import { permissionActions } from './permission';
import { casbinRuleActions } from './casbinRule';

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
  ...noticeReadActions,
  ...operationLogActions,
  ...postActions,
  ...roleActions,
  ...roleDepartmentActions,
  ...roleMenuActions,
  ...userPostActions,
  ...userRoleActions,
  ...permissionActions,
  ...casbinRuleActions,
];
