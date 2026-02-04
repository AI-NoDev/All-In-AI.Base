import { uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import type { FieldMap } from "../../utils/entity";
import { tBase } from "../../i18n";

export const deletedSchema = {
  deletedById: {
    field: uuid('deleted_by_id'),
    comment: tBase.deleted.deletedById(),
    config: { canExport: false, canImport: false }
  },
  deletedBy: {
    field: varchar('deleted_by', { length: 64 }),
    comment: tBase.deleted.deletedBy(),
    config: { canExport: false, canImport: false }
  },
  deletedAt: {
    field: timestamp('deleted_at', { mode: 'string' }),
    comment: tBase.deleted.deletedAt(),
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;
