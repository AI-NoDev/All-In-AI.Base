import type { PgColumnBuilderBase, PgTableWithColumns } from 'drizzle-orm/pg-core';
import { 
  createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema
} from './factory';

// 翻译函数类型
export type TranslateFn = () => string;

export type FieldConfig = {
    canExport?: boolean;
    canImport?: boolean;
    exportExcelColumnName?: TranslateFn;
    importExcelColumnName?: TranslateFn;
    cellType?: 'NUMERIC' | 'STRING' | 'IMAGE' | 'TEXT';
};

export type FieldDef<T extends PgColumnBuilderBase = PgColumnBuilderBase> = {
    field: T;
    comment: TranslateFn;
    config?: FieldConfig;
};

export type FieldMap<K extends string = string> = Record<K, FieldDef>;

export type EntityPermissions = {
    read: string;    // 读取权限名称
    write: string;   // 写入权限名称
    manage: string;  // 管理权限名称
};

export type EntityMeta = {
    name: string;                    // pgTable 名称（不翻译）
    displayName: TranslateFn;        // 显示名称
    verboseName: TranslateFn;        // 单数名称
    verboseNamePlural: TranslateFn;  // 复数名称
    permissions: EntityPermissions;  // 权限名称
};

/**
 * 生成实体权限名称
 * @param tableName pgTable 名称，格式为 module_entity (如 system_user)
 */
export function createPermissions(tableName: string): EntityPermissions {
    const [module, ...rest] = tableName.split('_');
    const entity = rest.join('_');
    return {
        read: `${module}:${entity}:read`,
        write: `${module}:${entity}:write`,
        manage: `${module}:${entity}:manage`,
    };
}

/**
 * 从 FieldMap 中提取 pgTable 所需的字段定义
 */
export function getTableFields<T extends FieldMap>(fields: T): { [K in keyof T]: T[K]['field'] } {
    const result = {} as { [K in keyof T]: T[K]['field'] };
    for (const key in fields) {
        result[key] = fields[key]!.field;
    }
    return result;
}

/**
 * 从 FieldMap 中提取配置信息
 */
export function getFieldConfigs<T extends FieldMap>(fields: T): { [K in keyof T]: Omit<FieldConfig, 'exportExcelColumnName' | 'importExcelColumnName'> & { 
    comment: TranslateFn;
    exportExcelColumnName?: TranslateFn;
    importExcelColumnName?: TranslateFn;
} } {
    const result = {} as { [K in keyof T]: Omit<FieldConfig, 'exportExcelColumnName' | 'importExcelColumnName'> & { 
        comment: TranslateFn;
        exportExcelColumnName?: TranslateFn;
        importExcelColumnName?: TranslateFn;
    } };
    for (const key in fields) {
        const field = fields[key]!;
        result[key] = {
            comment: field.comment,
            ...field.config
        };
    }
    return result;
}

/**
 * 合并多个 FieldMap，保留类型信息
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export function mergeFields<T extends FieldMap[]>(...fields: T): UnionToIntersection<T[number]> {
    return Object.assign({}, ...fields) as UnionToIntersection<T[number]>;
}

/**
 * 创建带描述的 refinements 对象
 */
export function createDescribeRefinements<T extends FieldMap>(fields: T) {
    const refinements: Record<string, (schema: unknown) => unknown> = {};
    for (const key in fields) {
        const field = fields[key];
        if (field?.comment) {
            const comment = field.comment;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            refinements[key] = (schema: unknown) => (schema as any).describe(comment());
        }
    }
    return refinements;
}

/**
 * 创建 Zod schemas
 */
export function createZodSchemas<T extends PgTableWithColumns<any>>(table: T, fields?: FieldMap) {
    if (fields) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const refinements = createDescribeRefinements(fields) as any;
        return {
            insert: createInsertZodSchema(table, refinements),
            select: createSelectZodSchema(table, refinements),
            update: createUpdateZodSchema(table, refinements),
        };
    }
    return {
        insert: createInsertZodSchema(table),
        select: createSelectZodSchema(table),
        update: createUpdateZodSchema(table),
    };
}

