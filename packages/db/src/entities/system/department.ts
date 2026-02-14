import { pgTable, uuid, varchar, text, boolean, integer } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_system_department_meta_displayName,
  db_system_department_meta_verboseName,
  db_system_department_meta_verboseNamePlural,
  db_system_department_parentId,
  db_system_department_ancestors,
  db_system_department_name,
  db_system_department_orderNum,
  db_system_department_leader,
  db_system_department_phone,
  db_system_department_email,
  db_system_department_status,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

// ============ Fields ============
const departmentOwnFields = {
  parentId: {
    field: uuid("parent_id"),
    comment: db_system_department_parentId,
    config: { canExport: false, canImport: true, importExcelColumnName: db_system_department_parentId, cellType: "STRING" as const }
  },
  ancestors: {
    field: text("ancestors"),
    comment: db_system_department_ancestors,
    config: { canExport: false, canImport: false }
  },
  name: {
    field: varchar("name", { length: 50 }).notNull(),
    comment: db_system_department_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_department_name, importExcelColumnName: db_system_department_name, cellType: "STRING" as const }
  },
  orderNum: {
    field: integer("order_num").notNull().default(1),
    comment: db_system_department_orderNum,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_department_orderNum, importExcelColumnName: db_system_department_orderNum, cellType: "NUMERIC" as const }
  },
  leader: {
    field: varchar("leader", { length: 20 }),
    comment: db_system_department_leader,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_department_leader, importExcelColumnName: db_system_department_leader, cellType: "STRING" as const }
  },
  phone: {
    field: varchar("phone", { length: 11 }),
    comment: db_system_department_phone,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_department_phone, importExcelColumnName: db_system_department_phone, cellType: "STRING" as const }
  },
  email: {
    field: varchar("email", { length: 50 }),
    comment: db_system_department_email,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_department_email, importExcelColumnName: db_system_department_email, cellType: "STRING" as const }
  },
  status: {
    field: boolean("status").notNull().default(true),
    comment: db_system_department_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_department_status, importExcelColumnName: db_system_department_status, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const departmentFields = mergeFields(pkSchema, auditSchema, deletedSchema, departmentOwnFields);

// ============ Meta ============
export const departmentMeta: EntityMeta = {
  name: 'system_department',
  displayName: db_system_department_meta_displayName,
  verboseName: db_system_department_meta_verboseName,
  verboseNamePlural: db_system_department_meta_verboseNamePlural,
  permissions: createPermissions('system_department'),
};

// ============ Table ============
export const department = pgTable(departmentMeta.name, getTableFields(departmentFields));

// ============ Config ============
export const departmentConfig = getFieldConfigs(departmentFields);

// ============ Schemas ============
export const departmentZodSchemas = createZodSchemas(department, departmentFields);
