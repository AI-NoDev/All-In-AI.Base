import { pgTable, uuid, varchar, text, char, boolean, integer, numeric } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions,
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
  // 能力支持
  "db_ai_model_supportTools" as f_supportTools,
  "db_ai_model_supportThinking" as f_supportThinking,
  "db_ai_model_supportPrefixCompletion" as f_supportPrefixCompletion,
  "db_ai_model_supportFIM" as f_supportFIM,
  "db_ai_model_supportJsonOutput" as f_supportJsonOutput,
  // 输入能力
  "db_ai_model_supportImageInput" as f_supportImageInput,
  "db_ai_model_supportVideoInput" as f_supportVideoInput,
  "db_ai_model_supportAudioInput" as f_supportAudioInput,
  // 输出能力
  "db_ai_model_supportImageOutput" as f_supportImageOutput,
  "db_ai_model_supportVideoOutput" as f_supportVideoOutput,
  "db_ai_model_supportAudioOutput" as f_supportAudioOutput,
  // Token 限制
  "db_ai_model_contextWindow" as f_contextWindow,
  "db_ai_model_maxInputTokens" as f_maxInputTokens,
  "db_ai_model_maxOutputTokens" as f_maxOutputTokens,
  "db_ai_model_maxThinkingTokens" as f_maxThinkingTokens,
  // 思考配置
  "db_ai_model_reasoningEffort" as f_reasoningEffort,
  // 成本
  "db_ai_model_inputPricePerMillion" as f_inputPricePerMillion,
  "db_ai_model_outputPricePerMillion" as f_outputPricePerMillion,
  "db_ai_model_cacheHitPricePerMillion" as f_cacheHitPricePerMillion,
  "db_ai_model_cacheMissPricePerMillion" as f_cacheMissPricePerMillion,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { createZodSchemas } from "../../types";

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
  // ============ 能力支持 ============
  supportTools: {
    field: boolean("support_tools").notNull().default(false),
    comment: f_supportTools,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_supportTools, importExcelColumnName: f_supportTools, cellType: "STRING" as const }
  },
  supportThinking: {
    field: boolean("support_thinking").notNull().default(false),
    comment: f_supportThinking,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_supportThinking, importExcelColumnName: f_supportThinking, cellType: "STRING" as const }
  },
  supportPrefixCompletion: {
    field: boolean("support_prefix_completion").notNull().default(false),
    comment: f_supportPrefixCompletion,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_supportPrefixCompletion, importExcelColumnName: f_supportPrefixCompletion, cellType: "STRING" as const }
  },
  supportFIM: {
    field: boolean("support_fim").notNull().default(false),
    comment: f_supportFIM,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_supportFIM, importExcelColumnName: f_supportFIM, cellType: "STRING" as const }
  },
  supportJsonOutput: {
    field: boolean("support_json_output").notNull().default(false),
    comment: f_supportJsonOutput,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_supportJsonOutput, importExcelColumnName: f_supportJsonOutput, cellType: "STRING" as const }
  },
  // ============ 输入能力 ============
  supportImageInput: {
    field: boolean("support_image_input").notNull().default(false),
    comment: f_supportImageInput,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_supportImageInput, importExcelColumnName: f_supportImageInput, cellType: "STRING" as const }
  },
  supportVideoInput: {
    field: boolean("support_video_input").notNull().default(false),
    comment: f_supportVideoInput,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_supportVideoInput, importExcelColumnName: f_supportVideoInput, cellType: "STRING" as const }
  },
  supportAudioInput: {
    field: boolean("support_audio_input").notNull().default(false),
    comment: f_supportAudioInput,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_supportAudioInput, importExcelColumnName: f_supportAudioInput, cellType: "STRING" as const }
  },
  // ============ 输出能力 ============
  supportImageOutput: {
    field: boolean("support_image_output").notNull().default(false),
    comment: f_supportImageOutput,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_supportImageOutput, importExcelColumnName: f_supportImageOutput, cellType: "STRING" as const }
  },
  supportVideoOutput: {
    field: boolean("support_video_output").notNull().default(false),
    comment: f_supportVideoOutput,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_supportVideoOutput, importExcelColumnName: f_supportVideoOutput, cellType: "STRING" as const }
  },
  supportAudioOutput: {
    field: boolean("support_audio_output").notNull().default(false),
    comment: f_supportAudioOutput,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_supportAudioOutput, importExcelColumnName: f_supportAudioOutput, cellType: "STRING" as const }
  },
  // ============ Token 限制 ============
  contextWindow: {
    field: integer("context_window"),
    comment: f_contextWindow,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_contextWindow, importExcelColumnName: f_contextWindow, cellType: "NUMERIC" as const }
  },
  maxInputTokens: {
    field: integer("max_input_tokens"),
    comment: f_maxInputTokens,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_maxInputTokens, importExcelColumnName: f_maxInputTokens, cellType: "NUMERIC" as const }
  },
  maxOutputTokens: {
    field: integer("max_output_tokens"),
    comment: f_maxOutputTokens,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_maxOutputTokens, importExcelColumnName: f_maxOutputTokens, cellType: "NUMERIC" as const }
  },
  maxThinkingTokens: {
    field: integer("max_thinking_tokens"),
    comment: f_maxThinkingTokens,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_maxThinkingTokens, importExcelColumnName: f_maxThinkingTokens, cellType: "NUMERIC" as const }
  },
  // ============ 思考配置 ============
  reasoningEffort: {
    field: varchar("reasoning_effort", { length: 16 }),
    comment: f_reasoningEffort,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_reasoningEffort, importExcelColumnName: f_reasoningEffort, cellType: "STRING" as const }
  },
  // ============ 成本 (元/百万Token) ============
  inputPricePerMillion: {
    field: numeric("input_price_per_million", { precision: 10, scale: 4 }),
    comment: f_inputPricePerMillion,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_inputPricePerMillion, importExcelColumnName: f_inputPricePerMillion, cellType: "NUMERIC" as const }
  },
  outputPricePerMillion: {
    field: numeric("output_price_per_million", { precision: 10, scale: 4 }),
    comment: f_outputPricePerMillion,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_outputPricePerMillion, importExcelColumnName: f_outputPricePerMillion, cellType: "NUMERIC" as const }
  },
  cacheHitPricePerMillion: {
    field: numeric("cache_hit_price_per_million", { precision: 10, scale: 4 }),
    comment: f_cacheHitPricePerMillion,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_cacheHitPricePerMillion, importExcelColumnName: f_cacheHitPricePerMillion, cellType: "NUMERIC" as const }
  },
  cacheMissPricePerMillion: {
    field: numeric("cache_miss_price_per_million", { precision: 10, scale: 4 }),
    comment: f_cacheMissPricePerMillion,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_cacheMissPricePerMillion, importExcelColumnName: f_cacheMissPricePerMillion, cellType: "NUMERIC" as const }
  },
} satisfies FieldMap;

export const modelFields = mergeFields(pkSchema, auditSchema, modelOwnFields);

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
export const modelZodSchemas = createZodSchemas(model, modelFields);
