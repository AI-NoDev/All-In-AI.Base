/**
 * 字典种子数据
 */

import { eq } from 'drizzle-orm';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { dictGroup } from '../entities/system/dictGroup';
import { dict } from '../entities/system/dict';

export interface DictGroupSeed {
  key: string;
  name: string;
  remark?: string;
}

export interface DictSeed {
  group: string;
  label: string;
  value: string;
  sort: number;
  cssClass?: string;
  listClass?: string;
  isDefault?: boolean;
  remark?: string;
}

/**
 * 字典组种子数据
 */
export const dictGroupSeeds: DictGroupSeed[] = [
  { key: 'sys_normal_disable', name: '系统开关', remark: '系统开关列表' },
  { key: 'sys_user_sex', name: '用户性别', remark: '用户性别列表' },
  { key: 'sys_show_hide', name: '菜单状态', remark: '菜单状态列表' },
  { key: 'sys_yes_no', name: '系统是否', remark: '系统是否列表' },
  { key: 'sys_notice_type', name: '通知类型', remark: '通知类型列表' },
  { key: 'sys_notice_status', name: '通知状态', remark: '通知状态列表' },
  { key: 'sys_oper_type', name: '操作类型', remark: '操作类型列表' },
  { key: 'sys_common_status', name: '系统状态', remark: '登录状态列表' },
];

/**
 * 字典项种子数据
 */
export const dictSeeds: DictSeed[] = [
  // 系统开关
  { group: 'sys_normal_disable', label: '正常', value: '0', sort: 1, listClass: 'success', isDefault: true },
  { group: 'sys_normal_disable', label: '停用', value: '1', sort: 2, listClass: 'danger' },
  
  // 用户性别
  { group: 'sys_user_sex', label: '男', value: '0', sort: 1 },
  { group: 'sys_user_sex', label: '女', value: '1', sort: 2 },
  { group: 'sys_user_sex', label: '未知', value: '2', sort: 3, isDefault: true },
  
  // 菜单状态
  { group: 'sys_show_hide', label: '显示', value: '0', sort: 1, listClass: 'success', isDefault: true },
  { group: 'sys_show_hide', label: '隐藏', value: '1', sort: 2, listClass: 'danger' },
  
  // 系统是否
  { group: 'sys_yes_no', label: '是', value: 'Y', sort: 1, listClass: 'success' },
  { group: 'sys_yes_no', label: '否', value: 'N', sort: 2, listClass: 'danger', isDefault: true },
  
  // 通知类型
  { group: 'sys_notice_type', label: '通知', value: '1', sort: 1 },
  { group: 'sys_notice_type', label: '公告', value: '2', sort: 2 },
  
  // 通知状态
  { group: 'sys_notice_status', label: '正常', value: '0', sort: 1, listClass: 'success', isDefault: true },
  { group: 'sys_notice_status', label: '关闭', value: '1', sort: 2, listClass: 'danger' },
  
  // 操作类型
  { group: 'sys_oper_type', label: '其他', value: '0', sort: 0, isDefault: true },
  { group: 'sys_oper_type', label: '新增', value: '1', sort: 1 },
  { group: 'sys_oper_type', label: '修改', value: '2', sort: 2 },
  { group: 'sys_oper_type', label: '删除', value: '3', sort: 3 },
  { group: 'sys_oper_type', label: '授权', value: '4', sort: 4 },
  { group: 'sys_oper_type', label: '导出', value: '5', sort: 5 },
  { group: 'sys_oper_type', label: '导入', value: '6', sort: 6 },
  { group: 'sys_oper_type', label: '强退', value: '7', sort: 7 },
  { group: 'sys_oper_type', label: '清空数据', value: '8', sort: 8 },
  
  // 系统状态
  { group: 'sys_common_status', label: '成功', value: '0', sort: 1, listClass: 'success' },
  { group: 'sys_common_status', label: '失败', value: '1', sort: 2, listClass: 'danger' },
];

/**
 * 初始化字典组种子数据
 */
export async function initDictGroupSeeds(db: PostgresJsDatabase): Promise<void> {
  console.log('🔧 Initializing dict group seeds...');
  
  let created = 0;
  let skipped = 0;

  for (const seed of dictGroupSeeds) {
    const [existing] = await db.select().from(dictGroup)
      .where(eq(dictGroup.key, seed.key))
      .limit(1);

    if (existing) {
      skipped++;
      continue;
    }

    await db.insert(dictGroup).values({
      key: seed.key,
      name: seed.name,
      remark: seed.remark,
      status: '0',
      createdBy: 'system',
      updatedBy: 'system',
    });

    created++;
  }

  console.log(`✅ Dict group seeds: ${created} created, ${skipped} skipped`);
}

/**
 * 初始化字典项种子数据
 */
export async function initDictSeeds(db: PostgresJsDatabase): Promise<void> {
  console.log('🔧 Initializing dict seeds...');
  
  let created = 0;
  let skipped = 0;

  for (const seed of dictSeeds) {
    // 检查是否已存在（通过 group + value 唯一）
    const [existing] = await db.select().from(dict)
      .where(eq(dict.group, seed.group))
      .limit(100);
    
    const exists = existing ? 
      (await db.select().from(dict)
        .where(eq(dict.group, seed.group))
      ).some(d => d.value === seed.value) : false;

    if (exists) {
      skipped++;
      continue;
    }

    await db.insert(dict).values({
      group: seed.group,
      label: seed.label,
      value: seed.value,
      sort: seed.sort,
      cssClass: seed.cssClass,
      listClass: seed.listClass,
      isDefault: seed.isDefault ?? false,
      remark: seed.remark,
      status: '0',
      createdBy: 'system',
      updatedBy: 'system',
    });

    created++;
  }

  console.log(`✅ Dict seeds: ${created} created, ${skipped} skipped`);
}

/**
 * 初始化所有字典种子数据
 */
export async function initAllDictSeeds(db: PostgresJsDatabase): Promise<void> {
  await initDictGroupSeeds(db);
  await initDictSeeds(db);
}
