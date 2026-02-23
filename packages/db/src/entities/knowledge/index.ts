// Knowledge entities - tables, fields, meta, config, schemas

// 新的统一节点实体
export { 
  node, 
  nodeFields, 
  nodeMeta, 
  nodeConfig, 
  nodeSchemas,
  NODE_TYPES,
  type NodeType,
  type NodeSelect,
  type NodeInsert,
} from './node';

export { 
  nodeVersion, 
  nodeVersionFields, 
  nodeVersionMeta, 
  nodeVersionConfig, 
  nodeVersionSchemas,
  type NodeVersionSelect,
  type NodeVersionInsert,
} from './nodeVersion';

// 收藏实体 (保留)
export { 
  favorite, 
  favoriteFields, 
  favoriteMeta, 
  favoriteConfig, 
  favoriteSchemas,
  type FavoriteSelect,
  type FavoriteInsert,
} from './favorite';

// 旧实体 (已废弃，将被删除)
// export { folder, folderFields, folderMeta, folderConfig, folderSchemas } from './folder';
// export { file, fileFields, fileMeta, fileConfig, fileSchemas } from './file';
// export { fileVersion, fileVersionFields, fileVersionMeta, fileVersionConfig, fileVersionSchemas } from './fileVersion';

// Relations
export * from './relations';

// Export schemas for drizzle-kit
export * from './exportSchemas';
