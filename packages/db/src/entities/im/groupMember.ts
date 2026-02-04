import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, timestamp, boolean, char, jsonb, primaryKey, index } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tIm, tImMeta } from '../../i18n';

const f = (field: string) => tIm('groupMember', field);

// ============ Fields ============
const groupMemberFields = {
  conversationId: {
    field: uuid("conversation_id").notNull(),
    comment: f('conversationId'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('conversationId'), importExcelColumnName: f('conversationId'), cellType: "STRING" as const }
  },
  userId: {
    field: uuid("user_id").notNull(),
    comment: f('userId'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('userId'), importExcelColumnName: f('userId'), cellType: "STRING" as const }
  },
  nickname: {
    field: varchar("nickname", { length: 64 }),
    comment: f('nickname'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('nickname'), importExcelColumnName: f('nickname'), cellType: "STRING" as const }
  },
  role: {
    field: char("role", { length: 1 }).notNull().default("0"),
    comment: f('role'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('role'), importExcelColumnName: f('role'), cellType: "STRING" as const }
  },
  invitedById: {
    field: uuid("invited_by_id"),
    comment: f('invitedById'),
    config: { canExport: false, canImport: false }
  },
  joinedAt: {
    field: timestamp("joined_at", { mode: 'string' }).notNull().default(sql`now()`),
    comment: f('joinedAt'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('joinedAt'), cellType: "STRING" as const }
  },
  isMuted: {
    field: boolean("is_muted").notNull().default(false),
    comment: f('isMuted'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('isMuted'), importExcelColumnName: f('isMuted'), cellType: "STRING" as const }
  },
  mutedUntil: {
    field: timestamp("muted_until", { mode: 'string' }),
    comment: f('mutedUntil'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('mutedUntil'), importExcelColumnName: f('mutedUntil'), cellType: "STRING" as const }
  },
  extra: {
    field: jsonb("extra").$type<Record<string, unknown>>().default({}),
    comment: f('extra'),
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

export { groupMemberFields };

// ============ Meta ============
export const groupMemberMeta: EntityMeta = {
  name: 'im_group_member',
  displayName: tImMeta('groupMember', 'displayName'),
  verboseName: tImMeta('groupMember', 'verboseName'),
  verboseNamePlural: tImMeta('groupMember', 'verboseNamePlural'),
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
export const groupMemberZodSchemas = createZodSchemas(groupMember, groupMemberFields);

// ============ Role Constants ============
export const GROUP_MEMBER_ROLES = {
  MEMBER: '0',
  ADMIN: '1',
  OWNER: '2',
} as const;
