import { pgTable, uuid } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';

const f = (field: string) => tSystem('userPost', field);

// ============ Fields ============
export const userPostFields = {
  userId: {
    field: uuid('user_id').notNull(),
    comment: f('userId'),
    config: { canExport: false, canImport: false }
  },
  postId: {
    field: uuid('post_id').notNull(),
    comment: f('postId'),
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

// ============ Meta ============
export const userPostMeta: EntityMeta = {
  name: 'system_user_post',
  displayName: tSystemMeta('userPost', 'displayName'),
  verboseName: tSystemMeta('userPost', 'verboseName'),
  verboseNamePlural: tSystemMeta('userPost', 'verboseNamePlural'),
  permissions: createPermissions('system_user_post'),
};

// ============ Table ============
export const userPost = pgTable(userPostMeta.name, getTableFields(userPostFields));

// ============ Config ============
export const userPostConfig = getFieldConfigs(userPostFields);

// ============ Schemas ============
export const userPostZodSchemas = createZodSchemas(userPost, userPostFields);
