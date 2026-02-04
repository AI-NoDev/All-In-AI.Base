import { randomUUID } from "crypto";
import { uuid } from "drizzle-orm/pg-core";
import type { FieldMap } from "../../utils/entity";
import { tBase } from "../../i18n";

export const pkSchema = {
  id: {
    field: uuid('id').primaryKey().$defaultFn(() => randomUUID()),
    comment: tBase.pk.id(),
    config: {
      canExport: true,
      canImport: false,
      exportExcelColumnName: tBase.pk.id(),
      cellType: "STRING" as const
    }
  }
} satisfies FieldMap;
