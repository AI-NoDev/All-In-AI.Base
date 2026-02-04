// 基础 Schema 字段翻译
export const base = {
  // pkSchema
  pk: {
    id: '主键ID',
  },
  // auditSchema
  audit: {
    createdById: '创建者ID',
    createdBy: '创建者',
    createdAt: '创建时间',
    updatedById: '更新者ID',
    updatedBy: '更新者',
    updatedAt: '更新时间',
  },
  // deletedSchema
  deleted: {
    deletedById: '删除者ID',
    deletedBy: '删除者',
    deletedAt: '删除时间',
  },
  // permissionSchema
  permission: {
    isPublic: '是否公开',
    allowedUserIds: '允许访问的用户',
    allowedRoleIds: '允许访问的角色',
    allowedDeptIds: '允许访问的部门',
    allowSubDepts: '子部门可访问',
  },
};
