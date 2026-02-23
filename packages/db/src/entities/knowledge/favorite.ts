import { pgTable, uuid, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createTypeboxSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const favoriteOwnFields = {
  userId: {
    field: uuid("user_id").notNull(),
    comment: () => '用户ID',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '用户ID', importExcelColumnName: () => '用户ID', cellType: "STRING" as const }
  },
  resourceType: {
    field: varchar("resource_type", { length: 16 }).notNull(),
    comment: () => '资源类型', // 'folder' | 'file'
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '资源类型', importExcelColumnName: () => '资源类型', cellType: "STRING" as const }
  },
  resourceId: {
    field: uuid("resource_id").notNull(),
    comment: () => '资源ID',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '资源ID', importExcelColumnName: () => '资源ID', cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const favoriteFields = mergeFields(pkSchema, auditSchema, favoriteOwnFields);

// ============ Meta ============
export const favoriteMeta: EntityMeta = {
  name: 'knowledge_favorite',
  displayName: () => '收藏',
  verboseName: () => '收藏',
  verboseNamePlural: () => '收藏列表',
  permissions: createPermissions('knowledge_favorite'),
};

// ============ Table ============
export const favorite = pgTable(
  favoriteMeta.name, 
  getTableFields(favoriteFields),
  (table) => [
    // Unique constraint: one favorite per user + resource combination
    uniqueIndex('favorite_unique_idx').on(
      table.userId,
      table.resourceType,
      table.resourceId
    ),
  ]
);

// ============ Config ============
export const favoriteConfig = getFieldConfigs(favoriteFields);

// ============ Schemas ============
export const favoriteSchemas = createTypeboxSchemas(favorite);

// ============ 类型导出 ============
export type FavoriteSelect = typeof favorite.$inferSelect;
export type FavoriteInsert = typeof favorite.$inferInsert;
