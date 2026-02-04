import { pgTable, uuid, varchar, text, integer, timestamp, boolean, char, jsonb } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tIm, tImMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

const f = (field: string) => tIm('conversation', field);

// ============ Fields ============
const conversationOwnFields = {
  type: {
    field: char("type", { length: 1 }).notNull().default("1"),
    comment: f('type'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('type'), importExcelColumnName: f('type'), cellType: "STRING" as const }
  },
  name: {
    field: varchar("name", { length: 128 }),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  avatar: {
    field: varchar("avatar", { length: 512 }),
    comment: f('avatar'),
    config: { canExport: false, canImport: false }
  },
  ownerId: {
    field: uuid("owner_id"),
    comment: f('ownerId'),
    config: { canExport: false, canImport: false }
  },
  lastMessageId: {
    field: uuid("last_message_id"),
    comment: f('lastMessageId'),
    config: { canExport: false, canImport: false }
  },
  lastMessageAt: {
    field: timestamp("last_message_at", { mode: 'string' }),
    comment: f('lastMessageAt'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('lastMessageAt'), cellType: "STRING" as const }
  },
  memberCount: {
    field: integer("member_count").notNull().default(0),
    comment: f('memberCount'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('memberCount'), cellType: "NUMERIC" as const }
  },
  maxMembers: {
    field: integer("max_members").default(500),
    comment: f('maxMembers'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('maxMembers'), importExcelColumnName: f('maxMembers'), cellType: "NUMERIC" as const }
  },
  isTop: {
    field: boolean("is_top").notNull().default(false),
    comment: f('isTop'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('isTop'), importExcelColumnName: f('isTop'), cellType: "STRING" as const }
  },
  isMuted: {
    field: boolean("is_muted").notNull().default(false),
    comment: f('isMuted'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('isMuted'), importExcelColumnName: f('isMuted'), cellType: "STRING" as const }
  },
  announcement: {
    field: text("announcement"),
    comment: f('announcement'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('announcement'), importExcelColumnName: f('announcement'), cellType: "TEXT" as const }
  },
  extra: {
    field: jsonb("extra").$type<Record<string, unknown>>().default({}),
    comment: f('extra'),
    config: { canExport: false, canImport: false }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('status'), importExcelColumnName: f('status'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const conversationFields = mergeFields(pkSchema, auditSchema, deletedSchema, conversationOwnFields);

// ============ Meta ============
export const conversationMeta: EntityMeta = {
  name: 'im_conversation',
  displayName: tImMeta('conversation', 'displayName'),
  verboseName: tImMeta('conversation', 'verboseName'),
  verboseNamePlural: tImMeta('conversation', 'verboseNamePlural'),
  permissions: createPermissions('im_conversation'),
};

// ============ Table ============
export const conversation = pgTable(conversationMeta.name, getTableFields(conversationFields));

// ============ Config ============
export const conversationConfig = getFieldConfigs(conversationFields);

// ============ Schemas ============
export const conversationZodSchemas = createZodSchemas(conversation, conversationFields);
