/**
 * 用户模块 Schema 定义
 */

import { z } from 'zod';

// 空字符串转 undefined
const emptyToUndefined = (val: unknown) => (val === '' || val === null ? undefined : val);
const emptyArrayToUndefined = (val: unknown) => {
  if (!Array.isArray(val)) return val;
  if (val.length === 0 || (val.length === 1 && val[0] === '')) return undefined;
  return val;
};

/** 用户过滤条件 Schema */
export const userFilterSchema = z.object({
  // IN 查询
  ids: z.preprocess(emptyArrayToUndefined, z.array(z.string().describe('用户 ID')).optional()).describe('用户 ID 列表，批量查询'),
  loginNames: z.preprocess(emptyArrayToUndefined, z.array(z.string().describe('登录名')).optional()).describe('登录名列表，批量查询'),
  // 精确匹配
  deptId: z.preprocess(emptyToUndefined, z.string().optional()).describe('部门 ID'),
  userType: z.preprocess(emptyToUndefined, z.string().optional()).describe('用户类型：00=系统管理员，01=普通用户'),
  sex: z.preprocess(emptyToUndefined, z.string().optional()).describe('性别：0=男，1=女，2=未知'),
  status: z.preprocess(emptyToUndefined, z.string().optional()).describe('状态：0=正常，1=禁用'),
  // 模糊匹配
  loginName: z.preprocess(emptyToUndefined, z.string().optional()).describe('登录名（模糊匹配）'),
  name: z.preprocess(emptyToUndefined, z.string().optional()).describe('用户名（模糊匹配）'),
  email: z.preprocess(emptyToUndefined, z.string().optional()).describe('邮箱（模糊匹配）'),
  phonenumber: z.preprocess(emptyToUndefined, z.string().optional()).describe('手机号（模糊匹配）'),
  // 时间范围
  createdAtStart: z.preprocess(emptyToUndefined, z.iso.datetime().optional()).describe('创建时间起始'),
  createdAtEnd: z.preprocess(emptyToUndefined, z.iso.datetime().optional()).describe('创建时间结束'),
  loginDateStart: z.preprocess(emptyToUndefined, z.iso.datetime().optional()).describe('最后登录时间起始'),
  loginDateEnd: z.preprocess(emptyToUndefined, z.iso.datetime().optional()).describe('最后登录时间结束'),
}).optional().describe('过滤条件');

/** 排序 Schema */
export const sortSchema = z.object({
  field: z.enum(['loginName', 'name', 'createdAt', 'updatedAt', 'loginDate']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向'),
}).optional().describe('排序配置');

/** 分页查询 Body Schema */
export const paginationBodySchema = z.object({
  filter: userFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0).describe('偏移量'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量'),
});
