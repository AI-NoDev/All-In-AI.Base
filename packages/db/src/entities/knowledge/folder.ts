import { pgTable, uuid, varchar, text, integer, boolean } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

// ============ Fields ============
const folderOwnFields = {
  parentId: {
    field: uuid("parent_id"),
    comment: () => '父文件夹ID',
    config: { canExport: false, canImport: true, importExcelColumnName: () => '父文件夹ID', cellType: "STRING" as const }
  },
  name: {
    field: varchar("name", { length: 255 }).notNull(),
    comment: () => '文件夹名称',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '文件夹名称', importExcelColumnName: () => '文件夹名称', cellType: "STRING" as const }
  },
  path: {
    field: text("path").notNull(),
    comment: () => '路径',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '路径', cellType: "STRING" as const }
  },
  description: {
    field: text("description"),
    comment: () => '描述',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '描述', importExcelColumnName: () => '描述', cellType: "TEXT" as const }
  },
  icon: {
    field: varchar("icon", { length: 64 }),
    comment: () => '图标',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '图标', importExcelColumnName: () => '图标', cellType: "STRING" as const }
  },
  color: {
    field: varchar("color", { length: 32 }),
    comment: () => '颜色',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '颜色', importExcelColumnName: () => '颜色', cellType: "STRING" as const }
  },
  orderNum: {
    field: integer("order_num").notNull().default(0),
    comment: () => '排序号',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '排序号', importExcelColumnName: () => '排序号', cellType: "NUMERIC" as const }
  },
  isPublic: {
    field: boolean("is_public").notNull().default(false),
    comment: () => '是否公开',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '是否公开', importExcelColumnName: () => '是否公开', cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const folderFields = mergeFields(pkSchema, auditSchema, deletedSchema, folderOwnFields);

// ============ Meta ============
export const folderMeta: EntityMeta = {
  name: 'knowledge_folder',
  displayName: () => '文件夹',
  verboseName: () => '文件夹',
  verboseNamePlural: () => '文件夹列表',
  permissions: createPermissions('knowledge_folder'),
};

// ============ Table ============
// 注意：唯一性约束在应用层检查（folderCreate action），不使用数据库索引
// 这样软删除的记录不会影响新记录的创建
export const folder = pgTable(
  folderMeta.name, 
  getTableFields(folderFields)
);

// ============ Config ============
export const folderConfig = getFieldConfigs(folderFields);

// ============ Schemas ============
export const folderZodSchemas = createZodSchemas(folder, folderFields);
