import { m } from '@qiyu-allinai/i18n';

type MessageFn = (inputs?: Record<string, unknown>, options?: { locale?: string }) => string;
type Messages = Record<string, MessageFn>;
const msg = m as unknown as Messages;

// 翻译函数 - 通过 key 获取翻译
export function t(key: string): () => string {
  return () => {
    const fn = msg[key];
    return fn ? fn() : key;
  };
}

// 快捷翻译函数 - base schema
export const tBase = {
  pk: {
    id: () => t('db_base_pk_id'),
  },
  audit: {
    createdById: () => t('db_base_audit_createdById'),
    createdBy: () => t('db_base_audit_createdBy'),
    createdAt: () => t('db_base_audit_createdAt'),
    updatedById: () => t('db_base_audit_updatedById'),
    updatedBy: () => t('db_base_audit_updatedBy'),
    updatedAt: () => t('db_base_audit_updatedAt'),
  },
  deleted: {
    deletedById: () => t('db_base_deleted_deletedById'),
    deletedBy: () => t('db_base_deleted_deletedBy'),
    deletedAt: () => t('db_base_deleted_deletedAt'),
  },
  permission: {
    isPublic: () => t('db_base_permission_isPublic'),
    allowedUserIds: () => t('db_base_permission_allowedUserIds'),
    allowedRoleIds: () => t('db_base_permission_allowedRoleIds'),
    allowedDeptIds: () => t('db_base_permission_allowedDeptIds'),
    allowSubDepts: () => t('db_base_permission_allowSubDepts'),
  },
};

// 快捷翻译函数 - system 模块
export function tSystem(entity: string, field: string): () => string {
  return t(`db_system_${entity}_${field}`);
}

export function tSystemMeta(entity: string, key: 'displayName' | 'verboseName' | 'verboseNamePlural'): () => string {
  return t(`db_system_${entity}_meta_${key}`);
}

// 快捷翻译函数 - ai 模块
export function tAi(entity: string, field: string): () => string {
  return t(`db_ai_${entity}_${field}`);
}

export function tAiMeta(entity: string, key: 'displayName' | 'verboseName' | 'verboseNamePlural'): () => string {
  return t(`db_ai_${entity}_meta_${key}`);
}

// 快捷翻译函数 - knowledge 模块
export function tKnowledge(entity: string, field: string): () => string {
  return t(`db_knowledge_${entity}_${field}`);
}

export function tKnowledgeMeta(entity: string, key: 'displayName' | 'verboseName' | 'verboseNamePlural'): () => string {
  return t(`db_knowledge_${entity}_meta_${key}`);
}

// 快捷翻译函数 - im 模块
export function tIm(entity: string, field: string): () => string {
  return t(`db_im_${entity}_${field}`);
}

export function tImMeta(entity: string, key: 'displayName' | 'verboseName' | 'verboseNamePlural'): () => string {
  return t(`db_im_${entity}_meta_${key}`);
}
