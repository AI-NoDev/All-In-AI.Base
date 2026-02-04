// Knowledge module entity translations
export const knowledge = {
  folder: {
    _meta: {
      name: 'knowledge_folder',
      displayName: 'Folder',
      verboseName: 'Folder',
      verboseNamePlural: 'Folders',
    },
    fields: {
      parentId: 'Parent Folder ID',
      name: 'Folder Name',
      path: 'Path',
      description: 'Description',
      icon: 'Icon',
      color: 'Color',
      orderNum: 'Sort Order',
      isPublic: 'Public',
    },
  },

  file: {
    _meta: {
      name: 'knowledge_file',
      displayName: 'Knowledge File',
      verboseName: 'File',
      verboseNamePlural: 'Files',
    },
    fields: {
      folderId: 'Folder ID',
      name: 'File Name',
      originalName: 'Original Name',
      extension: 'Extension',
      mimeType: 'MIME Type',
      size: 'File Size',
      storageKey: 'Storage Key',
      bucket: 'Bucket',
      region: 'Region',
      etag: 'ETag',
      versionId: 'Version ID',
      storageClass: 'Storage Class',
      metadata: 'Metadata',
      tags: 'Tags',
      description: 'Description',
      processStatus: 'Process Status',
      processResult: 'Process Result',
      downloadCount: 'Download Count',
      status: 'Status',
      isPublic: 'Public',
    },
  },

  fileVersion: {
    _meta: {
      name: 'knowledge_file_version',
      displayName: 'File Version',
      verboseName: 'Version',
      verboseNamePlural: 'Versions',
    },
    fields: {
      fileId: 'File ID',
      versionNumber: 'Version Number',
      storageKey: 'Storage Key',
      bucket: 'Bucket',
      s3VersionId: 'S3 Version ID',
      etag: 'ETag',
      size: 'File Size',
      changeLog: 'Change Log',
      createdById: 'Created By ID',
      createdBy: 'Created By',
      createdAt: 'Created At',
    },
  },

  knowledgeBase: {
    _meta: {
      name: 'knowledge_base',
      displayName: 'Knowledge Base',
      verboseName: 'Knowledge Base',
      verboseNamePlural: 'Knowledge Bases',
    },
    fields: {
      name: 'Knowledge Base Name',
      description: 'Description',
      icon: 'Icon',
      color: 'Color',
      embeddingConfig: 'Embedding Config',
      s3Config: 'S3 Config',
      fileCount: 'File Count',
      totalSize: 'Total Size',
      chunkCount: 'Chunk Count',
      status: 'Status',
    },
  },

  knowledgeBaseFolder: {
    _meta: {
      name: 'knowledge_base_folder',
      displayName: 'Knowledge Base Folder Association',
      verboseName: 'Knowledge Base Folder',
      verboseNamePlural: 'Knowledge Base Folders',
    },
    fields: {
      knowledgeBaseId: 'Knowledge Base ID',
      folderId: 'Folder ID',
    },
  },

  resourcePermission: {
    _meta: {
      name: 'knowledge_resource_permission',
      displayName: 'Resource Permission',
      verboseName: 'Resource Permission',
      verboseNamePlural: 'Resource Permissions',
    },
    fields: {
      resourceType: 'Resource Type',
      resourceId: 'Resource ID',
      granteeType: 'Grantee Type',
      granteeId: 'Grantee ID',
      permissionLevel: 'Permission Level',
    },
  },
};
