import { pgTable, uuid, varchar, text, char, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_ai_model_meta_displayName" as meta_displayName,
  "db_ai_model_meta_verboseName" as meta_verboseName,
  "db_ai_model_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_ai_model_providerId" as f_providerId,
  "db_ai_model_name" as f_name,
  "db_ai_model_modelId" as f_modelId,
  "db_ai_model_remark" as f_remark,
  "db_ai_model_status" as f_status,
  "db_ai_model_supportTools" as f_supportTools,
  "db_ai_model_maxTokens" as f_maxTokens,
  "db_ai_model_inputCapabilities" as f_inputCapabilities,
  "db_ai_model_outputCapabilities" as f_outputCapabilities,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { permissionSchema } from '../base/permissionSchema';
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from "../../types";
import { z } from "zod/v4";

// ============ Fields ============
const modelOwnFields = {
  providerId: {
    field: uuid("provider_id").notNull(),
    comment: f_providerId,
    config: { canExport: false, canImport: true, importExcelColumnName: f_providerId, cellType: "STRING" as const }
  },
  name: {
    field: varchar("name", { length: 128 }).notNull(),
    comment: f_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_name, importExcelColumnName: f_name, cellType: "STRING" as const }
  },
  modelId: {
    field: varchar("model_id", { length: 128 }).notNull(),
    comment: f_modelId,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_modelId, importExcelColumnName: f_modelId, cellType: "STRING" as const }
  },
  remark: {
    field: text("remark"),
    comment: f_remark,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_remark, importExcelColumnName: f_remark, cellType: "TEXT" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_status, importExcelColumnName: f_status, cellType: "STRING" as const }
  },
  supportTools: {
    field: boolean("support_tools").notNull().default(false),
    comment: f_supportTools,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_supportTools, importExcelColumnName: f_supportTools, cellType: "STRING" as const }
  },
  maxTokens: {
    field: integer("max_tokens"),
    comment: f_maxTokens,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_maxTokens, importExcelColumnName: f_maxTokens, cellType: "NUMERIC" as const }
  },
  inputCapabilities: {
    field: jsonb("input_capabilities").$type<{
      text: boolean;
      image: boolean;
      file: boolean;
      audio: boolean;
      video: boolean;
    }>().default({ text: true, image: false, file: false, audio: false, video: false }),
    comment: f_inputCapabilities,
    config: { canExport: false, canImport: false }
  },
  outputCapabilities: {
    field: jsonb("output_capabilities").$type<{
      text: boolean;
      image: boolean;
      file: boolean;
      audio: boolean;
      video: boolean;
    }>().default({ text: true, image: false, file: false, audio: false, video: false }),
    comment: f_outputCapabilities,
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

export const modelFields = mergeFields(pkSchema, auditSchema, permissionSchema, modelOwnFields);

// ============ Meta ============
export const modelMeta: EntityMeta = {
  name: 'ai_model',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('ai_model'),
};

// ============ Table ============
export const model = pgTable(modelMeta.name, getTableFields(modelFields));

// ============ Config ============
export const modelConfig = getFieldConfigs(modelFields);

// ============ Schemas ============
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const describeRefinements = createDescribeRefinements(modelFields) as any;

export const modelZodSchemas = {
  insert: createInsertZodSchema(model, {
    ...describeRefinements,
    allowedUserIds: z.array(z.string()).describe(modelFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.string()).describe(modelFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.string()).describe(modelFields.allowedDeptIds.comment()),
  }),
  select: createSelectZodSchema(model, {
    ...describeRefinements,
    allowedUserIds: z.array(z.string()).nullable().describe(modelFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.string()).nullable().describe(modelFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.string()).nullable().describe(modelFields.allowedDeptIds.comment()),
  }),
  update: createUpdateZodSchema(model, {
    ...describeRefinements,
    allowedUserIds: z.array(z.string()).optional().describe(modelFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.string()).optional().describe(modelFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.string()).optional().describe(modelFields.allowedDeptIds.comment()),
  }),
};
