import { boolean, jsonb } from "drizzle-orm/pg-core";
import type { FieldMap } from "../../utils/entity";
import {
  db_base_permission_isPublic,
  db_base_permission_allowedUserIds,
  db_base_permission_allowedRoleIds,
  db_base_permission_allowedDeptIds,
  db_base_permission_allowSubDepts,
} from "@qiyu-allinai/i18n";

export const permissionSchema = {
  isPublic: {
    field: boolean('is_public').notNull().default(false),
    comment: db_base_permission_isPublic,
    config: {
      canExport: true,
      canImport: true,
      exportExcelColumnName: db_base_permission_isPublic,
      importExcelColumnName: db_base_permission_isPublic,
      cellType: "STRING" as const
    }
  },
  allowedUserIds: {
    field: jsonb('allowed_user_ids').$type<string[]>().default([]),
    comment: db_base_permission_allowedUserIds,
    config: { canExport: false, canImport: false }
  },
  allowedRoleIds: {
    field: jsonb('allowed_role_ids').$type<string[]>().default([]),
    comment: db_base_permission_allowedRoleIds,
    config: { canExport: false, canImport: false }
  },
  allowedDeptIds: {
    field: jsonb('allowed_dept_ids').$type<string[]>().default([]),
    comment: db_base_permission_allowedDeptIds,
    config: { canExport: false, canImport: false }
  },
  allowSubDepts: {
    field: boolean('allow_sub_depts').notNull().default(false),
    comment: db_base_permission_allowSubDepts,
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;
