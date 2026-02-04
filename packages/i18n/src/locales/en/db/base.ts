// Base Schema field translations
export const base = {
  // pkSchema
  pk: {
    id: 'Primary Key ID',
  },
  // auditSchema
  audit: {
    createdById: 'Created By ID',
    createdBy: 'Created By',
    createdAt: 'Created At',
    updatedById: 'Updated By ID',
    updatedBy: 'Updated By',
    updatedAt: 'Updated At',
  },
  // deletedSchema
  deleted: {
    deletedById: 'Deleted By ID',
    deletedBy: 'Deleted By',
    deletedAt: 'Deleted At',
  },
  // permissionSchema
  permission: {
    isPublic: 'Is Public',
    allowedUserIds: 'Allowed Users',
    allowedRoleIds: 'Allowed Roles',
    allowedDeptIds: 'Allowed Departments',
    allowSubDepts: 'Allow Sub Departments',
  },
};
