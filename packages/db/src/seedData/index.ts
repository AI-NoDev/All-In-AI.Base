/**
 * 种子数据模块
 * 包含系统初始化所需的所有种子数据
 */

export * from './systemConfig';
export * from './permission';
export * from './role';
export * from './casbinPolicy';
export * from './menu';
export * from './roleMenu';
export * from './dict';

// 导出所有种子数据的汇总
export { systemConfigSeeds, initSystemConfigSeeds } from './systemConfig';
export { permissionSeeds, flatPermissionSeeds, flattenPermissions, initPermissionSeeds } from './permission';
export { roleSeeds, initRoleSeeds } from './role';
export { casbinPolicySeeds, roleInheritanceSeeds, allCasbinSeeds, initCasbinPolicySeeds } from './casbinPolicy';
export { menuSeeds, initMenuSeeds, MENU_IDS, MENU_TYPE } from './menu';
export { roleMenuConfigs, initRoleMenuSeeds } from './roleMenu';
export { dictGroupSeeds, dictSeeds, initDictGroupSeeds, initDictSeeds, initAllDictSeeds } from './dict';
