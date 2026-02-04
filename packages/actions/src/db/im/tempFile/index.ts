import { z } from 'zod';
import { eq, and, asc, desc, inArray, gte, lte, lt, sql } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { tempFile, tempFileZodSchemas } from '@qiyu-allinai/db/entities/im';
import { uploadFile, getPresignedDownloadUrl, DEFAULT_BUCKET } from '../../../files/s3Client';

type TempFileSelect = typeof tempFile.$inferSelect;
type TempFileInsert = typeof tempFile.$inferInsert;

// ============ Filter Schema ============
const tempFileFilterSchema = z.object({
  ids: z.array(z.uuid()).optional(),
  conversationId: z.uuid().optional(),
  conversationIds: z.array(z.uuid()).optional(),
  messageId: z.uuid().optional(),
  messageIds: z.array(z.uuid()).optional(),
  mimeType: z.string().optional(),
  status: z.string().optional(),
  expiresAtBefore: z.iso.datetime().optional(),
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['createdAt', 'expiresAt', 'size']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: tempFileFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const tempFileGetByPagination = defineAction({
  meta: { name: 'im.tempFile.getByPagination', displayName: '分页查询临时文件', description: '分页查询临时文件列表', tags: ['im', 'tempFile'], method: 'POST', path: '/api/im/temp-file/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(tempFileZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];
    
    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(tempFile.id, filter.ids));
      if (filter.conversationId) conditions.push(eq(tempFile.conversationId, filter.conversationId));
      if (filter.conversationIds?.length) conditions.push(inArray(tempFile.conversationId, filter.conversationIds));
      if (filter.messageId) conditions.push(eq(tempFile.messageId, filter.messageId));
      if (filter.messageIds?.length) conditions.push(inArray(tempFile.messageId, filter.messageIds));
      if (filter.mimeType) conditions.push(eq(tempFile.mimeType, filter.mimeType));
      if (filter.status) conditions.push(eq(tempFile.status, filter.status));
      if (filter.expiresAtBefore) conditions.push(lt(tempFile.expiresAt, filter.expiresAtBefore));
      if (filter.createdAtStart) conditions.push(gte(tempFile.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(tempFile.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortField = sort?.field ?? 'createdAt';
    const sortColumn = tempFile[sortField as keyof typeof tempFile.$inferSelect];
    
    const data = await db.select().from(tempFile).where(whereClause).orderBy(orderFn(sortColumn)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(tempFile).where(whereClause);
    return { data: data as TempFileSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const tempFileGetByPk = defineAction({
  meta: { name: 'im.tempFile.getByPk', displayName: '根据ID查询临时文件', description: '根据主键ID查询单个临时文件', tags: ['im', 'tempFile'], method: 'GET', path: '/api/im/temp-file/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: tempFileZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(tempFile).where(eq(tempFile.id, input.id)).limit(1);
    return (result as TempFileSelect) ?? null;
  },
});

export const tempFileCreate = defineAction({
  meta: { name: 'im.tempFile.create', displayName: '创建临时文件', description: '创建单个临时文件记录', tags: ['im', 'tempFile'], method: 'POST', path: '/api/im/temp-file' },
  schemas: {
    bodySchema: z.object({ data: tempFileZodSchemas.insert }),
    outputSchema: tempFileZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(tempFile).values(input.data as TempFileInsert).returning();
    return result as TempFileSelect;
  },
});

export const tempFileUpdate = defineAction({
  meta: { name: 'im.tempFile.update', displayName: '更新临时文件', description: '根据ID更新临时文件', tags: ['im', 'tempFile'], method: 'PUT', path: '/api/im/temp-file/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    bodySchema: z.object({ data: tempFileZodSchemas.update }),
    outputSchema: tempFileZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(tempFile).set(input.data as Partial<TempFileInsert>).where(eq(tempFile.id, input.id)).returning();
    return result as TempFileSelect;
  },
});

export const tempFileDeleteByPk = defineAction({
  meta: { name: 'im.tempFile.deleteByPk', displayName: '删除临时文件', description: '根据ID删除临时文件', tags: ['im', 'tempFile'], method: 'DELETE', path: '/api/im/temp-file/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    const [result] = await db.delete(tempFile).where(eq(tempFile.id, input.id)).returning();
    return !!result;
  },
});

export const tempFileCleanExpired = defineAction({
  meta: { name: 'im.tempFile.cleanExpired', displayName: '清理过期文件', description: '清理所有过期的临时文件', tags: ['im', 'tempFile'], method: 'DELETE', path: '/api/im/temp-file/clean-expired' },
  schemas: {
    outputSchema: z.number(),
  },
  execute: async (_input, _context) => {
    const now = new Date().toISOString();
    const result = await db.delete(tempFile).where(lt(tempFile.expiresAt, now)).returning();
    return result.length;
  },
});


export const tempFileGetSchema = defineAction({
  meta: { name: 'im.tempFile.getSchema', ignoreTools: true, displayName: '获取临时文件Schema', description: '获取临时文件表的JSON Schema', tags: ['im', 'tempFile'], method: 'GET', path: '/api/im/temp-file/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(tempFileZodSchemas.select) as Record<string, unknown>;
  },
});

// Upload file to S3 and create temp file record
export const tempFileUpload = defineAction({
  meta: { name: 'im.tempFile.upload', displayName: '上传临时文件', description: '上传文件到S3并创建临时文件记录', tags: ['im', 'tempFile'], method: 'POST', path: '/api/im/temp-file/upload' },
  schemas: {
    bodySchema: z.object({
      conversationId: z.uuid().optional(),
      fileName: z.string(),
      mimeType: z.string(),
      base64Data: z.string(),
    }),
    outputSchema: z.object({
      id: z.uuid(),
      name: z.string(),
      originalName: z.string(),
      extension: z.string().nullable(),
      mimeType: z.string().nullable(),
      size: z.number(),
      storageKey: z.string(),
      downloadUrl: z.string(),
    }),
  },
  execute: async (input, context) => {
    const { conversationId, fileName, mimeType, base64Data } = input;
    const userId = context.currentUserId;
    
    // Decode base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');
    const size = buffer.length;
    
    // Extract extension
    const lastDot = fileName.lastIndexOf('.');
    const extension = lastDot > 0 ? fileName.slice(lastDot + 1).toLowerCase() : null;
    
    // Generate storage key
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const storageKey = `im/temp/${userId}/${timestamp}-${random}-${fileName}`;
    
    // Upload to S3
    const uploadResult = await uploadFile(storageKey, buffer, mimeType, DEFAULT_BUCKET);
    
    // Calculate expiration (24 hours)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    
    // Create temp file record
    const [result] = await db.insert(tempFile).values({
      conversationId: conversationId || null,
      name: fileName,
      originalName: fileName,
      extension,
      mimeType,
      size,
      storageKey,
      bucket: DEFAULT_BUCKET,
      etag: uploadResult.etag || null,
      expiresAt,
      status: '0',
      createdBy: context.currentUserName,
      updatedBy: context.currentUserName,
    } as TempFileInsert).returning();
    
    if (!result) {
      throw new Error('error.business.createFailed');
    }
    
    // Get download URL
    const { url: downloadUrl } = await getPresignedDownloadUrl(storageKey, DEFAULT_BUCKET, 3600, fileName);
    
    return {
      id: result.id,
      name: result.name,
      originalName: result.originalName,
      extension: result.extension,
      mimeType: result.mimeType,
      size: result.size,
      storageKey: result.storageKey,
      downloadUrl,
    };
  },
});

// Get download URL for temp file
export const tempFileGetDownloadUrl = defineAction({
  meta: { name: 'im.tempFile.getDownloadUrl', displayName: '获取临时文件下载链接', description: '获取临时文件的预签名下载链接', tags: ['im', 'tempFile'], method: 'GET', path: '/api/im/temp-file/:id/download-url' },
  schemas: {
    paramsSchema: z.object({ id: z.uuid() }),
    outputSchema: z.object({
      url: z.string(),
      expiresAt: z.string(),
    }),
  },
  execute: async (input, _context) => {
    const [file] = await db.select().from(tempFile).where(eq(tempFile.id, input.id)).limit(1);
    if (!file) {
      throw new Error('error.business.dataNotFound');
    }
    
    const { url, expiresAt } = await getPresignedDownloadUrl(file.storageKey, file.bucket, 3600, file.originalName);
    return { url, expiresAt: expiresAt.toISOString() };
  },
});

export const tempFileActions = [tempFileGetByPagination, tempFileGetByPk, tempFileCreate, tempFileUpdate, tempFileDeleteByPk, tempFileCleanExpired, tempFileGetSchema, tempFileUpload, tempFileGetDownloadUrl];
