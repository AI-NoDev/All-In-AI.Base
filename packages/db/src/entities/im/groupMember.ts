import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, timestamp, boolean, char, jsonb, primaryKey, index } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createTypeboxSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_im_groupMember_meta_displayName" as meta_displayName,
  "db_im_groupMember_meta_verboseName" as meta_verboseName,
  "db_im_groupMember_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_im_groupMember_conversationId" as f_conversationId,
  "db_im_groupMember_userId" as f_userId,
  "db_im_groupMember_nickname" as f_nickname,
  "db_im_groupMember_role" as f_role,
  "db_im_groupMember_invitedById" as f_invitedById,
  "db_im_groupMember_joinedAt" as f_joinedAt,
  "db_im_groupMember_isMuted" as f_isMuted,
  "db_im_groupMember_mutedUntil" as f_mutedUntil,
  "db_im_groupMember_extra" as f_extra,
} from '@qiyu-allinai/i18n';

// ============ Fields ============
const groupMemberFields = {
  conversationId: {
    field: uuid("conversation_id").notNull(),
    comment: f_conversationId,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_conversationId, importExcelColumnName: f_conversationId, cellType: "STRING" as const }
  },
  userId: {
    field: uuid("user_id").notNull(),
    comment: f_userId,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_userId, importExcelColumnName: f_userId, cellType: "STRING" as const }
  },
  nickname: {
    field: varchar("nickname", { length: 64 }),
    comment: f_nickname,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_nickname, importExcelColumnName: f_nickname, cellType: "STRING" as const }
  },
  role: {
    field: char("role", { length: 1 }).notNull().default("0"),
    comment: f_role,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_role, importExcelColumnName: f_role, cellType: "STRING" as const }
  },
  invitedById: {
    field: uuid("invited_by_id"),
    comment: f_invitedById,
    config: { canExport: false, canImport: false }
  },
  joinedAt: {
    field: timestamp("joined_at", { mode: 'string' }).notNull().default(sql`now()`),
    comment: f_joinedAt,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_joinedAt, cellType: "STRING" as const }
  },
  isMuted: {
    field: boolean("is_muted").notNull().default(false),
    comment: f_isMuted,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_isMuted, importExcelColumnName: f_isMuted, cellType: "STRING" as const }
  },
  mutedUntil: {
    field: timestamp("muted_until", { mode: 'string' }),
    comment: f_mutedUntil,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_mutedUntil, importExcelColumnName: f_mutedUntil, cellType: "STRING" as const }
  },
  extra: {
    field: jsonb("extra").$type<Record<string, unknown>>().default({}),
    comment: f_extra,
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

export { groupMemberFields };

// ============ Meta ============
export const groupMemberMeta: EntityMeta = {
  name: 'im_group_member',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('im_group_member'),
};

// ============ Table ============
export const groupMember = pgTable(
  groupMemberMeta.name, 
  getTableFields(groupMemberFields),
  (table) => [
    primaryKey({ columns: [table.conversationId, table.userId] }),
    index("idx_im_group_member_user").on(table.userId),
  ]
);

// ============ Config ============
export const groupMemberConfig = getFieldConfigs(groupMemberFields);

// ============ Schemas ============
export const groupMemberSchemas = createTypeboxSchemas(groupMember);

// ============ Types ============
export type GroupMemberSelect = typeof groupMember.$inferSelect;
export type GroupMemberInsert = typeof groupMember.$inferInsert;

// ============ Role Constants ============
export const GROUP_MEMBER_ROLES = {
  MEMBER: '0',
  ADMIN: '1',
  OWNER: '2',
} as const;
