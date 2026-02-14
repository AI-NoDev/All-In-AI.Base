import { sql } from "drizzle-orm";
import { uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import type { FieldMap } from "../../utils/entity";
import {
  db_base_audit_createdById,
  db_base_audit_createdBy,
  db_base_audit_createdAt,
  db_base_audit_updatedById,
  db_base_audit_updatedBy,
  db_base_audit_updatedAt,
} from "@qiyu-allinai/i18n";

export const auditSchema = {
  createdById: {
    field: uuid('created_by_id'),
    comment: db_base_audit_createdById,
    config: { canExport: false, canImport: false }
  },
  createdBy: {
    field: varchar('created_by', { length: 64 }).notNull(),
    comment: db_base_audit_createdBy,
    config: {
      canExport: true,
      canImport: false,
      exportExcelColumnName: db_base_audit_createdBy,
      cellType: "STRING" as const
    }
  },
  createdAt: {
    field: timestamp('created_at', { mode: 'string' }).notNull().default(sql`now()`),
    comment: db_base_audit_createdAt,
    config: {
      canExport: true,
      canImport: false,
      exportExcelColumnName: db_base_audit_createdAt,
      cellType: "STRING" as const
    }
  },
  updatedById: {
    field: uuid('updated_by_id'),
    comment: db_base_audit_updatedById,
    config: { canExport: false, canImport: false }
  },
  updatedBy: {
    field: varchar('updated_by', { length: 64 }).notNull(),
    comment: db_base_audit_updatedBy,
    config: {
      canExport: true,
      canImport: false,
      exportExcelColumnName: db_base_audit_updatedBy,
      cellType: "STRING" as const
    }
  },
  updatedAt: {
    field: timestamp('updated_at', { mode: 'string' }).notNull().default(sql`now()`),
    comment: db_base_audit_updatedAt,
    config: {
      canExport: true,
      canImport: false,
      exportExcelColumnName: db_base_audit_updatedAt,
      cellType: "STRING" as const
    }
  },
} satisfies FieldMap;
