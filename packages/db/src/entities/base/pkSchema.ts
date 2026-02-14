import { randomUUID } from "crypto";
import { uuid } from "drizzle-orm/pg-core";
import type { FieldMap } from "../../utils/entity";
import { db_base_pk_id } from "@qiyu-allinai/i18n";

export const pkSchema = {
  id: {
    field: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
    comment: db_base_pk_id,
    config: {
      canExport: true,
      canImport: false,
      exportExcelColumnName: db_base_pk_id,
      cellType: "STRING" as const
    }
  }
} satisfies FieldMap;
