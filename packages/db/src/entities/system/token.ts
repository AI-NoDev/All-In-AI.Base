import { pgTable, uuid, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_system_token_meta_displayName" as meta_displayName,
  "db_system_token_meta_verboseName" as meta_verboseName,
  "db_system_token_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_system_token_userId" as f_userId,
  "db_system_token_name" as f_name,
  "db_system_token_description" as f_description,
  "db_system_token_tokenType" as f_jti,
  "db_system_token_tokenValue" as f_sub,
  "db_system_token_issuedAt" as f_iat,
  "db_system_token_expiresAt" as f_exp,
  "db_system_token_scopes" as f_scopes,
  "db_system_token_isRevoked" as f_isRevoked,
  "db_system_token_revokedAt" as f_revokedAt,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from "../../types";
import { z } from "zod/v4";

// ============ Fields ============
const tokenOwnFields = {
  // 授权人
  userId: {
    field: uuid("user_id").notNull(),
    comment: f_userId,
    config: { canExport: false, canImport: false }
  },
  
  // JWT 标准字段
  jti: {
    field: varchar("jti", { length: 64 }).notNull(),
    comment: f_jti,
    config: { canExport: false, canImport: false }
  },
  sub: {
    field: varchar("sub", { length: 128 }).notNull(),
    comment: f_sub,
    config: { canExport: false, canImport: false }
  },
  iat: {
    field: timestamp("iat", { mode: 'string' }).notNull().default(sql`now()`),
    comment: f_iat,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_iat, cellType: "STRING" as const }
  },
  exp: {
    field: timestamp("exp", { mode: 'string' }).notNull(),
    comment: f_exp,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_exp, cellType: "STRING" as const }
  },
  
  // 权限范围
  scopes: {
    field: jsonb("scopes").$type<string[]>().default([]),
    comment: f_scopes,
    config: { canExport: false, canImport: false }
  },
  
  // 状态
  isRevoked: {
    field: boolean("is_revoked").notNull().default(false),
    comment: f_isRevoked,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_isRevoked, cellType: "STRING" as const }
  },
  revokedAt: {
    field: timestamp("revoked_at", { mode: 'string' }),
    comment: f_revokedAt,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_revokedAt, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const tokenFields = mergeFields(pkSchema, auditSchema, tokenOwnFields);

// ============ Meta ============
export const tokenMeta: EntityMeta = {
  name: 'system_token',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
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
