/**
 * 菜单模块工具函数
 */

import { menu } from '@qiyu-allinai/db/entities/system';

/** 菜单类型定义 */
export type MenuSelect = typeof menu.$inferSelect;
export type MenuInsert = typeof menu.$inferInsert;

/** 菜单类型常量 */
export const MENU_TYPE = {
  /** 目录 */
  DIRECTORY: 'M',
  /** 菜单 */
  MENU: 'C',
  /** 按钮 */
  BUTTON: 'F',
} as const;
