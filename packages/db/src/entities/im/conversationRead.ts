import { sql } from "drizzle-orm";
import { pgTable, uuid, bigint, timestamp, integer, primaryKey, index } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tIm, tImMeta } from '../../i18n';

const f = (field: string) => tIm('conversationRead', field);

// ============ Fields ============
const conversationReadFields = {
  conversationId: {
    field: uuid("conversation_id").notNull(),
    comment: f('conversationId'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('conversationId'), cellType: "STRING" as const }
  },
  userId: {
    field: uuid("user_id").notNull(),
    comment: f('userId'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('userId'), cellType: "STRING" as const }
  },
  lastReadSeq: {
    field: bigint("last_read_seq", { mode: "number" }).notNull().default(0),
    comment: f('lastReadSeq'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('lastReadSeq'), cellType: "NUMERIC" as const }
  },
  lastReadAt: {
    field: timestamp("last_read_at", { mode: 'string' }).notNull().default(sql`now()`),
    comment: f('lastReadAt'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('lastReadAt'), cellType: "STRING" as const }
  },
  unreadCount: {
    field: integer("unread_count").notNull().default(0),
    comment: f('unreadCount'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('unreadCount'), cellType: "NUMERIC" as const }
  },
} satisfies FieldMap;

export { conversationReadFields };

// ============ Meta ============
export const conversationReadMeta: EntityMeta = {
  name: 'im_conversation_read',
  displayName: tImMeta('conversationRead', 'displayName'),
  verboseName: tImMeta('conversationRead', 'verboseName'),
  verboseNamePlural: tImMeta('conversationRead', 'verboseNamePlural'),
  permissions: createPermissions('im_conversation_read'),
};

// ============ Table ============
export const conversationRead = pgTable(
  conversationReadMeta.name, 
  getTableFields(conversationReadFields),
  (table) => [
    primaryKey({ columns: [table.conversationId, table.userId] }),
    index("idx_im_conversation_read_user").on(table.userId),
  ]
);

// ============ Config ============
export const conversationReadConfig = getFieldConfigs(conversationReadFields);

// ============ Schemas ============
export const conversationReadZodSchemas = createZodSchemas(conversationRead, conversationReadFields);
