import { pgTable, uuid, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

const f = (field: string) => tSystem('menu', field);

// ============ Fields ============
const menuOwnFields = {
  name: {
    field: varchar("name", { length: 50 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  parentId: {
    field: uuid("parent_id"),
    comment: f('parentId'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('parentId'), cellType: "STRING" as const }
  },
  orderNum: {
    field: integer("order_num").notNull().default(1),
    comment: f('orderNum'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('orderNum'), importExcelColumnName: f('orderNum'), cellType: "NUMERIC" as const }
  },
  path: {
    field: varchar("path", { length: 200 }),
    comment: f('path'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('path'), importExcelColumnName: f('path'), cellType: "STRING" as const }
  },
  type: {
    field: varchar("type", { length: 1 }).notNull(),
    comment: f('type'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('type'), importExcelColumnName: f('type'), cellType: "STRING" as const }
  },
  visible: {
    field: boolean("visible").notNull().default(true),
    comment: f('visible'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('visible'), importExcelColumnName: f('visible'), cellType: "STRING" as const }
  },
  isCache: {
    field: boolean("is_cache").notNull().default(true),
    comment: f('isCache'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('isCache'), importExcelColumnName: f('isCache'), cellType: "STRING" as const }
  },
  isFrame: {
    field: boolean("is_frame").notNull().default(false),
    comment: f('isFrame'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('isFrame'), importExcelColumnName: f('isFrame'), cellType: "STRING" as const }
  },
  perms: {
    field: varchar("perms", { length: 100 }),
    comment: f('perms'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('perms'), importExcelColumnName: f('perms'), cellType: "STRING" as const }
  },
  icon: {
    field: varchar("icon", { length: 64 }),
    comment: f('icon'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('icon'), importExcelColumnName: f('icon'), cellType: "STRING" as const }
  },
  component: {
    field: varchar("component", { length: 255 }),
    comment: f('component'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('component'), importExcelColumnName: f('component'), cellType: "STRING" as const }
  },
  remark: {
    field: varchar("remark", { length: 512 }),
    comment: f('remark'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('remark'), importExcelColumnName: f('remark'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const menuFields = mergeFields(pkSchema, auditSchema, menuOwnFields);

// ============ Meta ============
export const menuMeta: EntityMeta = {
  name: 'system_menu',
  displayName: tSystemMeta('menu', 'displayName'),
  verboseName: tSystemMeta('menu', 'verboseName'),
  verboseNamePlural: tSystemMeta('menu', 'verboseNamePlural'),
  permissions: createPermissions('system_menu'),
};

// ============ Table ============
export const menu = pgTable(menuMeta.name, getTableFields(menuFields));

// ============ Config ============
export const menuConfig = getFieldConfigs(menuFields);

// ============ Schemas ============
export const menuZodSchemas = createZodSchemas(menu, menuFields);
