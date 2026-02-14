import { uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import type { FieldMap } from "../../utils/entity";
import {
  db_base_deleted_deletedById,
  db_base_deleted_deletedBy,
  db_base_deleted_deletedAt,
} from "@qiyu-allinai/i18n";

export const deletedSchema = {
  deletedById: {
    field: uuid('deleted_by_id'),
    comment: db_base_deleted_deletedById,
    config: { canExport: false, canImport: false }
  },
  deletedBy: {
    field: varchar('deleted_by', { length: 64 }),
    comment: db_base_deleted_deletedBy,
    config: { canExport: false, canImport: false }
  },
  deletedAt: {
    field: timestamp('deleted_at', { mode: 'string' }),
    comment: db_base_deleted_deletedAt,
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;
