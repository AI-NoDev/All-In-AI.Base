import { pgTable, uuid, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_system_menu_meta_displayName,
  db_system_menu_meta_verboseName,
  db_system_menu_meta_verboseNamePlural,
  db_system_menu_name,
  db_system_menu_parentId,
  db_system_menu_orderNum,
  db_system_menu_path,
  db_system_menu_type,
  db_system_menu_visible,
  db_system_menu_isCache,
  db_system_menu_isFrame,
  db_system_menu_perms,
  db_system_menu_icon,
  db_system_menu_remark,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

/**
 * 菜单类型
 * M - 目录 (Directory)
 * C - 菜单 (Menu) - 系统内置路由页面
 * F - 按钮 (Button)
 * L - 外链 (Link) - iframe 嵌入外部链接
 */
export const MENU_TYPE = {
  DIRECTORY: 'M',
  MENU: 'C',
  BUTTON: 'F',
  LINK: 'L',
} as const;

// ============ Fields ============
const menuOwnFields = {
  name: {
    field: varchar("name", { length: 50 }).notNull(),
    comment: db_system_menu_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_menu_name, importExcelColumnName: db_system_menu_name, cellType: "STRING" as const }
  },
  parentId: {
    field: uuid("parent_id"),
    comment: db_system_menu_parentId,
    config: { canExport: false, canImport: true, importExcelColumnName: db_system_menu_parentId, cellType: "STRING" as const }
  },
  orderNum: {
    field: integer("order_num").notNull().default(1),
    comment: db_system_menu_orderNum,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_menu_orderNum, importExcelColumnName: db_system_menu_orderNum, cellType: "NUMERIC" as const }
  },
  path: {
    field: varchar("path", { length: 500 }),
    comment: db_system_menu_path,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_menu_path, importExcelColumnName: db_system_menu_path, cellType: "STRING" as const }
  },
  type: {
    field: varchar("type", { length: 1 }).notNull(),
    comment: db_system_menu_type,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_menu_type, importExcelColumnName: db_system_menu_type, cellType: "STRING" as const }
  },
  visible: {
    field: boolean("visible").notNull().default(true),
    comment: db_system_menu_visible,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_menu_visible, importExcelColumnName: db_system_menu_visible, cellType: "STRING" as const }
  },
  isCache: {
    field: boolean("is_cache").notNull().default(true),
    comment: db_system_menu_isCache,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_menu_isCache, importExcelColumnName: db_system_menu_isCache, cellType: "STRING" as const }
  },
  isFrame: {
    field: boolean("is_frame").notNull().default(false),
    comment: db_system_menu_isFrame,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_menu_isFrame, importExcelColumnName: db_system_menu_isFrame, cellType: "STRING" as const }
  },
  /**
   * 是否系统内置菜单
   * true - 系统菜单，不可删除，可修改部分属性（如名称、图标、排序）
   * false - 用户自定义菜单，可删除
   */
  isSystem: {
    field: boolean("is_system").notNull().default(false),
    comment: () => '是否系统菜单',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '系统菜单', cellType: "STRING" as const }
  },
  /**
   * 外链地址（当 type='L' 或 isFrame=true 时使用）
   * 支持完整 URL，如 https://example.com
   */
  linkUrl: {
    field: varchar("link_url", { length: 500 }),
    comment: () => '外链地址',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '外链地址', importExcelColumnName: () => '外链地址', cellType: "STRING" as const }
  },
  /**
   * 外链打开方式
   * _self - 当前窗口（iframe 嵌入）
   * _blank - 新窗口打开
   */
  linkTarget: {
    field: varchar("link_target", { length: 10 }).default('_self'),
    comment: () => '外链打开方式',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '打开方式', importExcelColumnName: () => '打开方式', cellType: "STRING" as const }
  },
  perms: {
    field: varchar("perms", { length: 100 }),
    comment: db_system_menu_perms,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_menu_perms, importExcelColumnName: db_system_menu_perms, cellType: "STRING" as const }
  },
  icon: {
    field: varchar("icon", { length: 64 }),
    comment: db_system_menu_icon,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_menu_icon, importExcelColumnName: db_system_menu_icon, cellType: "STRING" as const }
  },
  remark: {
    field: varchar("remark", { length: 512 }),
    comment: db_system_menu_remark,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_menu_remark, importExcelColumnName: db_system_menu_remark, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const menuFields = mergeFields(pkSchema, auditSchema, menuOwnFields);

// ============ Meta ============
export const menuMeta: EntityMeta = {
  name: 'system_menu',
  displayName: db_system_menu_meta_displayName,
  verboseName: db_system_menu_meta_verboseName,
  verboseNamePlural: db_system_menu_meta_verboseNamePlural,
  permissions: createPermissions('system_menu'),
};

// ============ Table ============
export const menu = pgTable(menuMeta.name, getTableFields(menuFields));

// ============ Config ============
export const menuConfig = getFieldConfigs(menuFields);

// ============ Schemas ============
export const menuZodSchemas = createZodSchemas(menu, menuFields);
