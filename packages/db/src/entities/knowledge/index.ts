// Knowledge entities - tables, fields, meta, config, schemas
export { folder, folderFields, folderMeta, folderConfig, folderZodSchemas } from './folder';
export { file, fileFields, fileMeta, fileConfig, fileZodSchemas } from './file';
export { fileVersion, fileVersionFields, fileVersionMeta, fileVersionConfig, fileVersionZodSchemas } from './fileVersion';
export { favorite, favoriteFields, favoriteMeta, favoriteConfig, favoriteZodSchemas } from './favorite';

// Relations
export * from './relations';

// Export schemas for drizzle-kit
export * from './exportSchemas';
