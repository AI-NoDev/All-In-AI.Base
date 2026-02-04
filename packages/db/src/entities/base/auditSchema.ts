import { sql } from "drizzle-orm";
import { uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import type { FieldMap } from "../../utils/entity";
import { tBase } from "../../i18n";

export const auditSchema = {
  createdById: {
    field: uuid('created_by_id'),
    comment: tBase.audit.createdById(),
    config: { canExport: false, canImport: false }
  },
  createdBy: {
    field: varchar('created_by', { length: 64 }).notNull(),
    comment: tBase.audit.createdBy(),
    config: {
      canExport: true,
      canImport: false,
      exportExcelColumnName: tBase.audit.createdBy(),
      cellType: "STRING" as const
    }
  },
  createdAt: {
    field: timestamp('created_at', { mode: 'string' }).notNull().default(sql`now()`),
    comment: tBase.audit.createdAt(),
    config: {
      canExport: true,
      canImport: false,
      exportExcelColumnName: tBase.audit.createdAt(),
      cellType: "STRING" as const
    }
  },
  updatedById: {
    field: uuid('updated_by_id'),
    comment: tBase.audit.updatedById(),
    config: { canExport: false, canImport: false }
  },
  updatedBy: {
    field: varchar('updated_by', { length: 64 }).notNull(),
    comment: tBase.audit.updatedBy(),
    config: {
      canExport: true,
      canImport: false,
      exportExcelColumnName: tBase.audit.updatedBy(),
      cellType: "STRING" as const
    }
  },
  updatedAt: {
    field: timestamp('updated_at', { mode: 'string' }).notNull().default(sql`now()`),
    comment: tBase.audit.updatedAt(),
    config: {
      canExport: true,
      canImport: false,
      exportExcelColumnName: tBase.audit.updatedAt(),
      cellType: "STRING" as const
    }
  },
} satisfies FieldMap;
