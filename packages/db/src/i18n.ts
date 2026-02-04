import { createI18n, addResources, defaultResources, type i18n } from '@qiyu-allinai/i18n';

// 创建 db 模块专用的 i18n 实例
let i18nInstance: i18n | null = null;

export function getI18n(): i18n {
  if (!i18nInstance) {
    i18nInstance = createI18n({
      defaultNS: 'db',
      ns: ['db', 'common'],
    });
    addResources(i18nInstance, defaultResources);
  }
  return i18nInstance;
}

// 翻译函数工厂
export function t(key: string): () => string {
  return () => getI18n().t(key);
}

// 快捷翻译函数 - base schema
export const tBase = {
  pk: {
    id: () => t('db:base.pk.id'),
  },
  audit: {
    createdById: () => t('db:base.audit.createdById'),
    createdBy: () => t('db:base.audit.createdBy'),
    createdAt: () => t('db:base.audit.createdAt'),
    updatedById: () => t('db:base.audit.updatedById'),
    updatedBy: () => t('db:base.audit.updatedBy'),
    updatedAt: () => t('db:base.audit.updatedAt'),
  },
  deleted: {
    deletedById: () => t('db:base.deleted.deletedById'),
    deletedBy: () => t('db:base.deleted.deletedBy'),
    deletedAt: () => t('db:base.deleted.deletedAt'),
  },
  permission: {
    isPublic: () => t('db:base.permission.isPublic'),
    allowedUserIds: () => t('db:base.permission.allowedUserIds'),
    allowedRoleIds: () => t('db:base.permission.allowedRoleIds'),
    allowedDeptIds: () => t('db:base.permission.allowedDeptIds'),
    allowSubDepts: () => t('db:base.permission.allowSubDepts'),
  },
};

// 快捷翻译函数 - system 模块
export function tSystem(entity: string, field: string): () => string {
  return t(`db:system.${entity}.fields.${field}`);
}

export function tSystemMeta(entity: string, key: 'displayName' | 'verboseName' | 'verboseNamePlural'): () => string {
  return t(`db:system.${entity}._meta.${key}`);
}

// 快捷翻译函数 - ai 模块
export function tAi(entity: string, field: string): () => string {
  return t(`db:ai.${entity}.fields.${field}`);
}

export function tAiMeta(entity: string, key: 'displayName' | 'verboseName' | 'verboseNamePlural'): () => string {
  return t(`db:ai.${entity}._meta.${key}`);
}

// 快捷翻译函数 - knowledge 模块
export function tKnowledge(entity: string, field: string): () => string {
  return t(`db:knowledge.${entity}.fields.${field}`);
}

export function tKnowledgeMeta(entity: string, key: 'displayName' | 'verboseName' | 'verboseNamePlural'): () => string {
  return t(`db:knowledge.${entity}._meta.${key}`);
}

// 快捷翻译函数 - im 模块
export function tIm(entity: string, field: string): () => string {
  return t(`db:im.${entity}.fields.${field}`);
}

export function tImMeta(entity: string, key: 'displayName' | 'verboseName' | 'verboseNamePlural'): () => string {
  return t(`db:im.${entity}._meta.${key}`);
}
