import { pgTable, uuid, varchar, char, uniqueIndex } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tKnowledge, tKnowledgeMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

const f = (field: string) => tKnowledge('resourcePermission', field);

// Permission levels:
// 'r' = read only
// 'w' = read + write (edit, rename, move)
// 'm' = read + write + manage (delete, set permissions)

// ============ Fields ============
const resourcePermissionOwnFields = {
  resourceType: {
    field: varchar("resource_type", { length: 16 }).notNull(),
    comment: f('resourceType'), // 'folder' | 'file'
    config: { canExport: true, canImport: true, exportExcelColumnName: f('resourceType'), importExcelColumnName: f('resourceType'), cellType: "STRING" as const }
  },
  resourceId: {
    field: uuid("resource_id").notNull(),
    comment: f('resourceId'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('resourceId'), importExcelColumnName: f('resourceId'), cellType: "STRING" as const }
  },
  granteeType: {
    field: varchar("grantee_type", { length: 16 }).notNull(),
    comment: f('granteeType'), // 'user' | 'role' | 'dept'
    config: { canExport: true, canImport: true, exportExcelColumnName: f('granteeType'), importExcelColumnName: f('granteeType'), cellType: "STRING" as const }
  },
  granteeId: {
    field: uuid("grantee_id").notNull(),
    comment: f('granteeId'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('granteeId'), importExcelColumnName: f('granteeId'), cellType: "STRING" as const }
  },
  permissionLevel: {
    field: char("permission_level", { length: 1 }).notNull().default('r'),
    comment: f('permissionLevel'), // 'r' = read, 'w' = write, 'm' = manage
    config: { canExport: true, canImport: true, exportExcelColumnName: f('permissionLevel'), importExcelColumnName: f('permissionLevel'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const resourcePermissionFields = mergeFields(pkSchema, auditSchema, resourcePermissionOwnFields);

// ============ Meta ============
export const resourcePermissionMeta: EntityMeta = {
  name: 'knowledge_resource_permission',
  displayName: tKnowledgeMeta('resourcePermission', 'displayName'),
  verboseName: tKnowledgeMeta('resourcePermission', 'verboseName'),
  verboseNamePlural: tKnowledgeMeta('resourcePermission', 'verboseNamePlural'),
  permissions: createPermissions('knowledge_resource_permission'),
};

// ============ Table ============
export const resourcePermission = pgTable(
  resourcePermissionMeta.name, 
  getTableFields(resourcePermissionFields),
  (table) => [
    // Unique constraint: one permission per resource + grantee combination
    uniqueIndex('resource_permission_unique_idx').on(
      table.resourceType,
      table.resourceId,
      table.granteeType,
      table.granteeId
    ),
  ]
);

// ============ Config ============
export const resourcePermissionConfig = getFieldConfigs(resourcePermissionFields);

// ============ Schemas ============
export const resourcePermissionZodSchemas = createZodSchemas(resourcePermission, resourcePermissionFields);
