import { relations } from "drizzle-orm";
import { user } from "./user";
import { department } from "./department";
import { role } from "./role";
import { menu } from "./menu";
import { post } from "./post";
import { dict } from "./dict";
import { dictGroup } from "./dictGroup";
import { token } from "./token";
import { userRole } from "./userRole";
import { userPost } from "./userPost";
import { roleMenu } from "./roleMenu";
import { roleDepartment } from "./roleDepartment";

// 用户关系
export const userRelations = relations(user, ({ one, many }) => ({
  department: one(department, {
    fields: [user.deptId],
    references: [department.id],
  }),
  role: one(role, {
    fields: [user.roleId],
    references: [role.id],
  }),
  userRoles: many(userRole),
  userPosts: many(userPost),
  tokens: many(token),
}));

// Token关系
export const tokenRelations = relations(token, ({ one }) => ({
  user: one(user, {
    fields: [token.userId],
    references: [user.id],
  }),
}));

// 部门关系
export const departmentRelations = relations(department, ({ one, many }) => ({
  users: many(user),
  parent: one(department, {
    fields: [department.parentId],
    references: [department.id],
    relationName: "departmentParent",
  }),
  children: many(department, { relationName: "departmentParent" }),
  roleDepartments: many(roleDepartment),
}));

// 角色关系
export const roleRelations = relations(role, ({ many }) => ({
  users: many(user),
  userRoles: many(userRole),
  roleMenus: many(roleMenu),
  roleDepartments: many(roleDepartment),
}));

// 菜单关系
export const menuRelations = relations(menu, ({ one, many }) => ({
  parent: one(menu, {
    fields: [menu.parentId],
    references: [menu.id],
    relationName: "menuParent",
  }),
  children: many(menu, { relationName: "menuParent" }),
  roleMenus: many(roleMenu),
}));

// 岗位关系
export const postRelations = relations(post, ({ many }) => ({
  userPosts: many(userPost),
}));

// 字典关系
export const dictRelations = relations(dict, ({ one }) => ({
  dictGroup: one(dictGroup, {
    fields: [dict.group],
    references: [dictGroup.key],
  }),
}));

// 字典分组关系
export const dictGroupRelations = relations(dictGroup, ({ many }) => ({
  dicts: many(dict),
}));

// 用户-角色中间表关系
export const userRoleRelations = relations(userRole, ({ one }) => ({
  user: one(user, {
    fields: [userRole.userId],
    references: [user.id],
  }),
  role: one(role, {
    fields: [userRole.roleId],
    references: [role.id],
  }),
}));

// 用户-岗位中间表关系
export const userPostRelations = relations(userPost, ({ one }) => ({
  user: one(user, {
    fields: [userPost.userId],
    references: [user.id],
  }),
  post: one(post, {
    fields: [userPost.postId],
    references: [post.id],
  }),
}));

// 角色-菜单中间表关系
export const roleMenuRelations = relations(roleMenu, ({ one }) => ({
  role: one(role, {
    fields: [roleMenu.roleId],
    references: [role.id],
  }),
  menu: one(menu, {
    fields: [roleMenu.menuId],
    references: [menu.id],
  }),
}));

// 角色-部门中间表关系
export const roleDepartmentRelations = relations(roleDepartment, ({ one }) => ({
  role: one(role, {
    fields: [roleDepartment.roleId],
    references: [role.id],
  }),
  department: one(department, {
    fields: [roleDepartment.departmentId],
    references: [department.id],
  }),
}));
