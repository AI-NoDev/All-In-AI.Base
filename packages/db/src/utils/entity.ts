import type { PgColumnBuilderBase, PgTableWithColumns } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-typebox';

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
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export function mergeFields<T extends FieldMap[]>(...fields: T): UnionToIntersection<T[number]> {
    return Object.assign({}, ...fields) as UnionToIntersection<T[number]>;
}

/**
 * 创建 TypeBox schemas (使用 drizzle-typebox)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createTypeboxSchemas<T extends PgTableWithColumns<any>>(table: T) {
    return {
        insert: createInsertSchema(table),
        select: createSelectSchema(table),
        update: createUpdateSchema(table),
    };
}
