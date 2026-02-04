import { pgTable, uuid, varchar, text, char, boolean, integer, jsonb } from "drizzle-orm/pg-core";
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

const f = (field: string) => tAi('model', field);

// ============ Fields ============
const modelOwnFields = {
  providerId: {
    field: uuid("provider_id").notNull(),
    comment: f('providerId'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('providerId'), cellType: "STRING" as const }
  },
  name: {
    field: varchar("name", { length: 128 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  modelId: {
    field: varchar("model_id", { length: 128 }).notNull(),
    comment: f('modelId'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('modelId'), importExcelColumnName: f('modelId'), cellType: "STRING" as const }
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
  supportTools: {
    field: boolean("support_tools").notNull().default(false),
    comment: f('supportTools'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('supportTools'), importExcelColumnName: f('supportTools'), cellType: "STRING" as const }
  },
  maxTokens: {
    field: integer("max_tokens"),
    comment: f('maxTokens'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('maxTokens'), importExcelColumnName: f('maxTokens'), cellType: "NUMERIC" as const }
  },
  inputCapabilities: {
    field: jsonb("input_capabilities").$type<{
      text: boolean;
      image: boolean;
      file: boolean;
      audio: boolean;
      video: boolean;
    }>().default({ text: true, image: false, file: false, audio: false, video: false }),
    comment: f('inputCapabilities'),
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
    comment: f('outputCapabilities'),
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

export const modelFields = mergeFields(pkSchema, auditSchema, permissionSchema, modelOwnFields);

// ============ Meta ============
export const modelMeta: EntityMeta = {
  name: 'ai_model',
  displayName: tAiMeta('model', 'displayName'),
  verboseName: tAiMeta('model', 'verboseName'),
  verboseNamePlural: tAiMeta('model', 'verboseNamePlural'),
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
    allowedUserIds: z.array(z.uuid()).describe(modelFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).describe(modelFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).describe(modelFields.allowedDeptIds.comment()),
  }),
  select: createSelectZodSchema(model, {
    ...describeRefinements,
    allowedUserIds: z.array(z.uuid()).nullable().describe(modelFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).nullable().describe(modelFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).nullable().describe(modelFields.allowedDeptIds.comment()),
  }),
  update: createUpdateZodSchema(model, {
    ...describeRefinements,
    allowedUserIds: z.array(z.uuid()).optional().describe(modelFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).optional().describe(modelFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).optional().describe(modelFields.allowedDeptIds.comment()),
  }),
};
