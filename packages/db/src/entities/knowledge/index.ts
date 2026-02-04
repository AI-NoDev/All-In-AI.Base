// Knowledge entities - tables, fields, meta, config, schemas
export { folder, folderFields, folderMeta, folderConfig, folderZodSchemas } from './folder';
export { file, fileFields, fileMeta, fileConfig, fileZodSchemas } from './file';
export { fileVersion, fileVersionFields, fileVersionMeta, fileVersionConfig, fileVersionZodSchemas } from './fileVersion';
export { resourcePermission, resourcePermissionFields, resourcePermissionMeta, resourcePermissionConfig, resourcePermissionZodSchemas } from './resourcePermission';

// Relations
export * from './relations';

// Export schemas for drizzle-kit
export * from './exportSchemas';
