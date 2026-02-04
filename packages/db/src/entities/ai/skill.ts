import { pgTable, uuid, varchar, text, char, boolean, integer } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tAi, tAiMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { permissionSchema } from '../base/permissionSchema';
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from "../../types";
import { z } from "zod/v4";

const f = (field: string) => tAi('skill', field);

// ============ Fields ============
const skillOwnFields = {
  name: {
    field: varchar("name", { length: 64 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  parentId: {
    field: uuid("parent_id"),
    comment: f('parentId'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('parentId'), cellType: "STRING" as const }
  },
  folderId: {
    field: uuid("folder_id"),
    comment: f('folderId'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('folderId'), cellType: "STRING" as const }
  },
  isGroup: {
    field: boolean("is_group").notNull().default(false),
    comment: f('isGroup'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('isGroup'), importExcelColumnName: f('isGroup'), cellType: "STRING" as const }
  },
  orderNum: {
    field: integer("order_num").notNull().default(1),
    comment: f('orderNum'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('orderNum'), importExcelColumnName: f('orderNum'), cellType: "NUMERIC" as const }
  },
  icon: {
    field: varchar("icon", { length: 64 }),
    comment: f('icon'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('icon'), importExcelColumnName: f('icon'), cellType: "STRING" as const }
  },
  description: {
    field: text("description"),
    comment: f('description'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('description'), importExcelColumnName: f('description'), cellType: "TEXT" as const }
  },
  // 主文件 (指向知识库文件)
  fileId: {
    field: uuid("file_id"),
    comment: f('fileId'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('fileId'), cellType: "STRING" as const }
  },
  // 是否使用 A2A 协议（减少会话上下文）
  isA2a: {
    field: boolean("is_a2a").notNull().default(false),
    comment: f('isA2a'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('isA2a'), importExcelColumnName: f('isA2a'), cellType: "STRING" as const }
  },
  remark: {
    field: text("remark"),
    comment: f('remark'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('remark'), importExcelColumnName: f('remark'), cellType: "TEXT" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('status'), importExcelColumnName: f('status'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const skillFields = mergeFields(pkSchema, auditSchema, permissionSchema, skillOwnFields);

// ============ Meta ============
export const skillMeta: EntityMeta = {
  name: 'ai_skill',
  displayName: tAiMeta('skill', 'displayName'),
  verboseName: tAiMeta('skill', 'verboseName'),
  verboseNamePlural: tAiMeta('skill', 'verboseNamePlural'),
  permissions: createPermissions('ai_skill'),
};

// ============ Table ============
export const skill = pgTable(skillMeta.name, getTableFields(skillFields));

// ============ Config ============
export const skillConfig = getFieldConfigs(skillFields);

// ============ Schemas ============
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const describeRefinements = createDescribeRefinements(skillFields) as any;

export const skillZodSchemas = {
  insert: createInsertZodSchema(skill, {
    ...describeRefinements,
    allowedUserIds: z.array(z.uuid()).describe(skillFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).describe(skillFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).describe(skillFields.allowedDeptIds.comment()),
  }),
  select: createSelectZodSchema(skill, {
    ...describeRefinements,
    allowedUserIds: z.array(z.uuid()).nullable().describe(skillFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).nullable().describe(skillFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).nullable().describe(skillFields.allowedDeptIds.comment()),
  }),
  update: createUpdateZodSchema(skill, {
    ...describeRefinements,
    allowedUserIds: z.array(z.uuid()).optional().describe(skillFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).optional().describe(skillFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).optional().describe(skillFields.allowedDeptIds.comment()),
  }),
};
