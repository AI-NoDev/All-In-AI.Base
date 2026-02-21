/**
 * 知识库权限管理 Actions
 */

export * from './schemas';
export { assertCanManagePermission } from './utils';
export { permissionGetForNode } from './getForNode';
export { permissionSetForNode } from './setForNode';
export { permissionAdd } from './add';
export { permissionRemove } from './remove';
export { permissionGetEffective } from './getEffective';
export { permissionQuickShare } from './quickShare';
export { permissionRevokeShare } from './revokeShare';

import { permissionGetForNode } from './getForNode';
import { permissionSetForNode } from './setForNode';
import { permissionAdd } from './add';
import { permissionRemove } from './remove';
import { permissionGetEffective } from './getEffective';
import { permissionQuickShare } from './quickShare';
import { permissionRevokeShare } from './revokeShare';

export const permissionActions = [
  permissionGetForNode,
  permissionSetForNode,
  permissionAdd,
  permissionRemove,
  permissionGetEffective,
  permissionQuickShare,
  permissionRevokeShare,
];
