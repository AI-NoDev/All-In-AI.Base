import { pgTable, uuid, varchar, text, integer, boolean } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tKnowledge, tKnowledgeMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

const f = (field: string) => tKnowledge('folder', field);

// ============ Fields ============
const folderOwnFields = {
  parentId: {
    field: uuid("parent_id"),
    comment: f('parentId'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('parentId'), cellType: "STRING" as const }
  },
  name: {
    field: varchar("name", { length: 255 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  path: {
    field: text("path").notNull(),
    comment: f('path'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('path'), cellType: "STRING" as const }
  },
  description: {
    field: text("description"),
    comment: f('description'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('description'), importExcelColumnName: f('description'), cellType: "TEXT" as const }
  },
  icon: {
    field: varchar("icon", { length: 64 }),
    comment: f('icon'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('icon'), importExcelColumnName: f('icon'), cellType: "STRING" as const }
  },
  color: {
    field: varchar("color", { length: 32 }),
    comment: f('color'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('color'), importExcelColumnName: f('color'), cellType: "STRING" as const }
  },
  orderNum: {
    field: integer("order_num").notNull().default(0),
    comment: f('orderNum'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('orderNum'), importExcelColumnName: f('orderNum'), cellType: "NUMERIC" as const }
  },
  isPublic: {
    field: boolean("is_public").notNull().default(false),
    comment: f('isPublic'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('isPublic'), importExcelColumnName: f('isPublic'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const folderFields = mergeFields(pkSchema, auditSchema, deletedSchema, folderOwnFields);

// ============ Meta ============
export const folderMeta: EntityMeta = {
  name: 'knowledge_folder',
  displayName: tKnowledgeMeta('folder', 'displayName'),
  verboseName: tKnowledgeMeta('folder', 'verboseName'),
  verboseNamePlural: tKnowledgeMeta('folder', 'verboseNamePlural'),
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
