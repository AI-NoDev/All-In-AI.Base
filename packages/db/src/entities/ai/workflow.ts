import { pgTable, varchar, text, char, jsonb, integer } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createTypeboxSchemas,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_ai_workflow_meta_displayName as meta_displayName,
  db_ai_workflow_meta_verboseName as meta_verboseName,
  db_ai_workflow_meta_verboseNamePlural as meta_verboseNamePlural,
  db_ai_workflow_name as f_name,
  db_ai_workflow_description as f_description,
  db_ai_workflow_icon as f_icon,
  db_ai_workflow_graph as f_graph,
  db_ai_workflow_remark as f_remark,
  db_ai_workflow_status as f_status,
} from '@qiyu-allinai/i18n';
import { pkSchema, auditSchema } from '../base';

// ============ Constants ============
export const WORKFLOW_STATUS = {
  DRAFT: '0',      // 草稿
  PUBLISHED: '1',  // 已发布
  DISABLED: '2',   // 已禁用
} as const;

// ============ Types ============
// 工作流节点类型（参考 Dify/Coze）
export interface WorkflowNode {
  id: string;
  type: string;  // start, end, llm, code, condition, loop, http, tool, etc.
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

// 工作流边（连接）
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  data?: Record<string, unknown>;
}

// 工作流图定义
export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  viewport?: { x: number; y: number; zoom: number };
}

// ============ Fields ============
const workflowOwnFields = {
  name: {
    field: varchar("name", { length: 100 }).notNull(),
    comment: f_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_name, importExcelColumnName: f_name, cellType: "STRING" as const }
  },
  description: {
    field: text("description"),
    comment: f_description,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_description, importExcelColumnName: f_description, cellType: "TEXT" as const }
  },
  icon: {
    field: varchar("icon", { length: 64 }),
    comment: f_icon,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_icon, importExcelColumnName: f_icon, cellType: "STRING" as const }
  },
  // 工作流图定义（核心字段）
  graph: {
    field: jsonb("graph").$type<WorkflowGraph>().notNull().default({ nodes: [], edges: [] }),
    comment: f_graph,
    config: { canExport: false, canImport: false }
  },
  remark: {
    field: text("remark"),
    comment: f_remark,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_remark, importExcelColumnName: f_remark, cellType: "TEXT" as const }
  },
  status: {
    field: char('status', { length: 1 }).default(WORKFLOW_STATUS.DRAFT),
    comment: f_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_status, importExcelColumnName: f_status, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const workflowFields = mergeFields(pkSchema, auditSchema, workflowOwnFields);

// ============ Meta ============
export const workflowMeta: EntityMeta = {
  name: 'ai_workflow',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('ai_workflow'),
};

// ============ Table ============
export const workflow = pgTable(workflowMeta.name, getTableFields(workflowFields));

// ============ Config ============
export const workflowConfig = getFieldConfigs(workflowFields);

// ============ Schemas (TypeBox) ============
export const workflowSchemas = createTypeboxSchemas(workflow);

// ============ Types ============
export type WorkflowSelect = typeof workflow.$inferSelect;
export type WorkflowInsert = typeof workflow.$inferInsert;
