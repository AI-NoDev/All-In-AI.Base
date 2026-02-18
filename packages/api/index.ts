/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DeleteApiAiAgentByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiAiAgentByIdParams {
  id: string;
}

export interface DeleteApiAiAgentMessageByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiAiAgentMessageByIdParams {
  id: string;
}

export interface DeleteApiAiAgentMessageFromSeqBySessionIdByMsgSeqData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiAiAgentMessageFromSeqBySessionIdByMsgSeqParams {
  /**
   * @min -9007199254740991
   * @max 9007199254740991
   */
  msgSeq: number;
  sessionId: string;
}

export interface DeleteApiAiAgentSessionByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiAiAgentSessionByIdParams {
  id: string;
}

export interface DeleteApiAiApiKeyByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiAiApiKeyByIdParams {
  id: string;
}

export interface DeleteApiAiMcpServerByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiAiMcpServerByIdParams {
  id: string;
}

export interface DeleteApiAiModelByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiAiModelByIdParams {
  id: string;
}

export interface DeleteApiAiProviderByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiAiProviderByIdParams {
  id: string;
}

export interface DeleteApiAiSessionByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiAiSessionByIdParams {
  id: string;
}

export interface DeleteApiAiSessionMessageFromSeqBySessionIdByMsgSeqData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiAiSessionMessageFromSeqBySessionIdByMsgSeqParams {
  /**
   * @min -9007199254740991
   * @max 9007199254740991
   */
  msgSeq: number;
  sessionId: string;
}

export interface DeleteApiAiToolGroupByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiAiToolGroupByIdParams {
  id: string;
}

export interface DeleteApiFilesByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiFilesByIdParams {
  id: string;
}

export interface DeleteApiFilesFoldersByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiFilesFoldersByIdParams {
  id: string;
}

export interface DeleteApiFilesPermissionAllByResourceTypeByResourceIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiFilesPermissionAllByResourceTypeByResourceIdParams {
  resourceId: string;
  resourceType: ResourceTypeEnum6;
}

export enum DeleteApiFilesPermissionAllByResourceTypeByResourceIdParams1Enum {
  File = "file",
  Folder = "folder",
}

export enum DeleteApiFilesPermissionAllByResourceTypeByResourceIdParams1ResourceTypeEnum {
  File = "file",
  Folder = "folder",
}

export interface DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionParams {
  permission: PermissionEnum;
  resourceId: string;
  resourceType: ResourceTypeEnum4;
  subjectId: string;
  subjectType: SubjectTypeEnum;
}

export enum DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionParams1Enum {
  File = "file",
  Folder = "folder",
}

export enum DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionParams1Enum1 {
  User = "user",
  Role = "role",
  Dept = "dept",
}

export enum DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionParams1Enum2 {
  Read = "read",
  Write = "write",
  Delete = "delete",
  Manage = "manage",
}

export enum DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionParams1PermissionEnum {
  Read = "read",
  Write = "write",
  Delete = "delete",
  Manage = "manage",
}

export enum DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionParams1ResourceTypeEnum {
  File = "file",
  Folder = "folder",
}

export enum DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionParams1SubjectTypeEnum {
  User = "user",
  Role = "role",
  Dept = "dept",
}

export interface DeleteApiImConversationByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiImConversationByIdParams {
  id: string;
}

export interface DeleteApiImGroupMemberByConversationIdByUserIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiImGroupMemberByConversationIdByUserIdParams {
  conversationId: string;
  userId: string;
}

export interface DeleteApiImTempFileByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiImTempFileByIdParams {
  id: string;
}

export interface DeleteApiImTempFileCleanExpiredData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiKnowledgeFavoriteByResourceTypeByResourceIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiKnowledgeFavoriteByResourceTypeByResourceIdParams {
  resourceId: string;
  resourceType: ResourceTypeEnum;
}

export enum DeleteApiKnowledgeFavoriteByResourceTypeByResourceIdParams1Enum {
  Folder = "folder",
  File = "file",
}

export enum DeleteApiKnowledgeFavoriteByResourceTypeByResourceIdParams1ResourceTypeEnum {
  Folder = "folder",
  File = "file",
}

export interface DeleteApiKnowledgeFileByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiKnowledgeFileByIdParams {
  id: string;
}

export interface DeleteApiKnowledgeFileVersionByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiKnowledgeFileVersionByIdParams {
  id: string;
}

export interface DeleteApiKnowledgeFolderByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiKnowledgeFolderByIdParams {
  id: string;
}

export interface DeleteApiSystemConfigByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemConfigByIdParams {
  id: string;
}

export interface DeleteApiSystemDepartmentByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemDepartmentByIdParams {
  id: string;
}

export interface DeleteApiSystemDictByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemDictByIdParams {
  id: string;
}

export interface DeleteApiSystemDictGroupByKeyData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemDictGroupByKeyParams {
  /**
   * @minLength 1
   * @maxLength 100
   */
  key: string;
}

export interface DeleteApiSystemJobByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemJobByIdParams {
  id: string;
}

export interface DeleteApiSystemJobLogByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemJobLogByIdParams {
  id: string;
}

export interface DeleteApiSystemLoginInfoByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemLoginInfoByIdParams {
  id: string;
}

export interface DeleteApiSystemMenuByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemMenuByIdParams {
  id: string;
}

export interface DeleteApiSystemNoticeByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemNoticeByIdParams {
  id: string;
}

export interface DeleteApiSystemOperationLogByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemOperationLogByIdParams {
  id: string;
}

export interface DeleteApiSystemPermissionByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemPermissionByIdParams {
  id: string;
}

export interface DeleteApiSystemPostByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemPostByIdParams {
  id: string;
}

export interface DeleteApiSystemRoleByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemRoleByIdParams {
  id: string;
}

export interface DeleteApiSystemRoleDepartmentByRoleIdByDepartmentIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemRoleDepartmentByRoleIdByDepartmentIdParams {
  departmentId: string;
  roleId: string;
}

export interface DeleteApiSystemRoleMenuByRoleIdByMenuIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemRoleMenuByRoleIdByMenuIdParams {
  menuId: string;
  roleId: string;
}

export interface DeleteApiSystemTokenByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemTokenByIdParams {
  id: string;
}

export interface DeleteApiSystemUserByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemUserByIdParams {
  id: string;
}

export interface DeleteApiSystemUserPostByUserIdByPostIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemUserPostByUserIdByPostIdParams {
  postId: string;
  userId: string;
}

export interface DeleteApiSystemUserRoleByUserIdByRoleIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiSystemUserRoleByUserIdByRoleIdParams {
  roleId: string;
  userId: string;
}

export interface GetApiActionsByNameData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiActionsByNameParams {
  name: string;
}

export interface GetApiActionsData {
  data: {
    description: string;
    displayName: string;
    method: string;
    name: string;
    path: string;
    tags: string[];
  }[];
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiAgentByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiAgentByIdParams {
  id: string;
}

export interface GetApiAiAgentMessageByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiAgentMessageByIdParams {
  id: string;
}

export interface GetApiAiAgentMessageHistoryBySessionIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiAgentMessageHistoryBySessionIdParams {
  /**
   * @min -9007199254740991
   * @max 9007199254740991
   */
  beforeSeq?: number;
  /**
   * @min 1
   * @max 200
   * @default 50
   */
  limit?: number;
  sessionId: string;
}

export interface GetApiAiAgentMessageSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiAgentSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiAgentSessionByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiAgentSessionByIdParams {
  id: string;
}

export interface GetApiAiAgentSessionSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiApiKeyByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiApiKeyByIdParams {
  id: string;
}

export interface GetApiAiApiKeySchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiMcpServerByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiMcpServerByIdParams {
  id: string;
}

export interface GetApiAiMcpServerSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiModelByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiModelByIdParams {
  id: string;
}

export interface GetApiAiModelSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiProviderByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiProviderByIdParams {
  id: string;
}

export interface GetApiAiProviderSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiSessionByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiSessionByIdParams {
  id: string;
}

export interface GetApiAiSessionMessageByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiSessionMessageByIdParams {
  id: string;
}

export interface GetApiAiSessionMessageHistoryBySessionIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiSessionMessageHistoryBySessionIdParams {
  /**
   * @min -9007199254740991
   * @max 9007199254740991
   */
  beforeSeq?: number;
  /**
   * @min 1
   * @max 200
   * @default 50
   */
  limit?: number;
  sessionId: string;
}

export interface GetApiAiSessionMessageSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiSessionSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiToolGroupByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiToolGroupByIdParams {
  id: string;
}

export interface GetApiAiToolGroupSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAuthConfigData {
  data: {
    accessTokenExpMinutes: number;
    refreshTokenExpDays: number;
  };
  message: string;
  success: true;
}

export interface GetApiAuthMeData {
  data: {
    avatar: string | null;
    deptId: string | null;
    email: string | null;
    id: string;
    loginDate: (date | string | number) | null;
    loginIp: string | null;
    loginName: string;
    name: string | null;
    phonenumber: string | null;
    sex: string | null;
    userType: string | null;
  };
  message: string;
  success: true;
}

export type GetApiAuthMeError = {
  data: null;
  message: string;
  success: false;
};

export interface GetApiAuthVerifyData {
  data: {
    scopes: string[];
    tokenType: string;
    user: {
      avatar: string | null;
      email: string | null;
      id: string;
      loginName: string;
      name: string | null;
    };
  };
  message: string;
  success: true;
}

export type GetApiAuthVerifyError = {
  data: null;
  message: string;
  success: false;
};

export interface GetApiDevProjectCodeRootData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiFilesByIdContentData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiFilesByIdContentParams {
  id: string;
}

export interface GetApiFilesByIdDownloadUrlData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiFilesByIdDownloadUrlParams {
  id: string;
}

export interface GetApiFilesByIdTextContentData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiFilesByIdTextContentParams {
  id: string;
}

export interface GetApiFilesPermissionByResourceTypeByResourceIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiFilesPermissionByResourceTypeByResourceIdParams {
  resourceId: string;
  resourceType: ResourceTypeEnum2;
}

export enum GetApiFilesPermissionByResourceTypeByResourceIdParams1Enum {
  File = "file",
  Folder = "folder",
}

export enum GetApiFilesPermissionByResourceTypeByResourceIdParams1ResourceTypeEnum {
  File = "file",
  Folder = "folder",
}

export interface GetApiFilesPermissionEffectiveByResourceTypeByResourceIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiFilesPermissionEffectiveByResourceTypeByResourceIdParams {
  resourceId: string;
  resourceType: ResourceTypeEnum5;
}

export enum GetApiFilesPermissionEffectiveByResourceTypeByResourceIdParams1Enum {
  File = "file",
  Folder = "folder",
}

export enum GetApiFilesPermissionEffectiveByResourceTypeByResourceIdParams1ResourceTypeEnum {
  File = "file",
  Folder = "folder",
}

export interface GetApiFilesShareFolderPathByFolderIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiFilesShareFolderPathByFolderIdParams {
  folderId: string;
}

export interface GetApiFilesVersionsByIdDownloadUrlData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiFilesVersionsByIdDownloadUrlParams {
  id: string;
}

export interface GetApiImConversationByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiImConversationByIdParams {
  id: string;
}

export interface GetApiImConversationFilesData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiImConversationHiddenListData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiImConversationReadByConversationIdByUserIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiImConversationReadByConversationIdByUserIdParams {
  conversationId: string;
  userId: string;
}

export interface GetApiImConversationReadSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiImConversationSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiImGroupMemberByConversationIdByUserIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiImGroupMemberByConversationIdByUserIdParams {
  conversationId: string;
  userId: string;
}

export interface GetApiImGroupMemberSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiImMessageByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiImMessageByIdParams {
  id: string;
}

export interface GetApiImMessageSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiImTempFileByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiImTempFileByIdDownloadUrlData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiImTempFileByIdDownloadUrlParams {
  download?: string;
  id: string;
}

export interface GetApiImTempFileByIdParams {
  id: string;
}

export interface GetApiImTempFileSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeFavoriteCheckByResourceTypeByResourceIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeFavoriteCheckByResourceTypeByResourceIdParams {
  resourceId: string;
  resourceType: ResourceTypeEnum1;
}

export enum GetApiKnowledgeFavoriteCheckByResourceTypeByResourceIdParams1Enum {
  Folder = "folder",
  File = "file",
}

export enum GetApiKnowledgeFavoriteCheckByResourceTypeByResourceIdParams1ResourceTypeEnum {
  Folder = "folder",
  File = "file",
}

export interface GetApiKnowledgeFileByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeFileByIdParams {
  id: string;
}

export interface GetApiKnowledgeFileSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeFileVersionByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeFileVersionByIdParams {
  id: string;
}

export interface GetApiKnowledgeFileVersionSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeFolderByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeFolderByIdParams {
  id: string;
}

export interface GetApiKnowledgeFolderSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiMonitorMetricsParams {
  range?: string;
  type: string;
}

export interface GetApiMonitorProcessesParams {
  limit?: string;
  sortBy?: string;
}

export interface GetApiSystemCasbinRuleRoleByRoleKeyPermissionsData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemCasbinRuleRoleByRoleKeyPermissionsParams {
  roleKey: string;
}

export interface GetApiSystemCasbinRuleUserByUserIdRolesData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemCasbinRuleUserByUserIdRolesParams {
  userId: string;
}

export interface GetApiSystemConfigByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemConfigByIdParams {
  id: string;
}

export interface GetApiSystemConfigSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemDepartmentByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemDepartmentByIdParams {
  id: string;
}

export interface GetApiSystemDepartmentSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemDictByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemDictByIdParams {
  id: string;
}

export interface GetApiSystemDictGroupByKeyData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemDictGroupByKeyParams {
  /**
   * @minLength 1
   * @maxLength 100
   */
  key: string;
}

export interface GetApiSystemDictGroupSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemDictSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemJobByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemJobByIdParams {
  id: string;
}

export interface GetApiSystemJobLogByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemJobLogByIdParams {
  id: string;
}

export interface GetApiSystemJobLogSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemJobSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemLoginInfoByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemLoginInfoByIdParams {
  id: string;
}

export interface GetApiSystemLoginInfoSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemMenuByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemMenuByIdParams {
  id: string;
}

export interface GetApiSystemMenuSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemNoticeByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemNoticeByIdParams {
  id: string;
}

export interface GetApiSystemNoticeSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemOperationLogByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemOperationLogByIdParams {
  id: string;
}

export interface GetApiSystemOperationLogSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemPermissionByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemPermissionByIdParams {
  id: string;
}

export interface GetApiSystemPermissionSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemPermissionTreeData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemPostByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemPostByIdParams {
  id: string;
}

export interface GetApiSystemPostSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemRoleByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemRoleByIdParams {
  id: string;
}

export interface GetApiSystemRoleDepartmentByRoleIdByDepartmentIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemRoleDepartmentByRoleIdByDepartmentIdParams {
  departmentId: string;
  roleId: string;
}

export interface GetApiSystemRoleDepartmentSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemRoleMenuByRoleIdByMenuIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemRoleMenuByRoleIdByMenuIdParams {
  menuId: string;
  roleId: string;
}

export interface GetApiSystemRoleMenuRoleByRoleIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemRoleMenuRoleByRoleIdParams {
  roleId: string;
}

export interface GetApiSystemRoleMenuSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemRoleSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemTokenByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemTokenByIdParams {
  id: string;
}

export interface GetApiSystemTokenSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemUserByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemUserByIdParams {
  id: string;
}

export interface GetApiSystemUserPostByUserIdByPostIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemUserPostByUserIdByPostIdParams {
  postId: string;
  userId: string;
}

export interface GetApiSystemUserPostSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemUserPostUserByUserIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemUserPostUserByUserIdParams {
  userId: string;
}

export interface GetApiSystemUserRoleByUserIdByRoleIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemUserRoleByUserIdByRoleIdParams {
  roleId: string;
  userId: string;
}

export interface GetApiSystemUserRoleSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemUserRoleUserByUserIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiSystemUserRoleUserByUserIdParams {
  userId: string;
}

export interface GetApiSystemUserSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PermissionEnum {
  Read = "read",
  Write = "write",
  Delete = "delete",
  Manage = "manage",
}

export interface PostApiActionsExecuteByNameData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiActionsExecuteByNameParams {
  name: string;
}

export type PostApiActionsExecuteByNamePayload = any;

export interface PostApiAiAgentBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiAgentBatchPayload {
  data: {
    /** 头像 */
    avatar?: string | null;
    /** 主题颜色 */
    color?: string | null;
    /** 上下文压缩策略 */
    contextStrategy?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 描述 */
    description?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 描述 */
    inputSchema?: Record<string, any>;
    /** 最大循环次数 */
    maxLoops?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 模型ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    modelId: string;
    /**
     * Agent名称
     * @maxLength 64
     */
    name: string;
    /** 工具 */
    nativeTools?: string[];
    /** 描述 */
    outputSchema?: Record<string, any>;
    /**
     * 提供商ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    providerId: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 描述 */
    structuredOutput?: boolean;
    /** 支持循环 */
    supportLoop?: boolean;
    /** 系统提示词 */
    systemPrompt?: string | null;
    /** 温度参数 */
    temperature?: number | null;
    /** 工具 */
    toolIds?: string[];
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  }[];
}

export interface PostApiAiAgentData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiAgentMessageBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiAgentMessageBatchPayload {
  messages: {
    /** 内容 */
    content?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 内容类型
     * @minLength 2
     * @maxLength 2
     */
    contentType?: string;
    /** Created At */
    createdAt?: string;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 结束原因 */
    finishReason?: string | null;
    /**
     * ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 延迟(毫秒) */
    latencyMs?: number | null;
    /**
     * 角色
     * @maxLength 16
     */
    role: string;
    /** Token数量 */
    tokenUsage?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 工具调用 */
    toolCalls?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 工具结果 */
    toolResults?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
  }[];
  sessionId: string;
}

export interface PostApiAiAgentMessageData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiAgentMessagePayload {
  data: {
    /** 内容 */
    content?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 内容类型
     * @minLength 2
     * @maxLength 2
     */
    contentType?: string;
    /** Created At */
    createdAt?: string;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 结束原因 */
    finishReason?: string | null;
    /**
     * ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 延迟(毫秒) */
    latencyMs?: number | null;
    /**
     * 角色
     * @maxLength 16
     */
    role: string;
    /**
     * 会话ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    sessionId: string;
    /** Token数量 */
    tokenUsage?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 工具调用 */
    toolCalls?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 工具结果 */
    toolResults?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
  };
}

export interface PostApiAiAgentMessageQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiAiAgentMessageQueryFieldEnum {
  MsgSeq = "msgSeq",
  CreatedAt = "createdAt",
}

export enum PostApiAiAgentMessageQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiAiAgentMessageQueryPayload {
  filter?: {
    contentType?: string;
    contentTypes?: string[];
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    finishReason?: string;
    ids?: string[];
    msgSeqEnd?: number;
    msgSeqStart?: number;
    role?: string;
    roles?: string[];
    sessionId?: string;
    sessionIds?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiAiAgentMessageQueryFieldEnum;
    order: PostApiAiAgentMessageQueryOrderEnum;
  };
}

export interface PostApiAiAgentPayload {
  data: {
    /** 头像 */
    avatar?: string | null;
    /** 主题颜色 */
    color?: string | null;
    /** 上下文压缩策略 */
    contextStrategy?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 描述 */
    description?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 描述 */
    inputSchema?: Record<string, any>;
    /** 最大循环次数 */
    maxLoops?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 模型ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    modelId: string;
    /**
     * Agent名称
     * @maxLength 64
     */
    name: string;
    /** 工具 */
    nativeTools?: string[];
    /** 描述 */
    outputSchema?: Record<string, any>;
    /**
     * 提供商ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    providerId: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 描述 */
    structuredOutput?: boolean;
    /** 支持循环 */
    supportLoop?: boolean;
    /** 系统提示词 */
    systemPrompt?: string | null;
    /** 温度参数 */
    temperature?: number | null;
    /** 工具 */
    toolIds?: string[];
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiAiAgentQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiAiAgentQueryFieldEnum {
  Name = "name",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiAiAgentQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiAiAgentQueryPayload {
  filter?: {
    contextStrategy?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    modelId?: string;
    modelIds?: string[];
    name?: string;
    names?: string[];
    providerId?: string;
    providerIds?: string[];
    status?: string;
    supportLoop?: boolean;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiAiAgentQueryFieldEnum;
    order: PostApiAiAgentQueryOrderEnum;
  };
}

export interface PostApiAiAgentSessionData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiAgentSessionPayload {
  data: {
    /** Agent ID */
    agentId?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否归档 */
    isArchived?: boolean;
    /** 是否置顶 */
    isPinned?: boolean;
    /** 最后消息时间 */
    lastMessageAt?: string | null;
    /**
     * 消息数量
     * @min -2147483648
     * @max 2147483647
     */
    messageCount?: number;
    /** 模型ID */
    modelId?: string | null;
    /** 提供商ID */
    providerId?: string | null;
    /** 状态 */
    status?: string | null;
    /** 摘要 */
    summary?: string | null;
    /** 会话标题 */
    title?: string | null;
    /** Token用量 */
    tokenUsage?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId: string;
  };
}

export interface PostApiAiAgentSessionQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiAiAgentSessionQueryFieldEnum {
  Title = "title",
  LastMessageAt = "lastMessageAt",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  MessageCount = "messageCount",
}

export enum PostApiAiAgentSessionQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiAiAgentSessionQueryPayload {
  filter?: {
    agentId?: string;
    agentIds?: string[];
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    isArchived?: boolean;
    isPinned?: boolean;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    lastMessageAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    lastMessageAtStart?: string;
    status?: string;
    title?: string;
    userId?: string;
    userIds?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiAiAgentSessionQueryFieldEnum;
    order: PostApiAiAgentSessionQueryOrderEnum;
  };
}

export interface PostApiAiApiKeyByIdRevokeData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiApiKeyByIdRevokeParams {
  id: string;
}

export interface PostApiAiApiKeyData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiApiKeyPayload {
  data: {
    /** @default true */
    accessAll?: boolean;
    expiresAt?: string;
    /** @default [] */
    mcpServerIds?: string[];
    name: string;
    remark?: string;
  };
}

export interface PostApiAiApiKeyQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiAiApiKeyQueryFieldEnum {
  CreatedAt = "createdAt",
  Name = "name",
  LastUsedAt = "lastUsedAt",
}

export enum PostApiAiApiKeyQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiAiApiKeyQueryPayload {
  filter?: {
    ids?: string[];
    isRevoked?: boolean;
    name?: string;
    status?: string;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiAiApiKeyQueryFieldEnum;
    order: PostApiAiApiKeyQueryOrderEnum;
  };
}

export interface PostApiAiChatPayload {
  /** @format uuid */
  agentId?: string;
  maxSteps?: number;
  messages: {
    content?: string;
    id: string;
    parts?: (
      | {
          text: string;
          type: "text";
        }
      | {
          mediaType: string;
          type: "file";
          url: string;
        }
      | {
          type: string;
        }
    )[];
    role: PostApiAiChatRoleEnum;
  }[];
  /** @format uuid */
  modelId?: string;
  rewriteFromMsgSeq?: number;
  /** @format uuid */
  sessionId?: string;
  system?: string;
  toolChoice?: PostApiAiChatToolChoiceEnum;
  tools?: object;
}

export enum PostApiAiChatRoleEnum {
  User = "user",
  Assistant = "assistant",
  System = "system",
}

export enum PostApiAiChatToolChoiceEnum {
  Auto = "auto",
  None = "none",
  Required = "required",
}

export interface PostApiAiMcpServerData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiMcpServerPayload {
  data: {
    /** Actions列表 */
    actions?: (string | number | boolean | null) | Record<string, any> | any[];
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 描述 */
    description?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 公开访问 */
    isPublic?: boolean;
    /**
     * 服务名称
     * @maxLength 64
     */
    name: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiAiMcpServerQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiAiMcpServerQueryFieldEnum {
  CreatedAt = "createdAt",
  Name = "name",
}

export enum PostApiAiMcpServerQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiAiMcpServerQueryPayload {
  filter?: {
    ids?: string[];
    isPublic?: boolean;
    name?: string;
    status?: string;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiAiMcpServerQueryFieldEnum;
    order: PostApiAiMcpServerQueryOrderEnum;
  };
}

export interface PostApiAiModelBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiModelBatchPayload {
  data: {
    /** 缓存命中价格(元/百万Token) */
    cacheHitPricePerMillion?: string | null;
    /** 缓存未命中价格(元/百万Token) */
    cacheMissPricePerMillion?: string | null;
    /** 上下文窗口 */
    contextWindow?: number | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 输入价格(元/百万Token) */
    inputPricePerMillion?: string | null;
    /** 最大输入Token */
    maxInputTokens?: number | null;
    /** 最大输出Token */
    maxOutputTokens?: number | null;
    /** 最大思考Token */
    maxThinkingTokens?: number | null;
    /**
     * 模型标识
     * @maxLength 128
     */
    modelId: string;
    /**
     * 模型名称
     * @maxLength 128
     */
    name: string;
    /** 输出价格(元/百万Token) */
    outputPricePerMillion?: string | null;
    /**
     * 提供商ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    providerId: string;
    /** 推理强度 */
    reasoningEffort?: string | null;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 支持音频输入 */
    supportAudioInput?: boolean;
    /** 支持音频输出 */
    supportAudioOutput?: boolean;
    /** 支持FIM */
    supportFIM?: boolean;
    /** 支持图片输入 */
    supportImageInput?: boolean;
    /** 支持图片输出 */
    supportImageOutput?: boolean;
    /** 支持JSON输出 */
    supportJsonOutput?: boolean;
    /** 支持前缀补全 */
    supportPrefixCompletion?: boolean;
    /** 支持思考 */
    supportThinking?: boolean;
    /** 支持工具 */
    supportTools?: boolean;
    /** 支持视频输入 */
    supportVideoInput?: boolean;
    /** 支持视频输出 */
    supportVideoOutput?: boolean;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  }[];
}

export interface PostApiAiModelByIdTestData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiModelByIdTestParams {
  id: string;
}

export interface PostApiAiModelByIdTestPayload {
  /** @default "Hello, please respond with a brief greeting." */
  message?: string;
}

export interface PostApiAiModelData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiModelPayload {
  data: {
    /** 缓存命中价格(元/百万Token) */
    cacheHitPricePerMillion?: string | null;
    /** 缓存未命中价格(元/百万Token) */
    cacheMissPricePerMillion?: string | null;
    /** 上下文窗口 */
    contextWindow?: number | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 输入价格(元/百万Token) */
    inputPricePerMillion?: string | null;
    /** 最大输入Token */
    maxInputTokens?: number | null;
    /** 最大输出Token */
    maxOutputTokens?: number | null;
    /** 最大思考Token */
    maxThinkingTokens?: number | null;
    /**
     * 模型标识
     * @maxLength 128
     */
    modelId: string;
    /**
     * 模型名称
     * @maxLength 128
     */
    name: string;
    /** 输出价格(元/百万Token) */
    outputPricePerMillion?: string | null;
    /**
     * 提供商ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    providerId: string;
    /** 推理强度 */
    reasoningEffort?: string | null;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 支持音频输入 */
    supportAudioInput?: boolean;
    /** 支持音频输出 */
    supportAudioOutput?: boolean;
    /** 支持FIM */
    supportFIM?: boolean;
    /** 支持图片输入 */
    supportImageInput?: boolean;
    /** 支持图片输出 */
    supportImageOutput?: boolean;
    /** 支持JSON输出 */
    supportJsonOutput?: boolean;
    /** 支持前缀补全 */
    supportPrefixCompletion?: boolean;
    /** 支持思考 */
    supportThinking?: boolean;
    /** 支持工具 */
    supportTools?: boolean;
    /** 支持视频输入 */
    supportVideoInput?: boolean;
    /** 支持视频输出 */
    supportVideoOutput?: boolean;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiAiModelQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiAiModelQueryFieldEnum {
  Name = "name",
  ModelId = "modelId",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiAiModelQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiAiModelQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    modelId?: string;
    modelIds?: string[];
    name?: string;
    providerId?: string;
    providerIds?: string[];
    status?: string;
    supportTools?: boolean;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiAiModelQueryFieldEnum;
    order: PostApiAiModelQueryOrderEnum;
  };
}

export interface PostApiAiProviderBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiProviderBatchPayload {
  data: {
    /**
     * API地址
     * @maxLength 512
     */
    baseUrl: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 提供商名称
     * @maxLength 64
     */
    name: string;
    /**
     * 提供商类型
     * @maxLength 32
     */
    providerType?: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** API密钥 */
    token: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  }[];
}

export interface PostApiAiProviderData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiProviderPayload {
  data: {
    /**
     * API地址
     * @maxLength 512
     */
    baseUrl: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 提供商名称
     * @maxLength 64
     */
    name: string;
    /**
     * 提供商类型
     * @maxLength 32
     */
    providerType?: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** API密钥 */
    token: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiAiProviderQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiAiProviderQueryFieldEnum {
  Name = "name",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiAiProviderQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiAiProviderQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    name?: string;
    names?: string[];
    status?: string;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiAiProviderQueryFieldEnum;
    order: PostApiAiProviderQueryOrderEnum;
  };
}

export interface PostApiAiSessionData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiSessionMessageBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiSessionMessageBatchPayload {
  messages: {
    /** 内容 */
    content?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 内容类型
     * @minLength 2
     * @maxLength 2
     */
    contentType?: string;
    /** Created At */
    createdAt?: string;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 结束原因 */
    finishReason?: string | null;
    /**
     * ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 延迟(毫秒) */
    latencyMs?: number | null;
    /**
     * 角色
     * @maxLength 16
     */
    role: string;
    /** Token数量 */
    tokenUsage?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 工具调用 */
    toolCalls?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 工具结果 */
    toolResults?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
  }[];
  sessionId: string;
}

export interface PostApiAiSessionMessageData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiSessionMessagePayload {
  data: {
    /** 内容 */
    content?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 内容类型
     * @minLength 2
     * @maxLength 2
     */
    contentType?: string;
    /** Created At */
    createdAt?: string;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 结束原因 */
    finishReason?: string | null;
    /**
     * ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 延迟(毫秒) */
    latencyMs?: number | null;
    /**
     * 角色
     * @maxLength 16
     */
    role: string;
    /**
     * 会话ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    sessionId: string;
    /** Token数量 */
    tokenUsage?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 工具调用 */
    toolCalls?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 工具结果 */
    toolResults?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
  };
}

export interface PostApiAiSessionMessageQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiAiSessionMessageQueryFieldEnum {
  MsgSeq = "msgSeq",
  CreatedAt = "createdAt",
}

export enum PostApiAiSessionMessageQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiAiSessionMessageQueryPayload {
  filter?: {
    contentType?: string;
    contentTypes?: string[];
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    finishReason?: string;
    ids?: string[];
    msgSeqEnd?: number;
    msgSeqStart?: number;
    role?: string;
    roles?: string[];
    sessionId?: string;
    sessionIds?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiAiSessionMessageQueryFieldEnum;
    order: PostApiAiSessionMessageQueryOrderEnum;
  };
}

export interface PostApiAiSessionPayload {
  data: {
    /** Agent ID */
    agentId?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否归档 */
    isArchived?: boolean;
    /** 是否置顶 */
    isPinned?: boolean;
    /** 最后消息时间 */
    lastMessageAt?: string | null;
    /**
     * 消息数量
     * @min -2147483648
     * @max 2147483647
     */
    messageCount?: number;
    /** 模型ID */
    modelId?: string | null;
    /** 提供商ID */
    providerId?: string | null;
    /** 状态 */
    status?: string | null;
    /** 摘要 */
    summary?: string | null;
    /** 会话标题 */
    title?: string | null;
    /** Token用量 */
    tokenUsage?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId: string;
  };
}

export interface PostApiAiSessionQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiAiSessionQueryFieldEnum {
  Title = "title",
  LastMessageAt = "lastMessageAt",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  MessageCount = "messageCount",
}

export enum PostApiAiSessionQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiAiSessionQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    isArchived?: boolean;
    isPinned?: boolean;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    lastMessageAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    lastMessageAtStart?: string;
    status?: string;
    title?: string;
    userId?: string;
    userIds?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiAiSessionQueryFieldEnum;
    order: PostApiAiSessionQueryOrderEnum;
  };
}

export interface PostApiAiToolGroupBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiToolGroupBatchPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 描述 */
    description?: string | null;
    /** 图标 */
    icon?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 分组名称
     * @maxLength 64
     */
    name: string;
    /**
     * 排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 分组名称 */
    tools?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  }[];
}

export interface PostApiAiToolGroupData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiAiToolGroupPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 描述 */
    description?: string | null;
    /** 图标 */
    icon?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 分组名称
     * @maxLength 64
     */
    name: string;
    /**
     * 排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 分组名称 */
    tools?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiAiToolGroupQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiAiToolGroupQueryFieldEnum {
  Name = "name",
  OrderNum = "orderNum",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiAiToolGroupQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiAiToolGroupQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    name?: string;
    names?: string[];
    status?: string;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiAiToolGroupQueryFieldEnum;
    order: PostApiAiToolGroupQueryOrderEnum;
  };
}

export interface PostApiAuthLoginData {
  data: {
    accessToken: string;
    accessTokenExp: string;
    expiresIn: number;
    refreshToken: string;
    refreshTokenExp: string;
    user: {
      avatar: string | null;
      email: string | null;
      id: string;
      loginName: string;
      name: string | null;
    };
  };
  message: string;
  success: true;
}

export type PostApiAuthLoginError = {
  data: null;
  message: string;
  success: false;
};

export interface PostApiAuthLoginPayload {
  /** @minLength 1 */
  loginName: string;
  /** @minLength 1 */
  password: string;
}

export interface PostApiAuthLogoutData {
  data: null;
  message: string;
  success: true;
}

export type PostApiAuthLogoutError = {
  data: null;
  message: string;
  success: false;
};

export interface PostApiAuthRefreshData {
  data: {
    accessToken: string;
    accessTokenExp: string;
    expiresIn: number;
  };
  message: string;
  success: true;
}

export type PostApiAuthRefreshError = {
  data: null;
  message: string;
  success: false;
};

export interface PostApiAuthRefreshPayload {
  /** @minLength 1 */
  refreshToken: string;
}

export interface PostApiDevProjectCodeDirectoryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiDevProjectCodeDirectoryPayload {
  /** @default "" */
  relativePath?: string;
}

export interface PostApiDevProjectCodeFileData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiDevProjectCodeFilePayload {
  relativePath: string;
}

export interface PostApiFilesAiChatGetUrlData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesAiChatGetUrlPayload {
  storageKey: string;
}

export interface PostApiFilesAiChatUploadData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesAiChatUploadPayload {
  content: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  filename: string;
  mimeType: string;
}

export interface PostApiFilesByIdCopyAsDuplicateData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesByIdCopyAsDuplicateParams {
  id: string;
}

export interface PostApiFilesByIdCopyAsDuplicatePayload {
  targetFolderId: string | null;
}

export interface PostApiFilesByIdCopyData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesByIdCopyParams {
  id: string;
}

export interface PostApiFilesByIdCopyPayload {
  targetFolderId: string | null;
}

export interface PostApiFilesByIdMoveData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesByIdMoveParams {
  id: string;
}

export interface PostApiFilesByIdMovePayload {
  targetFolderId: string | null;
}

export interface PostApiFilesCheckExistsData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesCheckExistsPayload {
  folderId?: string | null;
  names: string[];
}

export interface PostApiFilesConfirmUploadData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesConfirmUploadPayload {
  description?: string;
  folderId?: string | null;
  mimeType: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  size: number;
  storageKey: string;
}

export interface PostApiFilesDeleteBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesDeleteBatchPayload {
  ids: string[];
}

export interface PostApiFilesFoldersByIdMoveData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesFoldersByIdMoveParams {
  id: string;
}

export interface PostApiFilesFoldersByIdMovePayload {
  targetParentId: string | null;
}

export interface PostApiFilesFoldersData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesFoldersPayload {
  color?: string;
  description?: string;
  icon?: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  parentId?: string | null;
}

export interface PostApiFilesPermissionByResourceTypeByResourceIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

/** @default "allow" */
export enum PostApiFilesPermissionByResourceTypeByResourceIdEffectEnum {
  Allow = "allow",
  Deny = "deny",
}

export interface PostApiFilesPermissionByResourceTypeByResourceIdParams {
  resourceId: string;
  resourceType: ResourceTypeEnum3;
}

export enum PostApiFilesPermissionByResourceTypeByResourceIdParams1Enum {
  File = "file",
  Folder = "folder",
}

export enum PostApiFilesPermissionByResourceTypeByResourceIdParams1ResourceTypeEnum {
  File = "file",
  Folder = "folder",
}

export interface PostApiFilesPermissionByResourceTypeByResourceIdPayload {
  permissions: {
    /** @default "allow" */
    effect?: PostApiFilesPermissionByResourceTypeByResourceIdEffectEnum;
    permission: PostApiFilesPermissionByResourceTypeByResourceIdPermissionEnum;
    subjectId: string;
    subjectType: PostApiFilesPermissionByResourceTypeByResourceIdSubjectTypeEnum;
  }[];
}

export enum PostApiFilesPermissionByResourceTypeByResourceIdPermissionEnum {
  Read = "read",
  Write = "write",
  Delete = "delete",
  Manage = "manage",
}

export enum PostApiFilesPermissionByResourceTypeByResourceIdSubjectTypeEnum {
  User = "user",
  Role = "role",
  Dept = "dept",
}

export interface PostApiFilesPermissionCheckData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesPermissionCheckPayload {
  permission: PostApiFilesPermissionCheckPermissionEnum;
  resourceId: string;
  resourceType: PostApiFilesPermissionCheckResourceTypeEnum;
  userId: string;
}

export enum PostApiFilesPermissionCheckPermissionEnum {
  Read = "read",
  Write = "write",
  Delete = "delete",
  Manage = "manage",
}

export enum PostApiFilesPermissionCheckResourceTypeEnum {
  File = "file",
  Folder = "folder",
}

export interface PostApiFilesPermissionCopyData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesPermissionCopyPayload {
  sourceId: string;
  sourceType: PostApiFilesPermissionCopySourceTypeEnum;
  targetId: string;
  targetType: PostApiFilesPermissionCopyTargetTypeEnum;
}

export enum PostApiFilesPermissionCopySourceTypeEnum {
  File = "file",
  Folder = "folder",
}

export enum PostApiFilesPermissionCopyTargetTypeEnum {
  File = "file",
  Folder = "folder",
}

export interface PostApiFilesPermissionData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

/** @default "allow" */
export enum PostApiFilesPermissionEffectEnum {
  Allow = "allow",
  Deny = "deny",
}

export interface PostApiFilesPermissionParentData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesPermissionParentPayload {
  parentFolderId: string | null;
  resourceId: string;
  resourceType: PostApiFilesPermissionParentResourceTypeEnum;
}

export enum PostApiFilesPermissionParentResourceTypeEnum {
  File = "file",
  Folder = "folder",
}

export interface PostApiFilesPermissionPayload {
  /** @default "allow" */
  effect?: PostApiFilesPermissionEffectEnum;
  permission: PostApiFilesPermissionPermissionEnum;
  resourceId: string;
  resourceType: PostApiFilesPermissionResourceTypeEnum;
  subjectId: string;
  subjectType: PostApiFilesPermissionSubjectTypeEnum;
}

export enum PostApiFilesPermissionPermissionEnum {
  Read = "read",
  Write = "write",
  Delete = "delete",
  Manage = "manage",
}

export enum PostApiFilesPermissionResourceTypeEnum {
  File = "file",
  Folder = "folder",
}

export enum PostApiFilesPermissionSubjectTypeEnum {
  User = "user",
  Role = "role",
  Dept = "dept",
}

export interface PostApiFilesShareFolderContentsData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesShareFolderContentsPayload {
  folderId: string;
  /**
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  viewMode: PostApiFilesShareFolderContentsViewModeEnum;
}

export enum PostApiFilesShareFolderContentsViewModeEnum {
  SharedWithMe = "shared-with-me",
  MyShared = "my-shared",
  Favorites = "favorites",
}

export interface PostApiFilesShareMySharedData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesShareMySharedPayload {
  /**
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
}

export interface PostApiFilesShareSharedWithMeData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesShareSharedWithMePayload {
  /**
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
}

export interface PostApiFilesUploadData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiFilesUploadForceConflictModeEnum {
  Overwrite = "overwrite",
  NewVersion = "newVersion",
  Copy = "copy",
}

export interface PostApiFilesUploadForceData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesUploadForcePayload {
  conflictMode: PostApiFilesUploadForceConflictModeEnum;
  content: string;
  description?: string;
  existingFileId?: string;
  folderId?: string | null;
  mimeType?: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
}

export interface PostApiFilesUploadPayload {
  content: string;
  description?: string;
  folderId?: string | null;
  mimeType?: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
}

export interface PostApiFilesUploadUrlData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesUploadUrlPayload {
  /**
   * @minLength 1
   * @maxLength 255
   */
  filename: string;
  folderId?: string | null;
  mimeType: string;
}

export interface PostApiFilesVersionsByIdRestoreData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiFilesVersionsByIdRestoreParams {
  id: string;
}

export interface PostApiImConversationByIdDissolveData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiImConversationByIdDissolveParams {
  id: string;
}

export interface PostApiImConversationData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiImConversationGroupData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiImConversationGroupPayload {
  avatar?: string;
  /** @minItems 1 */
  memberIds: string[];
  /**
   * @minLength 1
   * @maxLength 128
   */
  name: string;
}

export interface PostApiImConversationHiddenHideData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiImConversationHiddenHidePayload {
  conversationId: string;
}

export interface PostApiImConversationHiddenUnhideData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiImConversationHiddenUnhidePayload {
  conversationId: string;
  userId: string;
}

export interface PostApiImConversationPayload {
  data: {
    /** 群公告 */
    announcement?: string | null;
    /** 头像 */
    avatar?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否免打扰 */
    isMuted?: boolean;
    /** 是否置顶 */
    isTop?: boolean;
    /** 最后消息时间 */
    lastMessageAt?: string | null;
    /** 最后消息ID */
    lastMessageId?: string | null;
    /** 最大成员数 */
    maxMembers?: number | null;
    /**
     * 成员数量
     * @min -2147483648
     * @max 2147483647
     */
    memberCount?: number;
    /** 会话名称 */
    name?: string | null;
    /** 所有者ID */
    ownerId?: string | null;
    /** 状态 */
    status?: string | null;
    /**
     * 会话类型
     * @minLength 1
     * @maxLength 1
     */
    type?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiImConversationPrivateData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiImConversationPrivatePayload {
  targetUserId: string;
  targetUserName?: string;
}

export interface PostApiImConversationQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiImConversationQueryFieldEnum {
  Name = "name",
  LastMessageAt = "lastMessageAt",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  MemberCount = "memberCount",
}

export enum PostApiImConversationQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiImConversationQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    isMuted?: boolean;
    isTop?: boolean;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    lastMessageAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    lastMessageAtStart?: string;
    name?: string;
    ownerId?: string;
    status?: string;
    type?: string;
    types?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiImConversationQueryFieldEnum;
    order: PostApiImConversationQueryOrderEnum;
  };
}

export interface PostApiImConversationReadQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiImConversationReadQueryPayload {
  filter?: {
    conversationId?: string;
    conversationIds?: string[];
    userId?: string;
    userIds?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
}

export interface PostApiImGroupMemberBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiImGroupMemberBatchPayload {
  data: {
    /**
     * 会话ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    conversationId: string;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 邀请人ID */
    invitedById?: string | null;
    /** 是否禁言 */
    isMuted?: boolean;
    /** 加入时间 */
    joinedAt?: string;
    /** 禁言截止时间 */
    mutedUntil?: string | null;
    /** 群内昵称 */
    nickname?: string | null;
    /**
     * 角色
     * @minLength 1
     * @maxLength 1
     */
    role?: string;
    /**
     * 用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId: string;
  }[];
}

export interface PostApiImGroupMemberData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiImGroupMemberPayload {
  data: {
    /**
     * 会话ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    conversationId: string;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 邀请人ID */
    invitedById?: string | null;
    /** 是否禁言 */
    isMuted?: boolean;
    /** 加入时间 */
    joinedAt?: string;
    /** 禁言截止时间 */
    mutedUntil?: string | null;
    /** 群内昵称 */
    nickname?: string | null;
    /**
     * 角色
     * @minLength 1
     * @maxLength 1
     */
    role?: string;
    /**
     * 用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId: string;
  };
}

export interface PostApiImGroupMemberQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiImGroupMemberQueryFieldEnum {
  JoinedAt = "joinedAt",
  Role = "role",
}

export enum PostApiImGroupMemberQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiImGroupMemberQueryPayload {
  filter?: {
    conversationId?: string;
    conversationIds?: string[];
    isMuted?: boolean;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    joinedAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    joinedAtStart?: string;
    role?: string;
    roles?: string[];
    userId?: string;
    userIds?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiImGroupMemberQueryFieldEnum;
    order: PostApiImGroupMemberQueryOrderEnum;
  };
}

export interface PostApiImMessageData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiImMessagePayload {
  data: {
    /** @用户ID列表 */
    atUserIds: string[];
    /** 消息内容 */
    content: (string | number | boolean | null) | Record<string, any> | any[];
    /**
     * 会话ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    conversationId: string;
    /** Created At */
    createdAt?: string;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 转发来源ID */
    forwardFromId?: string | null;
    /**
     * ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否撤回 */
    isRecalled?: boolean;
    /**
     * 消息序号
     * @min -9007199254740991
     * @max 9007199254740991
     */
    msgSeq: number;
    /**
     * 消息类型
     * @minLength 2
     * @maxLength 2
     */
    msgType?: string;
    /** 撤回时间 */
    recalledAt?: string | null;
    /** 撤回者ID */
    recalledById?: string | null;
    /** 回复消息ID */
    replyToId?: string | null;
    /**
     * 发送者ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    senderId: string;
  };
}

export interface PostApiImMessageQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiImMessageQueryFieldEnum {
  MsgSeq = "msgSeq",
  CreatedAt = "createdAt",
}

export enum PostApiImMessageQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiImMessageQueryPayload {
  filter?: {
    conversationId?: string;
    conversationIds?: string[];
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    isRecalled?: boolean;
    msgSeqEnd?: number;
    msgSeqStart?: number;
    msgType?: string;
    msgTypes?: string[];
    senderId?: string;
    senderIds?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiImMessageQueryFieldEnum;
    order: PostApiImMessageQueryOrderEnum;
  };
}

export interface PostApiImTempFileData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiImTempFilePayload {
  data: {
    /**
     * 存储桶
     * @maxLength 128
     */
    bucket: string;
    /** 会话ID */
    conversationId?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** ETag */
    etag?: string | null;
    /** 过期时间 */
    expiresAt?: string | null;
    /** 扩展名 */
    extension?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 消息ID */
    messageId?: string | null;
    /** 元数据 */
    metadata?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** MIME类型 */
    mimeType?: string | null;
    /**
     * 文件名称
     * @maxLength 255
     */
    name: string;
    /**
     * 原始文件名
     * @maxLength 255
     */
    originalName: string;
    /** 区域 */
    region?: string | null;
    /**
     * 文件大小
     * @min -9007199254740991
     * @max 9007199254740991
     */
    size?: number;
    /** 状态 */
    status?: string | null;
    /**
     * 存储键
     * @maxLength 512
     */
    storageKey: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiImTempFileQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiImTempFileQueryFieldEnum {
  CreatedAt = "createdAt",
  ExpiresAt = "expiresAt",
  Size = "size",
}

export enum PostApiImTempFileQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiImTempFileQueryPayload {
  filter?: {
    conversationId?: string;
    conversationIds?: string[];
    createdAtEnd?: string;
    createdAtStart?: string;
    expiresAtBefore?: string;
    ids?: string[];
    messageId?: string;
    messageIds?: string[];
    mimeType?: string;
    status?: string;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiImTempFileQueryFieldEnum;
    order: PostApiImTempFileQueryOrderEnum;
  };
}

export interface PostApiImTempFileUploadData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiImTempFileUploadPayload {
  base64Data: string;
  conversationId?: string;
  fileName: string;
  mimeType: string;
}

export interface PostApiKnowledgeFavoriteCheckBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeFavoriteCheckBatchPayload {
  /** @default [] */
  fileIds?: string[];
  /** @default [] */
  folderIds?: string[];
}

export interface PostApiKnowledgeFavoriteData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeFavoriteListData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeFavoriteListPayload {
  /**
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** @default "all" */
  resourceType?: PostApiKnowledgeFavoriteListResourceTypeEnum;
}

/** @default "all" */
export enum PostApiKnowledgeFavoriteListResourceTypeEnum {
  Folder = "folder",
  File = "file",
  All = "all",
}

export interface PostApiKnowledgeFavoritePayload {
  resourceId: string;
  resourceType: PostApiKnowledgeFavoriteResourceTypeEnum;
}

export enum PostApiKnowledgeFavoriteResourceTypeEnum {
  Folder = "folder",
  File = "file",
}

export interface PostApiKnowledgeFileBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeFileBatchPayload {
  data: {
    /**
     * 存储桶
     * @maxLength 128
     */
    bucket: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 描述 */
    description?: string | null;
    /**
     * 下载次数
     * @min -2147483648
     * @max 2147483647
     */
    downloadCount?: number;
    /** ETag */
    etag?: string | null;
    /** 扩展名 */
    extension?: string | null;
    /** 文件夹ID */
    folderId?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 公开 */
    isPublic?: boolean;
    /** 元数据 */
    metadata?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** MIME类型 */
    mimeType?: string | null;
    /**
     * 文件名称
     * @maxLength 255
     */
    name: string;
    /**
     * 原始文件名
     * @maxLength 255
     */
    originalName: string;
    /** 处理结果 */
    processResult?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 处理状态 */
    processStatus?: string | null;
    /** 区域 */
    region?: string | null;
    /**
     * 文件大小
     * @min -9007199254740991
     * @max 9007199254740991
     */
    size?: number;
    /** 状态 */
    status?: string | null;
    /** 存储类型 */
    storageClass?: string | null;
    /**
     * 存储键
     * @maxLength 512
     */
    storageKey: string;
    /** 标签 */
    tags: string[];
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 下载次数
     * @min -2147483648
     * @max 2147483647
     */
    versionCount?: number;
    /** 版本ID */
    versionId?: string | null;
  }[];
}

export interface PostApiKnowledgeFileData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeFilePayload {
  data: {
    /**
     * 存储桶
     * @maxLength 128
     */
    bucket: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 描述 */
    description?: string | null;
    /**
     * 下载次数
     * @min -2147483648
     * @max 2147483647
     */
    downloadCount?: number;
    /** ETag */
    etag?: string | null;
    /** 扩展名 */
    extension?: string | null;
    /** 文件夹ID */
    folderId?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 公开 */
    isPublic?: boolean;
    /** 元数据 */
    metadata?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** MIME类型 */
    mimeType?: string | null;
    /**
     * 文件名称
     * @maxLength 255
     */
    name: string;
    /**
     * 原始文件名
     * @maxLength 255
     */
    originalName: string;
    /** 处理结果 */
    processResult?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 处理状态 */
    processStatus?: string | null;
    /** 区域 */
    region?: string | null;
    /**
     * 文件大小
     * @min -9007199254740991
     * @max 9007199254740991
     */
    size?: number;
    /** 状态 */
    status?: string | null;
    /** 存储类型 */
    storageClass?: string | null;
    /**
     * 存储键
     * @maxLength 512
     */
    storageKey: string;
    /** 标签 */
    tags: string[];
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 下载次数
     * @min -2147483648
     * @max 2147483647
     */
    versionCount?: number;
    /** 版本ID */
    versionId?: string | null;
  };
}

export interface PostApiKnowledgeFileQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiKnowledgeFileQueryFieldEnum {
  Name = "name",
  Size = "size",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiKnowledgeFileQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiKnowledgeFileQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    extension?: string;
    extensions?: string[];
    folderId?: string | null;
    ids?: string[];
    mimeType?: string;
    name?: string;
    names?: string[];
    processStatus?: PostApiKnowledgeFileQueryProcessStatusEnum;
    status?: PostApiKnowledgeFileQueryStatusEnum;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiKnowledgeFileQueryFieldEnum;
    order: PostApiKnowledgeFileQueryOrderEnum;
  };
}

export enum PostApiKnowledgeFileQueryProcessStatusEnum {
  Value0 = "0",
  Value1 = "1",
  Value2 = "2",
}

export enum PostApiKnowledgeFileQueryStatusEnum {
  Value0 = "0",
  Value1 = "1",
}

export interface PostApiKnowledgeFileVersionBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeFileVersionBatchPayload {
  data: {
    /** S3版本ID */
    s3VersionId?: string | null;
    /**
     * 存储桶
     * @maxLength 128
     */
    bucket: string;
    /** 变更日志 */
    changeLog?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建人
     * @maxLength 64
     */
    createdBy: string;
    /** 创建人ID */
    createdById?: string | null;
    /** ETag */
    etag?: string | null;
    /**
     * 文件ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    fileId: string;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 文件大小
     * @min -9007199254740991
     * @max 9007199254740991
     */
    size?: number;
    /**
     * 存储键
     * @maxLength 512
     */
    storageKey: string;
    /**
     * 版本号
     * @maxLength 32
     */
    versionNumber: string;
  }[];
}

export interface PostApiKnowledgeFileVersionData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeFileVersionPayload {
  data: {
    /** S3版本ID */
    s3VersionId?: string | null;
    /**
     * 存储桶
     * @maxLength 128
     */
    bucket: string;
    /** 变更日志 */
    changeLog?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建人
     * @maxLength 64
     */
    createdBy: string;
    /** 创建人ID */
    createdById?: string | null;
    /** ETag */
    etag?: string | null;
    /**
     * 文件ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    fileId: string;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 文件大小
     * @min -9007199254740991
     * @max 9007199254740991
     */
    size?: number;
    /**
     * 存储键
     * @maxLength 512
     */
    storageKey: string;
    /**
     * 版本号
     * @maxLength 32
     */
    versionNumber: string;
  };
}

export interface PostApiKnowledgeFileVersionQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiKnowledgeFileVersionQueryFieldEnum {
  VersionNumber = "versionNumber",
  Size = "size",
  CreatedAt = "createdAt",
}

export enum PostApiKnowledgeFileVersionQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiKnowledgeFileVersionQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    fileId?: string;
    fileIds?: string[];
    ids?: string[];
    versionNumber?: string;
    versionNumbers?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiKnowledgeFileVersionQueryFieldEnum;
    order: PostApiKnowledgeFileVersionQueryOrderEnum;
  };
}

export interface PostApiKnowledgeFolderBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeFolderBatchPayload {
  data: {
    /** 颜色 */
    color?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 描述 */
    description?: string | null;
    /** 图标 */
    icon?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否公开 */
    isPublic?: boolean;
    /**
     * 文件夹名称
     * @maxLength 255
     */
    name: string;
    /**
     * 排序号
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父文件夹ID */
    parentId?: string | null;
    /** 路径 */
    path: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  }[];
}

export interface PostApiKnowledgeFolderData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeFolderPayload {
  data: {
    /** 颜色 */
    color?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 描述 */
    description?: string | null;
    /** 图标 */
    icon?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否公开 */
    isPublic?: boolean;
    /**
     * 文件夹名称
     * @maxLength 255
     */
    name: string;
    /**
     * 排序号
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父文件夹ID */
    parentId?: string | null;
    /** 路径 */
    path: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiKnowledgeFolderQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiKnowledgeFolderQueryFieldEnum {
  Name = "name",
  OrderNum = "orderNum",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiKnowledgeFolderQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiKnowledgeFolderQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    name?: string;
    names?: string[];
    parentId?: string | null;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiKnowledgeFolderQueryFieldEnum;
    order: PostApiKnowledgeFolderQueryOrderEnum;
  };
}

export interface PostApiMonitorProcessesByPidKillParams {
  pid: string;
}

export enum PostApiPublicUploadAvatarCategoryEnum {
  AgentAvatar = "agent-avatar",
  UserAvatar = "user-avatar",
  GroupAvatar = "group-avatar",
}

export interface PostApiPublicUploadAvatarData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiPublicUploadAvatarPayload {
  category: PostApiPublicUploadAvatarCategoryEnum;
  content: string;
  /**
   * @minLength 1
   * @maxLength 255
   */
  filename: string;
  mimeType: string;
}

export interface PostApiSystemConfigBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemConfigBatchPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 系统内置 */
    isSystem?: boolean;
    /**
     * 配置键
     * @maxLength 128
     */
    key: string;
    /**
     * 配置名称
     * @maxLength 128
     */
    name: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 配置值
     * @maxLength 512
     */
    value: string;
  }[];
}

export interface PostApiSystemConfigData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemConfigPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 系统内置 */
    isSystem?: boolean;
    /**
     * 配置键
     * @maxLength 128
     */
    key: string;
    /**
     * 配置名称
     * @maxLength 128
     */
    name: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 配置值
     * @maxLength 512
     */
    value: string;
  };
}

export interface PostApiSystemConfigQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemConfigQueryFieldEnum {
  Name = "name",
  Key = "key",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiSystemConfigQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemConfigQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    isSystem?: boolean;
    key?: string;
    keys?: string[];
    name?: string;
    names?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemConfigQueryFieldEnum;
    order: PostApiSystemConfigQueryOrderEnum;
  };
}

export interface PostApiSystemDepartmentBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemDepartmentBatchPayload {
  data: {
    /** 祖级列表 */
    ancestors?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 邮箱 */
    email?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 负责人 */
    leader?: string | null;
    /**
     * 部门名称
     * @maxLength 50
     */
    name: string;
    /**
     * 显示排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父部门ID */
    parentId?: string | null;
    /** 联系电话 */
    phone?: string | null;
    /** 部门状态 */
    status?: boolean;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  }[];
}

export interface PostApiSystemDepartmentData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemDepartmentPayload {
  data: {
    /** 祖级列表 */
    ancestors?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 邮箱 */
    email?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 负责人 */
    leader?: string | null;
    /**
     * 部门名称
     * @maxLength 50
     */
    name: string;
    /**
     * 显示排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父部门ID */
    parentId?: string | null;
    /** 联系电话 */
    phone?: string | null;
    /** 部门状态 */
    status?: boolean;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiSystemDepartmentQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemDepartmentQueryFieldEnum {
  Name = "name",
  OrderNum = "orderNum",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiSystemDepartmentQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemDepartmentQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    name?: string;
    names?: string[];
    parentId?: string | null;
    status?: boolean;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemDepartmentQueryFieldEnum;
    order: PostApiSystemDepartmentQueryOrderEnum;
  };
}

export interface PostApiSystemDictBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemDictBatchPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 样式属性 */
    cssClass?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /**
     * 字典分组
     * @maxLength 100
     */
    group: string;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否默认 */
    isDefault?: boolean;
    /**
     * 字典标签
     * @maxLength 100
     */
    label: string;
    /** 表格样式 */
    listClass?: string | null;
    /** 备注 */
    remark?: string | null;
    /**
     * 字典排序
     * @min -2147483648
     * @max 2147483647
     */
    sort?: number;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 字典键值
     * @maxLength 100
     */
    value: string;
  }[];
}

export interface PostApiSystemDictData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemDictGroupBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemDictGroupBatchPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 分组键
     * @maxLength 100
     */
    key: string;
    /**
     * 分组名称
     * @maxLength 100
     */
    name: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  }[];
}

export interface PostApiSystemDictGroupData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemDictGroupPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 分组键
     * @maxLength 100
     */
    key: string;
    /**
     * 分组名称
     * @maxLength 100
     */
    name: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiSystemDictGroupQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemDictGroupQueryFieldEnum {
  Key = "key",
  Name = "name",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiSystemDictGroupQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemDictGroupQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    key?: string;
    keys?: string[];
    name?: string;
    names?: string[];
    status?: PostApiSystemDictGroupQueryStatusEnum;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemDictGroupQueryFieldEnum;
    order: PostApiSystemDictGroupQueryOrderEnum;
  };
}

export enum PostApiSystemDictGroupQueryStatusEnum {
  Value0 = "0",
  Value1 = "1",
}

export interface PostApiSystemDictPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 样式属性 */
    cssClass?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /**
     * 字典分组
     * @maxLength 100
     */
    group: string;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否默认 */
    isDefault?: boolean;
    /**
     * 字典标签
     * @maxLength 100
     */
    label: string;
    /** 表格样式 */
    listClass?: string | null;
    /** 备注 */
    remark?: string | null;
    /**
     * 字典排序
     * @min -2147483648
     * @max 2147483647
     */
    sort?: number;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 字典键值
     * @maxLength 100
     */
    value: string;
  };
}

export interface PostApiSystemDictQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemDictQueryFieldEnum {
  Group = "group",
  Label = "label",
  Sort = "sort",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiSystemDictQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemDictQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    group?: string;
    groups?: string[];
    ids?: string[];
    isDefault?: boolean;
    label?: string;
    labels?: string[];
    status?: PostApiSystemDictQueryStatusEnum;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemDictQueryFieldEnum;
    order: PostApiSystemDictQueryOrderEnum;
  };
}

export enum PostApiSystemDictQueryStatusEnum {
  Value0 = "0",
  Value1 = "1",
}

export interface PostApiSystemJobBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemJobData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemJobLogBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemJobLogData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemJobLogQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemJobLogQueryFieldEnum {
  JobName = "jobName",
  JobGroup = "jobGroup",
  StartTime = "startTime",
  StopTime = "stopTime",
  CreatedAt = "createdAt",
}

export enum PostApiSystemJobLogQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemJobLogQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    jobGroup?: string;
    jobGroups?: string[];
    jobName?: string;
    jobNames?: string[];
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    startTimeEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    startTimeStart?: string;
    status?: PostApiSystemJobLogQueryStatusEnum;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemJobLogQueryFieldEnum;
    order: PostApiSystemJobLogQueryOrderEnum;
  };
}

export enum PostApiSystemJobLogQueryStatusEnum {
  Value0 = "0",
  Value1 = "1",
}

export interface PostApiSystemJobQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemJobQueryFieldEnum {
  Name = "name",
  Group = "group",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiSystemJobQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemJobQueryPayload {
  filter?: {
    concurrent?: boolean;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    group?: string;
    groups?: string[];
    ids?: string[];
    name?: string;
    names?: string[];
    status?: PostApiSystemJobQueryStatusEnum;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemJobQueryFieldEnum;
    order: PostApiSystemJobQueryOrderEnum;
  };
}

export enum PostApiSystemJobQueryStatusEnum {
  Value0 = "0",
  Value1 = "1",
}

export interface PostApiSystemLoginInfoData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemLoginInfoQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemLoginInfoQueryFieldEnum {
  LoginName = "loginName",
  Ipaddr = "ipaddr",
  LoginTime = "loginTime",
  CreatedAt = "createdAt",
}

export enum PostApiSystemLoginInfoQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemLoginInfoQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    ipaddr?: string;
    loginName?: string;
    loginNames?: string[];
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    loginTimeEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    loginTimeStart?: string;
    status?: PostApiSystemLoginInfoQueryStatusEnum;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemLoginInfoQueryFieldEnum;
    order: PostApiSystemLoginInfoQueryOrderEnum;
  };
}

export enum PostApiSystemLoginInfoQueryStatusEnum {
  Value0 = "0",
  Value1 = "1",
}

export interface PostApiSystemMenuBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemMenuBatchPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 菜单图标 */
    icon?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否缓存 */
    isCache?: boolean;
    /** 是否外链 */
    isFrame?: boolean;
    /** 是否系统菜单 */
    isSystem?: boolean;
    /** 外链打开方式 */
    linkTarget?: string | null;
    /** 外链地址 */
    linkUrl?: string | null;
    /**
     * 菜单名称
     * @maxLength 50
     */
    name: string;
    /**
     * 显示排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父菜单ID */
    parentId?: string | null;
    /** 路由地址 */
    path?: string | null;
    /** 权限标识 */
    perms?: string | null;
    /** 备注 */
    remark?: string | null;
    /**
     * 菜单类型
     * @maxLength 1
     */
    type: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
    /** 是否显示 */
    visible?: boolean;
  }[];
}

export interface PostApiSystemMenuData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemMenuPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 菜单图标 */
    icon?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否缓存 */
    isCache?: boolean;
    /** 是否外链 */
    isFrame?: boolean;
    /** 是否系统菜单 */
    isSystem?: boolean;
    /** 外链打开方式 */
    linkTarget?: string | null;
    /** 外链地址 */
    linkUrl?: string | null;
    /**
     * 菜单名称
     * @maxLength 50
     */
    name: string;
    /**
     * 显示排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父菜单ID */
    parentId?: string | null;
    /** 路由地址 */
    path?: string | null;
    /** 权限标识 */
    perms?: string | null;
    /** 备注 */
    remark?: string | null;
    /**
     * 菜单类型
     * @maxLength 1
     */
    type: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
    /** 是否显示 */
    visible?: boolean;
  };
}

export interface PostApiSystemMenuQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemMenuQueryFieldEnum {
  Name = "name",
  OrderNum = "orderNum",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiSystemMenuQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemMenuQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    name?: string;
    names?: string[];
    parentId?: string | null;
    type?: string;
    types?: string[];
    visible?: boolean;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemMenuQueryFieldEnum;
    order: PostApiSystemMenuQueryOrderEnum;
  };
}

export interface PostApiSystemNoticeBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemNoticeBatchPayload {
  data: {
    /** 公告内容 */
    content: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 状态 */
    status?: string | null;
    /**
     * 公告标题
     * @maxLength 50
     */
    title: string;
    /**
     * 公告类型
     * @maxLength 1
     */
    type: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  }[];
}

export interface PostApiSystemNoticeData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemNoticePayload {
  data: {
    /** 公告内容 */
    content: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 状态 */
    status?: string | null;
    /**
     * 公告标题
     * @maxLength 50
     */
    title: string;
    /**
     * 公告类型
     * @maxLength 1
     */
    type: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiSystemNoticeQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemNoticeQueryFieldEnum {
  Title = "title",
  Type = "type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiSystemNoticeQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemNoticeQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    status?: PostApiSystemNoticeQueryStatusEnum;
    title?: string;
    titles?: string[];
    type?: string;
    types?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemNoticeQueryFieldEnum;
    order: PostApiSystemNoticeQueryOrderEnum;
  };
}

export enum PostApiSystemNoticeQueryStatusEnum {
  Value0 = "0",
  Value1 = "1",
}

export interface PostApiSystemOperationLogData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemOperationLogQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemOperationLogQueryFieldEnum {
  Title = "title",
  Name = "name",
  Time = "time",
}

export enum PostApiSystemOperationLogQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemOperationLogQueryPayload {
  filter?: {
    ids?: string[];
    name?: string;
    names?: string[];
    status?: PostApiSystemOperationLogQueryStatusEnum;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    timeEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    timeStart?: string;
    title?: string;
    titles?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemOperationLogQueryFieldEnum;
    order: PostApiSystemOperationLogQueryOrderEnum;
  };
}

export enum PostApiSystemOperationLogQueryStatusEnum {
  Value0 = "0",
  Value1 = "1",
}

export interface PostApiSystemPermissionData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemPermissionPayload {
  data: {
    /** 操作类型 */
    action?: string | null;
    /**
     * 权限标识
     * @maxLength 100
     */
    code: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 权限描述 */
    description?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 所属模块 */
    module?: string | null;
    /**
     * 权限名称
     * @maxLength 100
     */
    name: string;
    /**
     * 排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父权限ID */
    parentId?: string | null;
    /** 资源名称 */
    resource?: string | null;
    /** 状态 */
    status?: boolean;
    /**
     * 权限类型
     * @maxLength 20
     */
    type?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiSystemPermissionQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemPermissionQueryFieldEnum {
  Code = "code",
  Name = "name",
  OrderNum = "orderNum",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiSystemPermissionQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemPermissionQueryPayload {
  filter?: {
    code?: string;
    codes?: string[];
    ids?: string[];
    modules?: string[];
    name?: string;
    parentId?: string | null;
    status?: boolean;
    types?: string[];
  };
  /**
   * @min 1
   * @max 1000
   * @default 100
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemPermissionQueryFieldEnum;
    order: PostApiSystemPermissionQueryOrderEnum;
  };
}

export interface PostApiSystemPostBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemPostBatchPayload {
  data: {
    /**
     * 岗位编码
     * @maxLength 64
     */
    code: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 岗位名称
     * @maxLength 50
     */
    name: string;
    /**
     * 显示排序
     * @maxLength 10
     */
    sort: string;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  }[];
}

export interface PostApiSystemPostData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemPostPayload {
  data: {
    /**
     * 岗位编码
     * @maxLength 64
     */
    code: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 岗位名称
     * @maxLength 50
     */
    name: string;
    /**
     * 显示排序
     * @maxLength 10
     */
    sort: string;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiSystemPostQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemPostQueryFieldEnum {
  Code = "code",
  Name = "name",
  Sort = "sort",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiSystemPostQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemPostQueryPayload {
  filter?: {
    code?: string;
    codes?: string[];
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    name?: string;
    names?: string[];
    status?: PostApiSystemPostQueryStatusEnum;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemPostQueryFieldEnum;
    order: PostApiSystemPostQueryOrderEnum;
  };
}

export enum PostApiSystemPostQueryStatusEnum {
  Value0 = "0",
  Value1 = "1",
}

export interface PostApiSystemRoleBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemRoleBatchPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 数据范围 */
    dataScope?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 角色描述 */
    description?: string | null;
    /** 角色标识 */
    flag?: boolean | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 权限字符串
     * @maxLength 100
     */
    key: string;
    /**
     * 角色名称
     * @maxLength 30
     */
    name: string;
    /**
     * 显示排序
     * @min -2147483648
     * @max 2147483647
     */
    sort?: number;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  }[];
}

export interface PostApiSystemRoleData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemRoleDepartmentBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemRoleDepartmentBatchPayload {
  data: {
    /**
     * 部门ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    departmentId: string;
    /**
     * 角色ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    roleId: string;
  }[];
}

export interface PostApiSystemRoleDepartmentData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemRoleDepartmentPayload {
  data: {
    /**
     * 部门ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    departmentId: string;
    /**
     * 角色ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    roleId: string;
  };
}

export interface PostApiSystemRoleDepartmentQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemRoleDepartmentQueryFieldEnum {
  RoleId = "roleId",
  DepartmentId = "departmentId",
}

export enum PostApiSystemRoleDepartmentQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemRoleDepartmentQueryPayload {
  filter?: {
    departmentId?: string;
    departmentIds?: string[];
    roleId?: string;
    roleIds?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemRoleDepartmentQueryFieldEnum;
    order: PostApiSystemRoleDepartmentQueryOrderEnum;
  };
}

export interface PostApiSystemRoleMenuBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemRoleMenuBatchPayload {
  data: {
    /**
     * 菜单ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    menuId: string;
    /**
     * 角色ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    roleId: string;
  }[];
}

export interface PostApiSystemRoleMenuData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemRoleMenuPayload {
  data: {
    /**
     * 菜单ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    menuId: string;
    /**
     * 角色ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    roleId: string;
  };
}

export interface PostApiSystemRoleMenuQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemRoleMenuQueryFieldEnum {
  RoleId = "roleId",
  MenuId = "menuId",
}

export enum PostApiSystemRoleMenuQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemRoleMenuQueryPayload {
  filter?: {
    menuId?: string;
    menuIds?: string[];
    roleId?: string;
    roleIds?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemRoleMenuQueryFieldEnum;
    order: PostApiSystemRoleMenuQueryOrderEnum;
  };
}

export interface PostApiSystemRolePayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 数据范围 */
    dataScope?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 角色描述 */
    description?: string | null;
    /** 角色标识 */
    flag?: boolean | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 权限字符串
     * @maxLength 100
     */
    key: string;
    /**
     * 角色名称
     * @maxLength 30
     */
    name: string;
    /**
     * 显示排序
     * @min -2147483648
     * @max 2147483647
     */
    sort?: number;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PostApiSystemRoleQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemRoleQueryFieldEnum {
  Name = "name",
  Key = "key",
  Sort = "sort",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

export enum PostApiSystemRoleQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemRoleQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    ids?: string[];
    key?: string;
    keys?: string[];
    name?: string;
    names?: string[];
    status?: PostApiSystemRoleQueryStatusEnum;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemRoleQueryFieldEnum;
    order: PostApiSystemRoleQueryOrderEnum;
  };
}

export enum PostApiSystemRoleQueryStatusEnum {
  Value0 = "0",
  Value1 = "1",
}

export interface PostApiSystemTokenData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemTokenPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 过期时间 */
    exp: string;
    /** 签发时间 */
    iat?: string;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否已撤销 */
    isRevoked?: boolean;
    /**
     * 令牌类型
     * @maxLength 64
     */
    jti: string;
    /** 撤销时间 */
    revokedAt?: string | null;
    /** 权限范围 */
    scopes: string[];
    /**
     * 令牌值
     * @maxLength 128
     */
    sub: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 授权用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId: string;
  };
}

export interface PostApiSystemTokenQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemTokenQueryFieldEnum {
  CreatedAt = "createdAt",
  Exp = "exp",
  Iat = "iat",
}

export enum PostApiSystemTokenQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemTokenQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    expEnd?: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    expStart?: string;
    ids?: string[];
    isRevoked?: boolean;
    userId?: string;
    userIds?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemTokenQueryFieldEnum;
    order: PostApiSystemTokenQueryOrderEnum;
  };
}

export interface PostApiSystemUserBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemUserByIdResetPasswordData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemUserByIdResetPasswordParams {
  id: string;
}

export interface PostApiSystemUserData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemUserPostBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemUserPostBatchPayload {
  data: {
    /**
     * 岗位ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    postId: string;
    /**
     * 用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId: string;
  }[];
}

export interface PostApiSystemUserPostData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemUserPostPayload {
  data: {
    /**
     * 岗位ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    postId: string;
    /**
     * 用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId: string;
  };
}

export interface PostApiSystemUserPostQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemUserPostQueryFieldEnum {
  UserId = "userId",
  PostId = "postId",
}

export enum PostApiSystemUserPostQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemUserPostQueryPayload {
  filter?: {
    postId?: string;
    postIds?: string[];
    userId?: string;
    userIds?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemUserPostQueryFieldEnum;
    order: PostApiSystemUserPostQueryOrderEnum;
  };
}

export interface PostApiSystemUserQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemUserQueryFieldEnum {
  LoginName = "loginName",
  Name = "name",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  LoginDate = "loginDate",
}

export enum PostApiSystemUserQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemUserQueryPayload {
  filter?: {
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart: string;
    deptId: string;
    email: string;
    ids: string[];
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    loginDateEnd: string;
    /**
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    loginDateStart: string;
    loginName: string;
    loginNames: string[];
    name: string;
    phonenumber: string;
    sex: string;
    status: string;
    userType: string;
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemUserQueryFieldEnum;
    order: PostApiSystemUserQueryOrderEnum;
  };
}

export interface PostApiSystemUserRoleBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemUserRoleBatchPayload {
  data: {
    /**
     * 角色ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    roleId: string;
    /**
     * 用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId: string;
  }[];
}

export interface PostApiSystemUserRoleData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemUserRolePayload {
  data: {
    /**
     * 角色ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    roleId: string;
    /**
     * 用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId: string;
  };
}

export interface PostApiSystemUserRoleQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PostApiSystemUserRoleQueryFieldEnum {
  UserId = "userId",
  RoleId = "roleId",
}

export enum PostApiSystemUserRoleQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemUserRoleQueryPayload {
  filter?: {
    roleId?: string;
    roleIds?: string[];
    userId?: string;
    userIds?: string[];
  };
  /**
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    field: PostApiSystemUserRoleQueryFieldEnum;
    order: PostApiSystemUserRoleQueryOrderEnum;
  };
}

export interface PutApiAiAgentBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiAgentBatchPayload {
  data: {
    /** 头像 */
    avatar?: string | null;
    /** 主题颜色 */
    color?: string | null;
    /** 上下文压缩策略 */
    contextStrategy?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 描述 */
    description?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 描述 */
    inputSchema?: Record<string, any>;
    /** 最大循环次数 */
    maxLoops?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 模型ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    modelId?: string;
    /**
     * Agent名称
     * @maxLength 64
     */
    name?: string;
    /** 工具 */
    nativeTools?: string[];
    /** 描述 */
    outputSchema?: Record<string, any>;
    /**
     * 提供商ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    providerId?: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 描述 */
    structuredOutput?: boolean;
    /** 支持循环 */
    supportLoop?: boolean;
    /** 系统提示词 */
    systemPrompt?: string | null;
    /** 温度参数 */
    temperature?: number | null;
    /** 工具 */
    toolIds?: string[];
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
  ids: string[];
}

export interface PutApiAiAgentByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiAgentByIdParams {
  id: string;
}

export interface PutApiAiAgentByIdPayload {
  data: {
    /** 头像 */
    avatar?: string | null;
    /** 主题颜色 */
    color?: string | null;
    /** 上下文压缩策略 */
    contextStrategy?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 描述 */
    description?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 描述 */
    inputSchema?: Record<string, any>;
    /** 最大循环次数 */
    maxLoops?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 模型ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    modelId?: string;
    /**
     * Agent名称
     * @maxLength 64
     */
    name?: string;
    /** 工具 */
    nativeTools?: string[];
    /** 描述 */
    outputSchema?: Record<string, any>;
    /**
     * 提供商ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    providerId?: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 描述 */
    structuredOutput?: boolean;
    /** 支持循环 */
    supportLoop?: boolean;
    /** 系统提示词 */
    systemPrompt?: string | null;
    /** 温度参数 */
    temperature?: number | null;
    /** 工具 */
    toolIds?: string[];
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiAiAgentSessionByIdArchiveData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiAgentSessionByIdArchiveParams {
  id: string;
}

export interface PutApiAiAgentSessionByIdArchivePayload {
  isArchived: boolean;
}

export interface PutApiAiAgentSessionByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiAgentSessionByIdParams {
  id: string;
}

export interface PutApiAiAgentSessionByIdPayload {
  data: {
    /** Agent ID */
    agentId?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否归档 */
    isArchived?: boolean;
    /** 是否置顶 */
    isPinned?: boolean;
    /** 最后消息时间 */
    lastMessageAt?: string | null;
    /**
     * 消息数量
     * @min -2147483648
     * @max 2147483647
     */
    messageCount?: number;
    /** 模型ID */
    modelId?: string | null;
    /** 提供商ID */
    providerId?: string | null;
    /** 状态 */
    status?: string | null;
    /** 摘要 */
    summary?: string | null;
    /** 会话标题 */
    title?: string | null;
    /** Token用量 */
    tokenUsage?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId?: string;
  };
}

export interface PutApiAiAgentSessionByIdPinData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiAgentSessionByIdPinParams {
  id: string;
}

export interface PutApiAiAgentSessionByIdPinPayload {
  isPinned: boolean;
}

export interface PutApiAiApiKeyByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiApiKeyByIdParams {
  id: string;
}

export interface PutApiAiApiKeyByIdPayload {
  data: {
    accessAll?: boolean;
    expiresAt?: string | null;
    mcpServerIds?: string[];
    name?: string;
    remark?: string | null;
  };
}

export interface PutApiAiMcpServerByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiMcpServerByIdParams {
  id: string;
}

export interface PutApiAiMcpServerByIdPayload {
  data: {
    /** Actions列表 */
    actions?: (string | number | boolean | null) | Record<string, any> | any[];
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 描述 */
    description?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 公开访问 */
    isPublic?: boolean;
    /**
     * 服务名称
     * @maxLength 64
     */
    name?: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiAiModelBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiModelBatchPayload {
  data: {
    /** 缓存命中价格(元/百万Token) */
    cacheHitPricePerMillion?: string | null;
    /** 缓存未命中价格(元/百万Token) */
    cacheMissPricePerMillion?: string | null;
    /** 上下文窗口 */
    contextWindow?: number | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 输入价格(元/百万Token) */
    inputPricePerMillion?: string | null;
    /** 最大输入Token */
    maxInputTokens?: number | null;
    /** 最大输出Token */
    maxOutputTokens?: number | null;
    /** 最大思考Token */
    maxThinkingTokens?: number | null;
    /**
     * 模型标识
     * @maxLength 128
     */
    modelId?: string;
    /**
     * 模型名称
     * @maxLength 128
     */
    name?: string;
    /** 输出价格(元/百万Token) */
    outputPricePerMillion?: string | null;
    /**
     * 提供商ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    providerId?: string;
    /** 推理强度 */
    reasoningEffort?: string | null;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 支持音频输入 */
    supportAudioInput?: boolean;
    /** 支持音频输出 */
    supportAudioOutput?: boolean;
    /** 支持FIM */
    supportFIM?: boolean;
    /** 支持图片输入 */
    supportImageInput?: boolean;
    /** 支持图片输出 */
    supportImageOutput?: boolean;
    /** 支持JSON输出 */
    supportJsonOutput?: boolean;
    /** 支持前缀补全 */
    supportPrefixCompletion?: boolean;
    /** 支持思考 */
    supportThinking?: boolean;
    /** 支持工具 */
    supportTools?: boolean;
    /** 支持视频输入 */
    supportVideoInput?: boolean;
    /** 支持视频输出 */
    supportVideoOutput?: boolean;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
  ids: string[];
}

export interface PutApiAiModelByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiModelByIdParams {
  id: string;
}

export interface PutApiAiModelByIdPayload {
  data: {
    /** 缓存命中价格(元/百万Token) */
    cacheHitPricePerMillion?: string | null;
    /** 缓存未命中价格(元/百万Token) */
    cacheMissPricePerMillion?: string | null;
    /** 上下文窗口 */
    contextWindow?: number | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 输入价格(元/百万Token) */
    inputPricePerMillion?: string | null;
    /** 最大输入Token */
    maxInputTokens?: number | null;
    /** 最大输出Token */
    maxOutputTokens?: number | null;
    /** 最大思考Token */
    maxThinkingTokens?: number | null;
    /**
     * 模型标识
     * @maxLength 128
     */
    modelId?: string;
    /**
     * 模型名称
     * @maxLength 128
     */
    name?: string;
    /** 输出价格(元/百万Token) */
    outputPricePerMillion?: string | null;
    /**
     * 提供商ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    providerId?: string;
    /** 推理强度 */
    reasoningEffort?: string | null;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 支持音频输入 */
    supportAudioInput?: boolean;
    /** 支持音频输出 */
    supportAudioOutput?: boolean;
    /** 支持FIM */
    supportFIM?: boolean;
    /** 支持图片输入 */
    supportImageInput?: boolean;
    /** 支持图片输出 */
    supportImageOutput?: boolean;
    /** 支持JSON输出 */
    supportJsonOutput?: boolean;
    /** 支持前缀补全 */
    supportPrefixCompletion?: boolean;
    /** 支持思考 */
    supportThinking?: boolean;
    /** 支持工具 */
    supportTools?: boolean;
    /** 支持视频输入 */
    supportVideoInput?: boolean;
    /** 支持视频输出 */
    supportVideoOutput?: boolean;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiAiProviderBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiProviderBatchPayload {
  data: {
    /**
     * API地址
     * @maxLength 512
     */
    baseUrl?: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 提供商名称
     * @maxLength 64
     */
    name?: string;
    /**
     * 提供商类型
     * @maxLength 32
     */
    providerType?: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** API密钥 */
    token?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
  ids: string[];
}

export interface PutApiAiProviderByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiProviderByIdParams {
  id: string;
}

export interface PutApiAiProviderByIdPayload {
  data: {
    /**
     * API地址
     * @maxLength 512
     */
    baseUrl?: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 提供商名称
     * @maxLength 64
     */
    name?: string;
    /**
     * 提供商类型
     * @maxLength 32
     */
    providerType?: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** API密钥 */
    token?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiAiSessionByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiSessionByIdParams {
  id: string;
}

export interface PutApiAiSessionByIdPayload {
  data: {
    /** Agent ID */
    agentId?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否归档 */
    isArchived?: boolean;
    /** 是否置顶 */
    isPinned?: boolean;
    /** 最后消息时间 */
    lastMessageAt?: string | null;
    /**
     * 消息数量
     * @min -2147483648
     * @max 2147483647
     */
    messageCount?: number;
    /** 模型ID */
    modelId?: string | null;
    /** 提供商ID */
    providerId?: string | null;
    /** 状态 */
    status?: string | null;
    /** 摘要 */
    summary?: string | null;
    /** 会话标题 */
    title?: string | null;
    /** Token用量 */
    tokenUsage?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId?: string;
  };
}

export interface PutApiAiToolGroupBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiToolGroupBatchPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 描述 */
    description?: string | null;
    /** 图标 */
    icon?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 分组名称
     * @maxLength 64
     */
    name?: string;
    /**
     * 排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 分组名称 */
    tools?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
  ids: string[];
}

export interface PutApiAiToolGroupByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiToolGroupByIdParams {
  id: string;
}

export interface PutApiAiToolGroupByIdPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 描述 */
    description?: string | null;
    /** 图标 */
    icon?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 分组名称
     * @maxLength 64
     */
    name?: string;
    /**
     * 排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 分组名称 */
    tools?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiAuthPasswordData {
  data: null;
  message: string;
  success: true;
}

export type PutApiAuthPasswordError = {
  data: null;
  message: string;
  success: false;
};

export interface PutApiAuthPasswordPayload {
  /** @minLength 6 */
  newPassword: string;
  /** @minLength 1 */
  oldPassword: string;
}

export interface PutApiFilesByIdContentData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiFilesByIdContentParams {
  id: string;
}

export interface PutApiFilesByIdContentPayload {
  content: string;
}

export interface PutApiFilesByIdDescriptionData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiFilesByIdDescriptionParams {
  id: string;
}

export interface PutApiFilesByIdDescriptionPayload {
  description: string | null;
}

export interface PutApiFilesByIdRenameData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiFilesByIdRenameParams {
  id: string;
}

export interface PutApiFilesByIdRenamePayload {
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
}

export interface PutApiFilesFoldersByIdDescriptionData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiFilesFoldersByIdDescriptionParams {
  id: string;
}

export interface PutApiFilesFoldersByIdDescriptionPayload {
  description: string | null;
}

export interface PutApiFilesFoldersByIdOrderData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiFilesFoldersByIdOrderParams {
  id: string;
}

export interface PutApiFilesFoldersByIdOrderPayload {
  /**
   * @min -9007199254740991
   * @max 9007199254740991
   */
  orderNum: number;
}

export interface PutApiFilesFoldersByIdRenameData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiFilesFoldersByIdRenameParams {
  id: string;
}

export interface PutApiFilesFoldersByIdRenamePayload {
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string;
}

export interface PutApiFilesFoldersByIdStyleData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiFilesFoldersByIdStyleParams {
  id: string;
}

export interface PutApiFilesFoldersByIdStylePayload {
  color?: string | null;
  icon?: string | null;
}

export interface PutApiImConversationByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiImConversationByIdParams {
  id: string;
}

export interface PutApiImConversationByIdPayload {
  data: {
    /** 群公告 */
    announcement?: string | null;
    /** 头像 */
    avatar?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否免打扰 */
    isMuted?: boolean;
    /** 是否置顶 */
    isTop?: boolean;
    /** 最后消息时间 */
    lastMessageAt?: string | null;
    /** 最后消息ID */
    lastMessageId?: string | null;
    /** 最大成员数 */
    maxMembers?: number | null;
    /**
     * 成员数量
     * @min -2147483648
     * @max 2147483647
     */
    memberCount?: number;
    /** 会话名称 */
    name?: string | null;
    /** 所有者ID */
    ownerId?: string | null;
    /** 状态 */
    status?: string | null;
    /**
     * 会话类型
     * @minLength 1
     * @maxLength 1
     */
    type?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiImConversationReadIncrementUnreadData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiImConversationReadIncrementUnreadPayload {
  conversationId: string;
  /**
   * @min 1
   * @max 9007199254740991
   * @default 1
   */
  increment?: number;
  userIds: string[];
}

export interface PutApiImConversationReadMarkData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiImConversationReadMarkPayload {
  conversationId: string;
  /**
   * @min 0
   * @max 9007199254740991
   */
  lastReadSeq: number;
  userId: string;
}

export interface PutApiImGroupMemberByConversationIdByUserIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiImGroupMemberByConversationIdByUserIdParams {
  conversationId: string;
  userId: string;
}

export interface PutApiImGroupMemberByConversationIdByUserIdPayload {
  data: {
    /**
     * 会话ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    conversationId?: string;
    /** 扩展数据 */
    extra?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 邀请人ID */
    invitedById?: string | null;
    /** 是否禁言 */
    isMuted?: boolean;
    /** 加入时间 */
    joinedAt?: string;
    /** 禁言截止时间 */
    mutedUntil?: string | null;
    /** 群内昵称 */
    nickname?: string | null;
    /**
     * 角色
     * @minLength 1
     * @maxLength 1
     */
    role?: string;
    /**
     * 用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId?: string;
  };
}

export interface PutApiImMessageByIdRecallData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiImMessageByIdRecallParams {
  id: string;
}

export interface PutApiImTempFileByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiImTempFileByIdParams {
  id: string;
}

export interface PutApiImTempFileByIdPayload {
  data: {
    /**
     * 存储桶
     * @maxLength 128
     */
    bucket?: string;
    /** 会话ID */
    conversationId?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** ETag */
    etag?: string | null;
    /** 过期时间 */
    expiresAt?: string | null;
    /** 扩展名 */
    extension?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 消息ID */
    messageId?: string | null;
    /** 元数据 */
    metadata?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** MIME类型 */
    mimeType?: string | null;
    /**
     * 文件名称
     * @maxLength 255
     */
    name?: string;
    /**
     * 原始文件名
     * @maxLength 255
     */
    originalName?: string;
    /** 区域 */
    region?: string | null;
    /**
     * 文件大小
     * @min -9007199254740991
     * @max 9007199254740991
     */
    size?: number;
    /** 状态 */
    status?: string | null;
    /**
     * 存储键
     * @maxLength 512
     */
    storageKey?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiKnowledgeFileBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiKnowledgeFileBatchPayload {
  data: {
    /**
     * 存储桶
     * @maxLength 128
     */
    bucket?: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 描述 */
    description?: string | null;
    /**
     * 下载次数
     * @min -2147483648
     * @max 2147483647
     */
    downloadCount?: number;
    /** ETag */
    etag?: string | null;
    /** 扩展名 */
    extension?: string | null;
    /** 文件夹ID */
    folderId?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 公开 */
    isPublic?: boolean;
    /** 元数据 */
    metadata?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** MIME类型 */
    mimeType?: string | null;
    /**
     * 文件名称
     * @maxLength 255
     */
    name?: string;
    /**
     * 原始文件名
     * @maxLength 255
     */
    originalName?: string;
    /** 处理结果 */
    processResult?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 处理状态 */
    processStatus?: string | null;
    /** 区域 */
    region?: string | null;
    /**
     * 文件大小
     * @min -9007199254740991
     * @max 9007199254740991
     */
    size?: number;
    /** 状态 */
    status?: string | null;
    /** 存储类型 */
    storageClass?: string | null;
    /**
     * 存储键
     * @maxLength 512
     */
    storageKey?: string;
    /** 标签 */
    tags?: string[];
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 下载次数
     * @min -2147483648
     * @max 2147483647
     */
    versionCount?: number;
    /** 版本ID */
    versionId?: string | null;
  };
  ids: string[];
}

export interface PutApiKnowledgeFileByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiKnowledgeFileByIdParams {
  id: string;
}

export interface PutApiKnowledgeFileByIdPayload {
  data: {
    /**
     * 存储桶
     * @maxLength 128
     */
    bucket?: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 描述 */
    description?: string | null;
    /**
     * 下载次数
     * @min -2147483648
     * @max 2147483647
     */
    downloadCount?: number;
    /** ETag */
    etag?: string | null;
    /** 扩展名 */
    extension?: string | null;
    /** 文件夹ID */
    folderId?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 公开 */
    isPublic?: boolean;
    /** 元数据 */
    metadata?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** MIME类型 */
    mimeType?: string | null;
    /**
     * 文件名称
     * @maxLength 255
     */
    name?: string;
    /**
     * 原始文件名
     * @maxLength 255
     */
    originalName?: string;
    /** 处理结果 */
    processResult?:
      | ((string | number | boolean | null) | Record<string, any> | any[])
      | null;
    /** 处理状态 */
    processStatus?: string | null;
    /** 区域 */
    region?: string | null;
    /**
     * 文件大小
     * @min -9007199254740991
     * @max 9007199254740991
     */
    size?: number;
    /** 状态 */
    status?: string | null;
    /** 存储类型 */
    storageClass?: string | null;
    /**
     * 存储键
     * @maxLength 512
     */
    storageKey?: string;
    /** 标签 */
    tags?: string[];
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 下载次数
     * @min -2147483648
     * @max 2147483647
     */
    versionCount?: number;
    /** 版本ID */
    versionId?: string | null;
  };
}

export interface PutApiKnowledgeFileVersionBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiKnowledgeFileVersionBatchPayload {
  data: {
    /** S3版本ID */
    s3VersionId?: string | null;
    /**
     * 存储桶
     * @maxLength 128
     */
    bucket?: string;
    /** 变更日志 */
    changeLog?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建人
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建人ID */
    createdById?: string | null;
    /** ETag */
    etag?: string | null;
    /**
     * 文件ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    fileId?: string;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 文件大小
     * @min -9007199254740991
     * @max 9007199254740991
     */
    size?: number;
    /**
     * 存储键
     * @maxLength 512
     */
    storageKey?: string;
    /**
     * 版本号
     * @maxLength 32
     */
    versionNumber?: string;
  };
  ids: string[];
}

export interface PutApiKnowledgeFileVersionByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiKnowledgeFileVersionByIdParams {
  id: string;
}

export interface PutApiKnowledgeFileVersionByIdPayload {
  data: {
    /** S3版本ID */
    s3VersionId?: string | null;
    /**
     * 存储桶
     * @maxLength 128
     */
    bucket?: string;
    /** 变更日志 */
    changeLog?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建人
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建人ID */
    createdById?: string | null;
    /** ETag */
    etag?: string | null;
    /**
     * 文件ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    fileId?: string;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 文件大小
     * @min -9007199254740991
     * @max 9007199254740991
     */
    size?: number;
    /**
     * 存储键
     * @maxLength 512
     */
    storageKey?: string;
    /**
     * 版本号
     * @maxLength 32
     */
    versionNumber?: string;
  };
}

export interface PutApiKnowledgeFolderBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiKnowledgeFolderBatchPayload {
  data: {
    /** 颜色 */
    color?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 描述 */
    description?: string | null;
    /** 图标 */
    icon?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否公开 */
    isPublic?: boolean;
    /**
     * 文件夹名称
     * @maxLength 255
     */
    name?: string;
    /**
     * 排序号
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父文件夹ID */
    parentId?: string | null;
    /** 路径 */
    path?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
  ids: string[];
}

export interface PutApiKnowledgeFolderByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiKnowledgeFolderByIdParams {
  id: string;
}

export interface PutApiKnowledgeFolderByIdPayload {
  data: {
    /** 颜色 */
    color?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 描述 */
    description?: string | null;
    /** 图标 */
    icon?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否公开 */
    isPublic?: boolean;
    /**
     * 文件夹名称
     * @maxLength 255
     */
    name?: string;
    /**
     * 排序号
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父文件夹ID */
    parentId?: string | null;
    /** 路径 */
    path?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiSystemCasbinRuleRoleByRoleKeyPermissionsData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemCasbinRuleRoleByRoleKeyPermissionsParams {
  roleKey: string;
}

export interface PutApiSystemCasbinRuleRoleByRoleKeyPermissionsPayload {
  permissionCodes: string[];
}

export interface PutApiSystemCasbinRuleUserByUserIdRolesData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemCasbinRuleUserByUserIdRolesParams {
  userId: string;
}

export interface PutApiSystemCasbinRuleUserByUserIdRolesPayload {
  roleKeys: string[];
}

export interface PutApiSystemConfigBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemConfigBatchPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 系统内置 */
    isSystem?: boolean;
    /**
     * 配置键
     * @maxLength 128
     */
    key?: string;
    /**
     * 配置名称
     * @maxLength 128
     */
    name?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 配置值
     * @maxLength 512
     */
    value?: string;
  };
  ids: string[];
}

export interface PutApiSystemConfigByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemConfigByIdParams {
  id: string;
}

export interface PutApiSystemConfigByIdPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 系统内置 */
    isSystem?: boolean;
    /**
     * 配置键
     * @maxLength 128
     */
    key?: string;
    /**
     * 配置名称
     * @maxLength 128
     */
    name?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 配置值
     * @maxLength 512
     */
    value?: string;
  };
}

export interface PutApiSystemDepartmentBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemDepartmentBatchPayload {
  data: {
    /** 祖级列表 */
    ancestors?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 邮箱 */
    email?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 负责人 */
    leader?: string | null;
    /**
     * 部门名称
     * @maxLength 50
     */
    name?: string;
    /**
     * 显示排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父部门ID */
    parentId?: string | null;
    /** 联系电话 */
    phone?: string | null;
    /** 部门状态 */
    status?: boolean;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
  ids: string[];
}

export interface PutApiSystemDepartmentByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemDepartmentByIdParams {
  id: string;
}

export interface PutApiSystemDepartmentByIdPayload {
  data: {
    /** 祖级列表 */
    ancestors?: string | null;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 邮箱 */
    email?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 负责人 */
    leader?: string | null;
    /**
     * 部门名称
     * @maxLength 50
     */
    name?: string;
    /**
     * 显示排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父部门ID */
    parentId?: string | null;
    /** 联系电话 */
    phone?: string | null;
    /** 部门状态 */
    status?: boolean;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiSystemDictBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemDictBatchPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 样式属性 */
    cssClass?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /**
     * 字典分组
     * @maxLength 100
     */
    group?: string;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否默认 */
    isDefault?: boolean;
    /**
     * 字典标签
     * @maxLength 100
     */
    label?: string;
    /** 表格样式 */
    listClass?: string | null;
    /** 备注 */
    remark?: string | null;
    /**
     * 字典排序
     * @min -2147483648
     * @max 2147483647
     */
    sort?: number;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 字典键值
     * @maxLength 100
     */
    value?: string;
  };
  ids: string[];
}

export interface PutApiSystemDictByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemDictByIdParams {
  id: string;
}

export interface PutApiSystemDictByIdPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 样式属性 */
    cssClass?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /**
     * 字典分组
     * @maxLength 100
     */
    group?: string;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否默认 */
    isDefault?: boolean;
    /**
     * 字典标签
     * @maxLength 100
     */
    label?: string;
    /** 表格样式 */
    listClass?: string | null;
    /** 备注 */
    remark?: string | null;
    /**
     * 字典排序
     * @min -2147483648
     * @max 2147483647
     */
    sort?: number;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 字典键值
     * @maxLength 100
     */
    value?: string;
  };
}

export interface PutApiSystemDictGroupBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemDictGroupBatchPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 分组键
     * @maxLength 100
     */
    key?: string;
    /**
     * 分组名称
     * @maxLength 100
     */
    name?: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
  keys: string[];
}

export interface PutApiSystemDictGroupByKeyData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemDictGroupByKeyParams {
  /**
   * @minLength 1
   * @maxLength 100
   */
  key: string;
}

export interface PutApiSystemDictGroupByKeyPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 分组键
     * @maxLength 100
     */
    key?: string;
    /**
     * 分组名称
     * @maxLength 100
     */
    name?: string;
    /** 备注 */
    remark?: string | null;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiSystemJobBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemJobByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemJobByIdParams {
  id: string;
}

export interface PutApiSystemJobLogBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemJobLogByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemJobLogByIdParams {
  id: string;
}

export interface PutApiSystemMenuBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemMenuBatchPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 菜单图标 */
    icon?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否缓存 */
    isCache?: boolean;
    /** 是否外链 */
    isFrame?: boolean;
    /** 是否系统菜单 */
    isSystem?: boolean;
    /** 外链打开方式 */
    linkTarget?: string | null;
    /** 外链地址 */
    linkUrl?: string | null;
    /**
     * 菜单名称
     * @maxLength 50
     */
    name?: string;
    /**
     * 显示排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父菜单ID */
    parentId?: string | null;
    /** 路由地址 */
    path?: string | null;
    /** 权限标识 */
    perms?: string | null;
    /** 备注 */
    remark?: string | null;
    /**
     * 菜单类型
     * @maxLength 1
     */
    type?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
    /** 是否显示 */
    visible?: boolean;
  };
  ids: string[];
}

export interface PutApiSystemMenuByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemMenuByIdParams {
  id: string;
}

export interface PutApiSystemMenuByIdPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 菜单图标 */
    icon?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否缓存 */
    isCache?: boolean;
    /** 是否外链 */
    isFrame?: boolean;
    /** 是否系统菜单 */
    isSystem?: boolean;
    /** 外链打开方式 */
    linkTarget?: string | null;
    /** 外链地址 */
    linkUrl?: string | null;
    /**
     * 菜单名称
     * @maxLength 50
     */
    name?: string;
    /**
     * 显示排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父菜单ID */
    parentId?: string | null;
    /** 路由地址 */
    path?: string | null;
    /** 权限标识 */
    perms?: string | null;
    /** 备注 */
    remark?: string | null;
    /**
     * 菜单类型
     * @maxLength 1
     */
    type?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
    /** 是否显示 */
    visible?: boolean;
  };
}

export interface PutApiSystemNoticeBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemNoticeBatchPayload {
  data: {
    /** 公告内容 */
    content?: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 状态 */
    status?: string | null;
    /**
     * 公告标题
     * @maxLength 50
     */
    title?: string;
    /**
     * 公告类型
     * @maxLength 1
     */
    type?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
  ids: string[];
}

export interface PutApiSystemNoticeByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemNoticeByIdParams {
  id: string;
}

export interface PutApiSystemNoticeByIdPayload {
  data: {
    /** 公告内容 */
    content?: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 状态 */
    status?: string | null;
    /**
     * 公告标题
     * @maxLength 50
     */
    title?: string;
    /**
     * 公告类型
     * @maxLength 1
     */
    type?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiSystemPermissionByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemPermissionByIdParams {
  id: string;
}

export interface PutApiSystemPermissionByIdPayload {
  data: {
    /** 操作类型 */
    action?: string | null;
    /**
     * 权限标识
     * @maxLength 100
     */
    code?: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 权限描述 */
    description?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 所属模块 */
    module?: string | null;
    /**
     * 权限名称
     * @maxLength 100
     */
    name?: string;
    /**
     * 排序
     * @min -2147483648
     * @max 2147483647
     */
    orderNum?: number;
    /** 父权限ID */
    parentId?: string | null;
    /** 资源名称 */
    resource?: string | null;
    /** 状态 */
    status?: boolean;
    /**
     * 权限类型
     * @maxLength 20
     */
    type?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiSystemPostBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemPostBatchPayload {
  data: {
    /**
     * 岗位编码
     * @maxLength 64
     */
    code?: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 岗位名称
     * @maxLength 50
     */
    name?: string;
    /**
     * 显示排序
     * @maxLength 10
     */
    sort?: string;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
  ids: string[];
}

export interface PutApiSystemPostByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemPostByIdParams {
  id: string;
}

export interface PutApiSystemPostByIdPayload {
  data: {
    /**
     * 岗位编码
     * @maxLength 64
     */
    code?: string;
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 岗位名称
     * @maxLength 50
     */
    name?: string;
    /**
     * 显示排序
     * @maxLength 10
     */
    sort?: string;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiSystemRoleBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemRoleBatchPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 数据范围 */
    dataScope?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 角色描述 */
    description?: string | null;
    /** 角色标识 */
    flag?: boolean | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 权限字符串
     * @maxLength 100
     */
    key?: string;
    /**
     * 角色名称
     * @maxLength 30
     */
    name?: string;
    /**
     * 显示排序
     * @min -2147483648
     * @max 2147483647
     */
    sort?: number;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
  ids: string[];
}

export interface PutApiSystemRoleByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemRoleByIdParams {
  id: string;
}

export interface PutApiSystemRoleByIdPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 数据范围 */
    dataScope?: string | null;
    /** 删除时间 */
    deletedAt?: string | null;
    /** 删除者 */
    deletedBy?: string | null;
    /** 删除者ID */
    deletedById?: string | null;
    /** 角色描述 */
    description?: string | null;
    /** 角色标识 */
    flag?: boolean | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 权限字符串
     * @maxLength 100
     */
    key?: string;
    /**
     * 角色名称
     * @maxLength 30
     */
    name?: string;
    /**
     * 显示排序
     * @min -2147483648
     * @max 2147483647
     */
    sort?: number;
    /** 状态 */
    status?: string | null;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
  };
}

export interface PutApiSystemRoleMenuRoleByRoleIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemRoleMenuRoleByRoleIdParams {
  roleId: string;
}

export interface PutApiSystemRoleMenuRoleByRoleIdPayload {
  menuIds: string[];
}

export interface PutApiSystemTokenByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemTokenByIdParams {
  id: string;
}

export interface PutApiSystemTokenByIdPayload {
  data: {
    /** 创建时间 */
    createdAt?: string;
    /**
     * 创建者
     * @maxLength 64
     */
    createdBy?: string;
    /** 创建者ID */
    createdById?: string | null;
    /** 过期时间 */
    exp?: string;
    /** 签发时间 */
    iat?: string;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /** 是否已撤销 */
    isRevoked?: boolean;
    /**
     * 令牌类型
     * @maxLength 64
     */
    jti?: string;
    /** 撤销时间 */
    revokedAt?: string | null;
    /** 权限范围 */
    scopes?: string[];
    /**
     * 令牌值
     * @maxLength 128
     */
    sub?: string;
    /** 更新时间 */
    updatedAt?: string;
    /**
     * 更新者
     * @maxLength 64
     */
    updatedBy?: string;
    /** 更新者ID */
    updatedById?: string | null;
    /**
     * 授权用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId?: string;
  };
}

export interface PutApiSystemUserBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemUserByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemUserByIdParams {
  id: string;
}

export interface PutApiSystemUserRoleUserByUserIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiSystemUserRoleUserByUserIdParams {
  userId: string;
}

export interface PutApiSystemUserRoleUserByUserIdPayload {
  roleIds: string[];
}

export enum ResourceTypeEnum {
  Folder = "folder",
  File = "file",
}

export enum ResourceTypeEnum1 {
  Folder = "folder",
  File = "file",
}

export enum ResourceTypeEnum2 {
  File = "file",
  Folder = "folder",
}

export enum ResourceTypeEnum3 {
  File = "file",
  Folder = "folder",
}

export enum ResourceTypeEnum4 {
  File = "file",
  Folder = "folder",
}

export enum ResourceTypeEnum5 {
  File = "file",
  Folder = "folder",
}

export enum ResourceTypeEnum6 {
  File = "file",
  Folder = "folder",
}

export enum SubjectTypeEnum {
  User = "user",
  Role = "role",
  Dept = "dept",
}

export namespace Ai {
  /**
   * @description 根据ID删除AI智能体
   * @tags ai, agent
   * @name DeleteApiAiAgentById
   * @summary 删除AI智能体
   * @request DELETE:/api/ai/agent/{id}
   * @response `200` `DeleteApiAiAgentByIdData` Response for status 200
   */
  export namespace DeleteApiAiAgentById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiAiAgentByIdData;
  }

  /**
   * @description 根据ID删除单条Agent消息
   * @tags ai, agentMessage
   * @name DeleteApiAiAgentMessageById
   * @summary 删除Agent消息
   * @request DELETE:/api/ai/agent-message/{id}
   * @response `200` `DeleteApiAiAgentMessageByIdData` Response for status 200
   */
  export namespace DeleteApiAiAgentMessageById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiAiAgentMessageByIdData;
  }

  /**
   * @description 删除会话中指定msgSeq及之后的所有消息
   * @tags ai, agentMessage
   * @name DeleteApiAiAgentMessageFromSeqBySessionIdByMsgSeq
   * @summary 删除指定序号及之后的消息
   * @request DELETE:/api/ai/agent-message/from-seq/{sessionId}/{msgSeq}
   * @response `200` `DeleteApiAiAgentMessageFromSeqBySessionIdByMsgSeqData` Response for status 200
   */
  export namespace DeleteApiAiAgentMessageFromSeqBySessionIdByMsgSeq {
    export type RequestParams = {
      /**
       * @min -9007199254740991
       * @max 9007199254740991
       */
      msgSeq: number;
      sessionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      DeleteApiAiAgentMessageFromSeqBySessionIdByMsgSeqData;
  }

  /**
   * @description 根据ID软删除Agent会话
   * @tags ai, agentSession
   * @name DeleteApiAiAgentSessionById
   * @summary 删除Agent会话
   * @request DELETE:/api/ai/agent-session/{id}
   * @response `200` `DeleteApiAiAgentSessionByIdData` Response for status 200
   */
  export namespace DeleteApiAiAgentSessionById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiAiAgentSessionByIdData;
  }

  /**
   * @description 根据ID删除API密钥
   * @tags ai, apiKey
   * @name DeleteApiAiApiKeyById
   * @summary 删除API密钥
   * @request DELETE:/api/ai/api-key/{id}
   * @response `200` `DeleteApiAiApiKeyByIdData` Response for status 200
   */
  export namespace DeleteApiAiApiKeyById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiAiApiKeyByIdData;
  }

  /**
   * @description 根据ID删除MCP服务
   * @tags ai, mcpServer
   * @name DeleteApiAiMcpServerById
   * @summary 删除MCP服务
   * @request DELETE:/api/ai/mcp-server/{id}
   * @response `200` `DeleteApiAiMcpServerByIdData` Response for status 200
   */
  export namespace DeleteApiAiMcpServerById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiAiMcpServerByIdData;
  }

  /**
   * @description 根据ID删除AI模型
   * @tags ai, model
   * @name DeleteApiAiModelById
   * @summary 删除AI模型
   * @request DELETE:/api/ai/model/{id}
   * @response `200` `DeleteApiAiModelByIdData` Response for status 200
   */
  export namespace DeleteApiAiModelById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiAiModelByIdData;
  }

  /**
   * @description 根据ID删除AI提供商
   * @tags ai, provider
   * @name DeleteApiAiProviderById
   * @summary 删除AI提供商
   * @request DELETE:/api/ai/provider/{id}
   * @response `200` `DeleteApiAiProviderByIdData` Response for status 200
   */
  export namespace DeleteApiAiProviderById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiAiProviderByIdData;
  }

  /**
   * @description 软删除AI会话
   * @tags ai, aiSession
   * @name DeleteApiAiSessionById
   * @summary 删除AI会话
   * @request DELETE:/api/ai/session/{id}
   * @response `200` `DeleteApiAiSessionByIdData` Response for status 200
   */
  export namespace DeleteApiAiSessionById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiAiSessionByIdData;
  }

  /**
   * @description 删除会话中指定msgSeq及之后的所有消息
   * @tags ai, aiSessionMessage
   * @name DeleteApiAiSessionMessageFromSeqBySessionIdByMsgSeq
   * @summary 删除指定序号及之后的消息
   * @request DELETE:/api/ai/session-message/from-seq/{sessionId}/{msgSeq}
   * @response `200` `DeleteApiAiSessionMessageFromSeqBySessionIdByMsgSeqData` Response for status 200
   */
  export namespace DeleteApiAiSessionMessageFromSeqBySessionIdByMsgSeq {
    export type RequestParams = {
      /**
       * @min -9007199254740991
       * @max 9007199254740991
       */
      msgSeq: number;
      sessionId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      DeleteApiAiSessionMessageFromSeqBySessionIdByMsgSeqData;
  }

  /**
   * @description 根据ID删除工具组
   * @tags ai, toolGroup
   * @name DeleteApiAiToolGroupById
   * @summary 删除工具组
   * @request DELETE:/api/ai/tool-group/{id}
   * @response `200` `DeleteApiAiToolGroupByIdData` Response for status 200
   */
  export namespace DeleteApiAiToolGroupById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiAiToolGroupByIdData;
  }

  /**
   * @description 根据主键ID查询单个AI智能体
   * @tags ai, agent
   * @name GetApiAiAgentById
   * @summary 根据ID查询AI智能体
   * @request GET:/api/ai/agent/{id}
   * @response `200` `GetApiAiAgentByIdData` Response for status 200
   */
  export namespace GetApiAiAgentById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiAgentByIdData;
  }

  /**
   * @description 根据主键ID查询单个Agent消息
   * @tags ai, agentMessage
   * @name GetApiAiAgentMessageById
   * @summary 根据ID查询Agent消息
   * @request GET:/api/ai/agent-message/{id}
   * @response `200` `GetApiAiAgentMessageByIdData` Response for status 200
   */
  export namespace GetApiAiAgentMessageById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiAgentMessageByIdData;
  }

  /**
   * @description 获取指定会话的消息历史
   * @tags ai, agentMessage
   * @name GetApiAiAgentMessageHistoryBySessionId
   * @summary 获取会话历史
   * @request GET:/api/ai/agent-message/history/{sessionId}
   * @response `200` `GetApiAiAgentMessageHistoryBySessionIdData` Response for status 200
   */
  export namespace GetApiAiAgentMessageHistoryBySessionId {
    export type RequestParams = {
      sessionId: string;
    };
    export type RequestQuery = {
      /**
       * @min -9007199254740991
       * @max 9007199254740991
       */
      beforeSeq?: number;
      /**
       * @min 1
       * @max 200
       * @default 50
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiAgentMessageHistoryBySessionIdData;
  }

  /**
   * @description 获取Agent消息表的JSON Schema
   * @tags ai, agentMessage
   * @name GetApiAiAgentMessageSchema
   * @summary 获取Agent消息Schema
   * @request GET:/api/ai/agent-message/schema
   * @response `200` `GetApiAiAgentMessageSchemaData` Response for status 200
   */
  export namespace GetApiAiAgentMessageSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiAgentMessageSchemaData;
  }

  /**
   * @description 获取AI智能体表的JSON Schema
   * @tags ai, agent
   * @name GetApiAiAgentSchema
   * @summary 获取AI智能体Schema
   * @request GET:/api/ai/agent/schema
   * @response `200` `GetApiAiAgentSchemaData` Response for status 200
   */
  export namespace GetApiAiAgentSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiAgentSchemaData;
  }

  /**
   * @description 根据主键ID查询单个Agent会话
   * @tags ai, agentSession
   * @name GetApiAiAgentSessionById
   * @summary 根据ID查询Agent会话
   * @request GET:/api/ai/agent-session/{id}
   * @response `200` `GetApiAiAgentSessionByIdData` Response for status 200
   */
  export namespace GetApiAiAgentSessionById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiAgentSessionByIdData;
  }

  /**
   * @description 获取Agent会话表的JSON Schema
   * @tags ai, agentSession
   * @name GetApiAiAgentSessionSchema
   * @summary 获取Agent会话Schema
   * @request GET:/api/ai/agent-session/schema
   * @response `200` `GetApiAiAgentSessionSchemaData` Response for status 200
   */
  export namespace GetApiAiAgentSessionSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiAgentSessionSchemaData;
  }

  /**
   * @description 根据主键ID查询单个API密钥
   * @tags ai, apiKey
   * @name GetApiAiApiKeyById
   * @summary 根据ID查询API密钥
   * @request GET:/api/ai/api-key/{id}
   * @response `200` `GetApiAiApiKeyByIdData` Response for status 200
   */
  export namespace GetApiAiApiKeyById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiApiKeyByIdData;
  }

  /**
   * @description 获取API密钥表的JSON Schema
   * @tags ai, apiKey
   * @name GetApiAiApiKeySchema
   * @summary 获取API密钥Schema
   * @request GET:/api/ai/api-key/schema
   * @response `200` `GetApiAiApiKeySchemaData` Response for status 200
   */
  export namespace GetApiAiApiKeySchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiApiKeySchemaData;
  }

  /**
   * @description 根据主键ID查询单个MCP服务
   * @tags ai, mcpServer
   * @name GetApiAiMcpServerById
   * @summary 根据ID查询MCP服务
   * @request GET:/api/ai/mcp-server/{id}
   * @response `200` `GetApiAiMcpServerByIdData` Response for status 200
   */
  export namespace GetApiAiMcpServerById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiMcpServerByIdData;
  }

  /**
   * @description 获取MCP服务表的JSON Schema
   * @tags ai, mcpServer
   * @name GetApiAiMcpServerSchema
   * @summary 获取MCP服务Schema
   * @request GET:/api/ai/mcp-server/schema
   * @response `200` `GetApiAiMcpServerSchemaData` Response for status 200
   */
  export namespace GetApiAiMcpServerSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiMcpServerSchemaData;
  }

  /**
   * @description 根据主键ID查询单个AI模型
   * @tags ai, model
   * @name GetApiAiModelById
   * @summary 根据ID查询AI模型
   * @request GET:/api/ai/model/{id}
   * @response `200` `GetApiAiModelByIdData` Response for status 200
   */
  export namespace GetApiAiModelById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiModelByIdData;
  }

  /**
   * @description 获取AI模型表的JSON Schema
   * @tags ai, model
   * @name GetApiAiModelSchema
   * @summary 获取AI模型Schema
   * @request GET:/api/ai/model/schema
   * @response `200` `GetApiAiModelSchemaData` Response for status 200
   */
  export namespace GetApiAiModelSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiModelSchemaData;
  }

  /**
   * @description 根据主键ID查询单个AI提供商
   * @tags ai, provider
   * @name GetApiAiProviderById
   * @summary 根据ID查询AI提供商
   * @request GET:/api/ai/provider/{id}
   * @response `200` `GetApiAiProviderByIdData` Response for status 200
   */
  export namespace GetApiAiProviderById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiProviderByIdData;
  }

  /**
   * @description 获取AI提供商表的JSON Schema
   * @tags ai, provider
   * @name GetApiAiProviderSchema
   * @summary 获取AI提供商Schema
   * @request GET:/api/ai/provider/schema
   * @response `200` `GetApiAiProviderSchemaData` Response for status 200
   */
  export namespace GetApiAiProviderSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiProviderSchemaData;
  }

  /**
   * @description 根据主键ID查询单个AI会话
   * @tags ai, aiSession
   * @name GetApiAiSessionById
   * @summary 根据ID查询AI会话
   * @request GET:/api/ai/session/{id}
   * @response `200` `GetApiAiSessionByIdData` Response for status 200
   */
  export namespace GetApiAiSessionById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiSessionByIdData;
  }

  /**
   * @description 根据主键ID查询单个AI会话消息
   * @tags ai, aiSessionMessage
   * @name GetApiAiSessionMessageById
   * @summary 根据ID查询AI会话消息
   * @request GET:/api/ai/session-message/{id}
   * @response `200` `GetApiAiSessionMessageByIdData` Response for status 200
   */
  export namespace GetApiAiSessionMessageById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiSessionMessageByIdData;
  }

  /**
   * @description 获取指定会话的消息历史
   * @tags ai, aiSessionMessage
   * @name GetApiAiSessionMessageHistoryBySessionId
   * @summary 获取会话历史
   * @request GET:/api/ai/session-message/history/{sessionId}
   * @response `200` `GetApiAiSessionMessageHistoryBySessionIdData` Response for status 200
   */
  export namespace GetApiAiSessionMessageHistoryBySessionId {
    export type RequestParams = {
      sessionId: string;
    };
    export type RequestQuery = {
      /**
       * @min -9007199254740991
       * @max 9007199254740991
       */
      beforeSeq?: number;
      /**
       * @min 1
       * @max 200
       * @default 50
       */
      limit?: number;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiSessionMessageHistoryBySessionIdData;
  }

  /**
   * @description 获取AI会话消息表的JSON Schema
   * @tags ai, aiSessionMessage
   * @name GetApiAiSessionMessageSchema
   * @summary 获取AI会话消息Schema
   * @request GET:/api/ai/session-message/schema
   * @response `200` `GetApiAiSessionMessageSchemaData` Response for status 200
   */
  export namespace GetApiAiSessionMessageSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiSessionMessageSchemaData;
  }

  /**
   * @description 获取AI会话表的JSON Schema
   * @tags ai, aiSession
   * @name GetApiAiSessionSchema
   * @summary 获取AI会话Schema
   * @request GET:/api/ai/session/schema
   * @response `200` `GetApiAiSessionSchemaData` Response for status 200
   */
  export namespace GetApiAiSessionSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiSessionSchemaData;
  }

  /**
   * @description 根据主键ID查询单个工具组
   * @tags ai, toolGroup
   * @name GetApiAiToolGroupById
   * @summary 根据ID查询工具组
   * @request GET:/api/ai/tool-group/{id}
   * @response `200` `GetApiAiToolGroupByIdData` Response for status 200
   */
  export namespace GetApiAiToolGroupById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiToolGroupByIdData;
  }

  /**
   * @description 获取工具组表的JSON Schema
   * @tags ai, toolGroup
   * @name GetApiAiToolGroupSchema
   * @summary 获取工具组Schema
   * @request GET:/api/ai/tool-group/schema
   * @response `200` `GetApiAiToolGroupSchemaData` Response for status 200
   */
  export namespace GetApiAiToolGroupSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiToolGroupSchemaData;
  }

  /**
   * @description 创建单个AI智能体
   * @tags ai, agent
   * @name PostApiAiAgent
   * @summary 创建AI智能体
   * @request POST:/api/ai/agent
   * @response `200` `PostApiAiAgentData` Response for status 200
   */
  export namespace PostApiAiAgent {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiAgentPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiAgentData;
  }

  /**
   * @description 批量创建多个AI智能体
   * @tags ai, agent
   * @name PostApiAiAgentBatch
   * @summary 批量创建AI智能体
   * @request POST:/api/ai/agent/batch
   * @response `200` `PostApiAiAgentBatchData` Response for status 200
   */
  export namespace PostApiAiAgentBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiAgentBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiAgentBatchData;
  }

  /**
   * @description 创建单条Agent消息
   * @tags ai, agentMessage
   * @name PostApiAiAgentMessage
   * @summary 创建Agent消息
   * @request POST:/api/ai/agent-message
   * @response `200` `PostApiAiAgentMessageData` Response for status 200
   */
  export namespace PostApiAiAgentMessage {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiAgentMessagePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiAgentMessageData;
  }

  /**
   * @description 批量创建Agent消息
   * @tags ai, agentMessage
   * @name PostApiAiAgentMessageBatch
   * @summary 批量创建Agent消息
   * @request POST:/api/ai/agent-message/batch
   * @response `200` `PostApiAiAgentMessageBatchData` Response for status 200
   */
  export namespace PostApiAiAgentMessageBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiAgentMessageBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiAgentMessageBatchData;
  }

  /**
   * @description 分页查询Agent消息列表
   * @tags ai, agentMessage
   * @name PostApiAiAgentMessageQuery
   * @summary 分页查询Agent消息
   * @request POST:/api/ai/agent-message/query
   * @response `200` `PostApiAiAgentMessageQueryData` Response for status 200
   */
  export namespace PostApiAiAgentMessageQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiAgentMessageQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiAgentMessageQueryData;
  }

  /**
   * @description 分页查询AI智能体列表
   * @tags ai, agent
   * @name PostApiAiAgentQuery
   * @summary 分页查询AI智能体
   * @request POST:/api/ai/agent/query
   * @response `200` `PostApiAiAgentQueryData` Response for status 200
   */
  export namespace PostApiAiAgentQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiAgentQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiAgentQueryData;
  }

  /**
   * @description 创建单个Agent会话
   * @tags ai, agentSession
   * @name PostApiAiAgentSession
   * @summary 创建Agent会话
   * @request POST:/api/ai/agent-session
   * @response `200` `PostApiAiAgentSessionData` Response for status 200
   */
  export namespace PostApiAiAgentSession {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiAgentSessionPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiAgentSessionData;
  }

  /**
   * @description 分页查询Agent会话列表
   * @tags ai, agentSession
   * @name PostApiAiAgentSessionQuery
   * @summary 分页查询Agent会话
   * @request POST:/api/ai/agent-session/query
   * @response `200` `PostApiAiAgentSessionQueryData` Response for status 200
   */
  export namespace PostApiAiAgentSessionQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiAgentSessionQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiAgentSessionQueryData;
  }

  /**
   * @description 创建API密钥并关联MCP服务
   * @tags ai, apiKey
   * @name PostApiAiApiKey
   * @summary 创建API密钥
   * @request POST:/api/ai/api-key
   * @response `200` `PostApiAiApiKeyData` Response for status 200
   */
  export namespace PostApiAiApiKey {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiApiKeyPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiApiKeyData;
  }

  /**
   * @description 撤销API密钥
   * @tags ai, apiKey
   * @name PostApiAiApiKeyByIdRevoke
   * @summary 撤销API密钥
   * @request POST:/api/ai/api-key/{id}/revoke
   * @response `200` `PostApiAiApiKeyByIdRevokeData` Response for status 200
   */
  export namespace PostApiAiApiKeyByIdRevoke {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiApiKeyByIdRevokeData;
  }

  /**
   * @description 分页查询API密钥列表
   * @tags ai, apiKey
   * @name PostApiAiApiKeyQuery
   * @summary 分页查询API密钥
   * @request POST:/api/ai/api-key/query
   * @response `200` `PostApiAiApiKeyQueryData` Response for status 200
   */
  export namespace PostApiAiApiKeyQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiApiKeyQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiApiKeyQueryData;
  }

  /**
   * @description 统一的 AI 对话接口，支持普通模式（modelId）和 Agent 模式（agentId），可通过 sessionId 自动加载历史消息，通过 rewriteFromMsgSeq 实现消息重写
   * @tags AI
   * @name PostApiAiChat
   * @summary AI 对话
   * @request POST:/api/ai/chat
   */
  export namespace PostApiAiChat {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiChatPayload;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * @description 创建单个MCP服务
   * @tags ai, mcpServer
   * @name PostApiAiMcpServer
   * @summary 创建MCP服务
   * @request POST:/api/ai/mcp-server
   * @response `200` `PostApiAiMcpServerData` Response for status 200
   */
  export namespace PostApiAiMcpServer {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiMcpServerPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiMcpServerData;
  }

  /**
   * @description 分页查询MCP服务列表
   * @tags ai, mcpServer
   * @name PostApiAiMcpServerQuery
   * @summary 分页查询MCP服务
   * @request POST:/api/ai/mcp-server/query
   * @response `200` `PostApiAiMcpServerQueryData` Response for status 200
   */
  export namespace PostApiAiMcpServerQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiMcpServerQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiMcpServerQueryData;
  }

  /**
   * @description 创建单个AI模型
   * @tags ai, model
   * @name PostApiAiModel
   * @summary 创建AI模型
   * @request POST:/api/ai/model
   * @response `200` `PostApiAiModelData` Response for status 200
   */
  export namespace PostApiAiModel {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiModelPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiModelData;
  }

  /**
   * @description 批量创建多个AI模型
   * @tags ai, model
   * @name PostApiAiModelBatch
   * @summary 批量创建AI模型
   * @request POST:/api/ai/model/batch
   * @response `200` `PostApiAiModelBatchData` Response for status 200
   */
  export namespace PostApiAiModelBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiModelBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiModelBatchData;
  }

  /**
   * @description 发送测试消息验证模型是否正常工作
   * @tags ai, model
   * @name PostApiAiModelByIdTest
   * @summary 测试AI模型
   * @request POST:/api/ai/model/{id}/test
   * @response `200` `PostApiAiModelByIdTestData` Response for status 200
   */
  export namespace PostApiAiModelByIdTest {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PostApiAiModelByIdTestPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiModelByIdTestData;
  }

  /**
   * @description 分页查询AI模型列表
   * @tags ai, model
   * @name PostApiAiModelQuery
   * @summary 分页查询AI模型
   * @request POST:/api/ai/model/query
   * @response `200` `PostApiAiModelQueryData` Response for status 200
   */
  export namespace PostApiAiModelQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiModelQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiModelQueryData;
  }

  /**
   * @description 创建单个AI提供商
   * @tags ai, provider
   * @name PostApiAiProvider
   * @summary 创建AI提供商
   * @request POST:/api/ai/provider
   * @response `200` `PostApiAiProviderData` Response for status 200
   */
  export namespace PostApiAiProvider {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiProviderPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiProviderData;
  }

  /**
   * @description 批量创建多个AI提供商
   * @tags ai, provider
   * @name PostApiAiProviderBatch
   * @summary 批量创建AI提供商
   * @request POST:/api/ai/provider/batch
   * @response `200` `PostApiAiProviderBatchData` Response for status 200
   */
  export namespace PostApiAiProviderBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiProviderBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiProviderBatchData;
  }

  /**
   * @description 分页查询AI提供商列表
   * @tags ai, provider
   * @name PostApiAiProviderQuery
   * @summary 分页查询AI提供商
   * @request POST:/api/ai/provider/query
   * @response `200` `PostApiAiProviderQueryData` Response for status 200
   */
  export namespace PostApiAiProviderQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiProviderQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiProviderQueryData;
  }

  /**
   * @description 创建单个AI会话
   * @tags ai, aiSession
   * @name PostApiAiSession
   * @summary 创建AI会话
   * @request POST:/api/ai/session
   * @response `200` `PostApiAiSessionData` Response for status 200
   */
  export namespace PostApiAiSession {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiSessionPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiSessionData;
  }

  /**
   * @description 创建单条AI会话消息
   * @tags ai, aiSessionMessage
   * @name PostApiAiSessionMessage
   * @summary 创建AI会话消息
   * @request POST:/api/ai/session-message
   * @response `200` `PostApiAiSessionMessageData` Response for status 200
   */
  export namespace PostApiAiSessionMessage {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiSessionMessagePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiSessionMessageData;
  }

  /**
   * @description 批量创建AI会话消息
   * @tags ai, aiSessionMessage
   * @name PostApiAiSessionMessageBatch
   * @summary 批量创建AI会话消息
   * @request POST:/api/ai/session-message/batch
   * @response `200` `PostApiAiSessionMessageBatchData` Response for status 200
   */
  export namespace PostApiAiSessionMessageBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiSessionMessageBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiSessionMessageBatchData;
  }

  /**
   * @description 分页查询AI会话消息列表
   * @tags ai, aiSessionMessage
   * @name PostApiAiSessionMessageQuery
   * @summary 分页查询AI会话消息
   * @request POST:/api/ai/session-message/query
   * @response `200` `PostApiAiSessionMessageQueryData` Response for status 200
   */
  export namespace PostApiAiSessionMessageQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiSessionMessageQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiSessionMessageQueryData;
  }

  /**
   * @description 分页查询AI会话列表
   * @tags ai, aiSession
   * @name PostApiAiSessionQuery
   * @summary 分页查询AI会话
   * @request POST:/api/ai/session/query
   * @response `200` `PostApiAiSessionQueryData` Response for status 200
   */
  export namespace PostApiAiSessionQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiSessionQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiSessionQueryData;
  }

  /**
   * @description 创建单个工具组
   * @tags ai, toolGroup
   * @name PostApiAiToolGroup
   * @summary 创建工具组
   * @request POST:/api/ai/tool-group
   * @response `200` `PostApiAiToolGroupData` Response for status 200
   */
  export namespace PostApiAiToolGroup {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiToolGroupPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiToolGroupData;
  }

  /**
   * @description 批量创建多个工具组
   * @tags ai, toolGroup
   * @name PostApiAiToolGroupBatch
   * @summary 批量创建工具组
   * @request POST:/api/ai/tool-group/batch
   * @response `200` `PostApiAiToolGroupBatchData` Response for status 200
   */
  export namespace PostApiAiToolGroupBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiToolGroupBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiToolGroupBatchData;
  }

  /**
   * @description 分页查询工具组列表
   * @tags ai, toolGroup
   * @name PostApiAiToolGroupQuery
   * @summary 分页查询工具组
   * @request POST:/api/ai/tool-group/query
   * @response `200` `PostApiAiToolGroupQueryData` Response for status 200
   */
  export namespace PostApiAiToolGroupQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiToolGroupQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiToolGroupQueryData;
  }

  /**
   * @description 根据ID列表批量更新AI智能体
   * @tags ai, agent
   * @name PutApiAiAgentBatch
   * @summary 批量更新AI智能体
   * @request PUT:/api/ai/agent/batch
   * @response `200` `PutApiAiAgentBatchData` Response for status 200
   */
  export namespace PutApiAiAgentBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiAiAgentBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiAgentBatchData;
  }

  /**
   * @description 根据ID更新单个AI智能体
   * @tags ai, agent
   * @name PutApiAiAgentById
   * @summary 更新AI智能体
   * @request PUT:/api/ai/agent/{id}
   * @response `200` `PutApiAiAgentByIdData` Response for status 200
   */
  export namespace PutApiAiAgentById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiAiAgentByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiAgentByIdData;
  }

  /**
   * @description 根据ID更新单个Agent会话
   * @tags ai, agentSession
   * @name PutApiAiAgentSessionById
   * @summary 更新Agent会话
   * @request PUT:/api/ai/agent-session/{id}
   * @response `200` `PutApiAiAgentSessionByIdData` Response for status 200
   */
  export namespace PutApiAiAgentSessionById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiAiAgentSessionByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiAgentSessionByIdData;
  }

  /**
   * @description 归档指定Agent会话
   * @tags ai, agentSession
   * @name PutApiAiAgentSessionByIdArchive
   * @summary 归档Agent会话
   * @request PUT:/api/ai/agent-session/{id}/archive
   * @response `200` `PutApiAiAgentSessionByIdArchiveData` Response for status 200
   */
  export namespace PutApiAiAgentSessionByIdArchive {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiAiAgentSessionByIdArchivePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiAgentSessionByIdArchiveData;
  }

  /**
   * @description 置顶/取消置顶Agent会话
   * @tags ai, agentSession
   * @name PutApiAiAgentSessionByIdPin
   * @summary 置顶Agent会话
   * @request PUT:/api/ai/agent-session/{id}/pin
   * @response `200` `PutApiAiAgentSessionByIdPinData` Response for status 200
   */
  export namespace PutApiAiAgentSessionByIdPin {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiAiAgentSessionByIdPinPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiAgentSessionByIdPinData;
  }

  /**
   * @description 更新API密钥信息和关联的MCP服务
   * @tags ai, apiKey
   * @name PutApiAiApiKeyById
   * @summary 更新API密钥
   * @request PUT:/api/ai/api-key/{id}
   * @response `200` `PutApiAiApiKeyByIdData` Response for status 200
   */
  export namespace PutApiAiApiKeyById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiAiApiKeyByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiApiKeyByIdData;
  }

  /**
   * @description 根据ID更新单个MCP服务
   * @tags ai, mcpServer
   * @name PutApiAiMcpServerById
   * @summary 更新MCP服务
   * @request PUT:/api/ai/mcp-server/{id}
   * @response `200` `PutApiAiMcpServerByIdData` Response for status 200
   */
  export namespace PutApiAiMcpServerById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiAiMcpServerByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiMcpServerByIdData;
  }

  /**
   * @description 根据ID列表批量更新AI模型
   * @tags ai, model
   * @name PutApiAiModelBatch
   * @summary 批量更新AI模型
   * @request PUT:/api/ai/model/batch
   * @response `200` `PutApiAiModelBatchData` Response for status 200
   */
  export namespace PutApiAiModelBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiAiModelBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiModelBatchData;
  }

  /**
   * @description 根据ID更新单个AI模型
   * @tags ai, model
   * @name PutApiAiModelById
   * @summary 更新AI模型
   * @request PUT:/api/ai/model/{id}
   * @response `200` `PutApiAiModelByIdData` Response for status 200
   */
  export namespace PutApiAiModelById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiAiModelByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiModelByIdData;
  }

  /**
   * @description 根据ID列表批量更新AI提供商
   * @tags ai, provider
   * @name PutApiAiProviderBatch
   * @summary 批量更新AI提供商
   * @request PUT:/api/ai/provider/batch
   * @response `200` `PutApiAiProviderBatchData` Response for status 200
   */
  export namespace PutApiAiProviderBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiAiProviderBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiProviderBatchData;
  }

  /**
   * @description 根据ID更新单个AI提供商
   * @tags ai, provider
   * @name PutApiAiProviderById
   * @summary 更新AI提供商
   * @request PUT:/api/ai/provider/{id}
   * @response `200` `PutApiAiProviderByIdData` Response for status 200
   */
  export namespace PutApiAiProviderById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiAiProviderByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiProviderByIdData;
  }

  /**
   * @description 更新单个AI会话
   * @tags ai, aiSession
   * @name PutApiAiSessionById
   * @summary 更新AI会话
   * @request PUT:/api/ai/session/{id}
   * @response `200` `PutApiAiSessionByIdData` Response for status 200
   */
  export namespace PutApiAiSessionById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiAiSessionByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiSessionByIdData;
  }

  /**
   * @description 根据ID列表批量更新工具组
   * @tags ai, toolGroup
   * @name PutApiAiToolGroupBatch
   * @summary 批量更新工具组
   * @request PUT:/api/ai/tool-group/batch
   * @response `200` `PutApiAiToolGroupBatchData` Response for status 200
   */
  export namespace PutApiAiToolGroupBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiAiToolGroupBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiToolGroupBatchData;
  }

  /**
   * @description 根据ID更新单个工具组
   * @tags ai, toolGroup
   * @name PutApiAiToolGroupById
   * @summary 更新工具组
   * @request PUT:/api/ai/tool-group/{id}
   * @response `200` `PutApiAiToolGroupByIdData` Response for status 200
   */
  export namespace PutApiAiToolGroupById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiAiToolGroupByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiToolGroupByIdData;
  }
}

export namespace Auth {
  /**
   * @description 获取 Token 过期时间配置
   * @tags auth
   * @name GetApiAuthConfig
   * @summary 获取Token配置
   * @request GET:/api/auth/config
   * @response `200` `GetApiAuthConfigData` Response for status 200
   */
  export namespace GetApiAuthConfig {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAuthConfigData;
  }

  /**
 * @description 获取当前登录用户的详细信息
 * @tags auth
 * @name GetApiAuthMe
 * @summary 获取当前用户
 * @request GET:/api/auth/me
 * @response `200` `GetApiAuthMeData` Response for status 200
 * @response `401` `{
    data: null,
    message: string,
    success: false,

}` Response for status 401
 * @response `500` `{
    data: null,
    message: string,
    success: false,

}` Response for status 500
*/
  export namespace GetApiAuthMe {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAuthMeData;
  }

  /**
 * @description 验证 Access Token 是否有效
 * @tags auth
 * @name GetApiAuthVerify
 * @summary 验证令牌
 * @request GET:/api/auth/verify
 * @response `200` `GetApiAuthVerifyData` Response for status 200
 * @response `401` `{
    data: null,
    message: string,
    success: false,

}` Response for status 401
 * @response `500` `{
    data: null,
    message: string,
    success: false,

}` Response for status 500
*/
  export namespace GetApiAuthVerify {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAuthVerifyData;
  }

  /**
 * @description 使用用户名密码登录，返回双 Token
 * @tags auth
 * @name PostApiAuthLogin
 * @summary 用户登录
 * @request POST:/api/auth/login
 * @response `200` `PostApiAuthLoginData` Response for status 200
 * @response `401` `{
    data: null,
    message: string,
    success: false,

}` Response for status 401
 * @response `500` `{
    data: null,
    message: string,
    success: false,

}` Response for status 500
*/
  export namespace PostApiAuthLogin {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAuthLoginPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAuthLoginData;
  }

  /**
 * @description 撤销用户的所有刷新令牌
 * @tags auth
 * @name PostApiAuthLogout
 * @summary 用户登出
 * @request POST:/api/auth/logout
 * @response `200` `PostApiAuthLogoutData` Response for status 200
 * @response `401` `{
    data: null,
    message: string,
    success: false,

}` Response for status 401
 * @response `500` `{
    data: null,
    message: string,
    success: false,

}` Response for status 500
*/
  export namespace PostApiAuthLogout {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAuthLogoutData;
  }

  /**
 * @description 使用 Refresh Token 获取新的 Access Token
 * @tags auth
 * @name PostApiAuthRefresh
 * @summary 刷新访问令牌
 * @request POST:/api/auth/refresh
 * @response `200` `PostApiAuthRefreshData` Response for status 200
 * @response `401` `{
    data: null,
    message: string,
    success: false,

}` Response for status 401
 * @response `500` `{
    data: null,
    message: string,
    success: false,

}` Response for status 500
*/
  export namespace PostApiAuthRefresh {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAuthRefreshPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAuthRefreshData;
  }

  /**
 * @description 修改当前用户密码
 * @tags auth
 * @name PutApiAuthPassword
 * @summary 修改密码
 * @request PUT:/api/auth/password
 * @response `200` `PutApiAuthPasswordData` Response for status 200
 * @response `400` `{
    data: null,
    message: string,
    success: false,

}` Response for status 400
 * @response `401` `{
    data: null,
    message: string,
    success: false,

}` Response for status 401
 * @response `500` `{
    data: null,
    message: string,
    success: false,

}` Response for status 500
*/
  export namespace PutApiAuthPassword {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiAuthPasswordPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAuthPasswordData;
  }
}

export namespace Ws {
  /**
   * No description
   * @name WsWsMain
   * @request WS:/ws/main
   */
  export namespace WsWsMain {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }
}

export namespace Api {
  /**
   * No description
   * @name GetApiMonitorDiskPartitions
   * @request GET:/api/monitor/disk/partitions
   */
  export namespace GetApiMonitorDiskPartitions {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @name GetApiMonitorMetrics
   * @request GET:/api/monitor/metrics
   */
  export namespace GetApiMonitorMetrics {
    export type RequestParams = {};
    export type RequestQuery = {
      range?: string;
      type: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @name GetApiMonitorMetricsLatest
   * @request GET:/api/monitor/metrics/latest
   */
  export namespace GetApiMonitorMetricsLatest {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @name GetApiMonitorPorts
   * @request GET:/api/monitor/ports
   */
  export namespace GetApiMonitorPorts {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @name GetApiMonitorProcesses
   * @request GET:/api/monitor/processes
   */
  export namespace GetApiMonitorProcesses {
    export type RequestParams = {};
    export type RequestQuery = {
      limit?: string;
      sortBy?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @name GetApiMonitorSystemInfo
   * @request GET:/api/monitor/system/info
   */
  export namespace GetApiMonitorSystemInfo {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @name PostApiMonitorProcessesByPidKill
   * @request POST:/api/monitor/processes/{pid}/kill
   */
  export namespace PostApiMonitorProcessesByPidKill {
    export type RequestParams = {
      pid: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }
}

export namespace Health {
  /**
   * No description
   * @name GetHealth
   * @request GET:/health
   */
  export namespace GetHealth {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }
}

export namespace Actions {
  /**
   * @description 获取系统中所有已注册的Actions的名称和描述
   * @tags actions
   * @name GetApiActions
   * @summary 获取所有Actions列表
   * @request GET:/api/actions
   * @response `200` `GetApiActionsData` Response for status 200
   */
  export namespace GetApiActions {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiActionsData;
  }

  /**
   * @description 根据Action名称获取详细信息，包含输入输出的JSON Schema
   * @tags actions
   * @name GetApiActionsByName
   * @summary 获取Action详情
   * @request GET:/api/actions/{name}
   * @response `200` `GetApiActionsByNameData` Response for status 200
   */
  export namespace GetApiActionsByName {
    export type RequestParams = {
      name: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiActionsByNameData;
  }

  /**
   * @description 通过Action名称执行，支持X-Sandbox header控制沙盒模式。沙盒模式下只验证输入不实际执行，返回模拟数据。
   * @tags actions
   * @name PostApiActionsExecuteByName
   * @summary 通过名称执行Action
   * @request POST:/api/actions/execute/{name}
   * @response `200` `PostApiActionsExecuteByNameData` Response for status 200
   */
  export namespace PostApiActionsExecuteByName {
    export type RequestParams = {
      name: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PostApiActionsExecuteByNamePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiActionsExecuteByNameData;
  }
}

export namespace System {
  /**
   * @description 根据ID删除配置
   * @tags system, config
   * @name DeleteApiSystemConfigById
   * @summary 删除配置
   * @request DELETE:/api/system/config/{id}
   * @response `200` `DeleteApiSystemConfigByIdData` Response for status 200
   */
  export namespace DeleteApiSystemConfigById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemConfigByIdData;
  }

  /**
   * @description 根据ID软删除部门
   * @tags system, department
   * @name DeleteApiSystemDepartmentById
   * @summary 删除部门
   * @request DELETE:/api/system/department/{id}
   * @response `200` `DeleteApiSystemDepartmentByIdData` Response for status 200
   */
  export namespace DeleteApiSystemDepartmentById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemDepartmentByIdData;
  }

  /**
   * @description 根据ID软删除字典
   * @tags system, dict
   * @name DeleteApiSystemDictById
   * @summary 删除字典
   * @request DELETE:/api/system/dict/{id}
   * @response `200` `DeleteApiSystemDictByIdData` Response for status 200
   */
  export namespace DeleteApiSystemDictById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemDictByIdData;
  }

  /**
   * @description 根据Key删除字典组
   * @tags system, dictGroup
   * @name DeleteApiSystemDictGroupByKey
   * @summary 删除字典组
   * @request DELETE:/api/system/dict-group/{key}
   * @response `200` `DeleteApiSystemDictGroupByKeyData` Response for status 200
   */
  export namespace DeleteApiSystemDictGroupByKey {
    export type RequestParams = {
      /**
       * @minLength 1
       * @maxLength 100
       */
      key: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemDictGroupByKeyData;
  }

  /**
   * @description 根据ID删除定时任务
   * @tags system, job
   * @name DeleteApiSystemJobById
   * @summary 删除定时任务
   * @request DELETE:/api/system/job/{id}
   * @response `200` `DeleteApiSystemJobByIdData` Response for status 200
   */
  export namespace DeleteApiSystemJobById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemJobByIdData;
  }

  /**
   * @description 根据ID删除任务日志
   * @tags system, jobLog
   * @name DeleteApiSystemJobLogById
   * @summary 删除任务日志
   * @request DELETE:/api/system/job-log/{id}
   * @response `200` `DeleteApiSystemJobLogByIdData` Response for status 200
   */
  export namespace DeleteApiSystemJobLogById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemJobLogByIdData;
  }

  /**
   * @description 根据ID删除登录日志
   * @tags system, loginInfo
   * @name DeleteApiSystemLoginInfoById
   * @summary 删除登录日志
   * @request DELETE:/api/system/login-info/{id}
   * @response `200` `DeleteApiSystemLoginInfoByIdData` Response for status 200
   */
  export namespace DeleteApiSystemLoginInfoById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemLoginInfoByIdData;
  }

  /**
   * @description 根据ID删除菜单
   * @tags system, menu
   * @name DeleteApiSystemMenuById
   * @summary 删除菜单
   * @request DELETE:/api/system/menu/{id}
   * @response `200` `DeleteApiSystemMenuByIdData` Response for status 200
   */
  export namespace DeleteApiSystemMenuById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemMenuByIdData;
  }

  /**
   * @description 根据ID删除通知
   * @tags system, notice
   * @name DeleteApiSystemNoticeById
   * @summary 删除通知
   * @request DELETE:/api/system/notice/{id}
   * @response `200` `DeleteApiSystemNoticeByIdData` Response for status 200
   */
  export namespace DeleteApiSystemNoticeById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemNoticeByIdData;
  }

  /**
   * @description 根据ID删除操作日志
   * @tags system, operationLog
   * @name DeleteApiSystemOperationLogById
   * @summary 删除操作日志
   * @request DELETE:/api/system/operation-log/{id}
   * @response `200` `DeleteApiSystemOperationLogByIdData` Response for status 200
   */
  export namespace DeleteApiSystemOperationLogById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemOperationLogByIdData;
  }

  /**
   * @description 根据ID删除权限（同时删除子权限）
   * @tags system, permission
   * @name DeleteApiSystemPermissionById
   * @summary 删除权限
   * @request DELETE:/api/system/permission/{id}
   * @response `200` `DeleteApiSystemPermissionByIdData` Response for status 200
   */
  export namespace DeleteApiSystemPermissionById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemPermissionByIdData;
  }

  /**
   * @description 根据ID软删除岗位
   * @tags system, post
   * @name DeleteApiSystemPostById
   * @summary 删除岗位
   * @request DELETE:/api/system/post/{id}
   * @response `200` `DeleteApiSystemPostByIdData` Response for status 200
   */
  export namespace DeleteApiSystemPostById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemPostByIdData;
  }

  /**
   * @description 根据ID软删除角色
   * @tags system, role
   * @name DeleteApiSystemRoleById
   * @summary 删除角色
   * @request DELETE:/api/system/role/{id}
   * @response `200` `DeleteApiSystemRoleByIdData` Response for status 200
   */
  export namespace DeleteApiSystemRoleById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemRoleByIdData;
  }

  /**
   * @description 根据复合主键删除
   * @tags system, roleDepartment
   * @name DeleteApiSystemRoleDepartmentByRoleIdByDepartmentId
   * @summary 删除角色部门关联
   * @request DELETE:/api/system/role-department/{roleId}/{departmentId}
   * @response `200` `DeleteApiSystemRoleDepartmentByRoleIdByDepartmentIdData` Response for status 200
   */
  export namespace DeleteApiSystemRoleDepartmentByRoleIdByDepartmentId {
    export type RequestParams = {
      departmentId: string;
      roleId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      DeleteApiSystemRoleDepartmentByRoleIdByDepartmentIdData;
  }

  /**
   * @description 根据复合主键删除
   * @tags system, roleMenu
   * @name DeleteApiSystemRoleMenuByRoleIdByMenuId
   * @summary 删除角色菜单关联
   * @request DELETE:/api/system/role-menu/{roleId}/{menuId}
   * @response `200` `DeleteApiSystemRoleMenuByRoleIdByMenuIdData` Response for status 200
   */
  export namespace DeleteApiSystemRoleMenuByRoleIdByMenuId {
    export type RequestParams = {
      menuId: string;
      roleId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemRoleMenuByRoleIdByMenuIdData;
  }

  /**
   * @description 根据ID删除令牌
   * @tags system, token
   * @name DeleteApiSystemTokenById
   * @summary 删除令牌
   * @request DELETE:/api/system/token/{id}
   * @response `200` `DeleteApiSystemTokenByIdData` Response for status 200
   */
  export namespace DeleteApiSystemTokenById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemTokenByIdData;
  }

  /**
   * @description 根据ID软删除用户
   * @tags system, user
   * @name DeleteApiSystemUserById
   * @summary 删除用户
   * @request DELETE:/api/system/user/{id}
   * @response `200` `DeleteApiSystemUserByIdData` Response for status 200
   */
  export namespace DeleteApiSystemUserById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemUserByIdData;
  }

  /**
   * @description 根据复合主键删除
   * @tags system, userPost
   * @name DeleteApiSystemUserPostByUserIdByPostId
   * @summary 删除用户岗位关联
   * @request DELETE:/api/system/user-post/{userId}/{postId}
   * @response `200` `DeleteApiSystemUserPostByUserIdByPostIdData` Response for status 200
   */
  export namespace DeleteApiSystemUserPostByUserIdByPostId {
    export type RequestParams = {
      postId: string;
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemUserPostByUserIdByPostIdData;
  }

  /**
   * @description 根据复合主键删除
   * @tags system, userRole
   * @name DeleteApiSystemUserRoleByUserIdByRoleId
   * @summary 删除用户角色关联
   * @request DELETE:/api/system/user-role/{userId}/{roleId}
   * @response `200` `DeleteApiSystemUserRoleByUserIdByRoleIdData` Response for status 200
   */
  export namespace DeleteApiSystemUserRoleByUserIdByRoleId {
    export type RequestParams = {
      roleId: string;
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiSystemUserRoleByUserIdByRoleIdData;
  }

  /**
   * @description 获取指定角色的所有权限标识
   * @tags system, casbinRule
   * @name GetApiSystemCasbinRuleRoleByRoleKeyPermissions
   * @summary 获取角色权限
   * @request GET:/api/system/casbin-rule/role/{roleKey}/permissions
   * @response `200` `GetApiSystemCasbinRuleRoleByRoleKeyPermissionsData` Response for status 200
   */
  export namespace GetApiSystemCasbinRuleRoleByRoleKeyPermissions {
    export type RequestParams = {
      roleKey: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      GetApiSystemCasbinRuleRoleByRoleKeyPermissionsData;
  }

  /**
   * @description 获取指定用户的所有角色
   * @tags system, casbinRule
   * @name GetApiSystemCasbinRuleUserByUserIdRoles
   * @summary 获取用户角色
   * @request GET:/api/system/casbin-rule/user/{userId}/roles
   * @response `200` `GetApiSystemCasbinRuleUserByUserIdRolesData` Response for status 200
   */
  export namespace GetApiSystemCasbinRuleUserByUserIdRoles {
    export type RequestParams = {
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemCasbinRuleUserByUserIdRolesData;
  }

  /**
   * @description 根据主键ID查询单个配置
   * @tags system, config
   * @name GetApiSystemConfigById
   * @summary 根据ID查询配置
   * @request GET:/api/system/config/{id}
   * @response `200` `GetApiSystemConfigByIdData` Response for status 200
   */
  export namespace GetApiSystemConfigById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemConfigByIdData;
  }

  /**
   * @description 获取配置表的JSON Schema
   * @tags system, config
   * @name GetApiSystemConfigSchema
   * @summary 获取配置Schema
   * @request GET:/api/system/config/schema
   * @response `200` `GetApiSystemConfigSchemaData` Response for status 200
   */
  export namespace GetApiSystemConfigSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemConfigSchemaData;
  }

  /**
   * @description 根据主键ID查询单个部门
   * @tags system, department
   * @name GetApiSystemDepartmentById
   * @summary 根据ID查询部门
   * @request GET:/api/system/department/{id}
   * @response `200` `GetApiSystemDepartmentByIdData` Response for status 200
   */
  export namespace GetApiSystemDepartmentById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemDepartmentByIdData;
  }

  /**
   * @description 获取部门表的JSON Schema
   * @tags system, department
   * @name GetApiSystemDepartmentSchema
   * @summary 获取部门Schema
   * @request GET:/api/system/department/schema
   * @response `200` `GetApiSystemDepartmentSchemaData` Response for status 200
   */
  export namespace GetApiSystemDepartmentSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemDepartmentSchemaData;
  }

  /**
   * @description 根据主键ID查询单个字典
   * @tags system, dict
   * @name GetApiSystemDictById
   * @summary 根据ID查询字典
   * @request GET:/api/system/dict/{id}
   * @response `200` `GetApiSystemDictByIdData` Response for status 200
   */
  export namespace GetApiSystemDictById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemDictByIdData;
  }

  /**
   * @description 根据主键Key查询单个字典组
   * @tags system, dictGroup
   * @name GetApiSystemDictGroupByKey
   * @summary 根据Key查询字典组
   * @request GET:/api/system/dict-group/{key}
   * @response `200` `GetApiSystemDictGroupByKeyData` Response for status 200
   */
  export namespace GetApiSystemDictGroupByKey {
    export type RequestParams = {
      /**
       * @minLength 1
       * @maxLength 100
       */
      key: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemDictGroupByKeyData;
  }

  /**
   * @description 获取字典组表的JSON Schema
   * @tags system, dictGroup
   * @name GetApiSystemDictGroupSchema
   * @summary 获取字典组Schema
   * @request GET:/api/system/dict-group/schema
   * @response `200` `GetApiSystemDictGroupSchemaData` Response for status 200
   */
  export namespace GetApiSystemDictGroupSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemDictGroupSchemaData;
  }

  /**
   * @description 获取字典表的JSON Schema
   * @tags system, dict
   * @name GetApiSystemDictSchema
   * @summary 获取字典Schema
   * @request GET:/api/system/dict/schema
   * @response `200` `GetApiSystemDictSchemaData` Response for status 200
   */
  export namespace GetApiSystemDictSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemDictSchemaData;
  }

  /**
   * @description 根据主键ID查询单个定时任务
   * @tags system, job
   * @name GetApiSystemJobById
   * @summary 根据ID查询定时任务
   * @request GET:/api/system/job/{id}
   * @response `200` `GetApiSystemJobByIdData` Response for status 200
   */
  export namespace GetApiSystemJobById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemJobByIdData;
  }

  /**
   * @description 根据主键ID查询单个任务日志
   * @tags system, jobLog
   * @name GetApiSystemJobLogById
   * @summary 根据ID查询任务日志
   * @request GET:/api/system/job-log/{id}
   * @response `200` `GetApiSystemJobLogByIdData` Response for status 200
   */
  export namespace GetApiSystemJobLogById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemJobLogByIdData;
  }

  /**
   * @description 获取任务日志表的JSON Schema
   * @tags system, jobLog
   * @name GetApiSystemJobLogSchema
   * @summary 获取任务日志Schema
   * @request GET:/api/system/job-log/schema
   * @response `200` `GetApiSystemJobLogSchemaData` Response for status 200
   */
  export namespace GetApiSystemJobLogSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemJobLogSchemaData;
  }

  /**
   * @description 获取定时任务表的JSON Schema
   * @tags system, job
   * @name GetApiSystemJobSchema
   * @summary 获取定时任务Schema
   * @request GET:/api/system/job/schema
   * @response `200` `GetApiSystemJobSchemaData` Response for status 200
   */
  export namespace GetApiSystemJobSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemJobSchemaData;
  }

  /**
   * @description 根据主键ID查询单个登录日志
   * @tags system, loginInfo
   * @name GetApiSystemLoginInfoById
   * @summary 根据ID查询登录日志
   * @request GET:/api/system/login-info/{id}
   * @response `200` `GetApiSystemLoginInfoByIdData` Response for status 200
   */
  export namespace GetApiSystemLoginInfoById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemLoginInfoByIdData;
  }

  /**
   * @description 获取登录信息表的JSON Schema
   * @tags system, loginInfo
   * @name GetApiSystemLoginInfoSchema
   * @summary 获取登录信息Schema
   * @request GET:/api/system/login-info/schema
   * @response `200` `GetApiSystemLoginInfoSchemaData` Response for status 200
   */
  export namespace GetApiSystemLoginInfoSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemLoginInfoSchemaData;
  }

  /**
   * @description 根据主键ID查询单个菜单
   * @tags system, menu
   * @name GetApiSystemMenuById
   * @summary 根据ID查询菜单
   * @request GET:/api/system/menu/{id}
   * @response `200` `GetApiSystemMenuByIdData` Response for status 200
   */
  export namespace GetApiSystemMenuById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemMenuByIdData;
  }

  /**
   * @description 获取菜单表的JSON Schema
   * @tags system, menu
   * @name GetApiSystemMenuSchema
   * @summary 获取菜单Schema
   * @request GET:/api/system/menu/schema
   * @response `200` `GetApiSystemMenuSchemaData` Response for status 200
   */
  export namespace GetApiSystemMenuSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemMenuSchemaData;
  }

  /**
   * @description 根据主键ID查询单个通知
   * @tags system, notice
   * @name GetApiSystemNoticeById
   * @summary 根据ID查询通知
   * @request GET:/api/system/notice/{id}
   * @response `200` `GetApiSystemNoticeByIdData` Response for status 200
   */
  export namespace GetApiSystemNoticeById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemNoticeByIdData;
  }

  /**
   * @description 获取通知表的JSON Schema
   * @tags system, notice
   * @name GetApiSystemNoticeSchema
   * @summary 获取通知Schema
   * @request GET:/api/system/notice/schema
   * @response `200` `GetApiSystemNoticeSchemaData` Response for status 200
   */
  export namespace GetApiSystemNoticeSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemNoticeSchemaData;
  }

  /**
   * @description 根据主键ID查询单个操作日志
   * @tags system, operationLog
   * @name GetApiSystemOperationLogById
   * @summary 根据ID查询操作日志
   * @request GET:/api/system/operation-log/{id}
   * @response `200` `GetApiSystemOperationLogByIdData` Response for status 200
   */
  export namespace GetApiSystemOperationLogById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemOperationLogByIdData;
  }

  /**
   * @description 获取操作日志表的JSON Schema
   * @tags system, operationLog
   * @name GetApiSystemOperationLogSchema
   * @summary 获取操作日志Schema
   * @request GET:/api/system/operation-log/schema
   * @response `200` `GetApiSystemOperationLogSchemaData` Response for status 200
   */
  export namespace GetApiSystemOperationLogSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemOperationLogSchemaData;
  }

  /**
   * @description 根据主键ID查询单个权限
   * @tags system, permission
   * @name GetApiSystemPermissionById
   * @summary 根据ID查询权限
   * @request GET:/api/system/permission/{id}
   * @response `200` `GetApiSystemPermissionByIdData` Response for status 200
   */
  export namespace GetApiSystemPermissionById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemPermissionByIdData;
  }

  /**
   * @description 获取权限表的JSON Schema
   * @tags system, permission
   * @name GetApiSystemPermissionSchema
   * @summary 获取权限Schema
   * @request GET:/api/system/permission/schema
   * @response `200` `GetApiSystemPermissionSchemaData` Response for status 200
   */
  export namespace GetApiSystemPermissionSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemPermissionSchemaData;
  }

  /**
   * @description 获取完整的权限树结构
   * @tags system, permission
   * @name GetApiSystemPermissionTree
   * @summary 获取权限树
   * @request GET:/api/system/permission/tree
   * @response `200` `GetApiSystemPermissionTreeData` Response for status 200
   */
  export namespace GetApiSystemPermissionTree {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemPermissionTreeData;
  }

  /**
   * @description 根据主键ID查询单个岗位
   * @tags system, post
   * @name GetApiSystemPostById
   * @summary 根据ID查询岗位
   * @request GET:/api/system/post/{id}
   * @response `200` `GetApiSystemPostByIdData` Response for status 200
   */
  export namespace GetApiSystemPostById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemPostByIdData;
  }

  /**
   * @description 获取岗位表的JSON Schema
   * @tags system, post
   * @name GetApiSystemPostSchema
   * @summary 获取岗位Schema
   * @request GET:/api/system/post/schema
   * @response `200` `GetApiSystemPostSchemaData` Response for status 200
   */
  export namespace GetApiSystemPostSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemPostSchemaData;
  }

  /**
   * @description 根据主键ID查询单个角色
   * @tags system, role
   * @name GetApiSystemRoleById
   * @summary 根据ID查询角色
   * @request GET:/api/system/role/{id}
   * @response `200` `GetApiSystemRoleByIdData` Response for status 200
   */
  export namespace GetApiSystemRoleById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemRoleByIdData;
  }

  /**
   * @description 根据roleId和departmentId查询
   * @tags system, roleDepartment
   * @name GetApiSystemRoleDepartmentByRoleIdByDepartmentId
   * @summary 根据复合主键查询角色部门关联
   * @request GET:/api/system/role-department/{roleId}/{departmentId}
   * @response `200` `GetApiSystemRoleDepartmentByRoleIdByDepartmentIdData` Response for status 200
   */
  export namespace GetApiSystemRoleDepartmentByRoleIdByDepartmentId {
    export type RequestParams = {
      departmentId: string;
      roleId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      GetApiSystemRoleDepartmentByRoleIdByDepartmentIdData;
  }

  /**
   * @description 获取角色部门表的JSON Schema
   * @tags system, roleDepartment
   * @name GetApiSystemRoleDepartmentSchema
   * @summary 获取角色部门Schema
   * @request GET:/api/system/role-department/schema
   * @response `200` `GetApiSystemRoleDepartmentSchemaData` Response for status 200
   */
  export namespace GetApiSystemRoleDepartmentSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemRoleDepartmentSchemaData;
  }

  /**
   * @description 根据roleId和menuId查询
   * @tags system, roleMenu
   * @name GetApiSystemRoleMenuByRoleIdByMenuId
   * @summary 根据复合主键查询角色菜单关联
   * @request GET:/api/system/role-menu/{roleId}/{menuId}
   * @response `200` `GetApiSystemRoleMenuByRoleIdByMenuIdData` Response for status 200
   */
  export namespace GetApiSystemRoleMenuByRoleIdByMenuId {
    export type RequestParams = {
      menuId: string;
      roleId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemRoleMenuByRoleIdByMenuIdData;
  }

  /**
   * @description 获取指定角色的所有菜单ID
   * @tags system, roleMenu
   * @name GetApiSystemRoleMenuRoleByRoleId
   * @summary 获取角色菜单
   * @request GET:/api/system/role-menu/role/{roleId}
   * @response `200` `GetApiSystemRoleMenuRoleByRoleIdData` Response for status 200
   */
  export namespace GetApiSystemRoleMenuRoleByRoleId {
    export type RequestParams = {
      roleId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemRoleMenuRoleByRoleIdData;
  }

  /**
   * @description 获取角色菜单表的JSON Schema
   * @tags system, roleMenu
   * @name GetApiSystemRoleMenuSchema
   * @summary 获取角色菜单Schema
   * @request GET:/api/system/role-menu/schema
   * @response `200` `GetApiSystemRoleMenuSchemaData` Response for status 200
   */
  export namespace GetApiSystemRoleMenuSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemRoleMenuSchemaData;
  }

  /**
   * @description 获取角色表的JSON Schema
   * @tags system, role
   * @name GetApiSystemRoleSchema
   * @summary 获取角色Schema
   * @request GET:/api/system/role/schema
   * @response `200` `GetApiSystemRoleSchemaData` Response for status 200
   */
  export namespace GetApiSystemRoleSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemRoleSchemaData;
  }

  /**
   * @description 根据主键ID查询单个令牌
   * @tags system, token
   * @name GetApiSystemTokenById
   * @summary 根据ID查询令牌
   * @request GET:/api/system/token/{id}
   * @response `200` `GetApiSystemTokenByIdData` Response for status 200
   */
  export namespace GetApiSystemTokenById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemTokenByIdData;
  }

  /**
   * @description 获取Token表的JSON Schema
   * @tags system, token
   * @name GetApiSystemTokenSchema
   * @summary 获取TokenSchema
   * @request GET:/api/system/token/schema
   * @response `200` `GetApiSystemTokenSchemaData` Response for status 200
   */
  export namespace GetApiSystemTokenSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemTokenSchemaData;
  }

  /**
   * @description 根据主键ID查询单个用户
   * @tags system, user
   * @name GetApiSystemUserById
   * @summary 根据ID查询用户
   * @request GET:/api/system/user/{id}
   * @response `200` `GetApiSystemUserByIdData` Response for status 200
   */
  export namespace GetApiSystemUserById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemUserByIdData;
  }

  /**
   * @description 根据userId和postId查询
   * @tags system, userPost
   * @name GetApiSystemUserPostByUserIdByPostId
   * @summary 根据复合主键查询用户岗位关联
   * @request GET:/api/system/user-post/{userId}/{postId}
   * @response `200` `GetApiSystemUserPostByUserIdByPostIdData` Response for status 200
   */
  export namespace GetApiSystemUserPostByUserIdByPostId {
    export type RequestParams = {
      postId: string;
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemUserPostByUserIdByPostIdData;
  }

  /**
   * @description 获取用户岗位表的JSON Schema
   * @tags system, userPost
   * @name GetApiSystemUserPostSchema
   * @summary 获取用户岗位Schema
   * @request GET:/api/system/user-post/schema
   * @response `200` `GetApiSystemUserPostSchemaData` Response for status 200
   */
  export namespace GetApiSystemUserPostSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemUserPostSchemaData;
  }

  /**
   * @description 获取指定用户的所有岗位ID
   * @tags system, userPost
   * @name GetApiSystemUserPostUserByUserId
   * @summary 获取用户岗位
   * @request GET:/api/system/user-post/user/{userId}
   * @response `200` `GetApiSystemUserPostUserByUserIdData` Response for status 200
   */
  export namespace GetApiSystemUserPostUserByUserId {
    export type RequestParams = {
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemUserPostUserByUserIdData;
  }

  /**
   * @description 根据userId和roleId查询
   * @tags system, userRole
   * @name GetApiSystemUserRoleByUserIdByRoleId
   * @summary 根据复合主键查询用户角色关联
   * @request GET:/api/system/user-role/{userId}/{roleId}
   * @response `200` `GetApiSystemUserRoleByUserIdByRoleIdData` Response for status 200
   */
  export namespace GetApiSystemUserRoleByUserIdByRoleId {
    export type RequestParams = {
      roleId: string;
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemUserRoleByUserIdByRoleIdData;
  }

  /**
   * @description 获取用户角色表的JSON Schema
   * @tags system, userRole
   * @name GetApiSystemUserRoleSchema
   * @summary 获取用户角色Schema
   * @request GET:/api/system/user-role/schema
   * @response `200` `GetApiSystemUserRoleSchemaData` Response for status 200
   */
  export namespace GetApiSystemUserRoleSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemUserRoleSchemaData;
  }

  /**
   * @description 获取指定用户的所有角色ID
   * @tags system, userRole
   * @name GetApiSystemUserRoleUserByUserId
   * @summary 获取用户角色
   * @request GET:/api/system/user-role/user/{userId}
   * @response `200` `GetApiSystemUserRoleUserByUserIdData` Response for status 200
   */
  export namespace GetApiSystemUserRoleUserByUserId {
    export type RequestParams = {
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemUserRoleUserByUserIdData;
  }

  /**
   * @description 获取用户表的JSON Schema
   * @tags system, user
   * @name GetApiSystemUserSchema
   * @summary 获取用户Schema
   * @request GET:/api/system/user/schema
   * @response `200` `GetApiSystemUserSchemaData` Response for status 200
   */
  export namespace GetApiSystemUserSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemUserSchemaData;
  }

  /**
   * @description 创建单个配置
   * @tags system, config
   * @name PostApiSystemConfig
   * @summary 创建配置
   * @request POST:/api/system/config
   * @response `200` `PostApiSystemConfigData` Response for status 200
   */
  export namespace PostApiSystemConfig {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemConfigPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemConfigData;
  }

  /**
   * @description 批量创建多个配置
   * @tags system, config
   * @name PostApiSystemConfigBatch
   * @summary 批量创建配置
   * @request POST:/api/system/config/batch
   * @response `200` `PostApiSystemConfigBatchData` Response for status 200
   */
  export namespace PostApiSystemConfigBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemConfigBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemConfigBatchData;
  }

  /**
   * @description 分页查询配置列表
   * @tags system, config
   * @name PostApiSystemConfigQuery
   * @summary 分页查询配置
   * @request POST:/api/system/config/query
   * @response `200` `PostApiSystemConfigQueryData` Response for status 200
   */
  export namespace PostApiSystemConfigQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemConfigQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemConfigQueryData;
  }

  /**
   * @description 创建单个部门
   * @tags system, department
   * @name PostApiSystemDepartment
   * @summary 创建部门
   * @request POST:/api/system/department
   * @response `200` `PostApiSystemDepartmentData` Response for status 200
   */
  export namespace PostApiSystemDepartment {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemDepartmentPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemDepartmentData;
  }

  /**
   * @description 批量创建多个部门
   * @tags system, department
   * @name PostApiSystemDepartmentBatch
   * @summary 批量创建部门
   * @request POST:/api/system/department/batch
   * @response `200` `PostApiSystemDepartmentBatchData` Response for status 200
   */
  export namespace PostApiSystemDepartmentBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemDepartmentBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemDepartmentBatchData;
  }

  /**
   * @description 分页查询部门列表，自动排除已删除数据
   * @tags system, department
   * @name PostApiSystemDepartmentQuery
   * @summary 分页查询部门
   * @request POST:/api/system/department/query
   * @response `200` `PostApiSystemDepartmentQueryData` Response for status 200
   */
  export namespace PostApiSystemDepartmentQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemDepartmentQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemDepartmentQueryData;
  }

  /**
   * @description 创建单个字典
   * @tags system, dict
   * @name PostApiSystemDict
   * @summary 创建字典
   * @request POST:/api/system/dict
   * @response `200` `PostApiSystemDictData` Response for status 200
   */
  export namespace PostApiSystemDict {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemDictPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemDictData;
  }

  /**
   * @description 批量创建多个字典
   * @tags system, dict
   * @name PostApiSystemDictBatch
   * @summary 批量创建字典
   * @request POST:/api/system/dict/batch
   * @response `200` `PostApiSystemDictBatchData` Response for status 200
   */
  export namespace PostApiSystemDictBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemDictBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemDictBatchData;
  }

  /**
   * @description 创建单个字典组
   * @tags system, dictGroup
   * @name PostApiSystemDictGroup
   * @summary 创建字典组
   * @request POST:/api/system/dict-group
   * @response `200` `PostApiSystemDictGroupData` Response for status 200
   */
  export namespace PostApiSystemDictGroup {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemDictGroupPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemDictGroupData;
  }

  /**
   * @description 批量创建多个字典组
   * @tags system, dictGroup
   * @name PostApiSystemDictGroupBatch
   * @summary 批量创建字典组
   * @request POST:/api/system/dict-group/batch
   * @response `200` `PostApiSystemDictGroupBatchData` Response for status 200
   */
  export namespace PostApiSystemDictGroupBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemDictGroupBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemDictGroupBatchData;
  }

  /**
   * @description 分页查询字典组列表
   * @tags system, dictGroup
   * @name PostApiSystemDictGroupQuery
   * @summary 分页查询字典组
   * @request POST:/api/system/dict-group/query
   * @response `200` `PostApiSystemDictGroupQueryData` Response for status 200
   */
  export namespace PostApiSystemDictGroupQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemDictGroupQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemDictGroupQueryData;
  }

  /**
   * @description 分页查询字典列表，自动排除已删除数据
   * @tags system, dict
   * @name PostApiSystemDictQuery
   * @summary 分页查询字典
   * @request POST:/api/system/dict/query
   * @response `200` `PostApiSystemDictQueryData` Response for status 200
   */
  export namespace PostApiSystemDictQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemDictQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemDictQueryData;
  }

  /**
   * @description 创建单个定时任务
   * @tags system, job
   * @name PostApiSystemJob
   * @summary 创建定时任务
   * @request POST:/api/system/job
   * @response `200` `PostApiSystemJobData` Response for status 200
   */
  export namespace PostApiSystemJob {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemJobData;
  }

  /**
   * @description 批量创建多个定时任务
   * @tags system, job
   * @name PostApiSystemJobBatch
   * @summary 批量创建定时任务
   * @request POST:/api/system/job/batch
   * @response `200` `PostApiSystemJobBatchData` Response for status 200
   */
  export namespace PostApiSystemJobBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemJobBatchData;
  }

  /**
   * @description 创建单个任务日志
   * @tags system, jobLog
   * @name PostApiSystemJobLog
   * @summary 创建任务日志
   * @request POST:/api/system/job-log
   * @response `200` `PostApiSystemJobLogData` Response for status 200
   */
  export namespace PostApiSystemJobLog {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemJobLogData;
  }

  /**
   * @description 批量创建多个任务日志
   * @tags system, jobLog
   * @name PostApiSystemJobLogBatch
   * @summary 批量创建任务日志
   * @request POST:/api/system/job-log/batch
   * @response `200` `PostApiSystemJobLogBatchData` Response for status 200
   */
  export namespace PostApiSystemJobLogBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemJobLogBatchData;
  }

  /**
   * @description 分页查询任务日志列表
   * @tags system, jobLog
   * @name PostApiSystemJobLogQuery
   * @summary 分页查询任务日志
   * @request POST:/api/system/job-log/query
   * @response `200` `PostApiSystemJobLogQueryData` Response for status 200
   */
  export namespace PostApiSystemJobLogQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemJobLogQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemJobLogQueryData;
  }

  /**
   * @description 分页查询定时任务列表
   * @tags system, job
   * @name PostApiSystemJobQuery
   * @summary 分页查询定时任务
   * @request POST:/api/system/job/query
   * @response `200` `PostApiSystemJobQueryData` Response for status 200
   */
  export namespace PostApiSystemJobQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemJobQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemJobQueryData;
  }

  /**
   * @description 创建单个登录日志
   * @tags system, loginInfo
   * @name PostApiSystemLoginInfo
   * @summary 创建登录日志
   * @request POST:/api/system/login-info
   * @response `200` `PostApiSystemLoginInfoData` Response for status 200
   */
  export namespace PostApiSystemLoginInfo {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemLoginInfoData;
  }

  /**
   * @description 分页查询登录日志列表
   * @tags system, loginInfo
   * @name PostApiSystemLoginInfoQuery
   * @summary 分页查询登录日志
   * @request POST:/api/system/login-info/query
   * @response `200` `PostApiSystemLoginInfoQueryData` Response for status 200
   */
  export namespace PostApiSystemLoginInfoQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemLoginInfoQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemLoginInfoQueryData;
  }

  /**
   * @description 创建单个菜单
   * @tags system, menu
   * @name PostApiSystemMenu
   * @summary 创建菜单
   * @request POST:/api/system/menu
   * @response `200` `PostApiSystemMenuData` Response for status 200
   */
  export namespace PostApiSystemMenu {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemMenuPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemMenuData;
  }

  /**
   * @description 批量创建多个菜单
   * @tags system, menu
   * @name PostApiSystemMenuBatch
   * @summary 批量创建菜单
   * @request POST:/api/system/menu/batch
   * @response `200` `PostApiSystemMenuBatchData` Response for status 200
   */
  export namespace PostApiSystemMenuBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemMenuBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemMenuBatchData;
  }

  /**
   * @description 分页查询菜单列表
   * @tags system, menu
   * @name PostApiSystemMenuQuery
   * @summary 分页查询菜单
   * @request POST:/api/system/menu/query
   * @response `200` `PostApiSystemMenuQueryData` Response for status 200
   */
  export namespace PostApiSystemMenuQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemMenuQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemMenuQueryData;
  }

  /**
   * @description 创建单个通知
   * @tags system, notice
   * @name PostApiSystemNotice
   * @summary 创建通知
   * @request POST:/api/system/notice
   * @response `200` `PostApiSystemNoticeData` Response for status 200
   */
  export namespace PostApiSystemNotice {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemNoticePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemNoticeData;
  }

  /**
   * @description 批量创建多个通知
   * @tags system, notice
   * @name PostApiSystemNoticeBatch
   * @summary 批量创建通知
   * @request POST:/api/system/notice/batch
   * @response `200` `PostApiSystemNoticeBatchData` Response for status 200
   */
  export namespace PostApiSystemNoticeBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemNoticeBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemNoticeBatchData;
  }

  /**
   * @description 分页查询通知列表
   * @tags system, notice
   * @name PostApiSystemNoticeQuery
   * @summary 分页查询通知
   * @request POST:/api/system/notice/query
   * @response `200` `PostApiSystemNoticeQueryData` Response for status 200
   */
  export namespace PostApiSystemNoticeQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemNoticeQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemNoticeQueryData;
  }

  /**
   * @description 创建单个操作日志
   * @tags system, operationLog
   * @name PostApiSystemOperationLog
   * @summary 创建操作日志
   * @request POST:/api/system/operation-log
   * @response `200` `PostApiSystemOperationLogData` Response for status 200
   */
  export namespace PostApiSystemOperationLog {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemOperationLogData;
  }

  /**
   * @description 分页查询操作日志列表
   * @tags system, operationLog
   * @name PostApiSystemOperationLogQuery
   * @summary 分页查询操作日志
   * @request POST:/api/system/operation-log/query
   * @response `200` `PostApiSystemOperationLogQueryData` Response for status 200
   */
  export namespace PostApiSystemOperationLogQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemOperationLogQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemOperationLogQueryData;
  }

  /**
   * @description 创建单个权限
   * @tags system, permission
   * @name PostApiSystemPermission
   * @summary 创建权限
   * @request POST:/api/system/permission
   * @response `200` `PostApiSystemPermissionData` Response for status 200
   */
  export namespace PostApiSystemPermission {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemPermissionPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemPermissionData;
  }

  /**
   * @description 分页查询权限列表
   * @tags system, permission
   * @name PostApiSystemPermissionQuery
   * @summary 分页查询权限
   * @request POST:/api/system/permission/query
   * @response `200` `PostApiSystemPermissionQueryData` Response for status 200
   */
  export namespace PostApiSystemPermissionQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemPermissionQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemPermissionQueryData;
  }

  /**
   * @description 创建单个岗位
   * @tags system, post
   * @name PostApiSystemPost
   * @summary 创建岗位
   * @request POST:/api/system/post
   * @response `200` `PostApiSystemPostData` Response for status 200
   */
  export namespace PostApiSystemPost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemPostPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemPostData;
  }

  /**
   * @description 批量创建多个岗位
   * @tags system, post
   * @name PostApiSystemPostBatch
   * @summary 批量创建岗位
   * @request POST:/api/system/post/batch
   * @response `200` `PostApiSystemPostBatchData` Response for status 200
   */
  export namespace PostApiSystemPostBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemPostBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemPostBatchData;
  }

  /**
   * @description 分页查询岗位列表
   * @tags system, post
   * @name PostApiSystemPostQuery
   * @summary 分页查询岗位
   * @request POST:/api/system/post/query
   * @response `200` `PostApiSystemPostQueryData` Response for status 200
   */
  export namespace PostApiSystemPostQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemPostQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemPostQueryData;
  }

  /**
   * @description 创建单个角色
   * @tags system, role
   * @name PostApiSystemRole
   * @summary 创建角色
   * @request POST:/api/system/role
   * @response `200` `PostApiSystemRoleData` Response for status 200
   */
  export namespace PostApiSystemRole {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemRolePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemRoleData;
  }

  /**
   * @description 批量创建多个角色
   * @tags system, role
   * @name PostApiSystemRoleBatch
   * @summary 批量创建角色
   * @request POST:/api/system/role/batch
   * @response `200` `PostApiSystemRoleBatchData` Response for status 200
   */
  export namespace PostApiSystemRoleBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemRoleBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemRoleBatchData;
  }

  /**
   * @description 创建单个角色部门关联
   * @tags system, roleDepartment
   * @name PostApiSystemRoleDepartment
   * @summary 创建角色部门关联
   * @request POST:/api/system/role-department
   * @response `200` `PostApiSystemRoleDepartmentData` Response for status 200
   */
  export namespace PostApiSystemRoleDepartment {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemRoleDepartmentPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemRoleDepartmentData;
  }

  /**
   * @description 批量创建多个角色部门关联
   * @tags system, roleDepartment
   * @name PostApiSystemRoleDepartmentBatch
   * @summary 批量创建角色部门关联
   * @request POST:/api/system/role-department/batch
   * @response `200` `PostApiSystemRoleDepartmentBatchData` Response for status 200
   */
  export namespace PostApiSystemRoleDepartmentBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemRoleDepartmentBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemRoleDepartmentBatchData;
  }

  /**
   * @description 分页查询角色部门关联列表
   * @tags system, roleDepartment
   * @name PostApiSystemRoleDepartmentQuery
   * @summary 分页查询角色部门关联
   * @request POST:/api/system/role-department/query
   * @response `200` `PostApiSystemRoleDepartmentQueryData` Response for status 200
   */
  export namespace PostApiSystemRoleDepartmentQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemRoleDepartmentQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemRoleDepartmentQueryData;
  }

  /**
   * @description 创建单个角色菜单关联
   * @tags system, roleMenu
   * @name PostApiSystemRoleMenu
   * @summary 创建角色菜单关联
   * @request POST:/api/system/role-menu
   * @response `200` `PostApiSystemRoleMenuData` Response for status 200
   */
  export namespace PostApiSystemRoleMenu {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemRoleMenuPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemRoleMenuData;
  }

  /**
   * @description 批量创建多个角色菜单关联
   * @tags system, roleMenu
   * @name PostApiSystemRoleMenuBatch
   * @summary 批量创建角色菜单关联
   * @request POST:/api/system/role-menu/batch
   * @response `200` `PostApiSystemRoleMenuBatchData` Response for status 200
   */
  export namespace PostApiSystemRoleMenuBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemRoleMenuBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemRoleMenuBatchData;
  }

  /**
   * @description 分页查询角色菜单关联列表
   * @tags system, roleMenu
   * @name PostApiSystemRoleMenuQuery
   * @summary 分页查询角色菜单关联
   * @request POST:/api/system/role-menu/query
   * @response `200` `PostApiSystemRoleMenuQueryData` Response for status 200
   */
  export namespace PostApiSystemRoleMenuQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemRoleMenuQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemRoleMenuQueryData;
  }

  /**
   * @description 分页查询角色列表，自动排除已删除数据
   * @tags system, role
   * @name PostApiSystemRoleQuery
   * @summary 分页查询角色
   * @request POST:/api/system/role/query
   * @response `200` `PostApiSystemRoleQueryData` Response for status 200
   */
  export namespace PostApiSystemRoleQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemRoleQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemRoleQueryData;
  }

  /**
   * @description 创建单个令牌
   * @tags system, token
   * @name PostApiSystemToken
   * @summary 创建令牌
   * @request POST:/api/system/token
   * @response `200` `PostApiSystemTokenData` Response for status 200
   */
  export namespace PostApiSystemToken {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemTokenPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemTokenData;
  }

  /**
   * @description 分页查询令牌列表
   * @tags system, token
   * @name PostApiSystemTokenQuery
   * @summary 分页查询令牌
   * @request POST:/api/system/token/query
   * @response `200` `PostApiSystemTokenQueryData` Response for status 200
   */
  export namespace PostApiSystemTokenQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemTokenQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemTokenQueryData;
  }

  /**
   * @description 创建单个用户
   * @tags system, user
   * @name PostApiSystemUser
   * @summary 创建用户
   * @request POST:/api/system/user
   * @response `200` `PostApiSystemUserData` Response for status 200
   */
  export namespace PostApiSystemUser {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemUserData;
  }

  /**
   * @description 批量创建多个用户
   * @tags system, user
   * @name PostApiSystemUserBatch
   * @summary 批量创建用户
   * @request POST:/api/system/user/batch
   * @response `200` `PostApiSystemUserBatchData` Response for status 200
   */
  export namespace PostApiSystemUserBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemUserBatchData;
  }

  /**
   * @description 重置用户密码为初始密码
   * @tags system, user
   * @name PostApiSystemUserByIdResetPassword
   * @summary 重置密码
   * @request POST:/api/system/user/{id}/reset-password
   * @response `200` `PostApiSystemUserByIdResetPasswordData` Response for status 200
   */
  export namespace PostApiSystemUserByIdResetPassword {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemUserByIdResetPasswordData;
  }

  /**
   * @description 创建单个用户岗位关联
   * @tags system, userPost
   * @name PostApiSystemUserPost
   * @summary 创建用户岗位关联
   * @request POST:/api/system/user-post
   * @response `200` `PostApiSystemUserPostData` Response for status 200
   */
  export namespace PostApiSystemUserPost {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemUserPostPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemUserPostData;
  }

  /**
   * @description 批量创建多个用户岗位关联
   * @tags system, userPost
   * @name PostApiSystemUserPostBatch
   * @summary 批量创建用户岗位关联
   * @request POST:/api/system/user-post/batch
   * @response `200` `PostApiSystemUserPostBatchData` Response for status 200
   */
  export namespace PostApiSystemUserPostBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemUserPostBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemUserPostBatchData;
  }

  /**
   * @description 分页查询用户岗位关联列表
   * @tags system, userPost
   * @name PostApiSystemUserPostQuery
   * @summary 分页查询用户岗位关联
   * @request POST:/api/system/user-post/query
   * @response `200` `PostApiSystemUserPostQueryData` Response for status 200
   */
  export namespace PostApiSystemUserPostQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemUserPostQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemUserPostQueryData;
  }

  /**
   * @description 分页查询用户列表
   * @tags system, user
   * @name PostApiSystemUserQuery
   * @summary 分页查询用户
   * @request POST:/api/system/user/query
   * @response `200` `PostApiSystemUserQueryData` Response for status 200
   */
  export namespace PostApiSystemUserQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemUserQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemUserQueryData;
  }

  /**
   * @description 创建单个用户角色关联
   * @tags system, userRole
   * @name PostApiSystemUserRole
   * @summary 创建用户角色关联
   * @request POST:/api/system/user-role
   * @response `200` `PostApiSystemUserRoleData` Response for status 200
   */
  export namespace PostApiSystemUserRole {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemUserRolePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemUserRoleData;
  }

  /**
   * @description 批量创建多个用户角色关联
   * @tags system, userRole
   * @name PostApiSystemUserRoleBatch
   * @summary 批量创建用户角色关联
   * @request POST:/api/system/user-role/batch
   * @response `200` `PostApiSystemUserRoleBatchData` Response for status 200
   */
  export namespace PostApiSystemUserRoleBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemUserRoleBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemUserRoleBatchData;
  }

  /**
   * @description 分页查询用户角色关联列表
   * @tags system, userRole
   * @name PostApiSystemUserRoleQuery
   * @summary 分页查询用户角色关联
   * @request POST:/api/system/user-role/query
   * @response `200` `PostApiSystemUserRoleQueryData` Response for status 200
   */
  export namespace PostApiSystemUserRoleQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemUserRoleQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemUserRoleQueryData;
  }

  /**
   * @description 设置指定角色的权限列表（全量替换）
   * @tags system, casbinRule
   * @name PutApiSystemCasbinRuleRoleByRoleKeyPermissions
   * @summary 设置角色权限
   * @request PUT:/api/system/casbin-rule/role/{roleKey}/permissions
   * @response `200` `PutApiSystemCasbinRuleRoleByRoleKeyPermissionsData` Response for status 200
   */
  export namespace PutApiSystemCasbinRuleRoleByRoleKeyPermissions {
    export type RequestParams = {
      roleKey: string;
    };
    export type RequestQuery = {};
    export type RequestBody =
      PutApiSystemCasbinRuleRoleByRoleKeyPermissionsPayload;
    export type RequestHeaders = {};
    export type ResponseBody =
      PutApiSystemCasbinRuleRoleByRoleKeyPermissionsData;
  }

  /**
   * @description 设置指定用户的角色列表（全量替换）
   * @tags system, casbinRule
   * @name PutApiSystemCasbinRuleUserByUserIdRoles
   * @summary 设置用户角色
   * @request PUT:/api/system/casbin-rule/user/{userId}/roles
   * @response `200` `PutApiSystemCasbinRuleUserByUserIdRolesData` Response for status 200
   */
  export namespace PutApiSystemCasbinRuleUserByUserIdRoles {
    export type RequestParams = {
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemCasbinRuleUserByUserIdRolesPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemCasbinRuleUserByUserIdRolesData;
  }

  /**
   * @description 根据ID列表批量更新配置
   * @tags system, config
   * @name PutApiSystemConfigBatch
   * @summary 批量更新配置
   * @request PUT:/api/system/config/batch
   * @response `200` `PutApiSystemConfigBatchData` Response for status 200
   */
  export namespace PutApiSystemConfigBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemConfigBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemConfigBatchData;
  }

  /**
   * @description 根据ID更新单个配置
   * @tags system, config
   * @name PutApiSystemConfigById
   * @summary 更新配置
   * @request PUT:/api/system/config/{id}
   * @response `200` `PutApiSystemConfigByIdData` Response for status 200
   */
  export namespace PutApiSystemConfigById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemConfigByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemConfigByIdData;
  }

  /**
   * @description 根据ID列表批量更新部门
   * @tags system, department
   * @name PutApiSystemDepartmentBatch
   * @summary 批量更新部门
   * @request PUT:/api/system/department/batch
   * @response `200` `PutApiSystemDepartmentBatchData` Response for status 200
   */
  export namespace PutApiSystemDepartmentBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemDepartmentBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemDepartmentBatchData;
  }

  /**
   * @description 根据ID更新单个部门
   * @tags system, department
   * @name PutApiSystemDepartmentById
   * @summary 更新部门
   * @request PUT:/api/system/department/{id}
   * @response `200` `PutApiSystemDepartmentByIdData` Response for status 200
   */
  export namespace PutApiSystemDepartmentById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemDepartmentByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemDepartmentByIdData;
  }

  /**
   * @description 根据ID列表批量更新字典
   * @tags system, dict
   * @name PutApiSystemDictBatch
   * @summary 批量更新字典
   * @request PUT:/api/system/dict/batch
   * @response `200` `PutApiSystemDictBatchData` Response for status 200
   */
  export namespace PutApiSystemDictBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemDictBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemDictBatchData;
  }

  /**
   * @description 根据ID更新单个字典
   * @tags system, dict
   * @name PutApiSystemDictById
   * @summary 更新字典
   * @request PUT:/api/system/dict/{id}
   * @response `200` `PutApiSystemDictByIdData` Response for status 200
   */
  export namespace PutApiSystemDictById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemDictByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemDictByIdData;
  }

  /**
   * @description 根据Key列表批量更新字典组
   * @tags system, dictGroup
   * @name PutApiSystemDictGroupBatch
   * @summary 批量更新字典组
   * @request PUT:/api/system/dict-group/batch
   * @response `200` `PutApiSystemDictGroupBatchData` Response for status 200
   */
  export namespace PutApiSystemDictGroupBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemDictGroupBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemDictGroupBatchData;
  }

  /**
   * @description 根据Key更新单个字典组
   * @tags system, dictGroup
   * @name PutApiSystemDictGroupByKey
   * @summary 更新字典组
   * @request PUT:/api/system/dict-group/{key}
   * @response `200` `PutApiSystemDictGroupByKeyData` Response for status 200
   */
  export namespace PutApiSystemDictGroupByKey {
    export type RequestParams = {
      /**
       * @minLength 1
       * @maxLength 100
       */
      key: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemDictGroupByKeyPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemDictGroupByKeyData;
  }

  /**
   * @description 根据ID列表批量更新定时任务
   * @tags system, job
   * @name PutApiSystemJobBatch
   * @summary 批量更新定时任务
   * @request PUT:/api/system/job/batch
   * @response `200` `PutApiSystemJobBatchData` Response for status 200
   */
  export namespace PutApiSystemJobBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemJobBatchData;
  }

  /**
   * @description 根据ID更新单个定时任务
   * @tags system, job
   * @name PutApiSystemJobById
   * @summary 更新定时任务
   * @request PUT:/api/system/job/{id}
   * @response `200` `PutApiSystemJobByIdData` Response for status 200
   */
  export namespace PutApiSystemJobById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemJobByIdData;
  }

  /**
   * @description 根据ID列表批量更新任务日志
   * @tags system, jobLog
   * @name PutApiSystemJobLogBatch
   * @summary 批量更新任务日志
   * @request PUT:/api/system/job-log/batch
   * @response `200` `PutApiSystemJobLogBatchData` Response for status 200
   */
  export namespace PutApiSystemJobLogBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemJobLogBatchData;
  }

  /**
   * @description 根据ID更新单个任务日志
   * @tags system, jobLog
   * @name PutApiSystemJobLogById
   * @summary 更新任务日志
   * @request PUT:/api/system/job-log/{id}
   * @response `200` `PutApiSystemJobLogByIdData` Response for status 200
   */
  export namespace PutApiSystemJobLogById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemJobLogByIdData;
  }

  /**
   * @description 根据ID列表批量更新菜单
   * @tags system, menu
   * @name PutApiSystemMenuBatch
   * @summary 批量更新菜单
   * @request PUT:/api/system/menu/batch
   * @response `200` `PutApiSystemMenuBatchData` Response for status 200
   */
  export namespace PutApiSystemMenuBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemMenuBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemMenuBatchData;
  }

  /**
   * @description 根据ID更新单个菜单
   * @tags system, menu
   * @name PutApiSystemMenuById
   * @summary 更新菜单
   * @request PUT:/api/system/menu/{id}
   * @response `200` `PutApiSystemMenuByIdData` Response for status 200
   */
  export namespace PutApiSystemMenuById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemMenuByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemMenuByIdData;
  }

  /**
   * @description 根据ID列表批量更新通知
   * @tags system, notice
   * @name PutApiSystemNoticeBatch
   * @summary 批量更新通知
   * @request PUT:/api/system/notice/batch
   * @response `200` `PutApiSystemNoticeBatchData` Response for status 200
   */
  export namespace PutApiSystemNoticeBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemNoticeBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemNoticeBatchData;
  }

  /**
   * @description 根据ID更新单个通知
   * @tags system, notice
   * @name PutApiSystemNoticeById
   * @summary 更新通知
   * @request PUT:/api/system/notice/{id}
   * @response `200` `PutApiSystemNoticeByIdData` Response for status 200
   */
  export namespace PutApiSystemNoticeById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemNoticeByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemNoticeByIdData;
  }

  /**
   * @description 根据ID更新单个权限
   * @tags system, permission
   * @name PutApiSystemPermissionById
   * @summary 更新权限
   * @request PUT:/api/system/permission/{id}
   * @response `200` `PutApiSystemPermissionByIdData` Response for status 200
   */
  export namespace PutApiSystemPermissionById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemPermissionByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemPermissionByIdData;
  }

  /**
   * @description 根据ID列表批量更新岗位
   * @tags system, post
   * @name PutApiSystemPostBatch
   * @summary 批量更新岗位
   * @request PUT:/api/system/post/batch
   * @response `200` `PutApiSystemPostBatchData` Response for status 200
   */
  export namespace PutApiSystemPostBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemPostBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemPostBatchData;
  }

  /**
   * @description 根据ID更新单个岗位
   * @tags system, post
   * @name PutApiSystemPostById
   * @summary 更新岗位
   * @request PUT:/api/system/post/{id}
   * @response `200` `PutApiSystemPostByIdData` Response for status 200
   */
  export namespace PutApiSystemPostById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemPostByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemPostByIdData;
  }

  /**
   * @description 根据ID列表批量更新角色
   * @tags system, role
   * @name PutApiSystemRoleBatch
   * @summary 批量更新角色
   * @request PUT:/api/system/role/batch
   * @response `200` `PutApiSystemRoleBatchData` Response for status 200
   */
  export namespace PutApiSystemRoleBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemRoleBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemRoleBatchData;
  }

  /**
   * @description 根据ID更新单个角色
   * @tags system, role
   * @name PutApiSystemRoleById
   * @summary 更新角色
   * @request PUT:/api/system/role/{id}
   * @response `200` `PutApiSystemRoleByIdData` Response for status 200
   */
  export namespace PutApiSystemRoleById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemRoleByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemRoleByIdData;
  }

  /**
   * @description 设置指定角色的菜单列表（全量替换）
   * @tags system, roleMenu
   * @name PutApiSystemRoleMenuRoleByRoleId
   * @summary 设置角色菜单
   * @request PUT:/api/system/role-menu/role/{roleId}
   * @response `200` `PutApiSystemRoleMenuRoleByRoleIdData` Response for status 200
   */
  export namespace PutApiSystemRoleMenuRoleByRoleId {
    export type RequestParams = {
      roleId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemRoleMenuRoleByRoleIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemRoleMenuRoleByRoleIdData;
  }

  /**
   * @description 根据ID更新单个令牌
   * @tags system, token
   * @name PutApiSystemTokenById
   * @summary 更新令牌
   * @request PUT:/api/system/token/{id}
   * @response `200` `PutApiSystemTokenByIdData` Response for status 200
   */
  export namespace PutApiSystemTokenById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemTokenByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemTokenByIdData;
  }

  /**
   * @description 根据ID列表批量更新用户
   * @tags system, user
   * @name PutApiSystemUserBatch
   * @summary 批量更新用户
   * @request PUT:/api/system/user/batch
   * @response `200` `PutApiSystemUserBatchData` Response for status 200
   */
  export namespace PutApiSystemUserBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemUserBatchData;
  }

  /**
   * @description 根据ID更新单个用户
   * @tags system, user
   * @name PutApiSystemUserById
   * @summary 更新用户
   * @request PUT:/api/system/user/{id}
   * @response `200` `PutApiSystemUserByIdData` Response for status 200
   */
  export namespace PutApiSystemUserById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemUserByIdData;
  }

  /**
   * @description 设置指定用户的角色列表（全量替换）
   * @tags system, userRole
   * @name PutApiSystemUserRoleUserByUserId
   * @summary 设置用户角色
   * @request PUT:/api/system/user-role/user/{userId}
   * @response `200` `PutApiSystemUserRoleUserByUserIdData` Response for status 200
   */
  export namespace PutApiSystemUserRoleUserByUserId {
    export type RequestParams = {
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemUserRoleUserByUserIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemUserRoleUserByUserIdData;
  }
}

export namespace Knowledge {
  /**
   * @description 取消收藏文件或文件夹
   * @tags knowledge, favorite
   * @name DeleteApiKnowledgeFavoriteByResourceTypeByResourceId
   * @summary 取消收藏
   * @request DELETE:/api/knowledge/favorite/{resourceType}/{resourceId}
   * @response `200` `DeleteApiKnowledgeFavoriteByResourceTypeByResourceIdData` Response for status 200
   */
  export namespace DeleteApiKnowledgeFavoriteByResourceTypeByResourceId {
    export type RequestParams = {
      resourceId: string;
      resourceType: DeleteApiKnowledgeFavoriteByResourceTypeByResourceIdParams1ResourceTypeEnum;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      DeleteApiKnowledgeFavoriteByResourceTypeByResourceIdData;
  }

  /**
   * @description 根据ID软删除文件
   * @tags knowledge, file
   * @name DeleteApiKnowledgeFileById
   * @summary 删除文件
   * @request DELETE:/api/knowledge/file/{id}
   * @response `200` `DeleteApiKnowledgeFileByIdData` Response for status 200
   */
  export namespace DeleteApiKnowledgeFileById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiKnowledgeFileByIdData;
  }

  /**
   * @description 根据ID硬删除文件版本
   * @tags knowledge, fileVersion
   * @name DeleteApiKnowledgeFileVersionById
   * @summary 删除文件版本
   * @request DELETE:/api/knowledge/file-version/{id}
   * @response `200` `DeleteApiKnowledgeFileVersionByIdData` Response for status 200
   */
  export namespace DeleteApiKnowledgeFileVersionById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiKnowledgeFileVersionByIdData;
  }

  /**
   * @description 根据ID软删除文件夹
   * @tags knowledge, folder
   * @name DeleteApiKnowledgeFolderById
   * @summary 删除文件夹
   * @request DELETE:/api/knowledge/folder/{id}
   * @response `200` `DeleteApiKnowledgeFolderByIdData` Response for status 200
   */
  export namespace DeleteApiKnowledgeFolderById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiKnowledgeFolderByIdData;
  }

  /**
   * @description 检查资源是否已被收藏
   * @tags knowledge, favorite
   * @name GetApiKnowledgeFavoriteCheckByResourceTypeByResourceId
   * @summary 检查收藏状态
   * @request GET:/api/knowledge/favorite/check/{resourceType}/{resourceId}
   * @response `200` `GetApiKnowledgeFavoriteCheckByResourceTypeByResourceIdData` Response for status 200
   */
  export namespace GetApiKnowledgeFavoriteCheckByResourceTypeByResourceId {
    export type RequestParams = {
      resourceId: string;
      resourceType: GetApiKnowledgeFavoriteCheckByResourceTypeByResourceIdParams1ResourceTypeEnum;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      GetApiKnowledgeFavoriteCheckByResourceTypeByResourceIdData;
  }

  /**
   * @description 根据主键ID查询单个文件（需要权限）
   * @tags knowledge, file
   * @name GetApiKnowledgeFileById
   * @summary 根据ID查询文件
   * @request GET:/api/knowledge/file/{id}
   * @response `200` `GetApiKnowledgeFileByIdData` Response for status 200
   */
  export namespace GetApiKnowledgeFileById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeFileByIdData;
  }

  /**
   * @description 获取文件表的JSON Schema
   * @tags knowledge, file
   * @name GetApiKnowledgeFileSchema
   * @summary 获取文件Schema
   * @request GET:/api/knowledge/file/schema
   * @response `200` `GetApiKnowledgeFileSchemaData` Response for status 200
   */
  export namespace GetApiKnowledgeFileSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeFileSchemaData;
  }

  /**
   * @description 根据主键ID查询单个文件版本
   * @tags knowledge, fileVersion
   * @name GetApiKnowledgeFileVersionById
   * @summary 根据ID查询文件版本
   * @request GET:/api/knowledge/file-version/{id}
   * @response `200` `GetApiKnowledgeFileVersionByIdData` Response for status 200
   */
  export namespace GetApiKnowledgeFileVersionById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeFileVersionByIdData;
  }

  /**
   * @description 获取文件版本表的JSON Schema
   * @tags knowledge, fileVersion
   * @name GetApiKnowledgeFileVersionSchema
   * @summary 获取文件版本Schema
   * @request GET:/api/knowledge/file-version/schema
   * @response `200` `GetApiKnowledgeFileVersionSchemaData` Response for status 200
   */
  export namespace GetApiKnowledgeFileVersionSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeFileVersionSchemaData;
  }

  /**
   * @description 根据主键ID查询单个文件夹
   * @tags knowledge, folder
   * @name GetApiKnowledgeFolderById
   * @summary 根据ID查询文件夹
   * @request GET:/api/knowledge/folder/{id}
   * @response `200` `GetApiKnowledgeFolderByIdData` Response for status 200
   */
  export namespace GetApiKnowledgeFolderById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeFolderByIdData;
  }

  /**
   * @description 获取文件夹表的JSON Schema
   * @tags knowledge, folder
   * @name GetApiKnowledgeFolderSchema
   * @summary 获取文件夹Schema
   * @request GET:/api/knowledge/folder/schema
   * @response `200` `GetApiKnowledgeFolderSchemaData` Response for status 200
   */
  export namespace GetApiKnowledgeFolderSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeFolderSchemaData;
  }

  /**
   * @description 收藏文件或文件夹
   * @tags knowledge, favorite
   * @name PostApiKnowledgeFavorite
   * @summary 添加收藏
   * @request POST:/api/knowledge/favorite
   * @response `200` `PostApiKnowledgeFavoriteData` Response for status 200
   */
  export namespace PostApiKnowledgeFavorite {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFavoritePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFavoriteData;
  }

  /**
   * @description 批量检查多个资源是否已被收藏
   * @tags knowledge, favorite
   * @name PostApiKnowledgeFavoriteCheckBatch
   * @summary 批量检查收藏状态
   * @request POST:/api/knowledge/favorite/check-batch
   * @response `200` `PostApiKnowledgeFavoriteCheckBatchData` Response for status 200
   */
  export namespace PostApiKnowledgeFavoriteCheckBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFavoriteCheckBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFavoriteCheckBatchData;
  }

  /**
   * @description 获取当前用户的收藏列表
   * @tags knowledge, favorite
   * @name PostApiKnowledgeFavoriteList
   * @summary 获取收藏列表
   * @request POST:/api/knowledge/favorite/list
   * @response `200` `PostApiKnowledgeFavoriteListData` Response for status 200
   */
  export namespace PostApiKnowledgeFavoriteList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFavoriteListPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFavoriteListData;
  }

  /**
   * @description 创建单个文件记录
   * @tags knowledge, file
   * @name PostApiKnowledgeFile
   * @summary 创建文件
   * @request POST:/api/knowledge/file
   * @response `200` `PostApiKnowledgeFileData` Response for status 200
   */
  export namespace PostApiKnowledgeFile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFilePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFileData;
  }

  /**
   * @description 批量创建多个文件记录
   * @tags knowledge, file
   * @name PostApiKnowledgeFileBatch
   * @summary 批量创建文件
   * @request POST:/api/knowledge/file/batch
   * @response `200` `PostApiKnowledgeFileBatchData` Response for status 200
   */
  export namespace PostApiKnowledgeFileBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFileBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFileBatchData;
  }

  /**
   * @description 分页查询文件列表，自动排除已删除数据，自动筛选当前用户的文件
   * @tags knowledge, file
   * @name PostApiKnowledgeFileQuery
   * @summary 分页查询文件
   * @request POST:/api/knowledge/file/query
   * @response `200` `PostApiKnowledgeFileQueryData` Response for status 200
   */
  export namespace PostApiKnowledgeFileQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFileQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFileQueryData;
  }

  /**
   * @description 创建单个文件版本
   * @tags knowledge, fileVersion
   * @name PostApiKnowledgeFileVersion
   * @summary 创建文件版本
   * @request POST:/api/knowledge/file-version
   * @response `200` `PostApiKnowledgeFileVersionData` Response for status 200
   */
  export namespace PostApiKnowledgeFileVersion {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFileVersionPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFileVersionData;
  }

  /**
   * @description 批量创建多个文件版本
   * @tags knowledge, fileVersion
   * @name PostApiKnowledgeFileVersionBatch
   * @summary 批量创建文件版本
   * @request POST:/api/knowledge/file-version/batch
   * @response `200` `PostApiKnowledgeFileVersionBatchData` Response for status 200
   */
  export namespace PostApiKnowledgeFileVersionBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFileVersionBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFileVersionBatchData;
  }

  /**
   * @description 分页查询文件版本列表
   * @tags knowledge, fileVersion
   * @name PostApiKnowledgeFileVersionQuery
   * @summary 分页查询文件版本
   * @request POST:/api/knowledge/file-version/query
   * @response `200` `PostApiKnowledgeFileVersionQueryData` Response for status 200
   */
  export namespace PostApiKnowledgeFileVersionQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFileVersionQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFileVersionQueryData;
  }

  /**
   * @description 创建单个文件夹
   * @tags knowledge, folder
   * @name PostApiKnowledgeFolder
   * @summary 创建文件夹
   * @request POST:/api/knowledge/folder
   * @response `200` `PostApiKnowledgeFolderData` Response for status 200
   */
  export namespace PostApiKnowledgeFolder {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFolderPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFolderData;
  }

  /**
   * @description 批量创建多个文件夹
   * @tags knowledge, folder
   * @name PostApiKnowledgeFolderBatch
   * @summary 批量创建文件夹
   * @request POST:/api/knowledge/folder/batch
   * @response `200` `PostApiKnowledgeFolderBatchData` Response for status 200
   */
  export namespace PostApiKnowledgeFolderBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFolderBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFolderBatchData;
  }

  /**
   * @description 分页查询文件夹列表，自动排除已删除数据，自动筛选当前用户的文件夹
   * @tags knowledge, folder
   * @name PostApiKnowledgeFolderQuery
   * @summary 分页查询文件夹
   * @request POST:/api/knowledge/folder/query
   * @response `200` `PostApiKnowledgeFolderQueryData` Response for status 200
   */
  export namespace PostApiKnowledgeFolderQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFolderQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFolderQueryData;
  }

  /**
   * @description 根据ID列表批量更新文件
   * @tags knowledge, file
   * @name PutApiKnowledgeFileBatch
   * @summary 批量更新文件
   * @request PUT:/api/knowledge/file/batch
   * @response `200` `PutApiKnowledgeFileBatchData` Response for status 200
   */
  export namespace PutApiKnowledgeFileBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiKnowledgeFileBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiKnowledgeFileBatchData;
  }

  /**
   * @description 根据ID更新单个文件
   * @tags knowledge, file
   * @name PutApiKnowledgeFileById
   * @summary 更新文件
   * @request PUT:/api/knowledge/file/{id}
   * @response `200` `PutApiKnowledgeFileByIdData` Response for status 200
   */
  export namespace PutApiKnowledgeFileById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiKnowledgeFileByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiKnowledgeFileByIdData;
  }

  /**
   * @description 根据ID列表批量更新文件版本
   * @tags knowledge, fileVersion
   * @name PutApiKnowledgeFileVersionBatch
   * @summary 批量更新文件版本
   * @request PUT:/api/knowledge/file-version/batch
   * @response `200` `PutApiKnowledgeFileVersionBatchData` Response for status 200
   */
  export namespace PutApiKnowledgeFileVersionBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiKnowledgeFileVersionBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiKnowledgeFileVersionBatchData;
  }

  /**
   * @description 根据ID更新单个文件版本
   * @tags knowledge, fileVersion
   * @name PutApiKnowledgeFileVersionById
   * @summary 更新文件版本
   * @request PUT:/api/knowledge/file-version/{id}
   * @response `200` `PutApiKnowledgeFileVersionByIdData` Response for status 200
   */
  export namespace PutApiKnowledgeFileVersionById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiKnowledgeFileVersionByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiKnowledgeFileVersionByIdData;
  }

  /**
   * @description 根据ID列表批量更新文件夹
   * @tags knowledge, folder
   * @name PutApiKnowledgeFolderBatch
   * @summary 批量更新文件夹
   * @request PUT:/api/knowledge/folder/batch
   * @response `200` `PutApiKnowledgeFolderBatchData` Response for status 200
   */
  export namespace PutApiKnowledgeFolderBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiKnowledgeFolderBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiKnowledgeFolderBatchData;
  }

  /**
   * @description 根据ID更新单个文件夹
   * @tags knowledge, folder
   * @name PutApiKnowledgeFolderById
   * @summary 更新文件夹
   * @request PUT:/api/knowledge/folder/{id}
   * @response `200` `PutApiKnowledgeFolderByIdData` Response for status 200
   */
  export namespace PutApiKnowledgeFolderById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiKnowledgeFolderByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiKnowledgeFolderByIdData;
  }
}

export namespace Im {
  /**
   * @description 根据ID软删除会话
   * @tags im, conversation
   * @name DeleteApiImConversationById
   * @summary 删除会话
   * @request DELETE:/api/im/conversation/{id}
   * @response `200` `DeleteApiImConversationByIdData` Response for status 200
   */
  export namespace DeleteApiImConversationById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiImConversationByIdData;
  }

  /**
   * @description 移除群成员
   * @tags im, groupMember
   * @name DeleteApiImGroupMemberByConversationIdByUserId
   * @summary 移除群成员
   * @request DELETE:/api/im/group-member/{conversationId}/{userId}
   * @response `200` `DeleteApiImGroupMemberByConversationIdByUserIdData` Response for status 200
   */
  export namespace DeleteApiImGroupMemberByConversationIdByUserId {
    export type RequestParams = {
      conversationId: string;
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      DeleteApiImGroupMemberByConversationIdByUserIdData;
  }

  /**
   * @description 根据ID删除临时文件
   * @tags im, tempFile
   * @name DeleteApiImTempFileById
   * @summary 删除临时文件
   * @request DELETE:/api/im/temp-file/{id}
   * @response `200` `DeleteApiImTempFileByIdData` Response for status 200
   */
  export namespace DeleteApiImTempFileById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiImTempFileByIdData;
  }

  /**
   * @description 清理所有过期的临时文件
   * @tags im, tempFile
   * @name DeleteApiImTempFileCleanExpired
   * @summary 清理过期文件
   * @request DELETE:/api/im/temp-file/clean-expired
   * @response `200` `DeleteApiImTempFileCleanExpiredData` Response for status 200
   */
  export namespace DeleteApiImTempFileCleanExpired {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiImTempFileCleanExpiredData;
  }

  /**
   * @description 根据主键ID查询单个会话
   * @tags im, conversation
   * @name GetApiImConversationById
   * @summary 根据ID查询会话
   * @request GET:/api/im/conversation/{id}
   * @response `200` `GetApiImConversationByIdData` Response for status 200
   */
  export namespace GetApiImConversationById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiImConversationByIdData;
  }

  /**
   * @description 获取当前用户所有会话中的文件列表
   * @tags im, conversation
   * @name GetApiImConversationFiles
   * @summary 获取会话文件
   * @request GET:/api/im/conversation-files
   * @response `200` `GetApiImConversationFilesData` Response for status 200
   */
  export namespace GetApiImConversationFiles {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiImConversationFilesData;
  }

  /**
   * @description 获取当前用户隐藏的会话ID列表
   * @tags im, conversationHidden
   * @name GetApiImConversationHiddenList
   * @summary 获取隐藏会话列表
   * @request GET:/api/im/conversation-hidden/list
   * @response `200` `GetApiImConversationHiddenListData` Response for status 200
   */
  export namespace GetApiImConversationHiddenList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiImConversationHiddenListData;
  }

  /**
   * @description 根据会话ID和用户ID查询已读状态
   * @tags im, conversationRead
   * @name GetApiImConversationReadByConversationIdByUserId
   * @summary 查询已读状态
   * @request GET:/api/im/conversation-read/{conversationId}/{userId}
   * @response `200` `GetApiImConversationReadByConversationIdByUserIdData` Response for status 200
   */
  export namespace GetApiImConversationReadByConversationIdByUserId {
    export type RequestParams = {
      conversationId: string;
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      GetApiImConversationReadByConversationIdByUserIdData;
  }

  /**
   * @description 获取已读状态表的JSON Schema
   * @tags im, conversationRead
   * @name GetApiImConversationReadSchema
   * @summary 获取已读状态Schema
   * @request GET:/api/im/conversation-read/schema
   * @response `200` `GetApiImConversationReadSchemaData` Response for status 200
   */
  export namespace GetApiImConversationReadSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiImConversationReadSchemaData;
  }

  /**
   * @description 获取会话表的JSON Schema
   * @tags im, conversation
   * @name GetApiImConversationSchema
   * @summary 获取会话Schema
   * @request GET:/api/im/conversation/schema
   * @response `200` `GetApiImConversationSchemaData` Response for status 200
   */
  export namespace GetApiImConversationSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiImConversationSchemaData;
  }

  /**
   * @description 根据会话ID和用户ID查询群成员
   * @tags im, groupMember
   * @name GetApiImGroupMemberByConversationIdByUserId
   * @summary 查询群成员
   * @request GET:/api/im/group-member/{conversationId}/{userId}
   * @response `200` `GetApiImGroupMemberByConversationIdByUserIdData` Response for status 200
   */
  export namespace GetApiImGroupMemberByConversationIdByUserId {
    export type RequestParams = {
      conversationId: string;
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiImGroupMemberByConversationIdByUserIdData;
  }

  /**
   * @description 获取群成员表的JSON Schema
   * @tags im, groupMember
   * @name GetApiImGroupMemberSchema
   * @summary 获取群成员Schema
   * @request GET:/api/im/group-member/schema
   * @response `200` `GetApiImGroupMemberSchemaData` Response for status 200
   */
  export namespace GetApiImGroupMemberSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiImGroupMemberSchemaData;
  }

  /**
   * @description 根据主键ID查询单个消息
   * @tags im, message
   * @name GetApiImMessageById
   * @summary 根据ID查询消息
   * @request GET:/api/im/message/{id}
   * @response `200` `GetApiImMessageByIdData` Response for status 200
   */
  export namespace GetApiImMessageById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiImMessageByIdData;
  }

  /**
   * @description 获取消息表的JSON Schema
   * @tags im, message
   * @name GetApiImMessageSchema
   * @summary 获取消息Schema
   * @request GET:/api/im/message/schema
   * @response `200` `GetApiImMessageSchemaData` Response for status 200
   */
  export namespace GetApiImMessageSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiImMessageSchemaData;
  }

  /**
   * @description 根据主键ID查询单个临时文件
   * @tags im, tempFile
   * @name GetApiImTempFileById
   * @summary 根据ID查询临时文件
   * @request GET:/api/im/temp-file/{id}
   * @response `200` `GetApiImTempFileByIdData` Response for status 200
   */
  export namespace GetApiImTempFileById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiImTempFileByIdData;
  }

  /**
   * @description 获取临时文件的预签名下载链接
   * @tags im, tempFile
   * @name GetApiImTempFileByIdDownloadUrl
   * @summary 获取临时文件下载链接
   * @request GET:/api/im/temp-file/{id}/download-url
   * @response `200` `GetApiImTempFileByIdDownloadUrlData` Response for status 200
   */
  export namespace GetApiImTempFileByIdDownloadUrl {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {
      download?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiImTempFileByIdDownloadUrlData;
  }

  /**
   * @description 获取临时文件表的JSON Schema
   * @tags im, tempFile
   * @name GetApiImTempFileSchema
   * @summary 获取临时文件Schema
   * @request GET:/api/im/temp-file/schema
   * @response `200` `GetApiImTempFileSchemaData` Response for status 200
   */
  export namespace GetApiImTempFileSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiImTempFileSchemaData;
  }

  /**
   * @description 创建单个会话
   * @tags im, conversation
   * @name PostApiImConversation
   * @summary 创建会话
   * @request POST:/api/im/conversation
   * @response `200` `PostApiImConversationData` Response for status 200
   */
  export namespace PostApiImConversation {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImConversationPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImConversationData;
  }

  /**
   * @description 解散群聊（仅群主可操作）
   * @tags im, conversation
   * @name PostApiImConversationByIdDissolve
   * @summary 解散群聊
   * @request POST:/api/im/conversation/{id}/dissolve
   * @response `200` `PostApiImConversationByIdDissolveData` Response for status 200
   */
  export namespace PostApiImConversationByIdDissolve {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImConversationByIdDissolveData;
  }

  /**
   * @description 创建群聊会话并添加成员
   * @tags im, conversation
   * @name PostApiImConversationGroup
   * @summary 创建群聊
   * @request POST:/api/im/conversation/group
   * @response `200` `PostApiImConversationGroupData` Response for status 200
   */
  export namespace PostApiImConversationGroup {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImConversationGroupPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImConversationGroupData;
  }

  /**
   * @description 隐藏会话（不再显示在消息列表）
   * @tags im, conversationHidden
   * @name PostApiImConversationHiddenHide
   * @summary 隐藏会话
   * @request POST:/api/im/conversation-hidden/hide
   * @response `200` `PostApiImConversationHiddenHideData` Response for status 200
   */
  export namespace PostApiImConversationHiddenHide {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImConversationHiddenHidePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImConversationHiddenHideData;
  }

  /**
   * @description 取消隐藏会话（新消息到达时调用）
   * @tags im, conversationHidden
   * @name PostApiImConversationHiddenUnhide
   * @summary 取消隐藏会话
   * @request POST:/api/im/conversation-hidden/unhide
   * @response `200` `PostApiImConversationHiddenUnhideData` Response for status 200
   */
  export namespace PostApiImConversationHiddenUnhide {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImConversationHiddenUnhidePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImConversationHiddenUnhideData;
  }

  /**
   * @description 查找两个用户之间的私聊会话，如果不存在则创建
   * @tags im, conversation
   * @name PostApiImConversationPrivate
   * @summary 查找或创建私聊
   * @request POST:/api/im/conversation/private
   * @response `200` `PostApiImConversationPrivateData` Response for status 200
   */
  export namespace PostApiImConversationPrivate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImConversationPrivatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImConversationPrivateData;
  }

  /**
   * @description 分页查询会话列表
   * @tags im, conversation
   * @name PostApiImConversationQuery
   * @summary 分页查询会话
   * @request POST:/api/im/conversation/query
   * @response `200` `PostApiImConversationQueryData` Response for status 200
   */
  export namespace PostApiImConversationQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImConversationQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImConversationQueryData;
  }

  /**
   * @description 分页查询已读状态列表
   * @tags im, conversationRead
   * @name PostApiImConversationReadQuery
   * @summary 分页查询已读状态
   * @request POST:/api/im/conversation-read/query
   * @response `200` `PostApiImConversationReadQueryData` Response for status 200
   */
  export namespace PostApiImConversationReadQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImConversationReadQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImConversationReadQueryData;
  }

  /**
   * @description 添加群成员
   * @tags im, groupMember
   * @name PostApiImGroupMember
   * @summary 添加群成员
   * @request POST:/api/im/group-member
   * @response `200` `PostApiImGroupMemberData` Response for status 200
   */
  export namespace PostApiImGroupMember {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImGroupMemberPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImGroupMemberData;
  }

  /**
   * @description 批量添加群成员
   * @tags im, groupMember
   * @name PostApiImGroupMemberBatch
   * @summary 批量添加群成员
   * @request POST:/api/im/group-member/batch
   * @response `200` `PostApiImGroupMemberBatchData` Response for status 200
   */
  export namespace PostApiImGroupMemberBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImGroupMemberBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImGroupMemberBatchData;
  }

  /**
   * @description 分页查询群成员列表
   * @tags im, groupMember
   * @name PostApiImGroupMemberQuery
   * @summary 分页查询群成员
   * @request POST:/api/im/group-member/query
   * @response `200` `PostApiImGroupMemberQueryData` Response for status 200
   */
  export namespace PostApiImGroupMemberQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImGroupMemberQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImGroupMemberQueryData;
  }

  /**
   * @description 发送单条消息
   * @tags im, message
   * @name PostApiImMessage
   * @summary 发送消息
   * @request POST:/api/im/message
   * @response `200` `PostApiImMessageData` Response for status 200
   */
  export namespace PostApiImMessage {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImMessagePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImMessageData;
  }

  /**
   * @description 分页查询消息列表
   * @tags im, message
   * @name PostApiImMessageQuery
   * @summary 分页查询消息
   * @request POST:/api/im/message/query
   * @response `200` `PostApiImMessageQueryData` Response for status 200
   */
  export namespace PostApiImMessageQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImMessageQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImMessageQueryData;
  }

  /**
   * @description 创建单个临时文件记录
   * @tags im, tempFile
   * @name PostApiImTempFile
   * @summary 创建临时文件
   * @request POST:/api/im/temp-file
   * @response `200` `PostApiImTempFileData` Response for status 200
   */
  export namespace PostApiImTempFile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImTempFilePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImTempFileData;
  }

  /**
   * @description 分页查询临时文件列表
   * @tags im, tempFile
   * @name PostApiImTempFileQuery
   * @summary 分页查询临时文件
   * @request POST:/api/im/temp-file/query
   * @response `200` `PostApiImTempFileQueryData` Response for status 200
   */
  export namespace PostApiImTempFileQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImTempFileQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImTempFileQueryData;
  }

  /**
   * @description 上传文件到S3并创建临时文件记录
   * @tags im, tempFile
   * @name PostApiImTempFileUpload
   * @summary 上传临时文件
   * @request POST:/api/im/temp-file/upload
   * @response `200` `PostApiImTempFileUploadData` Response for status 200
   */
  export namespace PostApiImTempFileUpload {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiImTempFileUploadPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiImTempFileUploadData;
  }

  /**
   * @description 根据ID更新单个会话
   * @tags im, conversation
   * @name PutApiImConversationById
   * @summary 更新会话
   * @request PUT:/api/im/conversation/{id}
   * @response `200` `PutApiImConversationByIdData` Response for status 200
   */
  export namespace PutApiImConversationById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiImConversationByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiImConversationByIdData;
  }

  /**
   * @description 增加用户在会话中的未读消息数
   * @tags im, conversationRead
   * @name PutApiImConversationReadIncrementUnread
   * @summary 增加未读数
   * @request PUT:/api/im/conversation-read/increment-unread
   * @response `200` `PutApiImConversationReadIncrementUnreadData` Response for status 200
   */
  export namespace PutApiImConversationReadIncrementUnread {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiImConversationReadIncrementUnreadPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiImConversationReadIncrementUnreadData;
  }

  /**
   * @description 标记会话已读到指定消息序号
   * @tags im, conversationRead
   * @name PutApiImConversationReadMark
   * @summary 标记已读
   * @request PUT:/api/im/conversation-read/mark
   * @response `200` `PutApiImConversationReadMarkData` Response for status 200
   */
  export namespace PutApiImConversationReadMark {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiImConversationReadMarkPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiImConversationReadMarkData;
  }

  /**
   * @description 更新群成员信息
   * @tags im, groupMember
   * @name PutApiImGroupMemberByConversationIdByUserId
   * @summary 更新群成员
   * @request PUT:/api/im/group-member/{conversationId}/{userId}
   * @response `200` `PutApiImGroupMemberByConversationIdByUserIdData` Response for status 200
   */
  export namespace PutApiImGroupMemberByConversationIdByUserId {
    export type RequestParams = {
      conversationId: string;
      userId: string;
    };
    export type RequestQuery = {};
    export type RequestBody =
      PutApiImGroupMemberByConversationIdByUserIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiImGroupMemberByConversationIdByUserIdData;
  }

  /**
   * @description 撤回指定消息
   * @tags im, message
   * @name PutApiImMessageByIdRecall
   * @summary 撤回消息
   * @request PUT:/api/im/message/{id}/recall
   * @response `200` `PutApiImMessageByIdRecallData` Response for status 200
   */
  export namespace PutApiImMessageByIdRecall {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiImMessageByIdRecallData;
  }

  /**
   * @description 根据ID更新临时文件
   * @tags im, tempFile
   * @name PutApiImTempFileById
   * @summary 更新临时文件
   * @request PUT:/api/im/temp-file/{id}
   * @response `200` `PutApiImTempFileByIdData` Response for status 200
   */
  export namespace PutApiImTempFileById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiImTempFileByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiImTempFileByIdData;
  }
}

export namespace Files {
  /**
   * @description 软删除文件
   * @tags files, files
   * @name DeleteApiFilesById
   * @summary 删除文件
   * @request DELETE:/api/files/{id}
   * @response `200` `DeleteApiFilesByIdData` Response for status 200
   */
  export namespace DeleteApiFilesById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiFilesByIdData;
  }

  /**
   * @description 软删除文件夹及其内容
   * @tags files, files
   * @name DeleteApiFilesFoldersById
   * @summary 删除文件夹
   * @request DELETE:/api/files/folders/{id}
   * @response `200` `DeleteApiFilesFoldersByIdData` Response for status 200
   */
  export namespace DeleteApiFilesFoldersById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiFilesFoldersByIdData;
  }

  /**
   * @description 删除资源的所有权限和继承关系
   * @tags files, permission
   * @name DeleteApiFilesPermissionAllByResourceTypeByResourceId
   * @summary 删除所有权限
   * @request DELETE:/api/files/permission/all/{resourceType}/{resourceId}
   * @response `200` `DeleteApiFilesPermissionAllByResourceTypeByResourceIdData` Response for status 200
   */
  export namespace DeleteApiFilesPermissionAllByResourceTypeByResourceId {
    export type RequestParams = {
      resourceId: string;
      resourceType: DeleteApiFilesPermissionAllByResourceTypeByResourceIdParams1ResourceTypeEnum;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      DeleteApiFilesPermissionAllByResourceTypeByResourceIdData;
  }

  /**
   * @description 移除资源的权限
   * @tags files, permission
   * @name DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermission
   * @summary 移除权限
   * @request DELETE:/api/files/permission/{resourceType}/{resourceId}/{subjectType}/{subjectId}/{permission}
   * @response `200` `DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionData` Response for status 200
   */
  export namespace DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermission {
    export type RequestParams = {
      permission: DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionParams1PermissionEnum;
      resourceId: string;
      resourceType: DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionParams1ResourceTypeEnum;
      subjectId: string;
      subjectType: DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionParams1SubjectTypeEnum;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionData;
  }

  /**
   * @description 获取文本文件内容
   * @tags files, files
   * @name GetApiFilesByIdContent
   * @summary 获取文件内容
   * @request GET:/api/files/{id}/content
   * @response `200` `GetApiFilesByIdContentData` Response for status 200
   */
  export namespace GetApiFilesByIdContent {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiFilesByIdContentData;
  }

  /**
   * @description 获取预签名下载URL
   * @tags files, files
   * @name GetApiFilesByIdDownloadUrl
   * @summary 获取下载URL
   * @request GET:/api/files/{id}/download-url
   * @response `200` `GetApiFilesByIdDownloadUrlData` Response for status 200
   */
  export namespace GetApiFilesByIdDownloadUrl {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiFilesByIdDownloadUrlData;
  }

  /**
   * @description 获取文本文件内容，仅支持纯文本文件
   * @tags files, files
   * @name GetApiFilesByIdTextContent
   * @summary 获取文本文件内容
   * @request GET:/api/files/{id}/text-content
   * @response `200` `GetApiFilesByIdTextContentData` Response for status 200
   */
  export namespace GetApiFilesByIdTextContent {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiFilesByIdTextContentData;
  }

  /**
   * @description 获取文件或文件夹的权限列表
   * @tags files, permission
   * @name GetApiFilesPermissionByResourceTypeByResourceId
   * @summary 获取资源权限
   * @request GET:/api/files/permission/{resourceType}/{resourceId}
   * @response `200` `GetApiFilesPermissionByResourceTypeByResourceIdData` Response for status 200
   */
  export namespace GetApiFilesPermissionByResourceTypeByResourceId {
    export type RequestParams = {
      resourceId: string;
      resourceType: GetApiFilesPermissionByResourceTypeByResourceIdParams1ResourceTypeEnum;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      GetApiFilesPermissionByResourceTypeByResourceIdData;
  }

  /**
   * @description 获取用户对资源的所有有效权限（包括继承的权限）
   * @tags files, permission
   * @name GetApiFilesPermissionEffectiveByResourceTypeByResourceId
   * @summary 获取有效权限
   * @request GET:/api/files/permission/effective/{resourceType}/{resourceId}
   * @response `200` `GetApiFilesPermissionEffectiveByResourceTypeByResourceIdData` Response for status 200
   */
  export namespace GetApiFilesPermissionEffectiveByResourceTypeByResourceId {
    export type RequestParams = {
      resourceId: string;
      resourceType: GetApiFilesPermissionEffectiveByResourceTypeByResourceIdParams1ResourceTypeEnum;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      GetApiFilesPermissionEffectiveByResourceTypeByResourceIdData;
  }

  /**
   * @description 获取文件夹的完整路径（面包屑）
   * @tags files, share
   * @name GetApiFilesShareFolderPathByFolderId
   * @summary 获取文件夹路径
   * @request GET:/api/files/share/folder-path/{folderId}
   * @response `200` `GetApiFilesShareFolderPathByFolderIdData` Response for status 200
   */
  export namespace GetApiFilesShareFolderPathByFolderId {
    export type RequestParams = {
      folderId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiFilesShareFolderPathByFolderIdData;
  }

  /**
   * @description 获取历史版本的下载URL
   * @tags files, files
   * @name GetApiFilesVersionsByIdDownloadUrl
   * @summary 下载历史版本
   * @request GET:/api/files/versions/{id}/download-url
   * @response `200` `GetApiFilesVersionsByIdDownloadUrlData` Response for status 200
   */
  export namespace GetApiFilesVersionsByIdDownloadUrl {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiFilesVersionsByIdDownloadUrlData;
  }

  /**
   * @description 获取已上传附件的访问URL
   * @tags files, ai-chat
   * @name PostApiFilesAiChatGetUrl
   * @summary 获取AI聊天附件URL
   * @request POST:/api/files/ai-chat/get-url
   * @response `200` `PostApiFilesAiChatGetUrlData` Response for status 200
   */
  export namespace PostApiFilesAiChatGetUrl {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesAiChatGetUrlPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesAiChatGetUrlData;
  }

  /**
   * @description 上传文件到存储，返回可访问的URL
   * @tags files, ai-chat
   * @name PostApiFilesAiChatUpload
   * @summary 上传AI聊天附件
   * @request POST:/api/files/ai-chat/upload
   * @response `200` `PostApiFilesAiChatUploadData` Response for status 200
   */
  export namespace PostApiFilesAiChatUpload {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesAiChatUploadPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesAiChatUploadData;
  }

  /**
   * @description 复制文件到目标文件夹
   * @tags files, files
   * @name PostApiFilesByIdCopy
   * @summary 复制文件
   * @request POST:/api/files/{id}/copy
   * @response `200` `PostApiFilesByIdCopyData` Response for status 200
   */
  export namespace PostApiFilesByIdCopy {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesByIdCopyPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesByIdCopyData;
  }

  /**
   * @description 复制文件到目标文件夹，自动生成唯一文件名 filename(num).ext
   * @tags files, files
   * @name PostApiFilesByIdCopyAsDuplicate
   * @summary 复制文件为副本
   * @request POST:/api/files/{id}/copy-as-duplicate
   * @response `200` `PostApiFilesByIdCopyAsDuplicateData` Response for status 200
   */
  export namespace PostApiFilesByIdCopyAsDuplicate {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesByIdCopyAsDuplicatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesByIdCopyAsDuplicateData;
  }

  /**
   * @description 移动文件到目标文件夹
   * @tags files, files
   * @name PostApiFilesByIdMove
   * @summary 移动文件
   * @request POST:/api/files/{id}/move
   * @response `200` `PostApiFilesByIdMoveData` Response for status 200
   */
  export namespace PostApiFilesByIdMove {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesByIdMovePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesByIdMoveData;
  }

  /**
   * @description 检查指定文件夹中是否存在同名文件
   * @tags files, files
   * @name PostApiFilesCheckExists
   * @summary 检查文件是否存在
   * @request POST:/api/files/check-exists
   * @response `200` `PostApiFilesCheckExistsData` Response for status 200
   */
  export namespace PostApiFilesCheckExists {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesCheckExistsPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesCheckExistsData;
  }

  /**
   * @description 确认文件上传完成并创建记录
   * @tags files, files
   * @name PostApiFilesConfirmUpload
   * @summary 确认上传
   * @request POST:/api/files/confirm-upload
   * @response `200` `PostApiFilesConfirmUploadData` Response for status 200
   */
  export namespace PostApiFilesConfirmUpload {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesConfirmUploadPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesConfirmUploadData;
  }

  /**
   * @description 批量软删除文件
   * @tags files, files
   * @name PostApiFilesDeleteBatch
   * @summary 批量删除文件
   * @request POST:/api/files/delete-batch
   * @response `200` `PostApiFilesDeleteBatchData` Response for status 200
   */
  export namespace PostApiFilesDeleteBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesDeleteBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesDeleteBatchData;
  }

  /**
   * @description 创建新文件夹
   * @tags files, files
   * @name PostApiFilesFolders
   * @summary 创建文件夹
   * @request POST:/api/files/folders
   * @response `200` `PostApiFilesFoldersData` Response for status 200
   */
  export namespace PostApiFilesFolders {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesFoldersPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesFoldersData;
  }

  /**
   * @description 移动文件夹到目标位置
   * @tags files, files
   * @name PostApiFilesFoldersByIdMove
   * @summary 移动文件夹
   * @request POST:/api/files/folders/{id}/move
   * @response `200` `PostApiFilesFoldersByIdMoveData` Response for status 200
   */
  export namespace PostApiFilesFoldersByIdMove {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesFoldersByIdMovePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesFoldersByIdMoveData;
  }

  /**
   * @description 为资源添加单个权限
   * @tags files, permission
   * @name PostApiFilesPermission
   * @summary 添加权限
   * @request POST:/api/files/permission
   * @response `200` `PostApiFilesPermissionData` Response for status 200
   */
  export namespace PostApiFilesPermission {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesPermissionPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesPermissionData;
  }

  /**
   * @description 设置文件或文件夹的权限（替换现有权限）
   * @tags files, permission
   * @name PostApiFilesPermissionByResourceTypeByResourceId
   * @summary 设置资源权限
   * @request POST:/api/files/permission/{resourceType}/{resourceId}
   * @response `200` `PostApiFilesPermissionByResourceTypeByResourceIdData` Response for status 200
   */
  export namespace PostApiFilesPermissionByResourceTypeByResourceId {
    export type RequestParams = {
      resourceId: string;
      resourceType: PostApiFilesPermissionByResourceTypeByResourceIdParams1ResourceTypeEnum;
    };
    export type RequestQuery = {};
    export type RequestBody =
      PostApiFilesPermissionByResourceTypeByResourceIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody =
      PostApiFilesPermissionByResourceTypeByResourceIdData;
  }

  /**
   * @description 检查用户对资源的权限
   * @tags files, permission
   * @name PostApiFilesPermissionCheck
   * @summary 检查权限
   * @request POST:/api/files/permission/check
   * @response `200` `PostApiFilesPermissionCheckData` Response for status 200
   */
  export namespace PostApiFilesPermissionCheck {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesPermissionCheckPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesPermissionCheckData;
  }

  /**
   * @description 将一个资源的权限复制到另一个资源
   * @tags files, permission
   * @name PostApiFilesPermissionCopy
   * @summary 复制权限
   * @request POST:/api/files/permission/copy
   * @response `200` `PostApiFilesPermissionCopyData` Response for status 200
   */
  export namespace PostApiFilesPermissionCopy {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesPermissionCopyPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesPermissionCopyData;
  }

  /**
   * @description 设置文件或文件夹的父级文件夹（用于权限继承）
   * @tags files, permission
   * @name PostApiFilesPermissionParent
   * @summary 设置资源父级
   * @request POST:/api/files/permission/parent
   * @response `200` `PostApiFilesPermissionParentData` Response for status 200
   */
  export namespace PostApiFilesPermissionParent {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesPermissionParentPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesPermissionParentData;
  }

  /**
   * @description 获取共享文件夹的子文件夹和文件，支持权限继承
   * @tags files, share
   * @name PostApiFilesShareFolderContents
   * @summary 获取共享文件夹内容
   * @request POST:/api/files/share/folder-contents
   * @response `200` `PostApiFilesShareFolderContentsData` Response for status 200
   */
  export namespace PostApiFilesShareFolderContents {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesShareFolderContentsPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesShareFolderContentsData;
  }

  /**
   * @description 获取当前用户共享给他人的文件和文件夹
   * @tags files, share
   * @name PostApiFilesShareMyShared
   * @summary 获取我共享的资源
   * @request POST:/api/files/share/my-shared
   * @response `200` `PostApiFilesShareMySharedData` Response for status 200
   */
  export namespace PostApiFilesShareMyShared {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesShareMySharedPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesShareMySharedData;
  }

  /**
   * @description 获取他人共享给当前用户的文件和文件夹
   * @tags files, share
   * @name PostApiFilesShareSharedWithMe
   * @summary 获取收到的共享
   * @request POST:/api/files/share/shared-with-me
   * @response `200` `PostApiFilesShareSharedWithMeData` Response for status 200
   */
  export namespace PostApiFilesShareSharedWithMe {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesShareSharedWithMePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesShareSharedWithMeData;
  }

  /**
   * @description 上传文件到存储（如果文件已存在则返回冲突信息）
   * @tags files, files
   * @name PostApiFilesUpload
   * @summary 上传文件
   * @request POST:/api/files/upload
   * @response `200` `PostApiFilesUploadData` Response for status 200
   */
  export namespace PostApiFilesUpload {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesUploadPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesUploadData;
  }

  /**
   * @description 上传文件并处理冲突（覆盖/创建新版本/创建副本）
   * @tags files, files
   * @name PostApiFilesUploadForce
   * @summary 强制上传文件
   * @request POST:/api/files/upload-force
   * @response `200` `PostApiFilesUploadForceData` Response for status 200
   */
  export namespace PostApiFilesUploadForce {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesUploadForcePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesUploadForceData;
  }

  /**
   * @description 获取预签名上传URL
   * @tags files, files
   * @name PostApiFilesUploadUrl
   * @summary 获取上传URL
   * @request POST:/api/files/upload-url
   * @response `200` `PostApiFilesUploadUrlData` Response for status 200
   */
  export namespace PostApiFilesUploadUrl {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiFilesUploadUrlPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesUploadUrlData;
  }

  /**
   * @description 将历史版本恢复为当前版本（交换S3字段）
   * @tags files, files
   * @name PostApiFilesVersionsByIdRestore
   * @summary 恢复历史版本
   * @request POST:/api/files/versions/{id}/restore
   * @response `200` `PostApiFilesVersionsByIdRestoreData` Response for status 200
   */
  export namespace PostApiFilesVersionsByIdRestore {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiFilesVersionsByIdRestoreData;
  }

  /**
   * @description 保存文本文件内容
   * @tags files, files
   * @name PutApiFilesByIdContent
   * @summary 保存文件内容
   * @request PUT:/api/files/{id}/content
   * @response `200` `PutApiFilesByIdContentData` Response for status 200
   */
  export namespace PutApiFilesByIdContent {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiFilesByIdContentPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiFilesByIdContentData;
  }

  /**
   * @description 更新文件描述信息
   * @tags files, files
   * @name PutApiFilesByIdDescription
   * @summary 更新文件描述
   * @request PUT:/api/files/{id}/description
   * @response `200` `PutApiFilesByIdDescriptionData` Response for status 200
   */
  export namespace PutApiFilesByIdDescription {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiFilesByIdDescriptionPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiFilesByIdDescriptionData;
  }

  /**
   * @description 重命名文件
   * @tags files, files
   * @name PutApiFilesByIdRename
   * @summary 重命名文件
   * @request PUT:/api/files/{id}/rename
   * @response `200` `PutApiFilesByIdRenameData` Response for status 200
   */
  export namespace PutApiFilesByIdRename {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiFilesByIdRenamePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiFilesByIdRenameData;
  }

  /**
   * @description 更新文件夹描述信息
   * @tags files, files
   * @name PutApiFilesFoldersByIdDescription
   * @summary 更新文件夹描述
   * @request PUT:/api/files/folders/{id}/description
   * @response `200` `PutApiFilesFoldersByIdDescriptionData` Response for status 200
   */
  export namespace PutApiFilesFoldersByIdDescription {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiFilesFoldersByIdDescriptionPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiFilesFoldersByIdDescriptionData;
  }

  /**
   * @description 更新文件夹排序
   * @tags files, files
   * @name PutApiFilesFoldersByIdOrder
   * @summary 更新文件夹排序
   * @request PUT:/api/files/folders/{id}/order
   * @response `200` `PutApiFilesFoldersByIdOrderData` Response for status 200
   */
  export namespace PutApiFilesFoldersByIdOrder {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiFilesFoldersByIdOrderPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiFilesFoldersByIdOrderData;
  }

  /**
   * @description 重命名文件夹
   * @tags files, files
   * @name PutApiFilesFoldersByIdRename
   * @summary 重命名文件夹
   * @request PUT:/api/files/folders/{id}/rename
   * @response `200` `PutApiFilesFoldersByIdRenameData` Response for status 200
   */
  export namespace PutApiFilesFoldersByIdRename {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiFilesFoldersByIdRenamePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiFilesFoldersByIdRenameData;
  }

  /**
   * @description 更新文件夹图标和颜色
   * @tags files, files
   * @name PutApiFilesFoldersByIdStyle
   * @summary 更新文件夹样式
   * @request PUT:/api/files/folders/{id}/style
   * @response `200` `PutApiFilesFoldersByIdStyleData` Response for status 200
   */
  export namespace PutApiFilesFoldersByIdStyle {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiFilesFoldersByIdStylePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiFilesFoldersByIdStyleData;
  }
}

export namespace Public {
  /**
   * @description 上传头像到公开存储，返回可直接访问的URL
   * @tags public, upload, avatar
   * @name PostApiPublicUploadAvatar
   * @summary 上传公开头像
   * @request POST:/api/public/upload/avatar
   * @response `200` `PostApiPublicUploadAvatarData` Response for status 200
   */
  export namespace PostApiPublicUploadAvatar {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiPublicUploadAvatarPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiPublicUploadAvatarData;
  }
}

export namespace Dev {
  /**
   * @description 获取 monorepo 项目根目录路径
   * @tags dev, project-code
   * @name GetApiDevProjectCodeRoot
   * @summary 获取项目根目录
   * @request GET:/api/dev/project-code/root
   * @response `200` `GetApiDevProjectCodeRootData` Response for status 200
   */
  export namespace GetApiDevProjectCodeRoot {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiDevProjectCodeRootData;
  }

  /**
   * @description 读取指定目录下的文件和子目录
   * @tags dev, project-code
   * @name PostApiDevProjectCodeDirectory
   * @summary 读取目录
   * @request POST:/api/dev/project-code/directory
   * @response `200` `PostApiDevProjectCodeDirectoryData` Response for status 200
   */
  export namespace PostApiDevProjectCodeDirectory {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiDevProjectCodeDirectoryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiDevProjectCodeDirectoryData;
  }

  /**
   * @description 读取指定文件的内容
   * @tags dev, project-code
   * @name PostApiDevProjectCodeFile
   * @summary 读取文件
   * @request POST:/api/dev/project-code/file
   * @response `200` `PostApiDevProjectCodeFileData` Response for status 200
   */
  export namespace PostApiDevProjectCodeFile {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiDevProjectCodeFilePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiDevProjectCodeFileData;
  }
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input;
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData());
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const responseToParse = responseFormat ? response.clone() : response;
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data.data;
    });
  };
}

/**
 * @title AI Drive System API
 * @version 1.0.0
 *
 * AI Drive System API Documentation
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  /**
   * No description
   *
   * @name GetIndex
   * @request GET:/
   */
  getIndex = (params: RequestParams = {}) =>
    this.http.request<any, any>({
      path: `/`,
      method: "GET",
      ...params,
    });

  ai = {
    /**
     * @description 根据ID删除AI智能体
     *
     * @tags ai, agent
     * @name DeleteApiAiAgentById
     * @summary 删除AI智能体
     * @request DELETE:/api/ai/agent/{id}
     * @response `200` `DeleteApiAiAgentByIdData` Response for status 200
     */
    deleteApiAiAgentById: (
      { id, ...query }: DeleteApiAiAgentByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiAiAgentByIdData, any>({
        path: `/api/ai/agent/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除单条Agent消息
     *
     * @tags ai, agentMessage
     * @name DeleteApiAiAgentMessageById
     * @summary 删除Agent消息
     * @request DELETE:/api/ai/agent-message/{id}
     * @response `200` `DeleteApiAiAgentMessageByIdData` Response for status 200
     */
    deleteApiAiAgentMessageById: (
      { id, ...query }: DeleteApiAiAgentMessageByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiAiAgentMessageByIdData, any>({
        path: `/api/ai/agent-message/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 删除会话中指定msgSeq及之后的所有消息
     *
     * @tags ai, agentMessage
     * @name DeleteApiAiAgentMessageFromSeqBySessionIdByMsgSeq
     * @summary 删除指定序号及之后的消息
     * @request DELETE:/api/ai/agent-message/from-seq/{sessionId}/{msgSeq}
     * @response `200` `DeleteApiAiAgentMessageFromSeqBySessionIdByMsgSeqData` Response for status 200
     */
    deleteApiAiAgentMessageFromSeqBySessionIdByMsgSeq: (
      {
        sessionId,
        msgSeq,
        ...query
      }: DeleteApiAiAgentMessageFromSeqBySessionIdByMsgSeqParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        DeleteApiAiAgentMessageFromSeqBySessionIdByMsgSeqData,
        any
      >({
        path: `/api/ai/agent-message/from-seq/${sessionId}/${msgSeq}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID软删除Agent会话
     *
     * @tags ai, agentSession
     * @name DeleteApiAiAgentSessionById
     * @summary 删除Agent会话
     * @request DELETE:/api/ai/agent-session/{id}
     * @response `200` `DeleteApiAiAgentSessionByIdData` Response for status 200
     */
    deleteApiAiAgentSessionById: (
      { id, ...query }: DeleteApiAiAgentSessionByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiAiAgentSessionByIdData, any>({
        path: `/api/ai/agent-session/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除API密钥
     *
     * @tags ai, apiKey
     * @name DeleteApiAiApiKeyById
     * @summary 删除API密钥
     * @request DELETE:/api/ai/api-key/{id}
     * @response `200` `DeleteApiAiApiKeyByIdData` Response for status 200
     */
    deleteApiAiApiKeyById: (
      { id, ...query }: DeleteApiAiApiKeyByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiAiApiKeyByIdData, any>({
        path: `/api/ai/api-key/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除MCP服务
     *
     * @tags ai, mcpServer
     * @name DeleteApiAiMcpServerById
     * @summary 删除MCP服务
     * @request DELETE:/api/ai/mcp-server/{id}
     * @response `200` `DeleteApiAiMcpServerByIdData` Response for status 200
     */
    deleteApiAiMcpServerById: (
      { id, ...query }: DeleteApiAiMcpServerByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiAiMcpServerByIdData, any>({
        path: `/api/ai/mcp-server/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除AI模型
     *
     * @tags ai, model
     * @name DeleteApiAiModelById
     * @summary 删除AI模型
     * @request DELETE:/api/ai/model/{id}
     * @response `200` `DeleteApiAiModelByIdData` Response for status 200
     */
    deleteApiAiModelById: (
      { id, ...query }: DeleteApiAiModelByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiAiModelByIdData, any>({
        path: `/api/ai/model/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除AI提供商
     *
     * @tags ai, provider
     * @name DeleteApiAiProviderById
     * @summary 删除AI提供商
     * @request DELETE:/api/ai/provider/{id}
     * @response `200` `DeleteApiAiProviderByIdData` Response for status 200
     */
    deleteApiAiProviderById: (
      { id, ...query }: DeleteApiAiProviderByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiAiProviderByIdData, any>({
        path: `/api/ai/provider/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 软删除AI会话
     *
     * @tags ai, aiSession
     * @name DeleteApiAiSessionById
     * @summary 删除AI会话
     * @request DELETE:/api/ai/session/{id}
     * @response `200` `DeleteApiAiSessionByIdData` Response for status 200
     */
    deleteApiAiSessionById: (
      { id, ...query }: DeleteApiAiSessionByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiAiSessionByIdData, any>({
        path: `/api/ai/session/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 删除会话中指定msgSeq及之后的所有消息
     *
     * @tags ai, aiSessionMessage
     * @name DeleteApiAiSessionMessageFromSeqBySessionIdByMsgSeq
     * @summary 删除指定序号及之后的消息
     * @request DELETE:/api/ai/session-message/from-seq/{sessionId}/{msgSeq}
     * @response `200` `DeleteApiAiSessionMessageFromSeqBySessionIdByMsgSeqData` Response for status 200
     */
    deleteApiAiSessionMessageFromSeqBySessionIdByMsgSeq: (
      {
        sessionId,
        msgSeq,
        ...query
      }: DeleteApiAiSessionMessageFromSeqBySessionIdByMsgSeqParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        DeleteApiAiSessionMessageFromSeqBySessionIdByMsgSeqData,
        any
      >({
        path: `/api/ai/session-message/from-seq/${sessionId}/${msgSeq}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除工具组
     *
     * @tags ai, toolGroup
     * @name DeleteApiAiToolGroupById
     * @summary 删除工具组
     * @request DELETE:/api/ai/tool-group/{id}
     * @response `200` `DeleteApiAiToolGroupByIdData` Response for status 200
     */
    deleteApiAiToolGroupById: (
      { id, ...query }: DeleteApiAiToolGroupByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiAiToolGroupByIdData, any>({
        path: `/api/ai/tool-group/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个AI智能体
     *
     * @tags ai, agent
     * @name GetApiAiAgentById
     * @summary 根据ID查询AI智能体
     * @request GET:/api/ai/agent/{id}
     * @response `200` `GetApiAiAgentByIdData` Response for status 200
     */
    getApiAiAgentById: (
      { id, ...query }: GetApiAiAgentByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiAgentByIdData, any>({
        path: `/api/ai/agent/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个Agent消息
     *
     * @tags ai, agentMessage
     * @name GetApiAiAgentMessageById
     * @summary 根据ID查询Agent消息
     * @request GET:/api/ai/agent-message/{id}
     * @response `200` `GetApiAiAgentMessageByIdData` Response for status 200
     */
    getApiAiAgentMessageById: (
      { id, ...query }: GetApiAiAgentMessageByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiAgentMessageByIdData, any>({
        path: `/api/ai/agent-message/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取指定会话的消息历史
     *
     * @tags ai, agentMessage
     * @name GetApiAiAgentMessageHistoryBySessionId
     * @summary 获取会话历史
     * @request GET:/api/ai/agent-message/history/{sessionId}
     * @response `200` `GetApiAiAgentMessageHistoryBySessionIdData` Response for status 200
     */
    getApiAiAgentMessageHistoryBySessionId: (
      { sessionId, ...query }: GetApiAiAgentMessageHistoryBySessionIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiAgentMessageHistoryBySessionIdData, any>({
        path: `/api/ai/agent-message/history/${sessionId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取Agent消息表的JSON Schema
     *
     * @tags ai, agentMessage
     * @name GetApiAiAgentMessageSchema
     * @summary 获取Agent消息Schema
     * @request GET:/api/ai/agent-message/schema
     * @response `200` `GetApiAiAgentMessageSchemaData` Response for status 200
     */
    getApiAiAgentMessageSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiAiAgentMessageSchemaData, any>({
        path: `/api/ai/agent-message/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取AI智能体表的JSON Schema
     *
     * @tags ai, agent
     * @name GetApiAiAgentSchema
     * @summary 获取AI智能体Schema
     * @request GET:/api/ai/agent/schema
     * @response `200` `GetApiAiAgentSchemaData` Response for status 200
     */
    getApiAiAgentSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiAiAgentSchemaData, any>({
        path: `/api/ai/agent/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个Agent会话
     *
     * @tags ai, agentSession
     * @name GetApiAiAgentSessionById
     * @summary 根据ID查询Agent会话
     * @request GET:/api/ai/agent-session/{id}
     * @response `200` `GetApiAiAgentSessionByIdData` Response for status 200
     */
    getApiAiAgentSessionById: (
      { id, ...query }: GetApiAiAgentSessionByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiAgentSessionByIdData, any>({
        path: `/api/ai/agent-session/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取Agent会话表的JSON Schema
     *
     * @tags ai, agentSession
     * @name GetApiAiAgentSessionSchema
     * @summary 获取Agent会话Schema
     * @request GET:/api/ai/agent-session/schema
     * @response `200` `GetApiAiAgentSessionSchemaData` Response for status 200
     */
    getApiAiAgentSessionSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiAiAgentSessionSchemaData, any>({
        path: `/api/ai/agent-session/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个API密钥
     *
     * @tags ai, apiKey
     * @name GetApiAiApiKeyById
     * @summary 根据ID查询API密钥
     * @request GET:/api/ai/api-key/{id}
     * @response `200` `GetApiAiApiKeyByIdData` Response for status 200
     */
    getApiAiApiKeyById: (
      { id, ...query }: GetApiAiApiKeyByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiApiKeyByIdData, any>({
        path: `/api/ai/api-key/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取API密钥表的JSON Schema
     *
     * @tags ai, apiKey
     * @name GetApiAiApiKeySchema
     * @summary 获取API密钥Schema
     * @request GET:/api/ai/api-key/schema
     * @response `200` `GetApiAiApiKeySchemaData` Response for status 200
     */
    getApiAiApiKeySchema: (params: RequestParams = {}) =>
      this.http.request<GetApiAiApiKeySchemaData, any>({
        path: `/api/ai/api-key/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个MCP服务
     *
     * @tags ai, mcpServer
     * @name GetApiAiMcpServerById
     * @summary 根据ID查询MCP服务
     * @request GET:/api/ai/mcp-server/{id}
     * @response `200` `GetApiAiMcpServerByIdData` Response for status 200
     */
    getApiAiMcpServerById: (
      { id, ...query }: GetApiAiMcpServerByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiMcpServerByIdData, any>({
        path: `/api/ai/mcp-server/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取MCP服务表的JSON Schema
     *
     * @tags ai, mcpServer
     * @name GetApiAiMcpServerSchema
     * @summary 获取MCP服务Schema
     * @request GET:/api/ai/mcp-server/schema
     * @response `200` `GetApiAiMcpServerSchemaData` Response for status 200
     */
    getApiAiMcpServerSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiAiMcpServerSchemaData, any>({
        path: `/api/ai/mcp-server/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个AI模型
     *
     * @tags ai, model
     * @name GetApiAiModelById
     * @summary 根据ID查询AI模型
     * @request GET:/api/ai/model/{id}
     * @response `200` `GetApiAiModelByIdData` Response for status 200
     */
    getApiAiModelById: (
      { id, ...query }: GetApiAiModelByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiModelByIdData, any>({
        path: `/api/ai/model/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取AI模型表的JSON Schema
     *
     * @tags ai, model
     * @name GetApiAiModelSchema
     * @summary 获取AI模型Schema
     * @request GET:/api/ai/model/schema
     * @response `200` `GetApiAiModelSchemaData` Response for status 200
     */
    getApiAiModelSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiAiModelSchemaData, any>({
        path: `/api/ai/model/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个AI提供商
     *
     * @tags ai, provider
     * @name GetApiAiProviderById
     * @summary 根据ID查询AI提供商
     * @request GET:/api/ai/provider/{id}
     * @response `200` `GetApiAiProviderByIdData` Response for status 200
     */
    getApiAiProviderById: (
      { id, ...query }: GetApiAiProviderByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiProviderByIdData, any>({
        path: `/api/ai/provider/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取AI提供商表的JSON Schema
     *
     * @tags ai, provider
     * @name GetApiAiProviderSchema
     * @summary 获取AI提供商Schema
     * @request GET:/api/ai/provider/schema
     * @response `200` `GetApiAiProviderSchemaData` Response for status 200
     */
    getApiAiProviderSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiAiProviderSchemaData, any>({
        path: `/api/ai/provider/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个AI会话
     *
     * @tags ai, aiSession
     * @name GetApiAiSessionById
     * @summary 根据ID查询AI会话
     * @request GET:/api/ai/session/{id}
     * @response `200` `GetApiAiSessionByIdData` Response for status 200
     */
    getApiAiSessionById: (
      { id, ...query }: GetApiAiSessionByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiSessionByIdData, any>({
        path: `/api/ai/session/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个AI会话消息
     *
     * @tags ai, aiSessionMessage
     * @name GetApiAiSessionMessageById
     * @summary 根据ID查询AI会话消息
     * @request GET:/api/ai/session-message/{id}
     * @response `200` `GetApiAiSessionMessageByIdData` Response for status 200
     */
    getApiAiSessionMessageById: (
      { id, ...query }: GetApiAiSessionMessageByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiSessionMessageByIdData, any>({
        path: `/api/ai/session-message/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取指定会话的消息历史
     *
     * @tags ai, aiSessionMessage
     * @name GetApiAiSessionMessageHistoryBySessionId
     * @summary 获取会话历史
     * @request GET:/api/ai/session-message/history/{sessionId}
     * @response `200` `GetApiAiSessionMessageHistoryBySessionIdData` Response for status 200
     */
    getApiAiSessionMessageHistoryBySessionId: (
      { sessionId, ...query }: GetApiAiSessionMessageHistoryBySessionIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiSessionMessageHistoryBySessionIdData, any>({
        path: `/api/ai/session-message/history/${sessionId}`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取AI会话消息表的JSON Schema
     *
     * @tags ai, aiSessionMessage
     * @name GetApiAiSessionMessageSchema
     * @summary 获取AI会话消息Schema
     * @request GET:/api/ai/session-message/schema
     * @response `200` `GetApiAiSessionMessageSchemaData` Response for status 200
     */
    getApiAiSessionMessageSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiAiSessionMessageSchemaData, any>({
        path: `/api/ai/session-message/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取AI会话表的JSON Schema
     *
     * @tags ai, aiSession
     * @name GetApiAiSessionSchema
     * @summary 获取AI会话Schema
     * @request GET:/api/ai/session/schema
     * @response `200` `GetApiAiSessionSchemaData` Response for status 200
     */
    getApiAiSessionSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiAiSessionSchemaData, any>({
        path: `/api/ai/session/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个工具组
     *
     * @tags ai, toolGroup
     * @name GetApiAiToolGroupById
     * @summary 根据ID查询工具组
     * @request GET:/api/ai/tool-group/{id}
     * @response `200` `GetApiAiToolGroupByIdData` Response for status 200
     */
    getApiAiToolGroupById: (
      { id, ...query }: GetApiAiToolGroupByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiToolGroupByIdData, any>({
        path: `/api/ai/tool-group/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取工具组表的JSON Schema
     *
     * @tags ai, toolGroup
     * @name GetApiAiToolGroupSchema
     * @summary 获取工具组Schema
     * @request GET:/api/ai/tool-group/schema
     * @response `200` `GetApiAiToolGroupSchemaData` Response for status 200
     */
    getApiAiToolGroupSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiAiToolGroupSchemaData, any>({
        path: `/api/ai/tool-group/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个AI智能体
     *
     * @tags ai, agent
     * @name PostApiAiAgent
     * @summary 创建AI智能体
     * @request POST:/api/ai/agent
     * @response `200` `PostApiAiAgentData` Response for status 200
     */
    postApiAiAgent: (data: PostApiAiAgentPayload, params: RequestParams = {}) =>
      this.http.request<PostApiAiAgentData, any>({
        path: `/api/ai/agent`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个AI智能体
     *
     * @tags ai, agent
     * @name PostApiAiAgentBatch
     * @summary 批量创建AI智能体
     * @request POST:/api/ai/agent/batch
     * @response `200` `PostApiAiAgentBatchData` Response for status 200
     */
    postApiAiAgentBatch: (
      data: PostApiAiAgentBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiAgentBatchData, any>({
        path: `/api/ai/agent/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单条Agent消息
     *
     * @tags ai, agentMessage
     * @name PostApiAiAgentMessage
     * @summary 创建Agent消息
     * @request POST:/api/ai/agent-message
     * @response `200` `PostApiAiAgentMessageData` Response for status 200
     */
    postApiAiAgentMessage: (
      data: PostApiAiAgentMessagePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiAgentMessageData, any>({
        path: `/api/ai/agent-message`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建Agent消息
     *
     * @tags ai, agentMessage
     * @name PostApiAiAgentMessageBatch
     * @summary 批量创建Agent消息
     * @request POST:/api/ai/agent-message/batch
     * @response `200` `PostApiAiAgentMessageBatchData` Response for status 200
     */
    postApiAiAgentMessageBatch: (
      data: PostApiAiAgentMessageBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiAgentMessageBatchData, any>({
        path: `/api/ai/agent-message/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询Agent消息列表
     *
     * @tags ai, agentMessage
     * @name PostApiAiAgentMessageQuery
     * @summary 分页查询Agent消息
     * @request POST:/api/ai/agent-message/query
     * @response `200` `PostApiAiAgentMessageQueryData` Response for status 200
     */
    postApiAiAgentMessageQuery: (
      data: PostApiAiAgentMessageQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiAgentMessageQueryData, any>({
        path: `/api/ai/agent-message/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询AI智能体列表
     *
     * @tags ai, agent
     * @name PostApiAiAgentQuery
     * @summary 分页查询AI智能体
     * @request POST:/api/ai/agent/query
     * @response `200` `PostApiAiAgentQueryData` Response for status 200
     */
    postApiAiAgentQuery: (
      data: PostApiAiAgentQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiAgentQueryData, any>({
        path: `/api/ai/agent/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个Agent会话
     *
     * @tags ai, agentSession
     * @name PostApiAiAgentSession
     * @summary 创建Agent会话
     * @request POST:/api/ai/agent-session
     * @response `200` `PostApiAiAgentSessionData` Response for status 200
     */
    postApiAiAgentSession: (
      data: PostApiAiAgentSessionPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiAgentSessionData, any>({
        path: `/api/ai/agent-session`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询Agent会话列表
     *
     * @tags ai, agentSession
     * @name PostApiAiAgentSessionQuery
     * @summary 分页查询Agent会话
     * @request POST:/api/ai/agent-session/query
     * @response `200` `PostApiAiAgentSessionQueryData` Response for status 200
     */
    postApiAiAgentSessionQuery: (
      data: PostApiAiAgentSessionQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiAgentSessionQueryData, any>({
        path: `/api/ai/agent-session/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建API密钥并关联MCP服务
     *
     * @tags ai, apiKey
     * @name PostApiAiApiKey
     * @summary 创建API密钥
     * @request POST:/api/ai/api-key
     * @response `200` `PostApiAiApiKeyData` Response for status 200
     */
    postApiAiApiKey: (
      data: PostApiAiApiKeyPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiApiKeyData, any>({
        path: `/api/ai/api-key`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 撤销API密钥
     *
     * @tags ai, apiKey
     * @name PostApiAiApiKeyByIdRevoke
     * @summary 撤销API密钥
     * @request POST:/api/ai/api-key/{id}/revoke
     * @response `200` `PostApiAiApiKeyByIdRevokeData` Response for status 200
     */
    postApiAiApiKeyByIdRevoke: (
      { id, ...query }: PostApiAiApiKeyByIdRevokeParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiApiKeyByIdRevokeData, any>({
        path: `/api/ai/api-key/${id}/revoke`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询API密钥列表
     *
     * @tags ai, apiKey
     * @name PostApiAiApiKeyQuery
     * @summary 分页查询API密钥
     * @request POST:/api/ai/api-key/query
     * @response `200` `PostApiAiApiKeyQueryData` Response for status 200
     */
    postApiAiApiKeyQuery: (
      data: PostApiAiApiKeyQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiApiKeyQueryData, any>({
        path: `/api/ai/api-key/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 统一的 AI 对话接口，支持普通模式（modelId）和 Agent 模式（agentId），可通过 sessionId 自动加载历史消息，通过 rewriteFromMsgSeq 实现消息重写
     *
     * @tags AI
     * @name PostApiAiChat
     * @summary AI 对话
     * @request POST:/api/ai/chat
     */
    postApiAiChat: (data: PostApiAiChatPayload, params: RequestParams = {}) =>
      this.http.request<any, any>({
        path: `/api/ai/chat`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 创建单个MCP服务
     *
     * @tags ai, mcpServer
     * @name PostApiAiMcpServer
     * @summary 创建MCP服务
     * @request POST:/api/ai/mcp-server
     * @response `200` `PostApiAiMcpServerData` Response for status 200
     */
    postApiAiMcpServer: (
      data: PostApiAiMcpServerPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiMcpServerData, any>({
        path: `/api/ai/mcp-server`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询MCP服务列表
     *
     * @tags ai, mcpServer
     * @name PostApiAiMcpServerQuery
     * @summary 分页查询MCP服务
     * @request POST:/api/ai/mcp-server/query
     * @response `200` `PostApiAiMcpServerQueryData` Response for status 200
     */
    postApiAiMcpServerQuery: (
      data: PostApiAiMcpServerQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiMcpServerQueryData, any>({
        path: `/api/ai/mcp-server/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个AI模型
     *
     * @tags ai, model
     * @name PostApiAiModel
     * @summary 创建AI模型
     * @request POST:/api/ai/model
     * @response `200` `PostApiAiModelData` Response for status 200
     */
    postApiAiModel: (data: PostApiAiModelPayload, params: RequestParams = {}) =>
      this.http.request<PostApiAiModelData, any>({
        path: `/api/ai/model`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个AI模型
     *
     * @tags ai, model
     * @name PostApiAiModelBatch
     * @summary 批量创建AI模型
     * @request POST:/api/ai/model/batch
     * @response `200` `PostApiAiModelBatchData` Response for status 200
     */
    postApiAiModelBatch: (
      data: PostApiAiModelBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiModelBatchData, any>({
        path: `/api/ai/model/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 发送测试消息验证模型是否正常工作
     *
     * @tags ai, model
     * @name PostApiAiModelByIdTest
     * @summary 测试AI模型
     * @request POST:/api/ai/model/{id}/test
     * @response `200` `PostApiAiModelByIdTestData` Response for status 200
     */
    postApiAiModelByIdTest: (
      { id, ...query }: PostApiAiModelByIdTestParams,
      data: PostApiAiModelByIdTestPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiModelByIdTestData, any>({
        path: `/api/ai/model/${id}/test`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询AI模型列表
     *
     * @tags ai, model
     * @name PostApiAiModelQuery
     * @summary 分页查询AI模型
     * @request POST:/api/ai/model/query
     * @response `200` `PostApiAiModelQueryData` Response for status 200
     */
    postApiAiModelQuery: (
      data: PostApiAiModelQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiModelQueryData, any>({
        path: `/api/ai/model/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个AI提供商
     *
     * @tags ai, provider
     * @name PostApiAiProvider
     * @summary 创建AI提供商
     * @request POST:/api/ai/provider
     * @response `200` `PostApiAiProviderData` Response for status 200
     */
    postApiAiProvider: (
      data: PostApiAiProviderPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiProviderData, any>({
        path: `/api/ai/provider`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个AI提供商
     *
     * @tags ai, provider
     * @name PostApiAiProviderBatch
     * @summary 批量创建AI提供商
     * @request POST:/api/ai/provider/batch
     * @response `200` `PostApiAiProviderBatchData` Response for status 200
     */
    postApiAiProviderBatch: (
      data: PostApiAiProviderBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiProviderBatchData, any>({
        path: `/api/ai/provider/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询AI提供商列表
     *
     * @tags ai, provider
     * @name PostApiAiProviderQuery
     * @summary 分页查询AI提供商
     * @request POST:/api/ai/provider/query
     * @response `200` `PostApiAiProviderQueryData` Response for status 200
     */
    postApiAiProviderQuery: (
      data: PostApiAiProviderQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiProviderQueryData, any>({
        path: `/api/ai/provider/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个AI会话
     *
     * @tags ai, aiSession
     * @name PostApiAiSession
     * @summary 创建AI会话
     * @request POST:/api/ai/session
     * @response `200` `PostApiAiSessionData` Response for status 200
     */
    postApiAiSession: (
      data: PostApiAiSessionPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiSessionData, any>({
        path: `/api/ai/session`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单条AI会话消息
     *
     * @tags ai, aiSessionMessage
     * @name PostApiAiSessionMessage
     * @summary 创建AI会话消息
     * @request POST:/api/ai/session-message
     * @response `200` `PostApiAiSessionMessageData` Response for status 200
     */
    postApiAiSessionMessage: (
      data: PostApiAiSessionMessagePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiSessionMessageData, any>({
        path: `/api/ai/session-message`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建AI会话消息
     *
     * @tags ai, aiSessionMessage
     * @name PostApiAiSessionMessageBatch
     * @summary 批量创建AI会话消息
     * @request POST:/api/ai/session-message/batch
     * @response `200` `PostApiAiSessionMessageBatchData` Response for status 200
     */
    postApiAiSessionMessageBatch: (
      data: PostApiAiSessionMessageBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiSessionMessageBatchData, any>({
        path: `/api/ai/session-message/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询AI会话消息列表
     *
     * @tags ai, aiSessionMessage
     * @name PostApiAiSessionMessageQuery
     * @summary 分页查询AI会话消息
     * @request POST:/api/ai/session-message/query
     * @response `200` `PostApiAiSessionMessageQueryData` Response for status 200
     */
    postApiAiSessionMessageQuery: (
      data: PostApiAiSessionMessageQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiSessionMessageQueryData, any>({
        path: `/api/ai/session-message/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询AI会话列表
     *
     * @tags ai, aiSession
     * @name PostApiAiSessionQuery
     * @summary 分页查询AI会话
     * @request POST:/api/ai/session/query
     * @response `200` `PostApiAiSessionQueryData` Response for status 200
     */
    postApiAiSessionQuery: (
      data: PostApiAiSessionQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiSessionQueryData, any>({
        path: `/api/ai/session/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个工具组
     *
     * @tags ai, toolGroup
     * @name PostApiAiToolGroup
     * @summary 创建工具组
     * @request POST:/api/ai/tool-group
     * @response `200` `PostApiAiToolGroupData` Response for status 200
     */
    postApiAiToolGroup: (
      data: PostApiAiToolGroupPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiToolGroupData, any>({
        path: `/api/ai/tool-group`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个工具组
     *
     * @tags ai, toolGroup
     * @name PostApiAiToolGroupBatch
     * @summary 批量创建工具组
     * @request POST:/api/ai/tool-group/batch
     * @response `200` `PostApiAiToolGroupBatchData` Response for status 200
     */
    postApiAiToolGroupBatch: (
      data: PostApiAiToolGroupBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiToolGroupBatchData, any>({
        path: `/api/ai/tool-group/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询工具组列表
     *
     * @tags ai, toolGroup
     * @name PostApiAiToolGroupQuery
     * @summary 分页查询工具组
     * @request POST:/api/ai/tool-group/query
     * @response `200` `PostApiAiToolGroupQueryData` Response for status 200
     */
    postApiAiToolGroupQuery: (
      data: PostApiAiToolGroupQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiToolGroupQueryData, any>({
        path: `/api/ai/tool-group/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新AI智能体
     *
     * @tags ai, agent
     * @name PutApiAiAgentBatch
     * @summary 批量更新AI智能体
     * @request PUT:/api/ai/agent/batch
     * @response `200` `PutApiAiAgentBatchData` Response for status 200
     */
    putApiAiAgentBatch: (
      data: PutApiAiAgentBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiAgentBatchData, any>({
        path: `/api/ai/agent/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个AI智能体
     *
     * @tags ai, agent
     * @name PutApiAiAgentById
     * @summary 更新AI智能体
     * @request PUT:/api/ai/agent/{id}
     * @response `200` `PutApiAiAgentByIdData` Response for status 200
     */
    putApiAiAgentById: (
      { id, ...query }: PutApiAiAgentByIdParams,
      data: PutApiAiAgentByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiAgentByIdData, any>({
        path: `/api/ai/agent/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个Agent会话
     *
     * @tags ai, agentSession
     * @name PutApiAiAgentSessionById
     * @summary 更新Agent会话
     * @request PUT:/api/ai/agent-session/{id}
     * @response `200` `PutApiAiAgentSessionByIdData` Response for status 200
     */
    putApiAiAgentSessionById: (
      { id, ...query }: PutApiAiAgentSessionByIdParams,
      data: PutApiAiAgentSessionByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiAgentSessionByIdData, any>({
        path: `/api/ai/agent-session/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 归档指定Agent会话
     *
     * @tags ai, agentSession
     * @name PutApiAiAgentSessionByIdArchive
     * @summary 归档Agent会话
     * @request PUT:/api/ai/agent-session/{id}/archive
     * @response `200` `PutApiAiAgentSessionByIdArchiveData` Response for status 200
     */
    putApiAiAgentSessionByIdArchive: (
      { id, ...query }: PutApiAiAgentSessionByIdArchiveParams,
      data: PutApiAiAgentSessionByIdArchivePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiAgentSessionByIdArchiveData, any>({
        path: `/api/ai/agent-session/${id}/archive`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 置顶/取消置顶Agent会话
     *
     * @tags ai, agentSession
     * @name PutApiAiAgentSessionByIdPin
     * @summary 置顶Agent会话
     * @request PUT:/api/ai/agent-session/{id}/pin
     * @response `200` `PutApiAiAgentSessionByIdPinData` Response for status 200
     */
    putApiAiAgentSessionByIdPin: (
      { id, ...query }: PutApiAiAgentSessionByIdPinParams,
      data: PutApiAiAgentSessionByIdPinPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiAgentSessionByIdPinData, any>({
        path: `/api/ai/agent-session/${id}/pin`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 更新API密钥信息和关联的MCP服务
     *
     * @tags ai, apiKey
     * @name PutApiAiApiKeyById
     * @summary 更新API密钥
     * @request PUT:/api/ai/api-key/{id}
     * @response `200` `PutApiAiApiKeyByIdData` Response for status 200
     */
    putApiAiApiKeyById: (
      { id, ...query }: PutApiAiApiKeyByIdParams,
      data: PutApiAiApiKeyByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiApiKeyByIdData, any>({
        path: `/api/ai/api-key/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个MCP服务
     *
     * @tags ai, mcpServer
     * @name PutApiAiMcpServerById
     * @summary 更新MCP服务
     * @request PUT:/api/ai/mcp-server/{id}
     * @response `200` `PutApiAiMcpServerByIdData` Response for status 200
     */
    putApiAiMcpServerById: (
      { id, ...query }: PutApiAiMcpServerByIdParams,
      data: PutApiAiMcpServerByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiMcpServerByIdData, any>({
        path: `/api/ai/mcp-server/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新AI模型
     *
     * @tags ai, model
     * @name PutApiAiModelBatch
     * @summary 批量更新AI模型
     * @request PUT:/api/ai/model/batch
     * @response `200` `PutApiAiModelBatchData` Response for status 200
     */
    putApiAiModelBatch: (
      data: PutApiAiModelBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiModelBatchData, any>({
        path: `/api/ai/model/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个AI模型
     *
     * @tags ai, model
     * @name PutApiAiModelById
     * @summary 更新AI模型
     * @request PUT:/api/ai/model/{id}
     * @response `200` `PutApiAiModelByIdData` Response for status 200
     */
    putApiAiModelById: (
      { id, ...query }: PutApiAiModelByIdParams,
      data: PutApiAiModelByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiModelByIdData, any>({
        path: `/api/ai/model/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新AI提供商
     *
     * @tags ai, provider
     * @name PutApiAiProviderBatch
     * @summary 批量更新AI提供商
     * @request PUT:/api/ai/provider/batch
     * @response `200` `PutApiAiProviderBatchData` Response for status 200
     */
    putApiAiProviderBatch: (
      data: PutApiAiProviderBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiProviderBatchData, any>({
        path: `/api/ai/provider/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个AI提供商
     *
     * @tags ai, provider
     * @name PutApiAiProviderById
     * @summary 更新AI提供商
     * @request PUT:/api/ai/provider/{id}
     * @response `200` `PutApiAiProviderByIdData` Response for status 200
     */
    putApiAiProviderById: (
      { id, ...query }: PutApiAiProviderByIdParams,
      data: PutApiAiProviderByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiProviderByIdData, any>({
        path: `/api/ai/provider/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 更新单个AI会话
     *
     * @tags ai, aiSession
     * @name PutApiAiSessionById
     * @summary 更新AI会话
     * @request PUT:/api/ai/session/{id}
     * @response `200` `PutApiAiSessionByIdData` Response for status 200
     */
    putApiAiSessionById: (
      { id, ...query }: PutApiAiSessionByIdParams,
      data: PutApiAiSessionByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiSessionByIdData, any>({
        path: `/api/ai/session/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新工具组
     *
     * @tags ai, toolGroup
     * @name PutApiAiToolGroupBatch
     * @summary 批量更新工具组
     * @request PUT:/api/ai/tool-group/batch
     * @response `200` `PutApiAiToolGroupBatchData` Response for status 200
     */
    putApiAiToolGroupBatch: (
      data: PutApiAiToolGroupBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiToolGroupBatchData, any>({
        path: `/api/ai/tool-group/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个工具组
     *
     * @tags ai, toolGroup
     * @name PutApiAiToolGroupById
     * @summary 更新工具组
     * @request PUT:/api/ai/tool-group/{id}
     * @response `200` `PutApiAiToolGroupByIdData` Response for status 200
     */
    putApiAiToolGroupById: (
      { id, ...query }: PutApiAiToolGroupByIdParams,
      data: PutApiAiToolGroupByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiToolGroupByIdData, any>({
        path: `/api/ai/tool-group/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  auth = {
    /**
     * @description 获取 Token 过期时间配置
     *
     * @tags auth
     * @name GetApiAuthConfig
     * @summary 获取Token配置
     * @request GET:/api/auth/config
     * @response `200` `GetApiAuthConfigData` Response for status 200
     */
    getApiAuthConfig: (params: RequestParams = {}) =>
      this.http.request<GetApiAuthConfigData, any>({
        path: `/api/auth/config`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
 * @description 获取当前登录用户的详细信息
 *
 * @tags auth
 * @name GetApiAuthMe
 * @summary 获取当前用户
 * @request GET:/api/auth/me
 * @response `200` `GetApiAuthMeData` Response for status 200
 * @response `401` `{
    data: null,
    message: string,
    success: false,

}` Response for status 401
 * @response `500` `{
    data: null,
    message: string,
    success: false,

}` Response for status 500
 */
    getApiAuthMe: (params: RequestParams = {}) =>
      this.http.request<GetApiAuthMeData, GetApiAuthMeError>({
        path: `/api/auth/me`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
 * @description 验证 Access Token 是否有效
 *
 * @tags auth
 * @name GetApiAuthVerify
 * @summary 验证令牌
 * @request GET:/api/auth/verify
 * @response `200` `GetApiAuthVerifyData` Response for status 200
 * @response `401` `{
    data: null,
    message: string,
    success: false,

}` Response for status 401
 * @response `500` `{
    data: null,
    message: string,
    success: false,

}` Response for status 500
 */
    getApiAuthVerify: (params: RequestParams = {}) =>
      this.http.request<GetApiAuthVerifyData, GetApiAuthVerifyError>({
        path: `/api/auth/verify`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
 * @description 使用用户名密码登录，返回双 Token
 *
 * @tags auth
 * @name PostApiAuthLogin
 * @summary 用户登录
 * @request POST:/api/auth/login
 * @response `200` `PostApiAuthLoginData` Response for status 200
 * @response `401` `{
    data: null,
    message: string,
    success: false,

}` Response for status 401
 * @response `500` `{
    data: null,
    message: string,
    success: false,

}` Response for status 500
 */
    postApiAuthLogin: (
      data: PostApiAuthLoginPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAuthLoginData, PostApiAuthLoginError>({
        path: `/api/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description 撤销用户的所有刷新令牌
 *
 * @tags auth
 * @name PostApiAuthLogout
 * @summary 用户登出
 * @request POST:/api/auth/logout
 * @response `200` `PostApiAuthLogoutData` Response for status 200
 * @response `401` `{
    data: null,
    message: string,
    success: false,

}` Response for status 401
 * @response `500` `{
    data: null,
    message: string,
    success: false,

}` Response for status 500
 */
    postApiAuthLogout: (params: RequestParams = {}) =>
      this.http.request<PostApiAuthLogoutData, PostApiAuthLogoutError>({
        path: `/api/auth/logout`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
 * @description 使用 Refresh Token 获取新的 Access Token
 *
 * @tags auth
 * @name PostApiAuthRefresh
 * @summary 刷新访问令牌
 * @request POST:/api/auth/refresh
 * @response `200` `PostApiAuthRefreshData` Response for status 200
 * @response `401` `{
    data: null,
    message: string,
    success: false,

}` Response for status 401
 * @response `500` `{
    data: null,
    message: string,
    success: false,

}` Response for status 500
 */
    postApiAuthRefresh: (
      data: PostApiAuthRefreshPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAuthRefreshData, PostApiAuthRefreshError>({
        path: `/api/auth/refresh`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
 * @description 修改当前用户密码
 *
 * @tags auth
 * @name PutApiAuthPassword
 * @summary 修改密码
 * @request PUT:/api/auth/password
 * @response `200` `PutApiAuthPasswordData` Response for status 200
 * @response `400` `{
    data: null,
    message: string,
    success: false,

}` Response for status 400
 * @response `401` `{
    data: null,
    message: string,
    success: false,

}` Response for status 401
 * @response `500` `{
    data: null,
    message: string,
    success: false,

}` Response for status 500
 */
    putApiAuthPassword: (
      data: PutApiAuthPasswordPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAuthPasswordData, PutApiAuthPasswordError>({
        path: `/api/auth/password`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  ws = {
    /**
     * No description
     *
     * @name WsWsMain
     * @request WS:/ws/main
     */
    wsWsMain: (params: RequestParams = {}) =>
      this.http.request<any, any>({
        path: `/ws/main`,
        method: "WS",
        ...params,
      }),
  };
  api = {
    /**
     * No description
     *
     * @name GetApiMonitorDiskPartitions
     * @request GET:/api/monitor/disk/partitions
     */
    getApiMonitorDiskPartitions: (params: RequestParams = {}) =>
      this.http.request<any, any>({
        path: `/api/monitor/disk/partitions`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @name GetApiMonitorMetrics
     * @request GET:/api/monitor/metrics
     */
    getApiMonitorMetrics: (
      query: GetApiMonitorMetricsParams,
      params: RequestParams = {},
    ) =>
      this.http.request<any, any>({
        path: `/api/monitor/metrics`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name GetApiMonitorMetricsLatest
     * @request GET:/api/monitor/metrics/latest
     */
    getApiMonitorMetricsLatest: (params: RequestParams = {}) =>
      this.http.request<any, any>({
        path: `/api/monitor/metrics/latest`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @name GetApiMonitorPorts
     * @request GET:/api/monitor/ports
     */
    getApiMonitorPorts: (params: RequestParams = {}) =>
      this.http.request<any, any>({
        path: `/api/monitor/ports`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @name GetApiMonitorProcesses
     * @request GET:/api/monitor/processes
     */
    getApiMonitorProcesses: (
      query: GetApiMonitorProcessesParams,
      params: RequestParams = {},
    ) =>
      this.http.request<any, any>({
        path: `/api/monitor/processes`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @name GetApiMonitorSystemInfo
     * @request GET:/api/monitor/system/info
     */
    getApiMonitorSystemInfo: (params: RequestParams = {}) =>
      this.http.request<any, any>({
        path: `/api/monitor/system/info`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @name PostApiMonitorProcessesByPidKill
     * @request POST:/api/monitor/processes/{pid}/kill
     */
    postApiMonitorProcessesByPidKill: (
      { pid, ...query }: PostApiMonitorProcessesByPidKillParams,
      params: RequestParams = {},
    ) =>
      this.http.request<any, any>({
        path: `/api/monitor/processes/${pid}/kill`,
        method: "POST",
        ...params,
      }),
  };
  health = {
    /**
     * No description
     *
     * @name GetHealth
     * @request GET:/health
     */
    getHealth: (params: RequestParams = {}) =>
      this.http.request<any, any>({
        path: `/health`,
        method: "GET",
        ...params,
      }),
  };
  actions = {
    /**
     * @description 获取系统中所有已注册的Actions的名称和描述
     *
     * @tags actions
     * @name GetApiActions
     * @summary 获取所有Actions列表
     * @request GET:/api/actions
     * @response `200` `GetApiActionsData` Response for status 200
     */
    getApiActions: (params: RequestParams = {}) =>
      this.http.request<GetApiActionsData, any>({
        path: `/api/actions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据Action名称获取详细信息，包含输入输出的JSON Schema
     *
     * @tags actions
     * @name GetApiActionsByName
     * @summary 获取Action详情
     * @request GET:/api/actions/{name}
     * @response `200` `GetApiActionsByNameData` Response for status 200
     */
    getApiActionsByName: (
      { name, ...query }: GetApiActionsByNameParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiActionsByNameData, any>({
        path: `/api/actions/${name}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 通过Action名称执行，支持X-Sandbox header控制沙盒模式。沙盒模式下只验证输入不实际执行，返回模拟数据。
     *
     * @tags actions
     * @name PostApiActionsExecuteByName
     * @summary 通过名称执行Action
     * @request POST:/api/actions/execute/{name}
     * @response `200` `PostApiActionsExecuteByNameData` Response for status 200
     */
    postApiActionsExecuteByName: (
      { name, ...query }: PostApiActionsExecuteByNameParams,
      data: PostApiActionsExecuteByNamePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiActionsExecuteByNameData, any>({
        path: `/api/actions/execute/${name}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  system = {
    /**
     * @description 根据ID删除配置
     *
     * @tags system, config
     * @name DeleteApiSystemConfigById
     * @summary 删除配置
     * @request DELETE:/api/system/config/{id}
     * @response `200` `DeleteApiSystemConfigByIdData` Response for status 200
     */
    deleteApiSystemConfigById: (
      { id, ...query }: DeleteApiSystemConfigByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemConfigByIdData, any>({
        path: `/api/system/config/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID软删除部门
     *
     * @tags system, department
     * @name DeleteApiSystemDepartmentById
     * @summary 删除部门
     * @request DELETE:/api/system/department/{id}
     * @response `200` `DeleteApiSystemDepartmentByIdData` Response for status 200
     */
    deleteApiSystemDepartmentById: (
      { id, ...query }: DeleteApiSystemDepartmentByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemDepartmentByIdData, any>({
        path: `/api/system/department/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID软删除字典
     *
     * @tags system, dict
     * @name DeleteApiSystemDictById
     * @summary 删除字典
     * @request DELETE:/api/system/dict/{id}
     * @response `200` `DeleteApiSystemDictByIdData` Response for status 200
     */
    deleteApiSystemDictById: (
      { id, ...query }: DeleteApiSystemDictByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemDictByIdData, any>({
        path: `/api/system/dict/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据Key删除字典组
     *
     * @tags system, dictGroup
     * @name DeleteApiSystemDictGroupByKey
     * @summary 删除字典组
     * @request DELETE:/api/system/dict-group/{key}
     * @response `200` `DeleteApiSystemDictGroupByKeyData` Response for status 200
     */
    deleteApiSystemDictGroupByKey: (
      { key, ...query }: DeleteApiSystemDictGroupByKeyParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemDictGroupByKeyData, any>({
        path: `/api/system/dict-group/${key}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除定时任务
     *
     * @tags system, job
     * @name DeleteApiSystemJobById
     * @summary 删除定时任务
     * @request DELETE:/api/system/job/{id}
     * @response `200` `DeleteApiSystemJobByIdData` Response for status 200
     */
    deleteApiSystemJobById: (
      { id, ...query }: DeleteApiSystemJobByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemJobByIdData, any>({
        path: `/api/system/job/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除任务日志
     *
     * @tags system, jobLog
     * @name DeleteApiSystemJobLogById
     * @summary 删除任务日志
     * @request DELETE:/api/system/job-log/{id}
     * @response `200` `DeleteApiSystemJobLogByIdData` Response for status 200
     */
    deleteApiSystemJobLogById: (
      { id, ...query }: DeleteApiSystemJobLogByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemJobLogByIdData, any>({
        path: `/api/system/job-log/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除登录日志
     *
     * @tags system, loginInfo
     * @name DeleteApiSystemLoginInfoById
     * @summary 删除登录日志
     * @request DELETE:/api/system/login-info/{id}
     * @response `200` `DeleteApiSystemLoginInfoByIdData` Response for status 200
     */
    deleteApiSystemLoginInfoById: (
      { id, ...query }: DeleteApiSystemLoginInfoByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemLoginInfoByIdData, any>({
        path: `/api/system/login-info/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除菜单
     *
     * @tags system, menu
     * @name DeleteApiSystemMenuById
     * @summary 删除菜单
     * @request DELETE:/api/system/menu/{id}
     * @response `200` `DeleteApiSystemMenuByIdData` Response for status 200
     */
    deleteApiSystemMenuById: (
      { id, ...query }: DeleteApiSystemMenuByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemMenuByIdData, any>({
        path: `/api/system/menu/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除通知
     *
     * @tags system, notice
     * @name DeleteApiSystemNoticeById
     * @summary 删除通知
     * @request DELETE:/api/system/notice/{id}
     * @response `200` `DeleteApiSystemNoticeByIdData` Response for status 200
     */
    deleteApiSystemNoticeById: (
      { id, ...query }: DeleteApiSystemNoticeByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemNoticeByIdData, any>({
        path: `/api/system/notice/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除操作日志
     *
     * @tags system, operationLog
     * @name DeleteApiSystemOperationLogById
     * @summary 删除操作日志
     * @request DELETE:/api/system/operation-log/{id}
     * @response `200` `DeleteApiSystemOperationLogByIdData` Response for status 200
     */
    deleteApiSystemOperationLogById: (
      { id, ...query }: DeleteApiSystemOperationLogByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemOperationLogByIdData, any>({
        path: `/api/system/operation-log/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除权限（同时删除子权限）
     *
     * @tags system, permission
     * @name DeleteApiSystemPermissionById
     * @summary 删除权限
     * @request DELETE:/api/system/permission/{id}
     * @response `200` `DeleteApiSystemPermissionByIdData` Response for status 200
     */
    deleteApiSystemPermissionById: (
      { id, ...query }: DeleteApiSystemPermissionByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemPermissionByIdData, any>({
        path: `/api/system/permission/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID软删除岗位
     *
     * @tags system, post
     * @name DeleteApiSystemPostById
     * @summary 删除岗位
     * @request DELETE:/api/system/post/{id}
     * @response `200` `DeleteApiSystemPostByIdData` Response for status 200
     */
    deleteApiSystemPostById: (
      { id, ...query }: DeleteApiSystemPostByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemPostByIdData, any>({
        path: `/api/system/post/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID软删除角色
     *
     * @tags system, role
     * @name DeleteApiSystemRoleById
     * @summary 删除角色
     * @request DELETE:/api/system/role/{id}
     * @response `200` `DeleteApiSystemRoleByIdData` Response for status 200
     */
    deleteApiSystemRoleById: (
      { id, ...query }: DeleteApiSystemRoleByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemRoleByIdData, any>({
        path: `/api/system/role/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据复合主键删除
     *
     * @tags system, roleDepartment
     * @name DeleteApiSystemRoleDepartmentByRoleIdByDepartmentId
     * @summary 删除角色部门关联
     * @request DELETE:/api/system/role-department/{roleId}/{departmentId}
     * @response `200` `DeleteApiSystemRoleDepartmentByRoleIdByDepartmentIdData` Response for status 200
     */
    deleteApiSystemRoleDepartmentByRoleIdByDepartmentId: (
      {
        roleId,
        departmentId,
        ...query
      }: DeleteApiSystemRoleDepartmentByRoleIdByDepartmentIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        DeleteApiSystemRoleDepartmentByRoleIdByDepartmentIdData,
        any
      >({
        path: `/api/system/role-department/${roleId}/${departmentId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据复合主键删除
     *
     * @tags system, roleMenu
     * @name DeleteApiSystemRoleMenuByRoleIdByMenuId
     * @summary 删除角色菜单关联
     * @request DELETE:/api/system/role-menu/{roleId}/{menuId}
     * @response `200` `DeleteApiSystemRoleMenuByRoleIdByMenuIdData` Response for status 200
     */
    deleteApiSystemRoleMenuByRoleIdByMenuId: (
      {
        roleId,
        menuId,
        ...query
      }: DeleteApiSystemRoleMenuByRoleIdByMenuIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemRoleMenuByRoleIdByMenuIdData, any>({
        path: `/api/system/role-menu/${roleId}/${menuId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除令牌
     *
     * @tags system, token
     * @name DeleteApiSystemTokenById
     * @summary 删除令牌
     * @request DELETE:/api/system/token/{id}
     * @response `200` `DeleteApiSystemTokenByIdData` Response for status 200
     */
    deleteApiSystemTokenById: (
      { id, ...query }: DeleteApiSystemTokenByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemTokenByIdData, any>({
        path: `/api/system/token/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID软删除用户
     *
     * @tags system, user
     * @name DeleteApiSystemUserById
     * @summary 删除用户
     * @request DELETE:/api/system/user/{id}
     * @response `200` `DeleteApiSystemUserByIdData` Response for status 200
     */
    deleteApiSystemUserById: (
      { id, ...query }: DeleteApiSystemUserByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemUserByIdData, any>({
        path: `/api/system/user/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据复合主键删除
     *
     * @tags system, userPost
     * @name DeleteApiSystemUserPostByUserIdByPostId
     * @summary 删除用户岗位关联
     * @request DELETE:/api/system/user-post/{userId}/{postId}
     * @response `200` `DeleteApiSystemUserPostByUserIdByPostIdData` Response for status 200
     */
    deleteApiSystemUserPostByUserIdByPostId: (
      {
        userId,
        postId,
        ...query
      }: DeleteApiSystemUserPostByUserIdByPostIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemUserPostByUserIdByPostIdData, any>({
        path: `/api/system/user-post/${userId}/${postId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据复合主键删除
     *
     * @tags system, userRole
     * @name DeleteApiSystemUserRoleByUserIdByRoleId
     * @summary 删除用户角色关联
     * @request DELETE:/api/system/user-role/{userId}/{roleId}
     * @response `200` `DeleteApiSystemUserRoleByUserIdByRoleIdData` Response for status 200
     */
    deleteApiSystemUserRoleByUserIdByRoleId: (
      {
        userId,
        roleId,
        ...query
      }: DeleteApiSystemUserRoleByUserIdByRoleIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiSystemUserRoleByUserIdByRoleIdData, any>({
        path: `/api/system/user-role/${userId}/${roleId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取指定角色的所有权限标识
     *
     * @tags system, casbinRule
     * @name GetApiSystemCasbinRuleRoleByRoleKeyPermissions
     * @summary 获取角色权限
     * @request GET:/api/system/casbin-rule/role/{roleKey}/permissions
     * @response `200` `GetApiSystemCasbinRuleRoleByRoleKeyPermissionsData` Response for status 200
     */
    getApiSystemCasbinRuleRoleByRoleKeyPermissions: (
      {
        roleKey,
        ...query
      }: GetApiSystemCasbinRuleRoleByRoleKeyPermissionsParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        GetApiSystemCasbinRuleRoleByRoleKeyPermissionsData,
        any
      >({
        path: `/api/system/casbin-rule/role/${roleKey}/permissions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取指定用户的所有角色
     *
     * @tags system, casbinRule
     * @name GetApiSystemCasbinRuleUserByUserIdRoles
     * @summary 获取用户角色
     * @request GET:/api/system/casbin-rule/user/{userId}/roles
     * @response `200` `GetApiSystemCasbinRuleUserByUserIdRolesData` Response for status 200
     */
    getApiSystemCasbinRuleUserByUserIdRoles: (
      { userId, ...query }: GetApiSystemCasbinRuleUserByUserIdRolesParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemCasbinRuleUserByUserIdRolesData, any>({
        path: `/api/system/casbin-rule/user/${userId}/roles`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个配置
     *
     * @tags system, config
     * @name GetApiSystemConfigById
     * @summary 根据ID查询配置
     * @request GET:/api/system/config/{id}
     * @response `200` `GetApiSystemConfigByIdData` Response for status 200
     */
    getApiSystemConfigById: (
      { id, ...query }: GetApiSystemConfigByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemConfigByIdData, any>({
        path: `/api/system/config/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取配置表的JSON Schema
     *
     * @tags system, config
     * @name GetApiSystemConfigSchema
     * @summary 获取配置Schema
     * @request GET:/api/system/config/schema
     * @response `200` `GetApiSystemConfigSchemaData` Response for status 200
     */
    getApiSystemConfigSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemConfigSchemaData, any>({
        path: `/api/system/config/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个部门
     *
     * @tags system, department
     * @name GetApiSystemDepartmentById
     * @summary 根据ID查询部门
     * @request GET:/api/system/department/{id}
     * @response `200` `GetApiSystemDepartmentByIdData` Response for status 200
     */
    getApiSystemDepartmentById: (
      { id, ...query }: GetApiSystemDepartmentByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemDepartmentByIdData, any>({
        path: `/api/system/department/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取部门表的JSON Schema
     *
     * @tags system, department
     * @name GetApiSystemDepartmentSchema
     * @summary 获取部门Schema
     * @request GET:/api/system/department/schema
     * @response `200` `GetApiSystemDepartmentSchemaData` Response for status 200
     */
    getApiSystemDepartmentSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemDepartmentSchemaData, any>({
        path: `/api/system/department/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个字典
     *
     * @tags system, dict
     * @name GetApiSystemDictById
     * @summary 根据ID查询字典
     * @request GET:/api/system/dict/{id}
     * @response `200` `GetApiSystemDictByIdData` Response for status 200
     */
    getApiSystemDictById: (
      { id, ...query }: GetApiSystemDictByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemDictByIdData, any>({
        path: `/api/system/dict/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键Key查询单个字典组
     *
     * @tags system, dictGroup
     * @name GetApiSystemDictGroupByKey
     * @summary 根据Key查询字典组
     * @request GET:/api/system/dict-group/{key}
     * @response `200` `GetApiSystemDictGroupByKeyData` Response for status 200
     */
    getApiSystemDictGroupByKey: (
      { key, ...query }: GetApiSystemDictGroupByKeyParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemDictGroupByKeyData, any>({
        path: `/api/system/dict-group/${key}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取字典组表的JSON Schema
     *
     * @tags system, dictGroup
     * @name GetApiSystemDictGroupSchema
     * @summary 获取字典组Schema
     * @request GET:/api/system/dict-group/schema
     * @response `200` `GetApiSystemDictGroupSchemaData` Response for status 200
     */
    getApiSystemDictGroupSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemDictGroupSchemaData, any>({
        path: `/api/system/dict-group/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取字典表的JSON Schema
     *
     * @tags system, dict
     * @name GetApiSystemDictSchema
     * @summary 获取字典Schema
     * @request GET:/api/system/dict/schema
     * @response `200` `GetApiSystemDictSchemaData` Response for status 200
     */
    getApiSystemDictSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemDictSchemaData, any>({
        path: `/api/system/dict/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个定时任务
     *
     * @tags system, job
     * @name GetApiSystemJobById
     * @summary 根据ID查询定时任务
     * @request GET:/api/system/job/{id}
     * @response `200` `GetApiSystemJobByIdData` Response for status 200
     */
    getApiSystemJobById: (
      { id, ...query }: GetApiSystemJobByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemJobByIdData, any>({
        path: `/api/system/job/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个任务日志
     *
     * @tags system, jobLog
     * @name GetApiSystemJobLogById
     * @summary 根据ID查询任务日志
     * @request GET:/api/system/job-log/{id}
     * @response `200` `GetApiSystemJobLogByIdData` Response for status 200
     */
    getApiSystemJobLogById: (
      { id, ...query }: GetApiSystemJobLogByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemJobLogByIdData, any>({
        path: `/api/system/job-log/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取任务日志表的JSON Schema
     *
     * @tags system, jobLog
     * @name GetApiSystemJobLogSchema
     * @summary 获取任务日志Schema
     * @request GET:/api/system/job-log/schema
     * @response `200` `GetApiSystemJobLogSchemaData` Response for status 200
     */
    getApiSystemJobLogSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemJobLogSchemaData, any>({
        path: `/api/system/job-log/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取定时任务表的JSON Schema
     *
     * @tags system, job
     * @name GetApiSystemJobSchema
     * @summary 获取定时任务Schema
     * @request GET:/api/system/job/schema
     * @response `200` `GetApiSystemJobSchemaData` Response for status 200
     */
    getApiSystemJobSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemJobSchemaData, any>({
        path: `/api/system/job/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个登录日志
     *
     * @tags system, loginInfo
     * @name GetApiSystemLoginInfoById
     * @summary 根据ID查询登录日志
     * @request GET:/api/system/login-info/{id}
     * @response `200` `GetApiSystemLoginInfoByIdData` Response for status 200
     */
    getApiSystemLoginInfoById: (
      { id, ...query }: GetApiSystemLoginInfoByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemLoginInfoByIdData, any>({
        path: `/api/system/login-info/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取登录信息表的JSON Schema
     *
     * @tags system, loginInfo
     * @name GetApiSystemLoginInfoSchema
     * @summary 获取登录信息Schema
     * @request GET:/api/system/login-info/schema
     * @response `200` `GetApiSystemLoginInfoSchemaData` Response for status 200
     */
    getApiSystemLoginInfoSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemLoginInfoSchemaData, any>({
        path: `/api/system/login-info/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个菜单
     *
     * @tags system, menu
     * @name GetApiSystemMenuById
     * @summary 根据ID查询菜单
     * @request GET:/api/system/menu/{id}
     * @response `200` `GetApiSystemMenuByIdData` Response for status 200
     */
    getApiSystemMenuById: (
      { id, ...query }: GetApiSystemMenuByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemMenuByIdData, any>({
        path: `/api/system/menu/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取菜单表的JSON Schema
     *
     * @tags system, menu
     * @name GetApiSystemMenuSchema
     * @summary 获取菜单Schema
     * @request GET:/api/system/menu/schema
     * @response `200` `GetApiSystemMenuSchemaData` Response for status 200
     */
    getApiSystemMenuSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemMenuSchemaData, any>({
        path: `/api/system/menu/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个通知
     *
     * @tags system, notice
     * @name GetApiSystemNoticeById
     * @summary 根据ID查询通知
     * @request GET:/api/system/notice/{id}
     * @response `200` `GetApiSystemNoticeByIdData` Response for status 200
     */
    getApiSystemNoticeById: (
      { id, ...query }: GetApiSystemNoticeByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemNoticeByIdData, any>({
        path: `/api/system/notice/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取通知表的JSON Schema
     *
     * @tags system, notice
     * @name GetApiSystemNoticeSchema
     * @summary 获取通知Schema
     * @request GET:/api/system/notice/schema
     * @response `200` `GetApiSystemNoticeSchemaData` Response for status 200
     */
    getApiSystemNoticeSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemNoticeSchemaData, any>({
        path: `/api/system/notice/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个操作日志
     *
     * @tags system, operationLog
     * @name GetApiSystemOperationLogById
     * @summary 根据ID查询操作日志
     * @request GET:/api/system/operation-log/{id}
     * @response `200` `GetApiSystemOperationLogByIdData` Response for status 200
     */
    getApiSystemOperationLogById: (
      { id, ...query }: GetApiSystemOperationLogByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemOperationLogByIdData, any>({
        path: `/api/system/operation-log/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取操作日志表的JSON Schema
     *
     * @tags system, operationLog
     * @name GetApiSystemOperationLogSchema
     * @summary 获取操作日志Schema
     * @request GET:/api/system/operation-log/schema
     * @response `200` `GetApiSystemOperationLogSchemaData` Response for status 200
     */
    getApiSystemOperationLogSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemOperationLogSchemaData, any>({
        path: `/api/system/operation-log/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个权限
     *
     * @tags system, permission
     * @name GetApiSystemPermissionById
     * @summary 根据ID查询权限
     * @request GET:/api/system/permission/{id}
     * @response `200` `GetApiSystemPermissionByIdData` Response for status 200
     */
    getApiSystemPermissionById: (
      { id, ...query }: GetApiSystemPermissionByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemPermissionByIdData, any>({
        path: `/api/system/permission/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取权限表的JSON Schema
     *
     * @tags system, permission
     * @name GetApiSystemPermissionSchema
     * @summary 获取权限Schema
     * @request GET:/api/system/permission/schema
     * @response `200` `GetApiSystemPermissionSchemaData` Response for status 200
     */
    getApiSystemPermissionSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemPermissionSchemaData, any>({
        path: `/api/system/permission/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取完整的权限树结构
     *
     * @tags system, permission
     * @name GetApiSystemPermissionTree
     * @summary 获取权限树
     * @request GET:/api/system/permission/tree
     * @response `200` `GetApiSystemPermissionTreeData` Response for status 200
     */
    getApiSystemPermissionTree: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemPermissionTreeData, any>({
        path: `/api/system/permission/tree`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个岗位
     *
     * @tags system, post
     * @name GetApiSystemPostById
     * @summary 根据ID查询岗位
     * @request GET:/api/system/post/{id}
     * @response `200` `GetApiSystemPostByIdData` Response for status 200
     */
    getApiSystemPostById: (
      { id, ...query }: GetApiSystemPostByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemPostByIdData, any>({
        path: `/api/system/post/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取岗位表的JSON Schema
     *
     * @tags system, post
     * @name GetApiSystemPostSchema
     * @summary 获取岗位Schema
     * @request GET:/api/system/post/schema
     * @response `200` `GetApiSystemPostSchemaData` Response for status 200
     */
    getApiSystemPostSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemPostSchemaData, any>({
        path: `/api/system/post/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个角色
     *
     * @tags system, role
     * @name GetApiSystemRoleById
     * @summary 根据ID查询角色
     * @request GET:/api/system/role/{id}
     * @response `200` `GetApiSystemRoleByIdData` Response for status 200
     */
    getApiSystemRoleById: (
      { id, ...query }: GetApiSystemRoleByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemRoleByIdData, any>({
        path: `/api/system/role/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据roleId和departmentId查询
     *
     * @tags system, roleDepartment
     * @name GetApiSystemRoleDepartmentByRoleIdByDepartmentId
     * @summary 根据复合主键查询角色部门关联
     * @request GET:/api/system/role-department/{roleId}/{departmentId}
     * @response `200` `GetApiSystemRoleDepartmentByRoleIdByDepartmentIdData` Response for status 200
     */
    getApiSystemRoleDepartmentByRoleIdByDepartmentId: (
      {
        roleId,
        departmentId,
        ...query
      }: GetApiSystemRoleDepartmentByRoleIdByDepartmentIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        GetApiSystemRoleDepartmentByRoleIdByDepartmentIdData,
        any
      >({
        path: `/api/system/role-department/${roleId}/${departmentId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取角色部门表的JSON Schema
     *
     * @tags system, roleDepartment
     * @name GetApiSystemRoleDepartmentSchema
     * @summary 获取角色部门Schema
     * @request GET:/api/system/role-department/schema
     * @response `200` `GetApiSystemRoleDepartmentSchemaData` Response for status 200
     */
    getApiSystemRoleDepartmentSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemRoleDepartmentSchemaData, any>({
        path: `/api/system/role-department/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据roleId和menuId查询
     *
     * @tags system, roleMenu
     * @name GetApiSystemRoleMenuByRoleIdByMenuId
     * @summary 根据复合主键查询角色菜单关联
     * @request GET:/api/system/role-menu/{roleId}/{menuId}
     * @response `200` `GetApiSystemRoleMenuByRoleIdByMenuIdData` Response for status 200
     */
    getApiSystemRoleMenuByRoleIdByMenuId: (
      { roleId, menuId, ...query }: GetApiSystemRoleMenuByRoleIdByMenuIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemRoleMenuByRoleIdByMenuIdData, any>({
        path: `/api/system/role-menu/${roleId}/${menuId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取指定角色的所有菜单ID
     *
     * @tags system, roleMenu
     * @name GetApiSystemRoleMenuRoleByRoleId
     * @summary 获取角色菜单
     * @request GET:/api/system/role-menu/role/{roleId}
     * @response `200` `GetApiSystemRoleMenuRoleByRoleIdData` Response for status 200
     */
    getApiSystemRoleMenuRoleByRoleId: (
      { roleId, ...query }: GetApiSystemRoleMenuRoleByRoleIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemRoleMenuRoleByRoleIdData, any>({
        path: `/api/system/role-menu/role/${roleId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取角色菜单表的JSON Schema
     *
     * @tags system, roleMenu
     * @name GetApiSystemRoleMenuSchema
     * @summary 获取角色菜单Schema
     * @request GET:/api/system/role-menu/schema
     * @response `200` `GetApiSystemRoleMenuSchemaData` Response for status 200
     */
    getApiSystemRoleMenuSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemRoleMenuSchemaData, any>({
        path: `/api/system/role-menu/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取角色表的JSON Schema
     *
     * @tags system, role
     * @name GetApiSystemRoleSchema
     * @summary 获取角色Schema
     * @request GET:/api/system/role/schema
     * @response `200` `GetApiSystemRoleSchemaData` Response for status 200
     */
    getApiSystemRoleSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemRoleSchemaData, any>({
        path: `/api/system/role/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个令牌
     *
     * @tags system, token
     * @name GetApiSystemTokenById
     * @summary 根据ID查询令牌
     * @request GET:/api/system/token/{id}
     * @response `200` `GetApiSystemTokenByIdData` Response for status 200
     */
    getApiSystemTokenById: (
      { id, ...query }: GetApiSystemTokenByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemTokenByIdData, any>({
        path: `/api/system/token/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取Token表的JSON Schema
     *
     * @tags system, token
     * @name GetApiSystemTokenSchema
     * @summary 获取TokenSchema
     * @request GET:/api/system/token/schema
     * @response `200` `GetApiSystemTokenSchemaData` Response for status 200
     */
    getApiSystemTokenSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemTokenSchemaData, any>({
        path: `/api/system/token/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个用户
     *
     * @tags system, user
     * @name GetApiSystemUserById
     * @summary 根据ID查询用户
     * @request GET:/api/system/user/{id}
     * @response `200` `GetApiSystemUserByIdData` Response for status 200
     */
    getApiSystemUserById: (
      { id, ...query }: GetApiSystemUserByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemUserByIdData, any>({
        path: `/api/system/user/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据userId和postId查询
     *
     * @tags system, userPost
     * @name GetApiSystemUserPostByUserIdByPostId
     * @summary 根据复合主键查询用户岗位关联
     * @request GET:/api/system/user-post/{userId}/{postId}
     * @response `200` `GetApiSystemUserPostByUserIdByPostIdData` Response for status 200
     */
    getApiSystemUserPostByUserIdByPostId: (
      { userId, postId, ...query }: GetApiSystemUserPostByUserIdByPostIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemUserPostByUserIdByPostIdData, any>({
        path: `/api/system/user-post/${userId}/${postId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取用户岗位表的JSON Schema
     *
     * @tags system, userPost
     * @name GetApiSystemUserPostSchema
     * @summary 获取用户岗位Schema
     * @request GET:/api/system/user-post/schema
     * @response `200` `GetApiSystemUserPostSchemaData` Response for status 200
     */
    getApiSystemUserPostSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemUserPostSchemaData, any>({
        path: `/api/system/user-post/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取指定用户的所有岗位ID
     *
     * @tags system, userPost
     * @name GetApiSystemUserPostUserByUserId
     * @summary 获取用户岗位
     * @request GET:/api/system/user-post/user/{userId}
     * @response `200` `GetApiSystemUserPostUserByUserIdData` Response for status 200
     */
    getApiSystemUserPostUserByUserId: (
      { userId, ...query }: GetApiSystemUserPostUserByUserIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemUserPostUserByUserIdData, any>({
        path: `/api/system/user-post/user/${userId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据userId和roleId查询
     *
     * @tags system, userRole
     * @name GetApiSystemUserRoleByUserIdByRoleId
     * @summary 根据复合主键查询用户角色关联
     * @request GET:/api/system/user-role/{userId}/{roleId}
     * @response `200` `GetApiSystemUserRoleByUserIdByRoleIdData` Response for status 200
     */
    getApiSystemUserRoleByUserIdByRoleId: (
      { userId, roleId, ...query }: GetApiSystemUserRoleByUserIdByRoleIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemUserRoleByUserIdByRoleIdData, any>({
        path: `/api/system/user-role/${userId}/${roleId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取用户角色表的JSON Schema
     *
     * @tags system, userRole
     * @name GetApiSystemUserRoleSchema
     * @summary 获取用户角色Schema
     * @request GET:/api/system/user-role/schema
     * @response `200` `GetApiSystemUserRoleSchemaData` Response for status 200
     */
    getApiSystemUserRoleSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemUserRoleSchemaData, any>({
        path: `/api/system/user-role/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取指定用户的所有角色ID
     *
     * @tags system, userRole
     * @name GetApiSystemUserRoleUserByUserId
     * @summary 获取用户角色
     * @request GET:/api/system/user-role/user/{userId}
     * @response `200` `GetApiSystemUserRoleUserByUserIdData` Response for status 200
     */
    getApiSystemUserRoleUserByUserId: (
      { userId, ...query }: GetApiSystemUserRoleUserByUserIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiSystemUserRoleUserByUserIdData, any>({
        path: `/api/system/user-role/user/${userId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取用户表的JSON Schema
     *
     * @tags system, user
     * @name GetApiSystemUserSchema
     * @summary 获取用户Schema
     * @request GET:/api/system/user/schema
     * @response `200` `GetApiSystemUserSchemaData` Response for status 200
     */
    getApiSystemUserSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemUserSchemaData, any>({
        path: `/api/system/user/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个配置
     *
     * @tags system, config
     * @name PostApiSystemConfig
     * @summary 创建配置
     * @request POST:/api/system/config
     * @response `200` `PostApiSystemConfigData` Response for status 200
     */
    postApiSystemConfig: (
      data: PostApiSystemConfigPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemConfigData, any>({
        path: `/api/system/config`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个配置
     *
     * @tags system, config
     * @name PostApiSystemConfigBatch
     * @summary 批量创建配置
     * @request POST:/api/system/config/batch
     * @response `200` `PostApiSystemConfigBatchData` Response for status 200
     */
    postApiSystemConfigBatch: (
      data: PostApiSystemConfigBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemConfigBatchData, any>({
        path: `/api/system/config/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询配置列表
     *
     * @tags system, config
     * @name PostApiSystemConfigQuery
     * @summary 分页查询配置
     * @request POST:/api/system/config/query
     * @response `200` `PostApiSystemConfigQueryData` Response for status 200
     */
    postApiSystemConfigQuery: (
      data: PostApiSystemConfigQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemConfigQueryData, any>({
        path: `/api/system/config/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个部门
     *
     * @tags system, department
     * @name PostApiSystemDepartment
     * @summary 创建部门
     * @request POST:/api/system/department
     * @response `200` `PostApiSystemDepartmentData` Response for status 200
     */
    postApiSystemDepartment: (
      data: PostApiSystemDepartmentPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemDepartmentData, any>({
        path: `/api/system/department`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个部门
     *
     * @tags system, department
     * @name PostApiSystemDepartmentBatch
     * @summary 批量创建部门
     * @request POST:/api/system/department/batch
     * @response `200` `PostApiSystemDepartmentBatchData` Response for status 200
     */
    postApiSystemDepartmentBatch: (
      data: PostApiSystemDepartmentBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemDepartmentBatchData, any>({
        path: `/api/system/department/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询部门列表，自动排除已删除数据
     *
     * @tags system, department
     * @name PostApiSystemDepartmentQuery
     * @summary 分页查询部门
     * @request POST:/api/system/department/query
     * @response `200` `PostApiSystemDepartmentQueryData` Response for status 200
     */
    postApiSystemDepartmentQuery: (
      data: PostApiSystemDepartmentQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemDepartmentQueryData, any>({
        path: `/api/system/department/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个字典
     *
     * @tags system, dict
     * @name PostApiSystemDict
     * @summary 创建字典
     * @request POST:/api/system/dict
     * @response `200` `PostApiSystemDictData` Response for status 200
     */
    postApiSystemDict: (
      data: PostApiSystemDictPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemDictData, any>({
        path: `/api/system/dict`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个字典
     *
     * @tags system, dict
     * @name PostApiSystemDictBatch
     * @summary 批量创建字典
     * @request POST:/api/system/dict/batch
     * @response `200` `PostApiSystemDictBatchData` Response for status 200
     */
    postApiSystemDictBatch: (
      data: PostApiSystemDictBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemDictBatchData, any>({
        path: `/api/system/dict/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个字典组
     *
     * @tags system, dictGroup
     * @name PostApiSystemDictGroup
     * @summary 创建字典组
     * @request POST:/api/system/dict-group
     * @response `200` `PostApiSystemDictGroupData` Response for status 200
     */
    postApiSystemDictGroup: (
      data: PostApiSystemDictGroupPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemDictGroupData, any>({
        path: `/api/system/dict-group`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个字典组
     *
     * @tags system, dictGroup
     * @name PostApiSystemDictGroupBatch
     * @summary 批量创建字典组
     * @request POST:/api/system/dict-group/batch
     * @response `200` `PostApiSystemDictGroupBatchData` Response for status 200
     */
    postApiSystemDictGroupBatch: (
      data: PostApiSystemDictGroupBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemDictGroupBatchData, any>({
        path: `/api/system/dict-group/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询字典组列表
     *
     * @tags system, dictGroup
     * @name PostApiSystemDictGroupQuery
     * @summary 分页查询字典组
     * @request POST:/api/system/dict-group/query
     * @response `200` `PostApiSystemDictGroupQueryData` Response for status 200
     */
    postApiSystemDictGroupQuery: (
      data: PostApiSystemDictGroupQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemDictGroupQueryData, any>({
        path: `/api/system/dict-group/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询字典列表，自动排除已删除数据
     *
     * @tags system, dict
     * @name PostApiSystemDictQuery
     * @summary 分页查询字典
     * @request POST:/api/system/dict/query
     * @response `200` `PostApiSystemDictQueryData` Response for status 200
     */
    postApiSystemDictQuery: (
      data: PostApiSystemDictQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemDictQueryData, any>({
        path: `/api/system/dict/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个定时任务
     *
     * @tags system, job
     * @name PostApiSystemJob
     * @summary 创建定时任务
     * @request POST:/api/system/job
     * @response `200` `PostApiSystemJobData` Response for status 200
     */
    postApiSystemJob: (params: RequestParams = {}) =>
      this.http.request<PostApiSystemJobData, any>({
        path: `/api/system/job`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个定时任务
     *
     * @tags system, job
     * @name PostApiSystemJobBatch
     * @summary 批量创建定时任务
     * @request POST:/api/system/job/batch
     * @response `200` `PostApiSystemJobBatchData` Response for status 200
     */
    postApiSystemJobBatch: (params: RequestParams = {}) =>
      this.http.request<PostApiSystemJobBatchData, any>({
        path: `/api/system/job/batch`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个任务日志
     *
     * @tags system, jobLog
     * @name PostApiSystemJobLog
     * @summary 创建任务日志
     * @request POST:/api/system/job-log
     * @response `200` `PostApiSystemJobLogData` Response for status 200
     */
    postApiSystemJobLog: (params: RequestParams = {}) =>
      this.http.request<PostApiSystemJobLogData, any>({
        path: `/api/system/job-log`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个任务日志
     *
     * @tags system, jobLog
     * @name PostApiSystemJobLogBatch
     * @summary 批量创建任务日志
     * @request POST:/api/system/job-log/batch
     * @response `200` `PostApiSystemJobLogBatchData` Response for status 200
     */
    postApiSystemJobLogBatch: (params: RequestParams = {}) =>
      this.http.request<PostApiSystemJobLogBatchData, any>({
        path: `/api/system/job-log/batch`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询任务日志列表
     *
     * @tags system, jobLog
     * @name PostApiSystemJobLogQuery
     * @summary 分页查询任务日志
     * @request POST:/api/system/job-log/query
     * @response `200` `PostApiSystemJobLogQueryData` Response for status 200
     */
    postApiSystemJobLogQuery: (
      data: PostApiSystemJobLogQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemJobLogQueryData, any>({
        path: `/api/system/job-log/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询定时任务列表
     *
     * @tags system, job
     * @name PostApiSystemJobQuery
     * @summary 分页查询定时任务
     * @request POST:/api/system/job/query
     * @response `200` `PostApiSystemJobQueryData` Response for status 200
     */
    postApiSystemJobQuery: (
      data: PostApiSystemJobQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemJobQueryData, any>({
        path: `/api/system/job/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个登录日志
     *
     * @tags system, loginInfo
     * @name PostApiSystemLoginInfo
     * @summary 创建登录日志
     * @request POST:/api/system/login-info
     * @response `200` `PostApiSystemLoginInfoData` Response for status 200
     */
    postApiSystemLoginInfo: (params: RequestParams = {}) =>
      this.http.request<PostApiSystemLoginInfoData, any>({
        path: `/api/system/login-info`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询登录日志列表
     *
     * @tags system, loginInfo
     * @name PostApiSystemLoginInfoQuery
     * @summary 分页查询登录日志
     * @request POST:/api/system/login-info/query
     * @response `200` `PostApiSystemLoginInfoQueryData` Response for status 200
     */
    postApiSystemLoginInfoQuery: (
      data: PostApiSystemLoginInfoQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemLoginInfoQueryData, any>({
        path: `/api/system/login-info/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个菜单
     *
     * @tags system, menu
     * @name PostApiSystemMenu
     * @summary 创建菜单
     * @request POST:/api/system/menu
     * @response `200` `PostApiSystemMenuData` Response for status 200
     */
    postApiSystemMenu: (
      data: PostApiSystemMenuPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemMenuData, any>({
        path: `/api/system/menu`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个菜单
     *
     * @tags system, menu
     * @name PostApiSystemMenuBatch
     * @summary 批量创建菜单
     * @request POST:/api/system/menu/batch
     * @response `200` `PostApiSystemMenuBatchData` Response for status 200
     */
    postApiSystemMenuBatch: (
      data: PostApiSystemMenuBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemMenuBatchData, any>({
        path: `/api/system/menu/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询菜单列表
     *
     * @tags system, menu
     * @name PostApiSystemMenuQuery
     * @summary 分页查询菜单
     * @request POST:/api/system/menu/query
     * @response `200` `PostApiSystemMenuQueryData` Response for status 200
     */
    postApiSystemMenuQuery: (
      data: PostApiSystemMenuQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemMenuQueryData, any>({
        path: `/api/system/menu/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个通知
     *
     * @tags system, notice
     * @name PostApiSystemNotice
     * @summary 创建通知
     * @request POST:/api/system/notice
     * @response `200` `PostApiSystemNoticeData` Response for status 200
     */
    postApiSystemNotice: (
      data: PostApiSystemNoticePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemNoticeData, any>({
        path: `/api/system/notice`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个通知
     *
     * @tags system, notice
     * @name PostApiSystemNoticeBatch
     * @summary 批量创建通知
     * @request POST:/api/system/notice/batch
     * @response `200` `PostApiSystemNoticeBatchData` Response for status 200
     */
    postApiSystemNoticeBatch: (
      data: PostApiSystemNoticeBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemNoticeBatchData, any>({
        path: `/api/system/notice/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询通知列表
     *
     * @tags system, notice
     * @name PostApiSystemNoticeQuery
     * @summary 分页查询通知
     * @request POST:/api/system/notice/query
     * @response `200` `PostApiSystemNoticeQueryData` Response for status 200
     */
    postApiSystemNoticeQuery: (
      data: PostApiSystemNoticeQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemNoticeQueryData, any>({
        path: `/api/system/notice/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个操作日志
     *
     * @tags system, operationLog
     * @name PostApiSystemOperationLog
     * @summary 创建操作日志
     * @request POST:/api/system/operation-log
     * @response `200` `PostApiSystemOperationLogData` Response for status 200
     */
    postApiSystemOperationLog: (params: RequestParams = {}) =>
      this.http.request<PostApiSystemOperationLogData, any>({
        path: `/api/system/operation-log`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询操作日志列表
     *
     * @tags system, operationLog
     * @name PostApiSystemOperationLogQuery
     * @summary 分页查询操作日志
     * @request POST:/api/system/operation-log/query
     * @response `200` `PostApiSystemOperationLogQueryData` Response for status 200
     */
    postApiSystemOperationLogQuery: (
      data: PostApiSystemOperationLogQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemOperationLogQueryData, any>({
        path: `/api/system/operation-log/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个权限
     *
     * @tags system, permission
     * @name PostApiSystemPermission
     * @summary 创建权限
     * @request POST:/api/system/permission
     * @response `200` `PostApiSystemPermissionData` Response for status 200
     */
    postApiSystemPermission: (
      data: PostApiSystemPermissionPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemPermissionData, any>({
        path: `/api/system/permission`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询权限列表
     *
     * @tags system, permission
     * @name PostApiSystemPermissionQuery
     * @summary 分页查询权限
     * @request POST:/api/system/permission/query
     * @response `200` `PostApiSystemPermissionQueryData` Response for status 200
     */
    postApiSystemPermissionQuery: (
      data: PostApiSystemPermissionQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemPermissionQueryData, any>({
        path: `/api/system/permission/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个岗位
     *
     * @tags system, post
     * @name PostApiSystemPost
     * @summary 创建岗位
     * @request POST:/api/system/post
     * @response `200` `PostApiSystemPostData` Response for status 200
     */
    postApiSystemPost: (
      data: PostApiSystemPostPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemPostData, any>({
        path: `/api/system/post`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个岗位
     *
     * @tags system, post
     * @name PostApiSystemPostBatch
     * @summary 批量创建岗位
     * @request POST:/api/system/post/batch
     * @response `200` `PostApiSystemPostBatchData` Response for status 200
     */
    postApiSystemPostBatch: (
      data: PostApiSystemPostBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemPostBatchData, any>({
        path: `/api/system/post/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询岗位列表
     *
     * @tags system, post
     * @name PostApiSystemPostQuery
     * @summary 分页查询岗位
     * @request POST:/api/system/post/query
     * @response `200` `PostApiSystemPostQueryData` Response for status 200
     */
    postApiSystemPostQuery: (
      data: PostApiSystemPostQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemPostQueryData, any>({
        path: `/api/system/post/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个角色
     *
     * @tags system, role
     * @name PostApiSystemRole
     * @summary 创建角色
     * @request POST:/api/system/role
     * @response `200` `PostApiSystemRoleData` Response for status 200
     */
    postApiSystemRole: (
      data: PostApiSystemRolePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemRoleData, any>({
        path: `/api/system/role`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个角色
     *
     * @tags system, role
     * @name PostApiSystemRoleBatch
     * @summary 批量创建角色
     * @request POST:/api/system/role/batch
     * @response `200` `PostApiSystemRoleBatchData` Response for status 200
     */
    postApiSystemRoleBatch: (
      data: PostApiSystemRoleBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemRoleBatchData, any>({
        path: `/api/system/role/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个角色部门关联
     *
     * @tags system, roleDepartment
     * @name PostApiSystemRoleDepartment
     * @summary 创建角色部门关联
     * @request POST:/api/system/role-department
     * @response `200` `PostApiSystemRoleDepartmentData` Response for status 200
     */
    postApiSystemRoleDepartment: (
      data: PostApiSystemRoleDepartmentPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemRoleDepartmentData, any>({
        path: `/api/system/role-department`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个角色部门关联
     *
     * @tags system, roleDepartment
     * @name PostApiSystemRoleDepartmentBatch
     * @summary 批量创建角色部门关联
     * @request POST:/api/system/role-department/batch
     * @response `200` `PostApiSystemRoleDepartmentBatchData` Response for status 200
     */
    postApiSystemRoleDepartmentBatch: (
      data: PostApiSystemRoleDepartmentBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemRoleDepartmentBatchData, any>({
        path: `/api/system/role-department/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询角色部门关联列表
     *
     * @tags system, roleDepartment
     * @name PostApiSystemRoleDepartmentQuery
     * @summary 分页查询角色部门关联
     * @request POST:/api/system/role-department/query
     * @response `200` `PostApiSystemRoleDepartmentQueryData` Response for status 200
     */
    postApiSystemRoleDepartmentQuery: (
      data: PostApiSystemRoleDepartmentQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemRoleDepartmentQueryData, any>({
        path: `/api/system/role-department/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个角色菜单关联
     *
     * @tags system, roleMenu
     * @name PostApiSystemRoleMenu
     * @summary 创建角色菜单关联
     * @request POST:/api/system/role-menu
     * @response `200` `PostApiSystemRoleMenuData` Response for status 200
     */
    postApiSystemRoleMenu: (
      data: PostApiSystemRoleMenuPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemRoleMenuData, any>({
        path: `/api/system/role-menu`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个角色菜单关联
     *
     * @tags system, roleMenu
     * @name PostApiSystemRoleMenuBatch
     * @summary 批量创建角色菜单关联
     * @request POST:/api/system/role-menu/batch
     * @response `200` `PostApiSystemRoleMenuBatchData` Response for status 200
     */
    postApiSystemRoleMenuBatch: (
      data: PostApiSystemRoleMenuBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemRoleMenuBatchData, any>({
        path: `/api/system/role-menu/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询角色菜单关联列表
     *
     * @tags system, roleMenu
     * @name PostApiSystemRoleMenuQuery
     * @summary 分页查询角色菜单关联
     * @request POST:/api/system/role-menu/query
     * @response `200` `PostApiSystemRoleMenuQueryData` Response for status 200
     */
    postApiSystemRoleMenuQuery: (
      data: PostApiSystemRoleMenuQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemRoleMenuQueryData, any>({
        path: `/api/system/role-menu/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询角色列表，自动排除已删除数据
     *
     * @tags system, role
     * @name PostApiSystemRoleQuery
     * @summary 分页查询角色
     * @request POST:/api/system/role/query
     * @response `200` `PostApiSystemRoleQueryData` Response for status 200
     */
    postApiSystemRoleQuery: (
      data: PostApiSystemRoleQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemRoleQueryData, any>({
        path: `/api/system/role/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个令牌
     *
     * @tags system, token
     * @name PostApiSystemToken
     * @summary 创建令牌
     * @request POST:/api/system/token
     * @response `200` `PostApiSystemTokenData` Response for status 200
     */
    postApiSystemToken: (
      data: PostApiSystemTokenPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemTokenData, any>({
        path: `/api/system/token`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询令牌列表
     *
     * @tags system, token
     * @name PostApiSystemTokenQuery
     * @summary 分页查询令牌
     * @request POST:/api/system/token/query
     * @response `200` `PostApiSystemTokenQueryData` Response for status 200
     */
    postApiSystemTokenQuery: (
      data: PostApiSystemTokenQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemTokenQueryData, any>({
        path: `/api/system/token/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个用户
     *
     * @tags system, user
     * @name PostApiSystemUser
     * @summary 创建用户
     * @request POST:/api/system/user
     * @response `200` `PostApiSystemUserData` Response for status 200
     */
    postApiSystemUser: (params: RequestParams = {}) =>
      this.http.request<PostApiSystemUserData, any>({
        path: `/api/system/user`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个用户
     *
     * @tags system, user
     * @name PostApiSystemUserBatch
     * @summary 批量创建用户
     * @request POST:/api/system/user/batch
     * @response `200` `PostApiSystemUserBatchData` Response for status 200
     */
    postApiSystemUserBatch: (params: RequestParams = {}) =>
      this.http.request<PostApiSystemUserBatchData, any>({
        path: `/api/system/user/batch`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 重置用户密码为初始密码
     *
     * @tags system, user
     * @name PostApiSystemUserByIdResetPassword
     * @summary 重置密码
     * @request POST:/api/system/user/{id}/reset-password
     * @response `200` `PostApiSystemUserByIdResetPasswordData` Response for status 200
     */
    postApiSystemUserByIdResetPassword: (
      { id, ...query }: PostApiSystemUserByIdResetPasswordParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemUserByIdResetPasswordData, any>({
        path: `/api/system/user/${id}/reset-password`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个用户岗位关联
     *
     * @tags system, userPost
     * @name PostApiSystemUserPost
     * @summary 创建用户岗位关联
     * @request POST:/api/system/user-post
     * @response `200` `PostApiSystemUserPostData` Response for status 200
     */
    postApiSystemUserPost: (
      data: PostApiSystemUserPostPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemUserPostData, any>({
        path: `/api/system/user-post`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个用户岗位关联
     *
     * @tags system, userPost
     * @name PostApiSystemUserPostBatch
     * @summary 批量创建用户岗位关联
     * @request POST:/api/system/user-post/batch
     * @response `200` `PostApiSystemUserPostBatchData` Response for status 200
     */
    postApiSystemUserPostBatch: (
      data: PostApiSystemUserPostBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemUserPostBatchData, any>({
        path: `/api/system/user-post/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询用户岗位关联列表
     *
     * @tags system, userPost
     * @name PostApiSystemUserPostQuery
     * @summary 分页查询用户岗位关联
     * @request POST:/api/system/user-post/query
     * @response `200` `PostApiSystemUserPostQueryData` Response for status 200
     */
    postApiSystemUserPostQuery: (
      data: PostApiSystemUserPostQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemUserPostQueryData, any>({
        path: `/api/system/user-post/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询用户列表
     *
     * @tags system, user
     * @name PostApiSystemUserQuery
     * @summary 分页查询用户
     * @request POST:/api/system/user/query
     * @response `200` `PostApiSystemUserQueryData` Response for status 200
     */
    postApiSystemUserQuery: (
      data: PostApiSystemUserQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemUserQueryData, any>({
        path: `/api/system/user/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个用户角色关联
     *
     * @tags system, userRole
     * @name PostApiSystemUserRole
     * @summary 创建用户角色关联
     * @request POST:/api/system/user-role
     * @response `200` `PostApiSystemUserRoleData` Response for status 200
     */
    postApiSystemUserRole: (
      data: PostApiSystemUserRolePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemUserRoleData, any>({
        path: `/api/system/user-role`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个用户角色关联
     *
     * @tags system, userRole
     * @name PostApiSystemUserRoleBatch
     * @summary 批量创建用户角色关联
     * @request POST:/api/system/user-role/batch
     * @response `200` `PostApiSystemUserRoleBatchData` Response for status 200
     */
    postApiSystemUserRoleBatch: (
      data: PostApiSystemUserRoleBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemUserRoleBatchData, any>({
        path: `/api/system/user-role/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询用户角色关联列表
     *
     * @tags system, userRole
     * @name PostApiSystemUserRoleQuery
     * @summary 分页查询用户角色关联
     * @request POST:/api/system/user-role/query
     * @response `200` `PostApiSystemUserRoleQueryData` Response for status 200
     */
    postApiSystemUserRoleQuery: (
      data: PostApiSystemUserRoleQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemUserRoleQueryData, any>({
        path: `/api/system/user-role/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 设置指定角色的权限列表（全量替换）
     *
     * @tags system, casbinRule
     * @name PutApiSystemCasbinRuleRoleByRoleKeyPermissions
     * @summary 设置角色权限
     * @request PUT:/api/system/casbin-rule/role/{roleKey}/permissions
     * @response `200` `PutApiSystemCasbinRuleRoleByRoleKeyPermissionsData` Response for status 200
     */
    putApiSystemCasbinRuleRoleByRoleKeyPermissions: (
      {
        roleKey,
        ...query
      }: PutApiSystemCasbinRuleRoleByRoleKeyPermissionsParams,
      data: PutApiSystemCasbinRuleRoleByRoleKeyPermissionsPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PutApiSystemCasbinRuleRoleByRoleKeyPermissionsData,
        any
      >({
        path: `/api/system/casbin-rule/role/${roleKey}/permissions`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 设置指定用户的角色列表（全量替换）
     *
     * @tags system, casbinRule
     * @name PutApiSystemCasbinRuleUserByUserIdRoles
     * @summary 设置用户角色
     * @request PUT:/api/system/casbin-rule/user/{userId}/roles
     * @response `200` `PutApiSystemCasbinRuleUserByUserIdRolesData` Response for status 200
     */
    putApiSystemCasbinRuleUserByUserIdRoles: (
      { userId, ...query }: PutApiSystemCasbinRuleUserByUserIdRolesParams,
      data: PutApiSystemCasbinRuleUserByUserIdRolesPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemCasbinRuleUserByUserIdRolesData, any>({
        path: `/api/system/casbin-rule/user/${userId}/roles`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新配置
     *
     * @tags system, config
     * @name PutApiSystemConfigBatch
     * @summary 批量更新配置
     * @request PUT:/api/system/config/batch
     * @response `200` `PutApiSystemConfigBatchData` Response for status 200
     */
    putApiSystemConfigBatch: (
      data: PutApiSystemConfigBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemConfigBatchData, any>({
        path: `/api/system/config/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个配置
     *
     * @tags system, config
     * @name PutApiSystemConfigById
     * @summary 更新配置
     * @request PUT:/api/system/config/{id}
     * @response `200` `PutApiSystemConfigByIdData` Response for status 200
     */
    putApiSystemConfigById: (
      { id, ...query }: PutApiSystemConfigByIdParams,
      data: PutApiSystemConfigByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemConfigByIdData, any>({
        path: `/api/system/config/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新部门
     *
     * @tags system, department
     * @name PutApiSystemDepartmentBatch
     * @summary 批量更新部门
     * @request PUT:/api/system/department/batch
     * @response `200` `PutApiSystemDepartmentBatchData` Response for status 200
     */
    putApiSystemDepartmentBatch: (
      data: PutApiSystemDepartmentBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemDepartmentBatchData, any>({
        path: `/api/system/department/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个部门
     *
     * @tags system, department
     * @name PutApiSystemDepartmentById
     * @summary 更新部门
     * @request PUT:/api/system/department/{id}
     * @response `200` `PutApiSystemDepartmentByIdData` Response for status 200
     */
    putApiSystemDepartmentById: (
      { id, ...query }: PutApiSystemDepartmentByIdParams,
      data: PutApiSystemDepartmentByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemDepartmentByIdData, any>({
        path: `/api/system/department/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新字典
     *
     * @tags system, dict
     * @name PutApiSystemDictBatch
     * @summary 批量更新字典
     * @request PUT:/api/system/dict/batch
     * @response `200` `PutApiSystemDictBatchData` Response for status 200
     */
    putApiSystemDictBatch: (
      data: PutApiSystemDictBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemDictBatchData, any>({
        path: `/api/system/dict/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个字典
     *
     * @tags system, dict
     * @name PutApiSystemDictById
     * @summary 更新字典
     * @request PUT:/api/system/dict/{id}
     * @response `200` `PutApiSystemDictByIdData` Response for status 200
     */
    putApiSystemDictById: (
      { id, ...query }: PutApiSystemDictByIdParams,
      data: PutApiSystemDictByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemDictByIdData, any>({
        path: `/api/system/dict/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据Key列表批量更新字典组
     *
     * @tags system, dictGroup
     * @name PutApiSystemDictGroupBatch
     * @summary 批量更新字典组
     * @request PUT:/api/system/dict-group/batch
     * @response `200` `PutApiSystemDictGroupBatchData` Response for status 200
     */
    putApiSystemDictGroupBatch: (
      data: PutApiSystemDictGroupBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemDictGroupBatchData, any>({
        path: `/api/system/dict-group/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据Key更新单个字典组
     *
     * @tags system, dictGroup
     * @name PutApiSystemDictGroupByKey
     * @summary 更新字典组
     * @request PUT:/api/system/dict-group/{key}
     * @response `200` `PutApiSystemDictGroupByKeyData` Response for status 200
     */
    putApiSystemDictGroupByKey: (
      { key, ...query }: PutApiSystemDictGroupByKeyParams,
      data: PutApiSystemDictGroupByKeyPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemDictGroupByKeyData, any>({
        path: `/api/system/dict-group/${key}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新定时任务
     *
     * @tags system, job
     * @name PutApiSystemJobBatch
     * @summary 批量更新定时任务
     * @request PUT:/api/system/job/batch
     * @response `200` `PutApiSystemJobBatchData` Response for status 200
     */
    putApiSystemJobBatch: (params: RequestParams = {}) =>
      this.http.request<PutApiSystemJobBatchData, any>({
        path: `/api/system/job/batch`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个定时任务
     *
     * @tags system, job
     * @name PutApiSystemJobById
     * @summary 更新定时任务
     * @request PUT:/api/system/job/{id}
     * @response `200` `PutApiSystemJobByIdData` Response for status 200
     */
    putApiSystemJobById: (
      { id, ...query }: PutApiSystemJobByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemJobByIdData, any>({
        path: `/api/system/job/${id}`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新任务日志
     *
     * @tags system, jobLog
     * @name PutApiSystemJobLogBatch
     * @summary 批量更新任务日志
     * @request PUT:/api/system/job-log/batch
     * @response `200` `PutApiSystemJobLogBatchData` Response for status 200
     */
    putApiSystemJobLogBatch: (params: RequestParams = {}) =>
      this.http.request<PutApiSystemJobLogBatchData, any>({
        path: `/api/system/job-log/batch`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个任务日志
     *
     * @tags system, jobLog
     * @name PutApiSystemJobLogById
     * @summary 更新任务日志
     * @request PUT:/api/system/job-log/{id}
     * @response `200` `PutApiSystemJobLogByIdData` Response for status 200
     */
    putApiSystemJobLogById: (
      { id, ...query }: PutApiSystemJobLogByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemJobLogByIdData, any>({
        path: `/api/system/job-log/${id}`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新菜单
     *
     * @tags system, menu
     * @name PutApiSystemMenuBatch
     * @summary 批量更新菜单
     * @request PUT:/api/system/menu/batch
     * @response `200` `PutApiSystemMenuBatchData` Response for status 200
     */
    putApiSystemMenuBatch: (
      data: PutApiSystemMenuBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemMenuBatchData, any>({
        path: `/api/system/menu/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个菜单
     *
     * @tags system, menu
     * @name PutApiSystemMenuById
     * @summary 更新菜单
     * @request PUT:/api/system/menu/{id}
     * @response `200` `PutApiSystemMenuByIdData` Response for status 200
     */
    putApiSystemMenuById: (
      { id, ...query }: PutApiSystemMenuByIdParams,
      data: PutApiSystemMenuByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemMenuByIdData, any>({
        path: `/api/system/menu/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新通知
     *
     * @tags system, notice
     * @name PutApiSystemNoticeBatch
     * @summary 批量更新通知
     * @request PUT:/api/system/notice/batch
     * @response `200` `PutApiSystemNoticeBatchData` Response for status 200
     */
    putApiSystemNoticeBatch: (
      data: PutApiSystemNoticeBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemNoticeBatchData, any>({
        path: `/api/system/notice/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个通知
     *
     * @tags system, notice
     * @name PutApiSystemNoticeById
     * @summary 更新通知
     * @request PUT:/api/system/notice/{id}
     * @response `200` `PutApiSystemNoticeByIdData` Response for status 200
     */
    putApiSystemNoticeById: (
      { id, ...query }: PutApiSystemNoticeByIdParams,
      data: PutApiSystemNoticeByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemNoticeByIdData, any>({
        path: `/api/system/notice/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个权限
     *
     * @tags system, permission
     * @name PutApiSystemPermissionById
     * @summary 更新权限
     * @request PUT:/api/system/permission/{id}
     * @response `200` `PutApiSystemPermissionByIdData` Response for status 200
     */
    putApiSystemPermissionById: (
      { id, ...query }: PutApiSystemPermissionByIdParams,
      data: PutApiSystemPermissionByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemPermissionByIdData, any>({
        path: `/api/system/permission/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新岗位
     *
     * @tags system, post
     * @name PutApiSystemPostBatch
     * @summary 批量更新岗位
     * @request PUT:/api/system/post/batch
     * @response `200` `PutApiSystemPostBatchData` Response for status 200
     */
    putApiSystemPostBatch: (
      data: PutApiSystemPostBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemPostBatchData, any>({
        path: `/api/system/post/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个岗位
     *
     * @tags system, post
     * @name PutApiSystemPostById
     * @summary 更新岗位
     * @request PUT:/api/system/post/{id}
     * @response `200` `PutApiSystemPostByIdData` Response for status 200
     */
    putApiSystemPostById: (
      { id, ...query }: PutApiSystemPostByIdParams,
      data: PutApiSystemPostByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemPostByIdData, any>({
        path: `/api/system/post/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新角色
     *
     * @tags system, role
     * @name PutApiSystemRoleBatch
     * @summary 批量更新角色
     * @request PUT:/api/system/role/batch
     * @response `200` `PutApiSystemRoleBatchData` Response for status 200
     */
    putApiSystemRoleBatch: (
      data: PutApiSystemRoleBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemRoleBatchData, any>({
        path: `/api/system/role/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个角色
     *
     * @tags system, role
     * @name PutApiSystemRoleById
     * @summary 更新角色
     * @request PUT:/api/system/role/{id}
     * @response `200` `PutApiSystemRoleByIdData` Response for status 200
     */
    putApiSystemRoleById: (
      { id, ...query }: PutApiSystemRoleByIdParams,
      data: PutApiSystemRoleByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemRoleByIdData, any>({
        path: `/api/system/role/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 设置指定角色的菜单列表（全量替换）
     *
     * @tags system, roleMenu
     * @name PutApiSystemRoleMenuRoleByRoleId
     * @summary 设置角色菜单
     * @request PUT:/api/system/role-menu/role/{roleId}
     * @response `200` `PutApiSystemRoleMenuRoleByRoleIdData` Response for status 200
     */
    putApiSystemRoleMenuRoleByRoleId: (
      { roleId, ...query }: PutApiSystemRoleMenuRoleByRoleIdParams,
      data: PutApiSystemRoleMenuRoleByRoleIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemRoleMenuRoleByRoleIdData, any>({
        path: `/api/system/role-menu/role/${roleId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个令牌
     *
     * @tags system, token
     * @name PutApiSystemTokenById
     * @summary 更新令牌
     * @request PUT:/api/system/token/{id}
     * @response `200` `PutApiSystemTokenByIdData` Response for status 200
     */
    putApiSystemTokenById: (
      { id, ...query }: PutApiSystemTokenByIdParams,
      data: PutApiSystemTokenByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemTokenByIdData, any>({
        path: `/api/system/token/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新用户
     *
     * @tags system, user
     * @name PutApiSystemUserBatch
     * @summary 批量更新用户
     * @request PUT:/api/system/user/batch
     * @response `200` `PutApiSystemUserBatchData` Response for status 200
     */
    putApiSystemUserBatch: (params: RequestParams = {}) =>
      this.http.request<PutApiSystemUserBatchData, any>({
        path: `/api/system/user/batch`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个用户
     *
     * @tags system, user
     * @name PutApiSystemUserById
     * @summary 更新用户
     * @request PUT:/api/system/user/{id}
     * @response `200` `PutApiSystemUserByIdData` Response for status 200
     */
    putApiSystemUserById: (
      { id, ...query }: PutApiSystemUserByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemUserByIdData, any>({
        path: `/api/system/user/${id}`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * @description 设置指定用户的角色列表（全量替换）
     *
     * @tags system, userRole
     * @name PutApiSystemUserRoleUserByUserId
     * @summary 设置用户角色
     * @request PUT:/api/system/user-role/user/{userId}
     * @response `200` `PutApiSystemUserRoleUserByUserIdData` Response for status 200
     */
    putApiSystemUserRoleUserByUserId: (
      { userId, ...query }: PutApiSystemUserRoleUserByUserIdParams,
      data: PutApiSystemUserRoleUserByUserIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemUserRoleUserByUserIdData, any>({
        path: `/api/system/user-role/user/${userId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  knowledge = {
    /**
     * @description 取消收藏文件或文件夹
     *
     * @tags knowledge, favorite
     * @name DeleteApiKnowledgeFavoriteByResourceTypeByResourceId
     * @summary 取消收藏
     * @request DELETE:/api/knowledge/favorite/{resourceType}/{resourceId}
     * @response `200` `DeleteApiKnowledgeFavoriteByResourceTypeByResourceIdData` Response for status 200
     */
    deleteApiKnowledgeFavoriteByResourceTypeByResourceId: (
      {
        resourceType,
        resourceId,
        ...query
      }: DeleteApiKnowledgeFavoriteByResourceTypeByResourceIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        DeleteApiKnowledgeFavoriteByResourceTypeByResourceIdData,
        any
      >({
        path: `/api/knowledge/favorite/${resourceType}/${resourceId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID软删除文件
     *
     * @tags knowledge, file
     * @name DeleteApiKnowledgeFileById
     * @summary 删除文件
     * @request DELETE:/api/knowledge/file/{id}
     * @response `200` `DeleteApiKnowledgeFileByIdData` Response for status 200
     */
    deleteApiKnowledgeFileById: (
      { id, ...query }: DeleteApiKnowledgeFileByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiKnowledgeFileByIdData, any>({
        path: `/api/knowledge/file/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID硬删除文件版本
     *
     * @tags knowledge, fileVersion
     * @name DeleteApiKnowledgeFileVersionById
     * @summary 删除文件版本
     * @request DELETE:/api/knowledge/file-version/{id}
     * @response `200` `DeleteApiKnowledgeFileVersionByIdData` Response for status 200
     */
    deleteApiKnowledgeFileVersionById: (
      { id, ...query }: DeleteApiKnowledgeFileVersionByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiKnowledgeFileVersionByIdData, any>({
        path: `/api/knowledge/file-version/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID软删除文件夹
     *
     * @tags knowledge, folder
     * @name DeleteApiKnowledgeFolderById
     * @summary 删除文件夹
     * @request DELETE:/api/knowledge/folder/{id}
     * @response `200` `DeleteApiKnowledgeFolderByIdData` Response for status 200
     */
    deleteApiKnowledgeFolderById: (
      { id, ...query }: DeleteApiKnowledgeFolderByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiKnowledgeFolderByIdData, any>({
        path: `/api/knowledge/folder/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 检查资源是否已被收藏
     *
     * @tags knowledge, favorite
     * @name GetApiKnowledgeFavoriteCheckByResourceTypeByResourceId
     * @summary 检查收藏状态
     * @request GET:/api/knowledge/favorite/check/{resourceType}/{resourceId}
     * @response `200` `GetApiKnowledgeFavoriteCheckByResourceTypeByResourceIdData` Response for status 200
     */
    getApiKnowledgeFavoriteCheckByResourceTypeByResourceId: (
      {
        resourceType,
        resourceId,
        ...query
      }: GetApiKnowledgeFavoriteCheckByResourceTypeByResourceIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        GetApiKnowledgeFavoriteCheckByResourceTypeByResourceIdData,
        any
      >({
        path: `/api/knowledge/favorite/check/${resourceType}/${resourceId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个文件（需要权限）
     *
     * @tags knowledge, file
     * @name GetApiKnowledgeFileById
     * @summary 根据ID查询文件
     * @request GET:/api/knowledge/file/{id}
     * @response `200` `GetApiKnowledgeFileByIdData` Response for status 200
     */
    getApiKnowledgeFileById: (
      { id, ...query }: GetApiKnowledgeFileByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiKnowledgeFileByIdData, any>({
        path: `/api/knowledge/file/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取文件表的JSON Schema
     *
     * @tags knowledge, file
     * @name GetApiKnowledgeFileSchema
     * @summary 获取文件Schema
     * @request GET:/api/knowledge/file/schema
     * @response `200` `GetApiKnowledgeFileSchemaData` Response for status 200
     */
    getApiKnowledgeFileSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiKnowledgeFileSchemaData, any>({
        path: `/api/knowledge/file/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个文件版本
     *
     * @tags knowledge, fileVersion
     * @name GetApiKnowledgeFileVersionById
     * @summary 根据ID查询文件版本
     * @request GET:/api/knowledge/file-version/{id}
     * @response `200` `GetApiKnowledgeFileVersionByIdData` Response for status 200
     */
    getApiKnowledgeFileVersionById: (
      { id, ...query }: GetApiKnowledgeFileVersionByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiKnowledgeFileVersionByIdData, any>({
        path: `/api/knowledge/file-version/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取文件版本表的JSON Schema
     *
     * @tags knowledge, fileVersion
     * @name GetApiKnowledgeFileVersionSchema
     * @summary 获取文件版本Schema
     * @request GET:/api/knowledge/file-version/schema
     * @response `200` `GetApiKnowledgeFileVersionSchemaData` Response for status 200
     */
    getApiKnowledgeFileVersionSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiKnowledgeFileVersionSchemaData, any>({
        path: `/api/knowledge/file-version/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个文件夹
     *
     * @tags knowledge, folder
     * @name GetApiKnowledgeFolderById
     * @summary 根据ID查询文件夹
     * @request GET:/api/knowledge/folder/{id}
     * @response `200` `GetApiKnowledgeFolderByIdData` Response for status 200
     */
    getApiKnowledgeFolderById: (
      { id, ...query }: GetApiKnowledgeFolderByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiKnowledgeFolderByIdData, any>({
        path: `/api/knowledge/folder/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取文件夹表的JSON Schema
     *
     * @tags knowledge, folder
     * @name GetApiKnowledgeFolderSchema
     * @summary 获取文件夹Schema
     * @request GET:/api/knowledge/folder/schema
     * @response `200` `GetApiKnowledgeFolderSchemaData` Response for status 200
     */
    getApiKnowledgeFolderSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiKnowledgeFolderSchemaData, any>({
        path: `/api/knowledge/folder/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 收藏文件或文件夹
     *
     * @tags knowledge, favorite
     * @name PostApiKnowledgeFavorite
     * @summary 添加收藏
     * @request POST:/api/knowledge/favorite
     * @response `200` `PostApiKnowledgeFavoriteData` Response for status 200
     */
    postApiKnowledgeFavorite: (
      data: PostApiKnowledgeFavoritePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFavoriteData, any>({
        path: `/api/knowledge/favorite`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量检查多个资源是否已被收藏
     *
     * @tags knowledge, favorite
     * @name PostApiKnowledgeFavoriteCheckBatch
     * @summary 批量检查收藏状态
     * @request POST:/api/knowledge/favorite/check-batch
     * @response `200` `PostApiKnowledgeFavoriteCheckBatchData` Response for status 200
     */
    postApiKnowledgeFavoriteCheckBatch: (
      data: PostApiKnowledgeFavoriteCheckBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFavoriteCheckBatchData, any>({
        path: `/api/knowledge/favorite/check-batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取当前用户的收藏列表
     *
     * @tags knowledge, favorite
     * @name PostApiKnowledgeFavoriteList
     * @summary 获取收藏列表
     * @request POST:/api/knowledge/favorite/list
     * @response `200` `PostApiKnowledgeFavoriteListData` Response for status 200
     */
    postApiKnowledgeFavoriteList: (
      data: PostApiKnowledgeFavoriteListPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFavoriteListData, any>({
        path: `/api/knowledge/favorite/list`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个文件记录
     *
     * @tags knowledge, file
     * @name PostApiKnowledgeFile
     * @summary 创建文件
     * @request POST:/api/knowledge/file
     * @response `200` `PostApiKnowledgeFileData` Response for status 200
     */
    postApiKnowledgeFile: (
      data: PostApiKnowledgeFilePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFileData, any>({
        path: `/api/knowledge/file`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个文件记录
     *
     * @tags knowledge, file
     * @name PostApiKnowledgeFileBatch
     * @summary 批量创建文件
     * @request POST:/api/knowledge/file/batch
     * @response `200` `PostApiKnowledgeFileBatchData` Response for status 200
     */
    postApiKnowledgeFileBatch: (
      data: PostApiKnowledgeFileBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFileBatchData, any>({
        path: `/api/knowledge/file/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询文件列表，自动排除已删除数据，自动筛选当前用户的文件
     *
     * @tags knowledge, file
     * @name PostApiKnowledgeFileQuery
     * @summary 分页查询文件
     * @request POST:/api/knowledge/file/query
     * @response `200` `PostApiKnowledgeFileQueryData` Response for status 200
     */
    postApiKnowledgeFileQuery: (
      data: PostApiKnowledgeFileQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFileQueryData, any>({
        path: `/api/knowledge/file/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个文件版本
     *
     * @tags knowledge, fileVersion
     * @name PostApiKnowledgeFileVersion
     * @summary 创建文件版本
     * @request POST:/api/knowledge/file-version
     * @response `200` `PostApiKnowledgeFileVersionData` Response for status 200
     */
    postApiKnowledgeFileVersion: (
      data: PostApiKnowledgeFileVersionPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFileVersionData, any>({
        path: `/api/knowledge/file-version`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个文件版本
     *
     * @tags knowledge, fileVersion
     * @name PostApiKnowledgeFileVersionBatch
     * @summary 批量创建文件版本
     * @request POST:/api/knowledge/file-version/batch
     * @response `200` `PostApiKnowledgeFileVersionBatchData` Response for status 200
     */
    postApiKnowledgeFileVersionBatch: (
      data: PostApiKnowledgeFileVersionBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFileVersionBatchData, any>({
        path: `/api/knowledge/file-version/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询文件版本列表
     *
     * @tags knowledge, fileVersion
     * @name PostApiKnowledgeFileVersionQuery
     * @summary 分页查询文件版本
     * @request POST:/api/knowledge/file-version/query
     * @response `200` `PostApiKnowledgeFileVersionQueryData` Response for status 200
     */
    postApiKnowledgeFileVersionQuery: (
      data: PostApiKnowledgeFileVersionQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFileVersionQueryData, any>({
        path: `/api/knowledge/file-version/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个文件夹
     *
     * @tags knowledge, folder
     * @name PostApiKnowledgeFolder
     * @summary 创建文件夹
     * @request POST:/api/knowledge/folder
     * @response `200` `PostApiKnowledgeFolderData` Response for status 200
     */
    postApiKnowledgeFolder: (
      data: PostApiKnowledgeFolderPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFolderData, any>({
        path: `/api/knowledge/folder`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个文件夹
     *
     * @tags knowledge, folder
     * @name PostApiKnowledgeFolderBatch
     * @summary 批量创建文件夹
     * @request POST:/api/knowledge/folder/batch
     * @response `200` `PostApiKnowledgeFolderBatchData` Response for status 200
     */
    postApiKnowledgeFolderBatch: (
      data: PostApiKnowledgeFolderBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFolderBatchData, any>({
        path: `/api/knowledge/folder/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询文件夹列表，自动排除已删除数据，自动筛选当前用户的文件夹
     *
     * @tags knowledge, folder
     * @name PostApiKnowledgeFolderQuery
     * @summary 分页查询文件夹
     * @request POST:/api/knowledge/folder/query
     * @response `200` `PostApiKnowledgeFolderQueryData` Response for status 200
     */
    postApiKnowledgeFolderQuery: (
      data: PostApiKnowledgeFolderQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFolderQueryData, any>({
        path: `/api/knowledge/folder/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新文件
     *
     * @tags knowledge, file
     * @name PutApiKnowledgeFileBatch
     * @summary 批量更新文件
     * @request PUT:/api/knowledge/file/batch
     * @response `200` `PutApiKnowledgeFileBatchData` Response for status 200
     */
    putApiKnowledgeFileBatch: (
      data: PutApiKnowledgeFileBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiKnowledgeFileBatchData, any>({
        path: `/api/knowledge/file/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个文件
     *
     * @tags knowledge, file
     * @name PutApiKnowledgeFileById
     * @summary 更新文件
     * @request PUT:/api/knowledge/file/{id}
     * @response `200` `PutApiKnowledgeFileByIdData` Response for status 200
     */
    putApiKnowledgeFileById: (
      { id, ...query }: PutApiKnowledgeFileByIdParams,
      data: PutApiKnowledgeFileByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiKnowledgeFileByIdData, any>({
        path: `/api/knowledge/file/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新文件版本
     *
     * @tags knowledge, fileVersion
     * @name PutApiKnowledgeFileVersionBatch
     * @summary 批量更新文件版本
     * @request PUT:/api/knowledge/file-version/batch
     * @response `200` `PutApiKnowledgeFileVersionBatchData` Response for status 200
     */
    putApiKnowledgeFileVersionBatch: (
      data: PutApiKnowledgeFileVersionBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiKnowledgeFileVersionBatchData, any>({
        path: `/api/knowledge/file-version/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个文件版本
     *
     * @tags knowledge, fileVersion
     * @name PutApiKnowledgeFileVersionById
     * @summary 更新文件版本
     * @request PUT:/api/knowledge/file-version/{id}
     * @response `200` `PutApiKnowledgeFileVersionByIdData` Response for status 200
     */
    putApiKnowledgeFileVersionById: (
      { id, ...query }: PutApiKnowledgeFileVersionByIdParams,
      data: PutApiKnowledgeFileVersionByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiKnowledgeFileVersionByIdData, any>({
        path: `/api/knowledge/file-version/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID列表批量更新文件夹
     *
     * @tags knowledge, folder
     * @name PutApiKnowledgeFolderBatch
     * @summary 批量更新文件夹
     * @request PUT:/api/knowledge/folder/batch
     * @response `200` `PutApiKnowledgeFolderBatchData` Response for status 200
     */
    putApiKnowledgeFolderBatch: (
      data: PutApiKnowledgeFolderBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiKnowledgeFolderBatchData, any>({
        path: `/api/knowledge/folder/batch`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个文件夹
     *
     * @tags knowledge, folder
     * @name PutApiKnowledgeFolderById
     * @summary 更新文件夹
     * @request PUT:/api/knowledge/folder/{id}
     * @response `200` `PutApiKnowledgeFolderByIdData` Response for status 200
     */
    putApiKnowledgeFolderById: (
      { id, ...query }: PutApiKnowledgeFolderByIdParams,
      data: PutApiKnowledgeFolderByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiKnowledgeFolderByIdData, any>({
        path: `/api/knowledge/folder/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  im = {
    /**
     * @description 根据ID软删除会话
     *
     * @tags im, conversation
     * @name DeleteApiImConversationById
     * @summary 删除会话
     * @request DELETE:/api/im/conversation/{id}
     * @response `200` `DeleteApiImConversationByIdData` Response for status 200
     */
    deleteApiImConversationById: (
      { id, ...query }: DeleteApiImConversationByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiImConversationByIdData, any>({
        path: `/api/im/conversation/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 移除群成员
     *
     * @tags im, groupMember
     * @name DeleteApiImGroupMemberByConversationIdByUserId
     * @summary 移除群成员
     * @request DELETE:/api/im/group-member/{conversationId}/{userId}
     * @response `200` `DeleteApiImGroupMemberByConversationIdByUserIdData` Response for status 200
     */
    deleteApiImGroupMemberByConversationIdByUserId: (
      {
        conversationId,
        userId,
        ...query
      }: DeleteApiImGroupMemberByConversationIdByUserIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        DeleteApiImGroupMemberByConversationIdByUserIdData,
        any
      >({
        path: `/api/im/group-member/${conversationId}/${userId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID删除临时文件
     *
     * @tags im, tempFile
     * @name DeleteApiImTempFileById
     * @summary 删除临时文件
     * @request DELETE:/api/im/temp-file/{id}
     * @response `200` `DeleteApiImTempFileByIdData` Response for status 200
     */
    deleteApiImTempFileById: (
      { id, ...query }: DeleteApiImTempFileByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiImTempFileByIdData, any>({
        path: `/api/im/temp-file/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 清理所有过期的临时文件
     *
     * @tags im, tempFile
     * @name DeleteApiImTempFileCleanExpired
     * @summary 清理过期文件
     * @request DELETE:/api/im/temp-file/clean-expired
     * @response `200` `DeleteApiImTempFileCleanExpiredData` Response for status 200
     */
    deleteApiImTempFileCleanExpired: (params: RequestParams = {}) =>
      this.http.request<DeleteApiImTempFileCleanExpiredData, any>({
        path: `/api/im/temp-file/clean-expired`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个会话
     *
     * @tags im, conversation
     * @name GetApiImConversationById
     * @summary 根据ID查询会话
     * @request GET:/api/im/conversation/{id}
     * @response `200` `GetApiImConversationByIdData` Response for status 200
     */
    getApiImConversationById: (
      { id, ...query }: GetApiImConversationByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiImConversationByIdData, any>({
        path: `/api/im/conversation/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取当前用户所有会话中的文件列表
     *
     * @tags im, conversation
     * @name GetApiImConversationFiles
     * @summary 获取会话文件
     * @request GET:/api/im/conversation-files
     * @response `200` `GetApiImConversationFilesData` Response for status 200
     */
    getApiImConversationFiles: (params: RequestParams = {}) =>
      this.http.request<GetApiImConversationFilesData, any>({
        path: `/api/im/conversation-files`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取当前用户隐藏的会话ID列表
     *
     * @tags im, conversationHidden
     * @name GetApiImConversationHiddenList
     * @summary 获取隐藏会话列表
     * @request GET:/api/im/conversation-hidden/list
     * @response `200` `GetApiImConversationHiddenListData` Response for status 200
     */
    getApiImConversationHiddenList: (params: RequestParams = {}) =>
      this.http.request<GetApiImConversationHiddenListData, any>({
        path: `/api/im/conversation-hidden/list`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据会话ID和用户ID查询已读状态
     *
     * @tags im, conversationRead
     * @name GetApiImConversationReadByConversationIdByUserId
     * @summary 查询已读状态
     * @request GET:/api/im/conversation-read/{conversationId}/{userId}
     * @response `200` `GetApiImConversationReadByConversationIdByUserIdData` Response for status 200
     */
    getApiImConversationReadByConversationIdByUserId: (
      {
        conversationId,
        userId,
        ...query
      }: GetApiImConversationReadByConversationIdByUserIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        GetApiImConversationReadByConversationIdByUserIdData,
        any
      >({
        path: `/api/im/conversation-read/${conversationId}/${userId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取已读状态表的JSON Schema
     *
     * @tags im, conversationRead
     * @name GetApiImConversationReadSchema
     * @summary 获取已读状态Schema
     * @request GET:/api/im/conversation-read/schema
     * @response `200` `GetApiImConversationReadSchemaData` Response for status 200
     */
    getApiImConversationReadSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiImConversationReadSchemaData, any>({
        path: `/api/im/conversation-read/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取会话表的JSON Schema
     *
     * @tags im, conversation
     * @name GetApiImConversationSchema
     * @summary 获取会话Schema
     * @request GET:/api/im/conversation/schema
     * @response `200` `GetApiImConversationSchemaData` Response for status 200
     */
    getApiImConversationSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiImConversationSchemaData, any>({
        path: `/api/im/conversation/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据会话ID和用户ID查询群成员
     *
     * @tags im, groupMember
     * @name GetApiImGroupMemberByConversationIdByUserId
     * @summary 查询群成员
     * @request GET:/api/im/group-member/{conversationId}/{userId}
     * @response `200` `GetApiImGroupMemberByConversationIdByUserIdData` Response for status 200
     */
    getApiImGroupMemberByConversationIdByUserId: (
      {
        conversationId,
        userId,
        ...query
      }: GetApiImGroupMemberByConversationIdByUserIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiImGroupMemberByConversationIdByUserIdData, any>({
        path: `/api/im/group-member/${conversationId}/${userId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取群成员表的JSON Schema
     *
     * @tags im, groupMember
     * @name GetApiImGroupMemberSchema
     * @summary 获取群成员Schema
     * @request GET:/api/im/group-member/schema
     * @response `200` `GetApiImGroupMemberSchemaData` Response for status 200
     */
    getApiImGroupMemberSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiImGroupMemberSchemaData, any>({
        path: `/api/im/group-member/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个消息
     *
     * @tags im, message
     * @name GetApiImMessageById
     * @summary 根据ID查询消息
     * @request GET:/api/im/message/{id}
     * @response `200` `GetApiImMessageByIdData` Response for status 200
     */
    getApiImMessageById: (
      { id, ...query }: GetApiImMessageByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiImMessageByIdData, any>({
        path: `/api/im/message/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取消息表的JSON Schema
     *
     * @tags im, message
     * @name GetApiImMessageSchema
     * @summary 获取消息Schema
     * @request GET:/api/im/message/schema
     * @response `200` `GetApiImMessageSchemaData` Response for status 200
     */
    getApiImMessageSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiImMessageSchemaData, any>({
        path: `/api/im/message/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个临时文件
     *
     * @tags im, tempFile
     * @name GetApiImTempFileById
     * @summary 根据ID查询临时文件
     * @request GET:/api/im/temp-file/{id}
     * @response `200` `GetApiImTempFileByIdData` Response for status 200
     */
    getApiImTempFileById: (
      { id, ...query }: GetApiImTempFileByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiImTempFileByIdData, any>({
        path: `/api/im/temp-file/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取临时文件的预签名下载链接
     *
     * @tags im, tempFile
     * @name GetApiImTempFileByIdDownloadUrl
     * @summary 获取临时文件下载链接
     * @request GET:/api/im/temp-file/{id}/download-url
     * @response `200` `GetApiImTempFileByIdDownloadUrlData` Response for status 200
     */
    getApiImTempFileByIdDownloadUrl: (
      { id, ...query }: GetApiImTempFileByIdDownloadUrlParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiImTempFileByIdDownloadUrlData, any>({
        path: `/api/im/temp-file/${id}/download-url`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取临时文件表的JSON Schema
     *
     * @tags im, tempFile
     * @name GetApiImTempFileSchema
     * @summary 获取临时文件Schema
     * @request GET:/api/im/temp-file/schema
     * @response `200` `GetApiImTempFileSchemaData` Response for status 200
     */
    getApiImTempFileSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiImTempFileSchemaData, any>({
        path: `/api/im/temp-file/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个会话
     *
     * @tags im, conversation
     * @name PostApiImConversation
     * @summary 创建会话
     * @request POST:/api/im/conversation
     * @response `200` `PostApiImConversationData` Response for status 200
     */
    postApiImConversation: (
      data: PostApiImConversationPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImConversationData, any>({
        path: `/api/im/conversation`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 解散群聊（仅群主可操作）
     *
     * @tags im, conversation
     * @name PostApiImConversationByIdDissolve
     * @summary 解散群聊
     * @request POST:/api/im/conversation/{id}/dissolve
     * @response `200` `PostApiImConversationByIdDissolveData` Response for status 200
     */
    postApiImConversationByIdDissolve: (
      { id, ...query }: PostApiImConversationByIdDissolveParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImConversationByIdDissolveData, any>({
        path: `/api/im/conversation/${id}/dissolve`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 创建群聊会话并添加成员
     *
     * @tags im, conversation
     * @name PostApiImConversationGroup
     * @summary 创建群聊
     * @request POST:/api/im/conversation/group
     * @response `200` `PostApiImConversationGroupData` Response for status 200
     */
    postApiImConversationGroup: (
      data: PostApiImConversationGroupPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImConversationGroupData, any>({
        path: `/api/im/conversation/group`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 隐藏会话（不再显示在消息列表）
     *
     * @tags im, conversationHidden
     * @name PostApiImConversationHiddenHide
     * @summary 隐藏会话
     * @request POST:/api/im/conversation-hidden/hide
     * @response `200` `PostApiImConversationHiddenHideData` Response for status 200
     */
    postApiImConversationHiddenHide: (
      data: PostApiImConversationHiddenHidePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImConversationHiddenHideData, any>({
        path: `/api/im/conversation-hidden/hide`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 取消隐藏会话（新消息到达时调用）
     *
     * @tags im, conversationHidden
     * @name PostApiImConversationHiddenUnhide
     * @summary 取消隐藏会话
     * @request POST:/api/im/conversation-hidden/unhide
     * @response `200` `PostApiImConversationHiddenUnhideData` Response for status 200
     */
    postApiImConversationHiddenUnhide: (
      data: PostApiImConversationHiddenUnhidePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImConversationHiddenUnhideData, any>({
        path: `/api/im/conversation-hidden/unhide`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 查找两个用户之间的私聊会话，如果不存在则创建
     *
     * @tags im, conversation
     * @name PostApiImConversationPrivate
     * @summary 查找或创建私聊
     * @request POST:/api/im/conversation/private
     * @response `200` `PostApiImConversationPrivateData` Response for status 200
     */
    postApiImConversationPrivate: (
      data: PostApiImConversationPrivatePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImConversationPrivateData, any>({
        path: `/api/im/conversation/private`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询会话列表
     *
     * @tags im, conversation
     * @name PostApiImConversationQuery
     * @summary 分页查询会话
     * @request POST:/api/im/conversation/query
     * @response `200` `PostApiImConversationQueryData` Response for status 200
     */
    postApiImConversationQuery: (
      data: PostApiImConversationQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImConversationQueryData, any>({
        path: `/api/im/conversation/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询已读状态列表
     *
     * @tags im, conversationRead
     * @name PostApiImConversationReadQuery
     * @summary 分页查询已读状态
     * @request POST:/api/im/conversation-read/query
     * @response `200` `PostApiImConversationReadQueryData` Response for status 200
     */
    postApiImConversationReadQuery: (
      data: PostApiImConversationReadQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImConversationReadQueryData, any>({
        path: `/api/im/conversation-read/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 添加群成员
     *
     * @tags im, groupMember
     * @name PostApiImGroupMember
     * @summary 添加群成员
     * @request POST:/api/im/group-member
     * @response `200` `PostApiImGroupMemberData` Response for status 200
     */
    postApiImGroupMember: (
      data: PostApiImGroupMemberPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImGroupMemberData, any>({
        path: `/api/im/group-member`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量添加群成员
     *
     * @tags im, groupMember
     * @name PostApiImGroupMemberBatch
     * @summary 批量添加群成员
     * @request POST:/api/im/group-member/batch
     * @response `200` `PostApiImGroupMemberBatchData` Response for status 200
     */
    postApiImGroupMemberBatch: (
      data: PostApiImGroupMemberBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImGroupMemberBatchData, any>({
        path: `/api/im/group-member/batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询群成员列表
     *
     * @tags im, groupMember
     * @name PostApiImGroupMemberQuery
     * @summary 分页查询群成员
     * @request POST:/api/im/group-member/query
     * @response `200` `PostApiImGroupMemberQueryData` Response for status 200
     */
    postApiImGroupMemberQuery: (
      data: PostApiImGroupMemberQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImGroupMemberQueryData, any>({
        path: `/api/im/group-member/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 发送单条消息
     *
     * @tags im, message
     * @name PostApiImMessage
     * @summary 发送消息
     * @request POST:/api/im/message
     * @response `200` `PostApiImMessageData` Response for status 200
     */
    postApiImMessage: (
      data: PostApiImMessagePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImMessageData, any>({
        path: `/api/im/message`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询消息列表
     *
     * @tags im, message
     * @name PostApiImMessageQuery
     * @summary 分页查询消息
     * @request POST:/api/im/message/query
     * @response `200` `PostApiImMessageQueryData` Response for status 200
     */
    postApiImMessageQuery: (
      data: PostApiImMessageQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImMessageQueryData, any>({
        path: `/api/im/message/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个临时文件记录
     *
     * @tags im, tempFile
     * @name PostApiImTempFile
     * @summary 创建临时文件
     * @request POST:/api/im/temp-file
     * @response `200` `PostApiImTempFileData` Response for status 200
     */
    postApiImTempFile: (
      data: PostApiImTempFilePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImTempFileData, any>({
        path: `/api/im/temp-file`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询临时文件列表
     *
     * @tags im, tempFile
     * @name PostApiImTempFileQuery
     * @summary 分页查询临时文件
     * @request POST:/api/im/temp-file/query
     * @response `200` `PostApiImTempFileQueryData` Response for status 200
     */
    postApiImTempFileQuery: (
      data: PostApiImTempFileQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImTempFileQueryData, any>({
        path: `/api/im/temp-file/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 上传文件到S3并创建临时文件记录
     *
     * @tags im, tempFile
     * @name PostApiImTempFileUpload
     * @summary 上传临时文件
     * @request POST:/api/im/temp-file/upload
     * @response `200` `PostApiImTempFileUploadData` Response for status 200
     */
    postApiImTempFileUpload: (
      data: PostApiImTempFileUploadPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiImTempFileUploadData, any>({
        path: `/api/im/temp-file/upload`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个会话
     *
     * @tags im, conversation
     * @name PutApiImConversationById
     * @summary 更新会话
     * @request PUT:/api/im/conversation/{id}
     * @response `200` `PutApiImConversationByIdData` Response for status 200
     */
    putApiImConversationById: (
      { id, ...query }: PutApiImConversationByIdParams,
      data: PutApiImConversationByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiImConversationByIdData, any>({
        path: `/api/im/conversation/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 增加用户在会话中的未读消息数
     *
     * @tags im, conversationRead
     * @name PutApiImConversationReadIncrementUnread
     * @summary 增加未读数
     * @request PUT:/api/im/conversation-read/increment-unread
     * @response `200` `PutApiImConversationReadIncrementUnreadData` Response for status 200
     */
    putApiImConversationReadIncrementUnread: (
      data: PutApiImConversationReadIncrementUnreadPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiImConversationReadIncrementUnreadData, any>({
        path: `/api/im/conversation-read/increment-unread`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 标记会话已读到指定消息序号
     *
     * @tags im, conversationRead
     * @name PutApiImConversationReadMark
     * @summary 标记已读
     * @request PUT:/api/im/conversation-read/mark
     * @response `200` `PutApiImConversationReadMarkData` Response for status 200
     */
    putApiImConversationReadMark: (
      data: PutApiImConversationReadMarkPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiImConversationReadMarkData, any>({
        path: `/api/im/conversation-read/mark`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 更新群成员信息
     *
     * @tags im, groupMember
     * @name PutApiImGroupMemberByConversationIdByUserId
     * @summary 更新群成员
     * @request PUT:/api/im/group-member/{conversationId}/{userId}
     * @response `200` `PutApiImGroupMemberByConversationIdByUserIdData` Response for status 200
     */
    putApiImGroupMemberByConversationIdByUserId: (
      {
        conversationId,
        userId,
        ...query
      }: PutApiImGroupMemberByConversationIdByUserIdParams,
      data: PutApiImGroupMemberByConversationIdByUserIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiImGroupMemberByConversationIdByUserIdData, any>({
        path: `/api/im/group-member/${conversationId}/${userId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 撤回指定消息
     *
     * @tags im, message
     * @name PutApiImMessageByIdRecall
     * @summary 撤回消息
     * @request PUT:/api/im/message/{id}/recall
     * @response `200` `PutApiImMessageByIdRecallData` Response for status 200
     */
    putApiImMessageByIdRecall: (
      { id, ...query }: PutApiImMessageByIdRecallParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiImMessageByIdRecallData, any>({
        path: `/api/im/message/${id}/recall`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新临时文件
     *
     * @tags im, tempFile
     * @name PutApiImTempFileById
     * @summary 更新临时文件
     * @request PUT:/api/im/temp-file/{id}
     * @response `200` `PutApiImTempFileByIdData` Response for status 200
     */
    putApiImTempFileById: (
      { id, ...query }: PutApiImTempFileByIdParams,
      data: PutApiImTempFileByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiImTempFileByIdData, any>({
        path: `/api/im/temp-file/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  files = {
    /**
     * @description 软删除文件
     *
     * @tags files, files
     * @name DeleteApiFilesById
     * @summary 删除文件
     * @request DELETE:/api/files/{id}
     * @response `200` `DeleteApiFilesByIdData` Response for status 200
     */
    deleteApiFilesById: (
      { id, ...query }: DeleteApiFilesByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiFilesByIdData, any>({
        path: `/api/files/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 软删除文件夹及其内容
     *
     * @tags files, files
     * @name DeleteApiFilesFoldersById
     * @summary 删除文件夹
     * @request DELETE:/api/files/folders/{id}
     * @response `200` `DeleteApiFilesFoldersByIdData` Response for status 200
     */
    deleteApiFilesFoldersById: (
      { id, ...query }: DeleteApiFilesFoldersByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiFilesFoldersByIdData, any>({
        path: `/api/files/folders/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 删除资源的所有权限和继承关系
     *
     * @tags files, permission
     * @name DeleteApiFilesPermissionAllByResourceTypeByResourceId
     * @summary 删除所有权限
     * @request DELETE:/api/files/permission/all/{resourceType}/{resourceId}
     * @response `200` `DeleteApiFilesPermissionAllByResourceTypeByResourceIdData` Response for status 200
     */
    deleteApiFilesPermissionAllByResourceTypeByResourceId: (
      {
        resourceType,
        resourceId,
        ...query
      }: DeleteApiFilesPermissionAllByResourceTypeByResourceIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        DeleteApiFilesPermissionAllByResourceTypeByResourceIdData,
        any
      >({
        path: `/api/files/permission/all/${resourceType}/${resourceId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 移除资源的权限
     *
     * @tags files, permission
     * @name DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermission
     * @summary 移除权限
     * @request DELETE:/api/files/permission/{resourceType}/{resourceId}/{subjectType}/{subjectId}/{permission}
     * @response `200` `DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionData` Response for status 200
     */
    deleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermission:
      (
        {
          resourceType,
          resourceId,
          subjectType,
          subjectId,
          permission,
          ...query
        }: DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionParams,
        params: RequestParams = {},
      ) =>
        this.http.request<
          DeleteApiFilesPermissionByResourceTypeByResourceIdBySubjectTypeBySubjectIdByPermissionData,
          any
        >({
          path: `/api/files/permission/${resourceType}/${resourceId}/${subjectType}/${subjectId}/${permission}`,
          method: "DELETE",
          format: "json",
          ...params,
        }),

    /**
     * @description 获取文本文件内容
     *
     * @tags files, files
     * @name GetApiFilesByIdContent
     * @summary 获取文件内容
     * @request GET:/api/files/{id}/content
     * @response `200` `GetApiFilesByIdContentData` Response for status 200
     */
    getApiFilesByIdContent: (
      { id, ...query }: GetApiFilesByIdContentParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiFilesByIdContentData, any>({
        path: `/api/files/${id}/content`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取预签名下载URL
     *
     * @tags files, files
     * @name GetApiFilesByIdDownloadUrl
     * @summary 获取下载URL
     * @request GET:/api/files/{id}/download-url
     * @response `200` `GetApiFilesByIdDownloadUrlData` Response for status 200
     */
    getApiFilesByIdDownloadUrl: (
      { id, ...query }: GetApiFilesByIdDownloadUrlParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiFilesByIdDownloadUrlData, any>({
        path: `/api/files/${id}/download-url`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取文本文件内容，仅支持纯文本文件
     *
     * @tags files, files
     * @name GetApiFilesByIdTextContent
     * @summary 获取文本文件内容
     * @request GET:/api/files/{id}/text-content
     * @response `200` `GetApiFilesByIdTextContentData` Response for status 200
     */
    getApiFilesByIdTextContent: (
      { id, ...query }: GetApiFilesByIdTextContentParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiFilesByIdTextContentData, any>({
        path: `/api/files/${id}/text-content`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取文件或文件夹的权限列表
     *
     * @tags files, permission
     * @name GetApiFilesPermissionByResourceTypeByResourceId
     * @summary 获取资源权限
     * @request GET:/api/files/permission/{resourceType}/{resourceId}
     * @response `200` `GetApiFilesPermissionByResourceTypeByResourceIdData` Response for status 200
     */
    getApiFilesPermissionByResourceTypeByResourceId: (
      {
        resourceType,
        resourceId,
        ...query
      }: GetApiFilesPermissionByResourceTypeByResourceIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        GetApiFilesPermissionByResourceTypeByResourceIdData,
        any
      >({
        path: `/api/files/permission/${resourceType}/${resourceId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取用户对资源的所有有效权限（包括继承的权限）
     *
     * @tags files, permission
     * @name GetApiFilesPermissionEffectiveByResourceTypeByResourceId
     * @summary 获取有效权限
     * @request GET:/api/files/permission/effective/{resourceType}/{resourceId}
     * @response `200` `GetApiFilesPermissionEffectiveByResourceTypeByResourceIdData` Response for status 200
     */
    getApiFilesPermissionEffectiveByResourceTypeByResourceId: (
      {
        resourceType,
        resourceId,
        ...query
      }: GetApiFilesPermissionEffectiveByResourceTypeByResourceIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        GetApiFilesPermissionEffectiveByResourceTypeByResourceIdData,
        any
      >({
        path: `/api/files/permission/effective/${resourceType}/${resourceId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取文件夹的完整路径（面包屑）
     *
     * @tags files, share
     * @name GetApiFilesShareFolderPathByFolderId
     * @summary 获取文件夹路径
     * @request GET:/api/files/share/folder-path/{folderId}
     * @response `200` `GetApiFilesShareFolderPathByFolderIdData` Response for status 200
     */
    getApiFilesShareFolderPathByFolderId: (
      { folderId, ...query }: GetApiFilesShareFolderPathByFolderIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiFilesShareFolderPathByFolderIdData, any>({
        path: `/api/files/share/folder-path/${folderId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取历史版本的下载URL
     *
     * @tags files, files
     * @name GetApiFilesVersionsByIdDownloadUrl
     * @summary 下载历史版本
     * @request GET:/api/files/versions/{id}/download-url
     * @response `200` `GetApiFilesVersionsByIdDownloadUrlData` Response for status 200
     */
    getApiFilesVersionsByIdDownloadUrl: (
      { id, ...query }: GetApiFilesVersionsByIdDownloadUrlParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiFilesVersionsByIdDownloadUrlData, any>({
        path: `/api/files/versions/${id}/download-url`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取已上传附件的访问URL
     *
     * @tags files, ai-chat
     * @name PostApiFilesAiChatGetUrl
     * @summary 获取AI聊天附件URL
     * @request POST:/api/files/ai-chat/get-url
     * @response `200` `PostApiFilesAiChatGetUrlData` Response for status 200
     */
    postApiFilesAiChatGetUrl: (
      data: PostApiFilesAiChatGetUrlPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesAiChatGetUrlData, any>({
        path: `/api/files/ai-chat/get-url`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 上传文件到存储，返回可访问的URL
     *
     * @tags files, ai-chat
     * @name PostApiFilesAiChatUpload
     * @summary 上传AI聊天附件
     * @request POST:/api/files/ai-chat/upload
     * @response `200` `PostApiFilesAiChatUploadData` Response for status 200
     */
    postApiFilesAiChatUpload: (
      data: PostApiFilesAiChatUploadPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesAiChatUploadData, any>({
        path: `/api/files/ai-chat/upload`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 复制文件到目标文件夹
     *
     * @tags files, files
     * @name PostApiFilesByIdCopy
     * @summary 复制文件
     * @request POST:/api/files/{id}/copy
     * @response `200` `PostApiFilesByIdCopyData` Response for status 200
     */
    postApiFilesByIdCopy: (
      { id, ...query }: PostApiFilesByIdCopyParams,
      data: PostApiFilesByIdCopyPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesByIdCopyData, any>({
        path: `/api/files/${id}/copy`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 复制文件到目标文件夹，自动生成唯一文件名 filename(num).ext
     *
     * @tags files, files
     * @name PostApiFilesByIdCopyAsDuplicate
     * @summary 复制文件为副本
     * @request POST:/api/files/{id}/copy-as-duplicate
     * @response `200` `PostApiFilesByIdCopyAsDuplicateData` Response for status 200
     */
    postApiFilesByIdCopyAsDuplicate: (
      { id, ...query }: PostApiFilesByIdCopyAsDuplicateParams,
      data: PostApiFilesByIdCopyAsDuplicatePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesByIdCopyAsDuplicateData, any>({
        path: `/api/files/${id}/copy-as-duplicate`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 移动文件到目标文件夹
     *
     * @tags files, files
     * @name PostApiFilesByIdMove
     * @summary 移动文件
     * @request POST:/api/files/{id}/move
     * @response `200` `PostApiFilesByIdMoveData` Response for status 200
     */
    postApiFilesByIdMove: (
      { id, ...query }: PostApiFilesByIdMoveParams,
      data: PostApiFilesByIdMovePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesByIdMoveData, any>({
        path: `/api/files/${id}/move`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 检查指定文件夹中是否存在同名文件
     *
     * @tags files, files
     * @name PostApiFilesCheckExists
     * @summary 检查文件是否存在
     * @request POST:/api/files/check-exists
     * @response `200` `PostApiFilesCheckExistsData` Response for status 200
     */
    postApiFilesCheckExists: (
      data: PostApiFilesCheckExistsPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesCheckExistsData, any>({
        path: `/api/files/check-exists`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 确认文件上传完成并创建记录
     *
     * @tags files, files
     * @name PostApiFilesConfirmUpload
     * @summary 确认上传
     * @request POST:/api/files/confirm-upload
     * @response `200` `PostApiFilesConfirmUploadData` Response for status 200
     */
    postApiFilesConfirmUpload: (
      data: PostApiFilesConfirmUploadPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesConfirmUploadData, any>({
        path: `/api/files/confirm-upload`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量软删除文件
     *
     * @tags files, files
     * @name PostApiFilesDeleteBatch
     * @summary 批量删除文件
     * @request POST:/api/files/delete-batch
     * @response `200` `PostApiFilesDeleteBatchData` Response for status 200
     */
    postApiFilesDeleteBatch: (
      data: PostApiFilesDeleteBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesDeleteBatchData, any>({
        path: `/api/files/delete-batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建新文件夹
     *
     * @tags files, files
     * @name PostApiFilesFolders
     * @summary 创建文件夹
     * @request POST:/api/files/folders
     * @response `200` `PostApiFilesFoldersData` Response for status 200
     */
    postApiFilesFolders: (
      data: PostApiFilesFoldersPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesFoldersData, any>({
        path: `/api/files/folders`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 移动文件夹到目标位置
     *
     * @tags files, files
     * @name PostApiFilesFoldersByIdMove
     * @summary 移动文件夹
     * @request POST:/api/files/folders/{id}/move
     * @response `200` `PostApiFilesFoldersByIdMoveData` Response for status 200
     */
    postApiFilesFoldersByIdMove: (
      { id, ...query }: PostApiFilesFoldersByIdMoveParams,
      data: PostApiFilesFoldersByIdMovePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesFoldersByIdMoveData, any>({
        path: `/api/files/folders/${id}/move`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 为资源添加单个权限
     *
     * @tags files, permission
     * @name PostApiFilesPermission
     * @summary 添加权限
     * @request POST:/api/files/permission
     * @response `200` `PostApiFilesPermissionData` Response for status 200
     */
    postApiFilesPermission: (
      data: PostApiFilesPermissionPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesPermissionData, any>({
        path: `/api/files/permission`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 设置文件或文件夹的权限（替换现有权限）
     *
     * @tags files, permission
     * @name PostApiFilesPermissionByResourceTypeByResourceId
     * @summary 设置资源权限
     * @request POST:/api/files/permission/{resourceType}/{resourceId}
     * @response `200` `PostApiFilesPermissionByResourceTypeByResourceIdData` Response for status 200
     */
    postApiFilesPermissionByResourceTypeByResourceId: (
      {
        resourceType,
        resourceId,
        ...query
      }: PostApiFilesPermissionByResourceTypeByResourceIdParams,
      data: PostApiFilesPermissionByResourceTypeByResourceIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<
        PostApiFilesPermissionByResourceTypeByResourceIdData,
        any
      >({
        path: `/api/files/permission/${resourceType}/${resourceId}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 检查用户对资源的权限
     *
     * @tags files, permission
     * @name PostApiFilesPermissionCheck
     * @summary 检查权限
     * @request POST:/api/files/permission/check
     * @response `200` `PostApiFilesPermissionCheckData` Response for status 200
     */
    postApiFilesPermissionCheck: (
      data: PostApiFilesPermissionCheckPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesPermissionCheckData, any>({
        path: `/api/files/permission/check`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 将一个资源的权限复制到另一个资源
     *
     * @tags files, permission
     * @name PostApiFilesPermissionCopy
     * @summary 复制权限
     * @request POST:/api/files/permission/copy
     * @response `200` `PostApiFilesPermissionCopyData` Response for status 200
     */
    postApiFilesPermissionCopy: (
      data: PostApiFilesPermissionCopyPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesPermissionCopyData, any>({
        path: `/api/files/permission/copy`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 设置文件或文件夹的父级文件夹（用于权限继承）
     *
     * @tags files, permission
     * @name PostApiFilesPermissionParent
     * @summary 设置资源父级
     * @request POST:/api/files/permission/parent
     * @response `200` `PostApiFilesPermissionParentData` Response for status 200
     */
    postApiFilesPermissionParent: (
      data: PostApiFilesPermissionParentPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesPermissionParentData, any>({
        path: `/api/files/permission/parent`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取共享文件夹的子文件夹和文件，支持权限继承
     *
     * @tags files, share
     * @name PostApiFilesShareFolderContents
     * @summary 获取共享文件夹内容
     * @request POST:/api/files/share/folder-contents
     * @response `200` `PostApiFilesShareFolderContentsData` Response for status 200
     */
    postApiFilesShareFolderContents: (
      data: PostApiFilesShareFolderContentsPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesShareFolderContentsData, any>({
        path: `/api/files/share/folder-contents`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取当前用户共享给他人的文件和文件夹
     *
     * @tags files, share
     * @name PostApiFilesShareMyShared
     * @summary 获取我共享的资源
     * @request POST:/api/files/share/my-shared
     * @response `200` `PostApiFilesShareMySharedData` Response for status 200
     */
    postApiFilesShareMyShared: (
      data: PostApiFilesShareMySharedPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesShareMySharedData, any>({
        path: `/api/files/share/my-shared`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取他人共享给当前用户的文件和文件夹
     *
     * @tags files, share
     * @name PostApiFilesShareSharedWithMe
     * @summary 获取收到的共享
     * @request POST:/api/files/share/shared-with-me
     * @response `200` `PostApiFilesShareSharedWithMeData` Response for status 200
     */
    postApiFilesShareSharedWithMe: (
      data: PostApiFilesShareSharedWithMePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesShareSharedWithMeData, any>({
        path: `/api/files/share/shared-with-me`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 上传文件到存储（如果文件已存在则返回冲突信息）
     *
     * @tags files, files
     * @name PostApiFilesUpload
     * @summary 上传文件
     * @request POST:/api/files/upload
     * @response `200` `PostApiFilesUploadData` Response for status 200
     */
    postApiFilesUpload: (
      data: PostApiFilesUploadPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesUploadData, any>({
        path: `/api/files/upload`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 上传文件并处理冲突（覆盖/创建新版本/创建副本）
     *
     * @tags files, files
     * @name PostApiFilesUploadForce
     * @summary 强制上传文件
     * @request POST:/api/files/upload-force
     * @response `200` `PostApiFilesUploadForceData` Response for status 200
     */
    postApiFilesUploadForce: (
      data: PostApiFilesUploadForcePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesUploadForceData, any>({
        path: `/api/files/upload-force`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取预签名上传URL
     *
     * @tags files, files
     * @name PostApiFilesUploadUrl
     * @summary 获取上传URL
     * @request POST:/api/files/upload-url
     * @response `200` `PostApiFilesUploadUrlData` Response for status 200
     */
    postApiFilesUploadUrl: (
      data: PostApiFilesUploadUrlPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesUploadUrlData, any>({
        path: `/api/files/upload-url`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 将历史版本恢复为当前版本（交换S3字段）
     *
     * @tags files, files
     * @name PostApiFilesVersionsByIdRestore
     * @summary 恢复历史版本
     * @request POST:/api/files/versions/{id}/restore
     * @response `200` `PostApiFilesVersionsByIdRestoreData` Response for status 200
     */
    postApiFilesVersionsByIdRestore: (
      { id, ...query }: PostApiFilesVersionsByIdRestoreParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiFilesVersionsByIdRestoreData, any>({
        path: `/api/files/versions/${id}/restore`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 保存文本文件内容
     *
     * @tags files, files
     * @name PutApiFilesByIdContent
     * @summary 保存文件内容
     * @request PUT:/api/files/{id}/content
     * @response `200` `PutApiFilesByIdContentData` Response for status 200
     */
    putApiFilesByIdContent: (
      { id, ...query }: PutApiFilesByIdContentParams,
      data: PutApiFilesByIdContentPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiFilesByIdContentData, any>({
        path: `/api/files/${id}/content`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 更新文件描述信息
     *
     * @tags files, files
     * @name PutApiFilesByIdDescription
     * @summary 更新文件描述
     * @request PUT:/api/files/{id}/description
     * @response `200` `PutApiFilesByIdDescriptionData` Response for status 200
     */
    putApiFilesByIdDescription: (
      { id, ...query }: PutApiFilesByIdDescriptionParams,
      data: PutApiFilesByIdDescriptionPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiFilesByIdDescriptionData, any>({
        path: `/api/files/${id}/description`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 重命名文件
     *
     * @tags files, files
     * @name PutApiFilesByIdRename
     * @summary 重命名文件
     * @request PUT:/api/files/{id}/rename
     * @response `200` `PutApiFilesByIdRenameData` Response for status 200
     */
    putApiFilesByIdRename: (
      { id, ...query }: PutApiFilesByIdRenameParams,
      data: PutApiFilesByIdRenamePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiFilesByIdRenameData, any>({
        path: `/api/files/${id}/rename`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 更新文件夹描述信息
     *
     * @tags files, files
     * @name PutApiFilesFoldersByIdDescription
     * @summary 更新文件夹描述
     * @request PUT:/api/files/folders/{id}/description
     * @response `200` `PutApiFilesFoldersByIdDescriptionData` Response for status 200
     */
    putApiFilesFoldersByIdDescription: (
      { id, ...query }: PutApiFilesFoldersByIdDescriptionParams,
      data: PutApiFilesFoldersByIdDescriptionPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiFilesFoldersByIdDescriptionData, any>({
        path: `/api/files/folders/${id}/description`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 更新文件夹排序
     *
     * @tags files, files
     * @name PutApiFilesFoldersByIdOrder
     * @summary 更新文件夹排序
     * @request PUT:/api/files/folders/{id}/order
     * @response `200` `PutApiFilesFoldersByIdOrderData` Response for status 200
     */
    putApiFilesFoldersByIdOrder: (
      { id, ...query }: PutApiFilesFoldersByIdOrderParams,
      data: PutApiFilesFoldersByIdOrderPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiFilesFoldersByIdOrderData, any>({
        path: `/api/files/folders/${id}/order`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 重命名文件夹
     *
     * @tags files, files
     * @name PutApiFilesFoldersByIdRename
     * @summary 重命名文件夹
     * @request PUT:/api/files/folders/{id}/rename
     * @response `200` `PutApiFilesFoldersByIdRenameData` Response for status 200
     */
    putApiFilesFoldersByIdRename: (
      { id, ...query }: PutApiFilesFoldersByIdRenameParams,
      data: PutApiFilesFoldersByIdRenamePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiFilesFoldersByIdRenameData, any>({
        path: `/api/files/folders/${id}/rename`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 更新文件夹图标和颜色
     *
     * @tags files, files
     * @name PutApiFilesFoldersByIdStyle
     * @summary 更新文件夹样式
     * @request PUT:/api/files/folders/{id}/style
     * @response `200` `PutApiFilesFoldersByIdStyleData` Response for status 200
     */
    putApiFilesFoldersByIdStyle: (
      { id, ...query }: PutApiFilesFoldersByIdStyleParams,
      data: PutApiFilesFoldersByIdStylePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiFilesFoldersByIdStyleData, any>({
        path: `/api/files/folders/${id}/style`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  public = {
    /**
     * @description 上传头像到公开存储，返回可直接访问的URL
     *
     * @tags public, upload, avatar
     * @name PostApiPublicUploadAvatar
     * @summary 上传公开头像
     * @request POST:/api/public/upload/avatar
     * @response `200` `PostApiPublicUploadAvatarData` Response for status 200
     */
    postApiPublicUploadAvatar: (
      data: PostApiPublicUploadAvatarPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiPublicUploadAvatarData, any>({
        path: `/api/public/upload/avatar`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  dev = {
    /**
     * @description 获取 monorepo 项目根目录路径
     *
     * @tags dev, project-code
     * @name GetApiDevProjectCodeRoot
     * @summary 获取项目根目录
     * @request GET:/api/dev/project-code/root
     * @response `200` `GetApiDevProjectCodeRootData` Response for status 200
     */
    getApiDevProjectCodeRoot: (params: RequestParams = {}) =>
      this.http.request<GetApiDevProjectCodeRootData, any>({
        path: `/api/dev/project-code/root`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 读取指定目录下的文件和子目录
     *
     * @tags dev, project-code
     * @name PostApiDevProjectCodeDirectory
     * @summary 读取目录
     * @request POST:/api/dev/project-code/directory
     * @response `200` `PostApiDevProjectCodeDirectoryData` Response for status 200
     */
    postApiDevProjectCodeDirectory: (
      data: PostApiDevProjectCodeDirectoryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiDevProjectCodeDirectoryData, any>({
        path: `/api/dev/project-code/directory`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 读取指定文件的内容
     *
     * @tags dev, project-code
     * @name PostApiDevProjectCodeFile
     * @summary 读取文件
     * @request POST:/api/dev/project-code/file
     * @response `200` `PostApiDevProjectCodeFileData` Response for status 200
     */
    postApiDevProjectCodeFile: (
      data: PostApiDevProjectCodeFilePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiDevProjectCodeFileData, any>({
        path: `/api/dev/project-code/file`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
