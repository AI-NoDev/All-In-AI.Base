import { sql } from "drizzle-orm";
import { pgTable, uuid, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tIm, tImMeta } from '../../i18n';

const f = (field: string) => tIm('conversationHidden', field);

// ============ Fields ============
// This table tracks hidden conversations per user
// When a user "deletes" a conversation, it's hidden until new messages arrive
const conversationHiddenFields = {
  conversationId: {
    field: uuid("conversation_id").notNull(),
    comment: f('conversationId'),
    config: { canExport: false, canImport: false }
  },
  userId: {
    field: uuid("user_id").notNull(),
    comment: f('userId'),
    config: { canExport: false, canImport: false }
  },
  isHidden: {
    field: boolean("is_hidden").notNull().default(true),
    comment: f('isHidden'),
    config: { canExport: false, canImport: false }
  },
  hiddenAt: {
    field: timestamp("hidden_at", { mode: 'string' }).notNull().default(sql`now()`),
    comment: f('hiddenAt'),
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
  displayName: tImMeta('conversationHidden', 'displayName'),
  verboseName: tImMeta('conversationHidden', 'verboseName'),
  verboseNamePlural: tImMeta('conversationHidden', 'verboseNamePlural'),
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
