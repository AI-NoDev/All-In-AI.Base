import { pgTable, uuid } from "drizzle-orm/pg-core";
import { 
  getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';

// ============ Fields ============
export const userPostFields = {
  userId: {
    field: uuid('user_id').notNull(),
    comment: () => '用户ID',
    config: { canExport: false, canImport: false }
  },
  postId: {
    field: uuid('post_id').notNull(),
    comment: () => '岗位ID',
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

// ============ Meta ============
export const userPostMeta: EntityMeta = {
  name: 'system_user_post',
  displayName: () => '用户岗位关联',
  verboseName: () => '用户岗位',
  verboseNamePlural: () => '用户岗位',
  permissions: createPermissions('system_user_post'),
};

// ============ Table ============
export const userPost = pgTable(userPostMeta.name, getTableFields(userPostFields));

// ============ Config ============
export const userPostConfig = getFieldConfigs(userPostFields);

// ============ Schemas ============
export const userPostZodSchemas = createZodSchemas(userPost, userPostFields);
