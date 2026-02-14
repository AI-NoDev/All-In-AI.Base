import { pgTable, uuid, varchar, text, integer, timestamp, boolean, char, jsonb } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_im_conversation_meta_displayName" as meta_displayName,
  "db_im_conversation_meta_verboseName" as meta_verboseName,
  "db_im_conversation_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_im_conversation_type" as f_type,
  "db_im_conversation_name" as f_name,
  "db_im_conversation_avatar" as f_avatar,
  "db_im_conversation_ownerId" as f_ownerId,
  "db_im_conversation_lastMessageId" as f_lastMessageId,
  "db_im_conversation_lastMessageAt" as f_lastMessageAt,
  "db_im_conversation_memberCount" as f_memberCount,
  "db_im_conversation_maxMembers" as f_maxMembers,
  "db_im_conversation_isTop" as f_isTop,
  "db_im_conversation_isMuted" as f_isMuted,
  "db_im_conversation_announcement" as f_announcement,
  "db_im_conversation_extra" as f_extra,
  "db_im_conversation_status" as f_status,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

// ============ Fields ============
const conversationOwnFields = {
  type: {
    field: char("type", { length: 1 }).notNull().default("1"),
    comment: f_type,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_type, importExcelColumnName: f_type, cellType: "STRING" as const }
  },
  name: {
    field: varchar("name", { length: 128 }),
    comment: f_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_name, importExcelColumnName: f_name, cellType: "STRING" as const }
  },
  avatar: {
    field: varchar("avatar", { length: 512 }),
    comment: f_avatar,
    config: { canExport: false, canImport: false }
  },
  ownerId: {
    field: uuid("owner_id"),
    comment: f_ownerId,
    config: { canExport: false, canImport: false }
  },
  lastMessageId: {
    field: uuid("last_message_id"),
    comment: f_lastMessageId,
    config: { canExport: false, canImport: false }
  },
  lastMessageAt: {
    field: timestamp("last_message_at", { mode: 'string' }),
    comment: f_lastMessageAt,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_lastMessageAt, cellType: "STRING" as const }
  },
  memberCount: {
    field: integer("member_count").notNull().default(0),
    comment: f_memberCount,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_memberCount, cellType: "NUMERIC" as const }
  },
  maxMembers: {
    field: integer("max_members").default(500),
    comment: f_maxMembers,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_maxMembers, importExcelColumnName: f_maxMembers, cellType: "NUMERIC" as const }
  },
  isTop: {
    field: boolean("is_top").notNull().default(false),
    comment: f_isTop,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_isTop, importExcelColumnName: f_isTop, cellType: "STRING" as const }
  },
  isMuted: {
    field: boolean("is_muted").notNull().default(false),
    comment: f_isMuted,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_isMuted, importExcelColumnName: f_isMuted, cellType: "STRING" as const }
  },
  announcement: {
    field: text("announcement"),
    comment: f_announcement,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_announcement, importExcelColumnName: f_announcement, cellType: "TEXT" as const }
  },
  extra: {
    field: jsonb("extra").$type<Record<string, unknown>>().default({}),
    comment: f_extra,
    config: { canExport: false, canImport: false }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_status, importExcelColumnName: f_status, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const conversationFields = mergeFields(pkSchema, auditSchema, deletedSchema, conversationOwnFields);

// ============ Meta ============
export const conversationMeta: EntityMeta = {
  name: 'im_conversation',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('im_conversation'),
};

// ============ Table ============
export const conversation = pgTable(conversationMeta.name, getTableFields(conversationFields));

// ============ Config ============
export const conversationConfig = getFieldConfigs(conversationFields);

// ============ Schemas ============
export const conversationZodSchemas = createZodSchemas(conversation, conversationFields);
