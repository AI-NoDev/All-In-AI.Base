import { z } from 'zod';
import { eq, and, inArray, sql } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { resourcePermission, resourcePermissionZodSchemas } from '@qiyu-allinai/db/entities/knowledge';

type ResourcePermissionSelect = typeof resourcePermission.$inferSelect;
type ResourcePermissionInsert = typeof resourcePermission.$inferInsert;

// ============ Filter Schema ============
const resourcePermissionFilterSchema = z.object({
  resourceType: z.enum(['folder', 'file']).optional(),
  resourceId: z.uuid().optional(),
  resourceIds: z.array(z.uuid()).optional(),
  granteeType: z.enum(['user', 'role', 'dept']).optional(),
  granteeId: z.uuid().optional(),
  granteeIds: z.array(z.uuid()).optional(),
  permissionLevel: z.enum(['r', 'w', 'm']).optional(),
}).optional();

const paginationBodySchema = z.object({
  filter: resourcePermissionFilterSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const resourcePermissionGetByPagination = defineAction({
  meta: { name: 'knowledge.resourcePermission.getByPagination', displayName: '分页查询资源权限', description: '分页查询资源权限列表', tags: ['knowledge', 'resourcePermission'], method: 'POST', path: '/api/knowledge/resource-permission/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(resourcePermissionZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, offset, limit } = input;
    
    const conditions = [];
    
    if (filter) {
      if (filter.resourceType) conditions.push(eq(resourcePermission.resourceType, filter.resourceType));
      if (filter.resourceId) conditions.push(eq(resourcePermission.resourceId, filter.resourceId));
      if (filter.resourceIds?.length) conditions.push(inArray(resourcePermission.resourceId, filter.resourceIds));
      if (filter.granteeType) conditions.push(eq(resourcePermission.granteeType, filter.granteeType));
      if (filter.granteeId) conditions.push(eq(resourcePermission.granteeId, filter.granteeId));
      if (filter.granteeIds?.length) conditions.push(inArray(resourcePermission.granteeId, filter.granteeIds));
      if (filter.permissionLevel) conditions.push(eq(resourcePermission.permissionLevel, filter.permissionLevel));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const data = await db.select().from(resourcePermission)
      .where(whereClause)
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(resourcePermission).where(whereClause);
    return { data: data as ResourcePermissionSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

// Get permissions for a specific resource
export const resourcePermissionGetByResource = defineAction({
  meta: { name: 'knowledge.resourcePermission.getByResource', displayName: '获取资源权限', description: '获取指定资源的所有权限', tags: ['knowledge', 'resourcePermission'], method: 'GET', path: '/api/knowledge/resource-permission/resource/:resourceType/:resourceId' },
  schemas: {
    paramsSchema: z.object({ 
      resourceType: z.enum(['folder', 'file']),
      resourceId: z.uuid() 
    }),
    outputSchema: z.array(resourcePermissionZodSchemas.select),
  },
  execute: async (input, _context) => {
    const data = await db.select().from(resourcePermission)
      .where(and(
        eq(resourcePermission.resourceType, input.resourceType),
        eq(resourcePermission.resourceId, input.resourceId)
      ));
    return data as ResourcePermissionSelect[];
  },
});

// Batch set permissions for a resource (replace all existing)
export const resourcePermissionSetForResource = defineAction({
  meta: { name: 'knowledge.resourcePermission.setForResource', displayName: '设置资源权限', description: '批量设置资源权限（替换现有权限）', tags: ['knowledge', 'resourcePermission'], method: 'POST', path: '/api/knowledge/resource-permission/set' },
  schemas: {
    bodySchema: z.object({
      resourceType: z.enum(['folder', 'file']),
      resourceId: z.uuid(),
      permissions: z.array(z.object({
        granteeType: z.enum(['user', 'role', 'dept']),
        granteeId: z.uuid(),
        permissionLevel: z.enum(['r', 'w', 'm']),
      })),
    }),
    outputSchema: z.array(resourcePermissionZodSchemas.select),
  },
  execute: async (input, context) => {
    const { resourceType, resourceId, permissions } = input;
    
    // Delete existing permissions for this resource
    await db.delete(resourcePermission)
      .where(and(
        eq(resourcePermission.resourceType, resourceType),
        eq(resourcePermission.resourceId, resourceId)
      ));
    
    if (permissions.length === 0) {
      return [];
    }
    
    // Insert new permissions
    const insertData: ResourcePermissionInsert[] = permissions.map(p => ({
      resourceType,
      resourceId,
      granteeType: p.granteeType,
      granteeId: p.granteeId,
      permissionLevel: p.permissionLevel,
      createdById: context.currentUserId,
      createdBy: context.currentUserName,
      updatedById: context.currentUserId,
      updatedBy: context.currentUserName,
    }));
    
    const results = await db.insert(resourcePermission).values(insertData).returning();
    return results as ResourcePermissionSelect[];
  },
});

// Add single permission
export const resourcePermissionCreate = defineAction({
  meta: { name: 'knowledge.resourcePermission.create', displayName: '添加权限', description: '添加单个资源权限', tags: ['knowledge', 'resourcePermission'], method: 'POST', path: '/api/knowledge/resource-permission' },
  schemas: {
    bodySchema: z.object({ data: resourcePermissionZodSchemas.insert }),
    outputSchema: resourcePermissionZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(resourcePermission).values(input.data as ResourcePermissionInsert).returning();
    return result as ResourcePermissionSelect;
  },
});

// Delete permission by ID
export const resourcePermissionDeleteByPk = defineAction({
  meta: { name: 'knowledge.resourcePermission.deleteByPk', displayName: '删除权限', description: '根据ID删除权限', tags: ['knowledge', 'resourcePermission'], method: 'DELETE', path: '/api/knowledge/resource-permission/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    const result = await db.delete(resourcePermission).where(eq(resourcePermission.id, input.id)).returning();
    return result.length > 0;
  },
});

// Delete all permissions for a resource
export const resourcePermissionDeleteByResource = defineAction({
  meta: { name: 'knowledge.resourcePermission.deleteByResource', displayName: '删除资源所有权限', description: '删除指定资源的所有权限', tags: ['knowledge', 'resourcePermission'], method: 'DELETE', path: '/api/knowledge/resource-permission/resource/:resourceType/:resourceId' },
  schemas: {
    paramsSchema: z.object({ 
      resourceType: z.enum(['folder', 'file']),
      resourceId: z.uuid() 
    }),
    outputSchema: z.number(),
  },
  execute: async (input, _context) => {
    const result = await db.delete(resourcePermission)
      .where(and(
        eq(resourcePermission.resourceType, input.resourceType),
        eq(resourcePermission.resourceId, input.resourceId)
      ))
      .returning();
    return result.length;
  },
});

export const resourcePermissionGetSchema = defineAction({
  meta: { name: 'knowledge.resourcePermission.getSchema', ignoreTools: true, displayName: '获取资源权限Schema', description: '获取资源权限表的JSON Schema', tags: ['knowledge', 'resourcePermission'], method: 'GET', path: '/api/knowledge/resource-permission/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(resourcePermissionZodSchemas.select) as Record<string, unknown>;
  },
});

export const resourcePermissionActions = [
  resourcePermissionGetByPagination, 
  resourcePermissionGetByResource,
  resourcePermissionSetForResource,
  resourcePermissionCreate, 
  resourcePermissionDeleteByPk,
  resourcePermissionDeleteByResource,
  resourcePermissionGetSchema
];
