import { pgTable, uuid, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from "../../types";
import { z } from "zod/v4";

const f = (field: string) => tSystem('token', field);

// ============ Fields ============
const tokenOwnFields = {
  // 授权人
  userId: {
    field: uuid("user_id").notNull(),
    comment: f('userId'),
    config: { canExport: false, canImport: false }
  },
  
  // JWT 标准字段
  jti: {
    field: varchar("jti", { length: 64 }).notNull(),
    comment: f('jti'),
    config: { canExport: false, canImport: false }
  },
  sub: {
    field: varchar("sub", { length: 128 }).notNull(),
    comment: f('sub'),
    config: { canExport: false, canImport: false }
  },
  iat: {
    field: timestamp("iat", { mode: 'string' }).notNull().default(sql`now()`),
    comment: f('iat'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('iat'), cellType: "STRING" as const }
  },
  exp: {
    field: timestamp("exp", { mode: 'string' }).notNull(),
    comment: f('exp'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('exp'), cellType: "STRING" as const }
  },
  
  // 权限范围
  scopes: {
    field: jsonb("scopes").$type<string[]>().default([]),
    comment: f('scopes'),
    config: { canExport: false, canImport: false }
  },
  
  // 状态
  isRevoked: {
    field: boolean("is_revoked").notNull().default(false),
    comment: f('isRevoked'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('isRevoked'), cellType: "STRING" as const }
  },
  revokedAt: {
    field: timestamp("revoked_at", { mode: 'string' }),
    comment: f('revokedAt'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('revokedAt'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const tokenFields = mergeFields(pkSchema, auditSchema, tokenOwnFields);

// ============ Meta ============
export const tokenMeta: EntityMeta = {
  name: 'system_token',
  displayName: tSystemMeta('token', 'displayName'),
  verboseName: tSystemMeta('token', 'verboseName'),
  verboseNamePlural: tSystemMeta('token', 'verboseNamePlural'),
  permissions: createPermissions('system_token'),
};

// ============ Table ============
export const token = pgTable(tokenMeta.name, getTableFields(tokenFields));

// ============ Config ============
export const tokenConfig = getFieldConfigs(tokenFields);

// ============ Schemas ============
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const describeRefinements = createDescribeRefinements(tokenFields) as any;

export const tokenZodSchemas = {
  insert: createInsertZodSchema(token, {
    ...describeRefinements,
    scopes: z.array(z.string()).describe(tokenFields.scopes.comment()),
  }),
  select: createSelectZodSchema(token, {
    ...describeRefinements,
    scopes: z.array(z.string()).nullable().describe(tokenFields.scopes.comment()),
  }),
  update: createUpdateZodSchema(token, {
    ...describeRefinements,
    scopes: z.array(z.string()).optional().describe(tokenFields.scopes.comment()),
  }),
};
