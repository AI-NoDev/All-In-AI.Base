import { sql } from "drizzle-orm";
import { pgTable, uuid, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_im_conversationHidden_meta_displayName" as meta_displayName,
  "db_im_conversationHidden_meta_verboseName" as meta_verboseName,
  "db_im_conversationHidden_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_im_conversationHidden_conversationId" as f_conversationId,
  "db_im_conversationHidden_userId" as f_userId,
  "db_im_conversationHidden_isHidden" as f_isHidden,
  "db_im_conversationHidden_hiddenAt" as f_hiddenAt,
} from '@qiyu-allinai/i18n';

// ============ Fields ============
// This table tracks hidden conversations per user
// When a user "deletes" a conversation, it's hidden until new messages arrive
const conversationHiddenFields = {
  conversationId: {
    field: uuid("conversation_id").notNull(),
    comment: f_conversationId,
    config: { canExport: false, canImport: false }
  },
  userId: {
    field: uuid("user_id").notNull(),
    comment: f_userId,
    config: { canExport: false, canImport: false }
  },
  isHidden: {
    field: boolean("is_hidden").notNull().default(true),
    comment: f_isHidden,
    config: { canExport: false, canImport: false }
  },
  hiddenAt: {
    field: timestamp("hidden_at", { mode: 'string' }).notNull().default(sql`now()`),
    comment: f_hiddenAt,
    config: { canExport: false, canImport: false }
  },
  createdAt: {
    field: timestamp('created_at', { mode: 'string' }).notNull().default(sql`now()`),
    comment: () => 'Created At',
    config: { canExport: false, canImport: false }
  },
  updatedAt: {
    field: timestamp('updated_at', { mode: 'string' }).notNull().default(sql`now()`),
    comment: () => 'Updated At',
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

export { conversationHiddenFields };

// ============ Meta ============
export const conversationHiddenMeta: EntityMeta = {
  name: 'im_conversation_hidden',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('im_conversation_hidden'),
};

// ============ Table ============
export const conversationHidden = pgTable(
  conversationHiddenMeta.name, 
  getTableFields(conversationHiddenFields),
  (table) => [
    primaryKey({ columns: [table.conversationId, table.userId] }),
  ]
);

// ============ Config ============
export const conversationHiddenConfig = getFieldConfigs(conversationHiddenFields);

// ============ Schemas ============
export const conversationHiddenZodSchemas = createZodSchemas(conversationHidden, conversationHiddenFields);
