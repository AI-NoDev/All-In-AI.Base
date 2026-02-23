import { pgTable, uuid, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { 
  mergeFields, getTableFields, getFieldConfigs, createPermissions, createTypeboxSchemas,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_system_token_meta_displayName as meta_displayName,
  db_system_token_meta_verboseName as meta_verboseName,
  db_system_token_meta_verboseNamePlural as meta_verboseNamePlural,
  db_system_token_userId as f_userId,
  db_system_token_tokenType as f_jti,
  db_system_token_tokenValue as f_sub,
  db_system_token_issuedAt as f_iat,
  db_system_token_expiresAt as f_exp,
  db_system_token_scopes as f_scopes,
  db_system_token_isRevoked as f_isRevoked,
  db_system_token_revokedAt as f_revokedAt,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const tokenOwnFields = {
  userId: {
    field: uuid("user_id").notNull(),
    comment: f_userId,
    config: { canExport: false, canImport: false }
  },
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
  scopes: {
    field: jsonb("scopes").$type<string[]>().default([]),
    comment: f_scopes,
    config: { canExport: false, canImport: false }
  },
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

// ============ Schemas (TypeBox) ============
export const tokenSchemas = createTypeboxSchemas(token);

// ============ Types (从 Drizzle 推导) ============
export type TokenSelect = typeof token.$inferSelect;
export type TokenInsert = typeof token.$inferInsert;
