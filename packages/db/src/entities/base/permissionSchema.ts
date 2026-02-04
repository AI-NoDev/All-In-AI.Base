import { boolean, jsonb } from "drizzle-orm/pg-core";
import type { FieldMap } from "../../utils/entity";
import { tBase } from "../../i18n";

export const permissionSchema = {
  isPublic: {
    field: boolean('is_public').notNull().default(false),
    comment: tBase.permission.isPublic(),
    config: {
      canExport: true,
      canImport: true,
      exportExcelColumnName: tBase.permission.isPublic(),
      importExcelColumnName: tBase.permission.isPublic(),
      cellType: "STRING" as const
    }
  },
  allowedUserIds: {
    field: jsonb('allowed_user_ids').$type<string[]>().default([]),
    comment: tBase.permission.allowedUserIds(),
    config: { canExport: false, canImport: false }
  },
  allowedRoleIds: {
    field: jsonb('allowed_role_ids').$type<string[]>().default([]),
    comment: tBase.permission.allowedRoleIds(),
    config: { canExport: false, canImport: false }
  },
  allowedDeptIds: {
    field: jsonb('allowed_dept_ids').$type<string[]>().default([]),
    comment: tBase.permission.allowedDeptIds(),
    config: { canExport: false, canImport: false }
  },
  allowSubDepts: {
    field: boolean('allow_sub_depts').notNull().default(false),
    comment: tBase.permission.allowSubDepts(),
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;
