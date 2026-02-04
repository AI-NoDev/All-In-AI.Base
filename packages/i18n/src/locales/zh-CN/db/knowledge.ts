// Knowledge 模块实体翻译
export const knowledge = {
  // 文件夹表
  folder: {
    _meta: {
      name: 'knowledge_folder',
      displayName: '文件夹',
      verboseName: '文件夹',
      verboseNamePlural: '文件夹列表',
    },
    fields: {
      parentId: '父文件夹ID',
      name: '文件夹名称',
      path: '路径',
      description: '描述',
      icon: '图标',
      color: '颜色',
      orderNum: '排序',
      isPublic: '公开',
    },
  },

  // 文件表
  file: {
    _meta: {
      name: 'knowledge_file',
      displayName: '知识文件',
      verboseName: '文件',
      verboseNamePlural: '文件列表',
    },
    fields: {
      folderId: '文件夹ID',
      name: '文件名称',
      originalName: '原始文件名',
      extension: '扩展名',
      mimeType: 'MIME类型',
      size: '文件大小',
      storageKey: '存储键',
      bucket: '存储桶',
      region: '区域',
      etag: 'ETag',
      versionId: '版本ID',
      storageClass: '存储类型',
      metadata: '元数据',
      tags: '标签',
      description: '描述',
      processStatus: '处理状态',
      processResult: '处理结果',
      downloadCount: '下载次数',
      status: '状态',
      isPublic: '公开',
    },
  },

  // 文件版本表
  fileVersion: {
    _meta: {
      name: 'knowledge_file_version',
      displayName: '文件版本',
      verboseName: '版本',
      verboseNamePlural: '版本列表',
    },
    fields: {
      fileId: '文件ID',
      versionNumber: '版本号',
      storageKey: '存储键',
      bucket: '存储桶',
      s3VersionId: 'S3版本ID',
      etag: 'ETag',
      size: '文件大小',
      changeLog: '变更说明',
      createdById: '创建者ID',
      createdBy: '创建者',
      createdAt: '创建时间',
    },
  },

  // 知识库表
  knowledgeBase: {
    _meta: {
      name: 'knowledge_base',
      displayName: '知识库',
      verboseName: '知识库',
      verboseNamePlural: '知识库列表',
    },
    fields: {
      name: '知识库名称',
      description: '描述',
      icon: '图标',
      color: '颜色',
      embeddingConfig: '嵌入配置',
      s3Config: 'S3配置',
      fileCount: '文件数量',
      totalSize: '总大小',
      chunkCount: '分块数量',
      status: '状态',
    },
  },

  // 知识库文件夹关联表
  knowledgeBaseFolder: {
    _meta: {
      name: 'knowledge_base_folder',
      displayName: '知识库文件夹关联',
      verboseName: '知识库文件夹',
      verboseNamePlural: '知识库文件夹列表',
    },
    fields: {
      knowledgeBaseId: '知识库ID',
      folderId: '文件夹ID',
    },
  },

  // 资源权限表
  resourcePermission: {
    _meta: {
      name: 'knowledge_resource_permission',
      displayName: '资源权限',
      verboseName: '资源权限',
      verboseNamePlural: '资源权限列表',
    },
    fields: {
      resourceType: '资源类型',
      resourceId: '资源ID',
      granteeType: '授权对象类型',
      granteeId: '授权对象ID',
      permissionLevel: '权限级别',
    },
  },
};
