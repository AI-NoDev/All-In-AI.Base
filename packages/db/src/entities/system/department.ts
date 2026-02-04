import { pgTable, uuid, varchar, text, boolean, integer } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

const f = (field: string) => tSystem('department', field);

// ============ Fields ============
const departmentOwnFields = {
  parentId: {
    field: uuid("parent_id"),
    comment: f('parentId'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('parentId'), cellType: "STRING" as const }
  },
  ancestors: {
    field: text("ancestors"),
    comment: f('ancestors'),
    config: { canExport: false, canImport: false }
  },
  name: {
    field: varchar("name", { length: 50 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  orderNum: {
    field: integer("order_num").notNull().default(1),
    comment: f('orderNum'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('orderNum'), importExcelColumnName: f('orderNum'), cellType: "NUMERIC" as const }
  },
  leader: {
    field: varchar("leader", { length: 20 }),
    comment: f('leader'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('leader'), importExcelColumnName: f('leader'), cellType: "STRING" as const }
  },
  phone: {
    field: varchar("phone", { length: 11 }),
    comment: f('phone'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('phone'), importExcelColumnName: f('phone'), cellType: "STRING" as const }
  },
  email: {
    field: varchar("email", { length: 50 }),
    comment: f('email'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('email'), importExcelColumnName: f('email'), cellType: "STRING" as const }
  },
  status: {
    field: boolean("status").notNull().default(true),
    comment: f('status'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('status'), importExcelColumnName: f('status'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const departmentFields = mergeFields(pkSchema, auditSchema, deletedSchema, departmentOwnFields);

// ============ Meta ============
export const departmentMeta: EntityMeta = {
  name: 'system_department',
  displayName: tSystemMeta('department', 'displayName'),
  verboseName: tSystemMeta('department', 'verboseName'),
  verboseNamePlural: tSystemMeta('department', 'verboseNamePlural'),
  permissions: createPermissions('system_department'),
};

// ============ Table ============
export const department = pgTable(departmentMeta.name, getTableFields(departmentFields));

// ============ Config ============
export const departmentConfig = getFieldConfigs(departmentFields);

// ============ Schemas ============
export const departmentZodSchemas = createZodSchemas(department, departmentFields);

