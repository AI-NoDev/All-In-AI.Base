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

export interface DeleteApiAiUserMemoryByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiAiUserMemoryByIdParams {
  /** 记忆ID */
  id: string;
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

export interface DeleteApiKnowledgeFavoritesByNodeIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiKnowledgeFavoritesByNodeIdParams {
  /** 节点 ID */
  nodeId: string;
}

export interface DeleteApiKnowledgeNodesByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiKnowledgeNodesByIdParams {
  id: string;
}

export interface DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectIdParams {
  /** 节点 ID */
  id: string;
  /** 要移除的特定权限，不指定则移除所有 */
  permission?: PermissionEnum;
  /** 主体 ID */
  subjectId: string;
  /** 主体类型：user=用户，role=角色，dept=部门 */
  subjectType: SubjectTypeEnum;
}

/** 主体类型：user=用户，role=角色，dept=部门 */
export enum DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectIdParams1Enum {
  User = "user",
  Role = "role",
  Dept = "dept",
}

/** 要移除的特定权限，不指定则移除所有 */
export enum DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectIdParams1PermissionEnum {
  Read = "read",
  Write = "write",
  Delete = "delete",
  Manage = "manage",
}

/** 主体类型：user=用户，role=角色，dept=部门 */
export enum DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectIdParams1SubjectTypeEnum {
  User = "user",
  Role = "role",
  Dept = "dept",
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

export interface DeleteMcpByIdParams {
  id: string;
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

export interface GetApiAiMcpServerByIdConfigData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiMcpServerByIdConfigParams {
  id: string;
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

export interface GetApiAiUserMemoryByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiAiUserMemoryByIdParams {
  /** 记忆ID */
  id: string;
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
    menus: {
      icon: string | null;
      id: string;
      isFrame: boolean;
      linkTarget: string | null;
      linkUrl: string | null;
      name: string;
      orderNum: number;
      parentId: string | null;
      path: string | null;
      perms: string | null;
      type: string;
      visible: boolean;
    }[];
    name: string | null;
    permissions: string[];
    phonenumber: string | null;
    roles: {
      id: string;
      key: string;
      name: string;
    }[];
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

export interface GetApiKnowledgeNodesByIdChildrenData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeNodesByIdChildrenParams {
  id: string;
  type?: TypeEnum;
}

export enum GetApiKnowledgeNodesByIdChildrenParams1TypeEnum {
  Folder = "folder",
  File = "file",
}

export interface GetApiKnowledgeNodesByIdContentData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeNodesByIdContentParams {
  /** 文件节点 ID */
  id: string;
}

export interface GetApiKnowledgeNodesByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeNodesByIdDownloadUrlData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeNodesByIdDownloadUrlParams {
  /** 文件节点 ID */
  id: string;
}

export interface GetApiKnowledgeNodesByIdEffectivePermissionsData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeNodesByIdEffectivePermissionsParams {
  /** 节点 ID */
  id: string;
  /** 用户 ID，不指定则查询当前用户 */
  userId?: string;
}

export interface GetApiKnowledgeNodesByIdParams {
  id: string;
}

export interface GetApiKnowledgeNodesByIdPathData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeNodesByIdPathParams {
  /** 节点 ID */
  id: string;
}

export interface GetApiKnowledgeNodesByIdPermissionsData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeNodesByIdPermissionsParams {
  /** 节点 ID */
  id: string;
}

export interface GetApiKnowledgeNodesByIdTextData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeNodesByIdTextParams {
  /** 文件节点 ID */
  id: string;
}

export interface GetApiKnowledgeNodesByIdVersionsData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeNodesByIdVersionsParams {
  /** 节点 ID */
  id: string;
}

export interface GetApiKnowledgeNodesSchemaData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeVersionsByIdDownloadUrlData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetApiKnowledgeVersionsByIdDownloadUrlParams {
  /** 版本 ID */
  id: string;
}

export interface GetApiKnowledgeVersionsSchemaData {
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

export interface GetApiSystemNoticeReadUnreadCountData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
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

export interface GetApiSystemUserPreferencesData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
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

export interface GetApiWsUsersOnlineData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface GetMcpByIdInfoParams {
  id: string;
}

/** 要移除的特定权限，不指定则移除所有 */
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

/** 排序字段 */
export enum PostApiAiAgentMessageQueryFieldEnum {
  MsgSeq = "msgSeq",
  CreatedAt = "createdAt",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiAiAgentMessageQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** Agent消息分页查询请求体 */
export interface PostApiAiAgentMessageQueryPayload {
  /** Agent消息过滤条件 */
  filter?: {
    /** 按内容类型精确匹配 */
    contentType?: string;
    /** 按内容类型列表精确匹配 */
    contentTypes?: string[];
    /** 创建时间范围-结束，ISO 8601格式 */
    createdAtEnd?: string;
    /** 创建时间范围-开始，ISO 8601格式 */
    createdAtStart?: string;
    /** 按完成原因精确匹配 */
    finishReason?: string;
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 消息序号范围-结束 */
    msgSeqEnd?: number;
    /** 消息序号范围-开始 */
    msgSeqStart?: number;
    /** 按角色精确匹配：user=用户, assistant=助手, system=系统, tool=工具 */
    role?: string;
    /** 按角色列表精确匹配 */
    roles?: string[];
    /** 按会话ID精确匹配 */
    sessionId?: string;
    /** 按会话ID列表精确匹配 */
    sessionIds?: string[];
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiAiAgentMessageQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
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

/** 排序字段 */
export enum PostApiAiAgentQueryFieldEnum {
  Name = "name",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiAiAgentQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** 智能体分页查询请求体 */
export interface PostApiAiAgentQueryPayload {
  /** 智能体过滤条件 */
  filter?: {
    /** 上下文策略 */
    contextStrategy?: string;
    /**
     * 创建时间范围-结束，ISO 8601格式
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * 创建时间范围-开始，ISO 8601格式
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 按模型ID精确匹配 */
    modelId?: string;
    /** 按模型ID列表精确匹配 */
    modelIds?: string[];
    /** 按名称模糊搜索 */
    name?: string;
    /** 按名称列表精确匹配 */
    names?: string[];
    /** 按提供商ID精确匹配 */
    providerId?: string;
    /** 按提供商ID列表精确匹配 */
    providerIds?: string[];
    /** 按状态精确匹配：0=正常，1=禁用 */
    status?: string;
    /** 是否支持循环调用 */
    supportLoop?: boolean;
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiAiAgentQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
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

/** 排序字段 */
export enum PostApiAiAgentSessionQueryFieldEnum {
  Title = "title",
  LastMessageAt = "lastMessageAt",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  MessageCount = "messageCount",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiAiAgentSessionQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** Agent会话分页查询请求体 */
export interface PostApiAiAgentSessionQueryPayload {
  /** Agent会话过滤条件 */
  filter?: {
    /** 按Agent ID精确匹配 */
    agentId?: string;
    /** 按Agent ID列表精确匹配 */
    agentIds?: string[];
    /** 创建时间范围-结束，ISO 8601格式 */
    createdAtEnd?: string;
    /** 创建时间范围-开始，ISO 8601格式 */
    createdAtStart?: string;
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 是否已归档 */
    isArchived?: boolean;
    /** 是否已置顶 */
    isPinned?: boolean;
    /** 最后消息时间范围-结束，ISO 8601格式 */
    lastMessageAtEnd?: string;
    /** 最后消息时间范围-开始，ISO 8601格式 */
    lastMessageAtStart?: string;
    /** 按状态精确匹配：0=正常，1=禁用 */
    status?: string;
    /** 按标题模糊搜索 */
    title?: string;
    /** 按用户ID精确匹配 */
    userId?: string;
    /** 按用户ID列表精确匹配 */
    userIds?: string[];
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiAiAgentSessionQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
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

/** 排序字段 */
export enum PostApiAiApiKeyQueryFieldEnum {
  CreatedAt = "createdAt",
  Name = "name",
  LastUsedAt = "lastUsedAt",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiAiApiKeyQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** API密钥分页查询请求体 */
export interface PostApiAiApiKeyQueryPayload {
  /** API密钥过滤条件 */
  filter?: {
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 是否已撤销 */
    isRevoked?: boolean;
    /** 按名称模糊搜索 */
    name?: string;
    /** 按状态精确匹配：0=正常，1=禁用 */
    status?: string;
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiAiApiKeyQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
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

/** 排序字段 */
export enum PostApiAiMcpServerQueryFieldEnum {
  CreatedAt = "createdAt",
  Name = "name",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiAiMcpServerQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** MCP服务分页查询请求体 */
export interface PostApiAiMcpServerQueryPayload {
  /** MCP服务过滤条件 */
  filter?: {
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 是否公开访问 */
    isPublic?: boolean;
    /** 按名称模糊搜索 */
    name?: string;
    /** 按状态精确匹配：0=正常，1=禁用 */
    status?: string;
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiAiMcpServerQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
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

/** 排序字段 */
export enum PostApiAiModelQueryFieldEnum {
  Name = "name",
  ModelId = "modelId",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiAiModelQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** AI模型分页查询请求体 */
export interface PostApiAiModelQueryPayload {
  /** 模型过滤条件 */
  filter?: {
    /** 创建时间范围-结束，ISO 8601格式 */
    createdAtEnd?: string;
    /** 创建时间范围-开始，ISO 8601格式 */
    createdAtStart?: string;
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 按模型标识模糊搜索 */
    modelId?: string;
    /** 按模型标识列表精确匹配 */
    modelIds?: string[];
    /** 按名称模糊搜索 */
    name?: string;
    /** 按提供商ID精确匹配 */
    providerId?: string;
    /** 按提供商ID列表精确匹配 */
    providerIds?: string[];
    /** 按状态精确匹配：0=正常，1=禁用 */
    status?: string;
    /** 是否支持工具调用 */
    supportTools?: boolean;
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiAiModelQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
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

/** 排序字段 */
export enum PostApiAiProviderQueryFieldEnum {
  Name = "name",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiAiProviderQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** AI提供商分页查询请求体 */
export interface PostApiAiProviderQueryPayload {
  /** 提供商过滤条件 */
  filter?: {
    /** 创建时间范围-结束，ISO 8601格式 */
    createdAtEnd?: string;
    /** 创建时间范围-开始，ISO 8601格式 */
    createdAtStart?: string;
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 按名称模糊搜索 */
    name?: string;
    /** 按名称列表精确匹配 */
    names?: string[];
    /** 按状态精确匹配：0=正常，1=禁用 */
    status?: string;
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiAiProviderQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
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

/** 排序字段 */
export enum PostApiAiSessionMessageQueryFieldEnum {
  MsgSeq = "msgSeq",
  CreatedAt = "createdAt",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiAiSessionMessageQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** AI会话消息分页查询请求体 */
export interface PostApiAiSessionMessageQueryPayload {
  /** AI会话消息过滤条件 */
  filter?: {
    /** 按内容类型精确匹配 */
    contentType?: string;
    /** 按内容类型列表精确匹配 */
    contentTypes?: string[];
    /** 创建时间范围-结束，ISO 8601格式 */
    createdAtEnd?: string;
    /** 创建时间范围-开始，ISO 8601格式 */
    createdAtStart?: string;
    /** 按完成原因精确匹配 */
    finishReason?: string;
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 消息序号范围-结束 */
    msgSeqEnd?: number;
    /** 消息序号范围-开始 */
    msgSeqStart?: number;
    /** 按角色精确匹配：user=用户, assistant=助手, system=系统 */
    role?: string;
    /** 按角色列表精确匹配 */
    roles?: string[];
    /** 按会话ID精确匹配 */
    sessionId?: string;
    /** 按会话ID列表精确匹配 */
    sessionIds?: string[];
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiAiSessionMessageQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
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

/** 排序字段 */
export enum PostApiAiSessionQueryFieldEnum {
  Title = "title",
  LastMessageAt = "lastMessageAt",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  MessageCount = "messageCount",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiAiSessionQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** AI会话分页查询请求体 */
export interface PostApiAiSessionQueryPayload {
  /** AI会话过滤条件 */
  filter?: {
    /** 创建时间范围-结束，ISO 8601格式 */
    createdAtEnd?: string;
    /** 创建时间范围-开始，ISO 8601格式 */
    createdAtStart?: string;
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 是否已归档 */
    isArchived?: boolean;
    /** 是否已置顶 */
    isPinned?: boolean;
    /** 最后消息时间范围-结束，ISO 8601格式 */
    lastMessageAtEnd?: string;
    /** 最后消息时间范围-开始，ISO 8601格式 */
    lastMessageAtStart?: string;
    /** 按状态精确匹配：0=正常，1=禁用 */
    status?: string;
    /** 按标题模糊搜索 */
    title?: string;
    /** 按用户ID精确匹配 */
    userId?: string;
    /** 按用户ID列表精确匹配 */
    userIds?: string[];
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiAiSessionQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
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

/** 排序字段 */
export enum PostApiAiToolGroupQueryFieldEnum {
  Name = "name",
  OrderNum = "orderNum",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiAiToolGroupQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** 工具组分页查询请求体 */
export interface PostApiAiToolGroupQueryPayload {
  /** 工具组过滤条件 */
  filter?: {
    /** 创建时间范围-结束，ISO 8601格式 */
    createdAtEnd?: string;
    /** 创建时间范围-开始，ISO 8601格式 */
    createdAtStart?: string;
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 按名称模糊搜索 */
    name?: string;
    /** 按名称列表精确匹配 */
    names?: string[];
    /** 按状态精确匹配：0=正常，1=禁用 */
    status?: string;
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiAiToolGroupQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
    order: PostApiAiToolGroupQueryOrderEnum;
  };
}

export interface PostApiAiUserMemoryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

/** 创建用户记忆请求体 */
export interface PostApiAiUserMemoryPayload {
  /** 记忆数据 */
  data: {
    /**
     * 访问次数
     * @min -2147483648
     * @max 2147483647
     */
    accessCount?: number;
    /** Agent ID */
    agentId?: string | null;
    /** 记忆内容 */
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
    /** 向量嵌入 */
    embedding?: number[];
    /** 过期时间 */
    expireAt?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 重要性
     * @min -2147483648
     * @max 2147483647
     */
    importance?: number;
    /** 最后访问时间 */
    lastAccessAt?: string | null;
    /**
     * 记忆类型
     * @maxLength 16
     */
    memoryType?: string;
    /** 元数据 */
    metadata?: Record<string, any>;
    /** 会话ID */
    sessionId?: string | null;
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
     * 用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId: string;
  };
  /**
   * 是否自动生成向量嵌入（需要配置嵌入服务）
   * @default false
   */
  generateEmbedding?: boolean;
}

export interface PostApiAiUserMemoryQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

/** 排序字段 */
export enum PostApiAiUserMemoryQueryFieldEnum {
  Importance = "importance",
  AccessCount = "accessCount",
  LastAccessAt = "lastAccessAt",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  ExpireAt = "expireAt",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiAiUserMemoryQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** 用户记忆分页查询请求体 */
export interface PostApiAiUserMemoryQueryPayload {
  /** 用户记忆过滤条件 */
  filter?: {
    /** 按Agent ID精确匹配（创建此记忆的Agent，可能是外部Agent） */
    agentId?: string;
    /** 按Agent ID列表精确匹配 */
    agentIds?: string[];
    /** 按内容模糊搜索 */
    content?: string;
    /** 创建时间范围-结束，ISO 8601格式 */
    createdAtEnd?: string;
    /** 创建时间范围-开始，ISO 8601格式 */
    createdAtStart?: string;
    /** 过期时间范围-结束 */
    expireAtEnd?: string;
    /** 过期时间范围-开始 */
    expireAtStart?: string;
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 重要性最大值（1-10） */
    importanceMax?: number;
    /** 重要性最小值（1-10） */
    importanceMin?: number;
    /** 是否包含已过期记忆，默认false */
    includeExpired?: boolean;
    /** 按记忆类型精确匹配：STM=短期，LTM=长期，PREFERENCE=偏好，FACT=事实，EPISODIC=情景 */
    memoryType?: string;
    /** 按记忆类型列表精确匹配 */
    memoryTypes?: string[];
    /** 按会话ID精确匹配 */
    sessionId?: string;
    /** 按会话ID列表精确匹配 */
    sessionIds?: string[];
    /** 按状态精确匹配：0=正常，1=禁用 */
    status?: string;
    /** 按用户ID精确匹配 */
    userId?: string;
    /** 按用户ID列表精确匹配 */
    userIds?: string[];
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiAiUserMemoryQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
    order: PostApiAiUserMemoryQueryOrderEnum;
  };
}

export interface PostApiAiUserMemorySemanticSearchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

/** 语义检索请求体 */
export interface PostApiAiUserMemorySemanticSearchPayload {
  /**
   * 是否考虑记忆衰减
   * @default true
   */
  considerDecay?: boolean;
  /**
   * 是否包含已过期记忆
   * @default false
   */
  includeExpired?: boolean;
  /** 限定记忆类型 */
  memoryTypes?: string[];
  /**
   * 最小相似度阈值（0-1）
   * @min 0
   * @max 1
   * @default 0.5
   */
  minSimilarity?: number;
  /** 检索文本，将转换为向量进行相似度匹配 */
  query: string;
  /**
   * 返回最相似的K条记忆
   * @min 1
   * @max 50
   * @default 10
   */
  topK?: number;
  /** 用户ID */
  userId: string;
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

/** 排序字段 */
export enum PostApiImConversationQueryFieldEnum {
  Name = "name",
  LastMessageAt = "lastMessageAt",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  MemberCount = "memberCount",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiImConversationQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** IM会话分页查询请求体 */
export interface PostApiImConversationQueryPayload {
  /** 会话过滤条件 */
  filter?: {
    /**
     * 创建时间范围-结束，ISO 8601格式
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * 创建时间范围-开始，ISO 8601格式
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 是否静音 */
    isMuted?: boolean;
    /** 是否置顶 */
    isTop?: boolean;
    /**
     * 最后消息时间范围-结束，ISO 8601格式
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    lastMessageAtEnd?: string;
    /**
     * 最后消息时间范围-开始，ISO 8601格式
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    lastMessageAtStart?: string;
    /** 按会话名称模糊搜索 */
    name?: string;
    /** 按群主ID精确匹配 */
    ownerId?: string;
    /** 按状态精确匹配：0=正常，1=禁用 */
    status?: string;
    /** 按会话类型精确匹配：01=单聊，02=群聊 */
    type?: string;
    /** 按会话类型列表精确匹配 */
    types?: string[];
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiImConversationQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
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

/** 排序字段 */
export enum PostApiImMessageQueryFieldEnum {
  MsgSeq = "msgSeq",
  CreatedAt = "createdAt",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiImMessageQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** IM消息分页查询请求体 */
export interface PostApiImMessageQueryPayload {
  /** 消息过滤条件 */
  filter?: {
    /** 按会话ID精确匹配 */
    conversationId?: string;
    /** 按会话ID列表精确匹配 */
    conversationIds?: string[];
    /**
     * 创建时间范围-结束，ISO 8601格式
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * 创建时间范围-开始，ISO 8601格式
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 是否已撤回 */
    isRecalled?: boolean;
    /** 消息序号范围-结束 */
    msgSeqEnd?: number;
    /** 消息序号范围-开始 */
    msgSeqStart?: number;
    /** 按消息类型精确匹配：01=文本，02=链接，03=图片，04=视频，05=音频，06=文件 */
    msgType?: string;
    /** 按消息类型列表精确匹配 */
    msgTypes?: string[];
    /** 按发送者ID精确匹配 */
    senderId?: string;
    /** 按发送者ID列表精确匹配 */
    senderIds?: string[];
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiImMessageQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
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

export interface PostApiKnowledgeFavoritesCheckData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeFavoritesCheckPayload {
  /** 要检查的节点 ID 列表 */
  nodeIds: string[];
}

export interface PostApiKnowledgeFavoritesData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeFavoritesListData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeFavoritesListPayload {
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 节点类型：folder=文件夹，file=文件 */
  type?: PostApiKnowledgeFavoritesListTypeEnum;
}

/** 节点类型：folder=文件夹，file=文件 */
export enum PostApiKnowledgeFavoritesListTypeEnum {
  Folder = "folder",
  File = "file",
}

export interface PostApiKnowledgeFavoritesPayload {
  /** 要收藏的节点 ID */
  nodeId: string;
}

export interface PostApiKnowledgeNodesByIdCopyData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeNodesByIdCopyParams {
  /** 节点 ID */
  id: string;
}

export interface PostApiKnowledgeNodesByIdCopyPayload {
  /** 目标父文件夹 ID，null 表示复制到根目录 */
  targetParentId: string | null;
}

export interface PostApiKnowledgeNodesByIdMoveData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeNodesByIdMoveParams {
  /** 节点 ID */
  id: string;
}

export interface PostApiKnowledgeNodesByIdMovePayload {
  /** 目标父文件夹 ID，null 表示移动到根目录 */
  targetParentId: string | null;
}

export interface PostApiKnowledgeNodesByIdPermissionsData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

/**
 * 权限效果：allow=允许，deny=拒绝
 * @default "allow"
 */
export enum PostApiKnowledgeNodesByIdPermissionsEffectEnum {
  Allow = "allow",
  Deny = "deny",
}

export interface PostApiKnowledgeNodesByIdPermissionsParams {
  /** 节点 ID */
  id: string;
}

export interface PostApiKnowledgeNodesByIdPermissionsPayload {
  /**
   * 权限效果：allow=允许，deny=拒绝
   * @default "allow"
   */
  effect?: PostApiKnowledgeNodesByIdPermissionsEffectEnum;
  /** 权限类型：read=读取，write=写入，delete=删除，manage=管理 */
  permission: PostApiKnowledgeNodesByIdPermissionsPermissionEnum;
  /** 主体 ID */
  subjectId: string;
  /** 主体类型：user=用户，role=角色，dept=部门 */
  subjectType: PostApiKnowledgeNodesByIdPermissionsSubjectTypeEnum;
}

/** 权限类型：read=读取，write=写入，delete=删除，manage=管理 */
export enum PostApiKnowledgeNodesByIdPermissionsPermissionEnum {
  Read = "read",
  Write = "write",
  Delete = "delete",
  Manage = "manage",
}

/** 主体类型：user=用户，role=角色，dept=部门 */
export enum PostApiKnowledgeNodesByIdPermissionsSubjectTypeEnum {
  User = "user",
  Role = "role",
  Dept = "dept",
}

export interface PostApiKnowledgeNodesByIdQuickShareData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

/** 共享级别：read=只读，edit=可编辑，full=完全控制 */
export enum PostApiKnowledgeNodesByIdQuickShareLevelEnum {
  Read = "read",
  Edit = "edit",
  Full = "full",
}

export interface PostApiKnowledgeNodesByIdQuickShareParams {
  /** 节点 ID */
  id: string;
}

export interface PostApiKnowledgeNodesByIdQuickSharePayload {
  /** 共享级别：read=只读，edit=可编辑，full=完全控制 */
  level: PostApiKnowledgeNodesByIdQuickShareLevelEnum;
  /** 目标用户 ID 列表 */
  userIds: string[];
}

export interface PostApiKnowledgeNodesByIdRevokeShareData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeNodesByIdRevokeShareParams {
  /** 节点 ID */
  id: string;
}

export interface PostApiKnowledgeNodesByIdRevokeSharePayload {
  /** 要撤销共享的用户 ID 列表 */
  userIds: string[];
}

export interface PostApiKnowledgeNodesCheckExistsData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeNodesCheckExistsPayload {
  /** 要检查的名称列表 */
  names: string[];
  /** 父文件夹 ID，null 表示根目录 */
  parentId?: string | null;
  /** 节点类型：folder=文件夹，file=文件 */
  type?: PostApiKnowledgeNodesCheckExistsTypeEnum;
}

/** 节点类型：folder=文件夹，file=文件 */
export enum PostApiKnowledgeNodesCheckExistsTypeEnum {
  Folder = "folder",
  File = "file",
}

export interface PostApiKnowledgeNodesData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeNodesDeleteBatchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeNodesDeleteBatchPayload {
  ids: string[];
}

export interface PostApiKnowledgeNodesPayload {
  /** 存储桶 */
  bucket?: string;
  /** 颜色（文件夹） */
  color?: string;
  /** 描述 */
  description?: string;
  /** ETag */
  etag?: string;
  /** 文件扩展名 */
  extension?: string;
  /** 图标（文件夹） */
  icon?: string;
  /** MIME 类型 */
  mimeType?: string;
  /**
   * 节点名称
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /** 父文件夹 ID，null 表示根目录 */
  parentId?: string | null;
  /** 文件大小（字节） */
  size?: number;
  /** 存储键 */
  storageKey?: string;
  /** 节点类型：folder=文件夹，file=文件 */
  type: PostApiKnowledgeNodesTypeEnum;
  /** 版本 ID */
  versionId?: string;
}

export interface PostApiKnowledgeNodesQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

/** 排序字段 */
export enum PostApiKnowledgeNodesQueryFieldEnum {
  Name = "name",
  Type = "type",
  Size = "size",
  OrderNum = "orderNum",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向 */
export enum PostApiKnowledgeNodesQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiKnowledgeNodesQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 创建时间结束 */
    createdAtEnd?: string;
    /** 创建时间起始 */
    createdAtStart?: string;
    /** 文件扩展名 */
    extension?: string;
    /** 节点 ID 列表，批量查询 */
    ids?: string[];
    /** 是否公开 */
    isPublic?: boolean;
    /** 名称（模糊匹配） */
    name?: string;
    /** 父文件夹 ID，null 表示根目录 */
    parentId?: string | null;
    /** 节点类型：folder=文件夹，file=文件 */
    type?: PostApiKnowledgeNodesQueryTypeEnum;
    /** 节点类型列表 */
    types?: PostApiKnowledgeNodesQueryTypesEnum[];
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiKnowledgeNodesQueryFieldEnum;
    /** 排序方向 */
    order: PostApiKnowledgeNodesQueryOrderEnum;
  };
}

/** 节点类型：folder=文件夹，file=文件 */
export enum PostApiKnowledgeNodesQueryTypeEnum {
  Folder = "folder",
  File = "file",
}

export enum PostApiKnowledgeNodesQueryTypesEnum {
  Folder = "folder",
  File = "file",
}

export interface PostApiKnowledgeNodesSearchData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeNodesSearchPayload {
  /**
   * 搜索关键词
   * @minLength 1
   * @maxLength 100
   */
  keyword: string;
  /**
   * 返回数量限制
   * @min 1
   * @max 50
   * @default 20
   */
  limit?: number;
  /** 节点类型：folder=文件夹，file=文件 */
  type?: PostApiKnowledgeNodesSearchTypeEnum;
}

/** 节点类型：folder=文件夹，file=文件 */
export enum PostApiKnowledgeNodesSearchTypeEnum {
  Folder = "folder",
  File = "file",
}

/** 节点类型：folder=文件夹，file=文件 */
export enum PostApiKnowledgeNodesTypeEnum {
  Folder = "folder",
  File = "file",
}

export interface PostApiKnowledgeShareMySharedData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeShareMySharedPayload {
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 节点类型：folder=文件夹，file=文件 */
  type?: PostApiKnowledgeShareMySharedTypeEnum;
}

/** 节点类型：folder=文件夹，file=文件 */
export enum PostApiKnowledgeShareMySharedTypeEnum {
  Folder = "folder",
  File = "file",
}

export interface PostApiKnowledgeShareSharedWithMeData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeShareSharedWithMePayload {
  /** 文件夹 ID，用于浏览共享文件夹内容 */
  folderId?: string;
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 50
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 节点类型：folder=文件夹，file=文件 */
  type?: PostApiKnowledgeShareSharedWithMeTypeEnum;
}

/** 节点类型：folder=文件夹，file=文件 */
export enum PostApiKnowledgeShareSharedWithMeTypeEnum {
  Folder = "folder",
  File = "file",
}

export interface PostApiKnowledgeUploadConfirmData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeUploadConfirmPayload {
  /** 文件描述 */
  description?: string;
  /** 文件 MIME 类型 */
  mimeType: string;
  /**
   * 文件名
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /** 父文件夹 ID，null 表示根目录 */
  parentId?: string | null;
  /** 文件大小（字节） */
  size: number;
  /** 存储键 */
  storageKey: string;
}

export interface PostApiKnowledgeUploadDirectData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeUploadDirectPayload {
  /** 文件内容（Base64 编码） */
  content: string;
  /** 文件描述 */
  description?: string;
  /** 文件 MIME 类型 */
  mimeType?: string;
  /**
   * 文件名
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /** 父文件夹 ID，null 表示根目录 */
  parentId?: string | null;
}

/** 冲突处理模式：overwrite=覆盖，newVersion=新版本，copy=复制 */
export enum PostApiKnowledgeUploadForceConflictModeEnum {
  Overwrite = "overwrite",
  NewVersion = "newVersion",
  Copy = "copy",
}

export interface PostApiKnowledgeUploadForceData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeUploadForcePayload {
  /** 冲突处理模式：overwrite=覆盖，newVersion=新版本，copy=复制 */
  conflictMode: PostApiKnowledgeUploadForceConflictModeEnum;
  /** 文件内容（Base64 编码） */
  content: string;
  /** 文件描述 */
  description?: string;
  /** 已存在的节点 ID（用于覆盖或新版本） */
  existingNodeId?: string;
  /** 文件 MIME 类型 */
  mimeType?: string;
  /**
   * 文件名
   * @minLength 1
   * @maxLength 255
   */
  name: string;
  /** 父文件夹 ID，null 表示根目录 */
  parentId?: string | null;
}

export interface PostApiKnowledgeUploadUrlData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeUploadUrlPayload {
  /**
   * 文件名
   * @minLength 1
   * @maxLength 255
   */
  filename: string;
  /** 文件 MIME 类型 */
  mimeType: string;
  /** 父文件夹 ID，null 表示根目录 */
  parentId?: string | null;
}

export interface PostApiKnowledgeVersionsByIdRestoreData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiKnowledgeVersionsByIdRestoreParams {
  /** 版本 ID */
  id: string;
}

export interface PostApiKnowledgeVersionsQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

/** 排序字段 */
export enum PostApiKnowledgeVersionsQueryFieldEnum {
  VersionNumber = "versionNumber",
  Size = "size",
  CreatedAt = "createdAt",
}

/** 排序方向 */
export enum PostApiKnowledgeVersionsQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiKnowledgeVersionsQueryPayload {
  /** 过滤条件 */
  filter?: {
    /**
     * 创建时间结束
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * 创建时间起始
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    /** 节点 ID，单个查询 */
    nodeId?: string;
    /** 节点 ID 列表，批量查询 */
    nodeIds?: string[];
    /** 版本号 */
    versionNumber?: string;
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiKnowledgeVersionsQueryFieldEnum;
    /** 排序方向 */
    order: PostApiKnowledgeVersionsQueryOrderEnum;
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

/** 排序字段 */
export enum PostApiSystemConfigQueryFieldEnum {
  Name = "name",
  Key = "key",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiSystemConfigQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** 系统配置分页查询请求体 */
export interface PostApiSystemConfigQueryPayload {
  /** 配置过滤条件 */
  filter?: {
    /** 创建时间范围-结束，ISO 8601格式 */
    createdAtEnd?: string;
    /** 创建时间范围-开始，ISO 8601格式 */
    createdAtStart?: string;
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 是否系统内置配置 */
    isSystem?: boolean;
    /** 按配置键模糊搜索 */
    key?: string;
    /** 按配置键列表精确匹配，如 ["sys.name", "sys.logo"] */
    keys?: string[];
    /** 按配置名称模糊搜索 */
    name?: string;
    /** 按配置名称列表精确匹配 */
    names?: string[];
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemConfigQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
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
    /** UUID物化路径（用于高效查询祖先/后代） */
    materializedPath?: string;
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
    /** UUID物化路径（用于高效查询祖先/后代） */
    materializedPath?: string;
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

/** 排序字段 */
export enum PostApiSystemDepartmentQueryFieldEnum {
  Name = "name",
  OrderNum = "orderNum",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向 */
export enum PostApiSystemDepartmentQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemDepartmentQueryPayload {
  /** 过滤条件 */
  filter?: {
    /**
     * 创建时间结束
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd?: string;
    /**
     * 创建时间起始
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart?: string;
    /** 部门 ID 列表，批量查询 */
    ids?: string[];
    /** 部门名称（模糊匹配） */
    name?: string;
    /** 部门名称列表，批量查询 */
    names?: string[];
    /** 父部门 ID，null 表示顶级部门 */
    parentId?: string | null;
    /** 状态：true=启用，false=禁用 */
    status?: boolean;
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemDepartmentQueryFieldEnum;
    /** 排序方向 */
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

/** 排序字段 */
export enum PostApiSystemDictGroupQueryFieldEnum {
  Key = "key",
  Name = "name",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiSystemDictGroupQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** 字典组分页查询请求体 */
export interface PostApiSystemDictGroupQueryPayload {
  /** 字典组过滤条件 */
  filter?: {
    /** 创建时间范围-结束，ISO 8601格式 */
    createdAtEnd?: string;
    /** 创建时间范围-开始，ISO 8601格式 */
    createdAtStart?: string;
    /** 按字典组键模糊搜索 */
    key?: string;
    /** 按字典组键列表精确匹配 */
    keys?: string[];
    /** 按字典组名称模糊搜索 */
    name?: string;
    /** 按字典组名称列表精确匹配 */
    names?: string[];
    /** 按状态精确匹配：0=正常，1=禁用 */
    status?: PostApiSystemDictGroupQueryStatusEnum;
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemDictGroupQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
    order: PostApiSystemDictGroupQueryOrderEnum;
  };
}

/** 按状态精确匹配：0=正常，1=禁用 */
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

/** 排序字段 */
export enum PostApiSystemDictQueryFieldEnum {
  Group = "group",
  Label = "label",
  Sort = "sort",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向：asc=升序，desc=降序 */
export enum PostApiSystemDictQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

/** 字典分页查询请求体 */
export interface PostApiSystemDictQueryPayload {
  /** 字典过滤条件 */
  filter?: {
    /** 创建时间范围-结束，ISO 8601格式 */
    createdAtEnd?: string;
    /** 创建时间范围-开始，ISO 8601格式 */
    createdAtStart?: string;
    /** 按分组模糊搜索 */
    group?: string;
    /** 按分组列表精确匹配 */
    groups?: string[];
    /** 按ID列表精确匹配 */
    ids?: string[];
    /** 是否默认值 */
    isDefault?: boolean;
    /** 按标签模糊搜索 */
    label?: string;
    /** 按标签列表精确匹配 */
    labels?: string[];
    /** 按状态精确匹配：0=正常，1=禁用 */
    status?: PostApiSystemDictQueryStatusEnum;
  };
  /**
   * 每页数量，1-100
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 分页偏移量，从0开始
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemDictQueryFieldEnum;
    /** 排序方向：asc=升序，desc=降序 */
    order: PostApiSystemDictQueryOrderEnum;
  };
}

/** 按状态精确匹配：0=正常，1=禁用 */
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

/** 排序字段 */
export enum PostApiSystemJobLogQueryFieldEnum {
  JobName = "jobName",
  JobGroup = "jobGroup",
  StartTime = "startTime",
  StopTime = "stopTime",
  CreatedAt = "createdAt",
}

/** 排序方向 */
export enum PostApiSystemJobLogQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemJobLogQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 创建时间结束 */
    createdAtEnd?: string;
    /** 创建时间起始 */
    createdAtStart?: string;
    /** 日志 ID 列表，批量查询 */
    ids?: string[];
    /** 任务分组（模糊匹配） */
    jobGroup?: string;
    /** 任务分组列表，批量查询 */
    jobGroups?: string[];
    /** 任务名称（模糊匹配） */
    jobName?: string;
    /** 任务名称列表，批量查询 */
    jobNames?: string[];
    /** 执行开始时间结束 */
    startTimeEnd?: string;
    /** 执行开始时间起始 */
    startTimeStart?: string;
    /** 状态：0=成功，1=失败 */
    status?: PostApiSystemJobLogQueryStatusEnum;
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemJobLogQueryFieldEnum;
    /** 排序方向 */
    order: PostApiSystemJobLogQueryOrderEnum;
  };
}

/** 状态：0=成功，1=失败 */
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

/** 排序字段 */
export enum PostApiSystemJobQueryFieldEnum {
  Name = "name",
  Group = "group",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向 */
export enum PostApiSystemJobQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemJobQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 是否允许并发执行 */
    concurrent?: boolean;
    /** 创建时间结束 */
    createdAtEnd?: string;
    /** 创建时间起始 */
    createdAtStart?: string;
    /** 任务分组（模糊匹配） */
    group?: string;
    /** 任务分组列表，批量查询 */
    groups?: string[];
    /** 任务 ID 列表，批量查询 */
    ids?: string[];
    /** 任务名称（模糊匹配） */
    name?: string;
    /** 任务名称列表，批量查询 */
    names?: string[];
    /** 状态：0=正常，1=暂停 */
    status?: PostApiSystemJobQueryStatusEnum;
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemJobQueryFieldEnum;
    /** 排序方向 */
    order: PostApiSystemJobQueryOrderEnum;
  };
}

/** 状态：0=正常，1=暂停 */
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

/** 排序字段 */
export enum PostApiSystemLoginInfoQueryFieldEnum {
  LoginName = "loginName",
  Ipaddr = "ipaddr",
  LoginTime = "loginTime",
  CreatedAt = "createdAt",
}

/** 排序方向 */
export enum PostApiSystemLoginInfoQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemLoginInfoQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 创建时间结束 */
    createdAtEnd?: string;
    /** 创建时间起始 */
    createdAtStart?: string;
    /** 日志 ID 列表，批量查询 */
    ids?: string[];
    /** IP 地址（模糊匹配） */
    ipaddr?: string;
    /** 登录账号（模糊匹配） */
    loginName?: string;
    /** 登录账号列表，批量查询 */
    loginNames?: string[];
    /** 登录时间结束 */
    loginTimeEnd?: string;
    /** 登录时间起始 */
    loginTimeStart?: string;
    /** 状态：0=成功，1=失败 */
    status?: PostApiSystemLoginInfoQueryStatusEnum;
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemLoginInfoQueryFieldEnum;
    /** 排序方向 */
    order: PostApiSystemLoginInfoQueryOrderEnum;
  };
}

/** 状态：0=成功，1=失败 */
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

/** 排序字段 */
export enum PostApiSystemMenuQueryFieldEnum {
  Name = "name",
  OrderNum = "orderNum",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向 */
export enum PostApiSystemMenuQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemMenuQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 创建时间结束 */
    createdAtEnd?: string;
    /** 创建时间起始 */
    createdAtStart?: string;
    /** 菜单 ID 列表，批量查询 */
    ids?: string[];
    /** 菜单名称（模糊匹配） */
    name?: string;
    /** 菜单名称列表，批量查询 */
    names?: string[];
    /** 父级菜单 ID，null 表示顶级菜单 */
    parentId?: string | null;
    /** 菜单类型：M=目录，C=菜单，F=按钮 */
    type?: string;
    /** 菜单类型列表：M=目录，C=菜单，F=按钮 */
    types?: string[];
    /** 是否可见 */
    visible?: boolean;
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemMenuQueryFieldEnum;
    /** 排序方向 */
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

export interface PostApiSystemNoticeByIdPublishData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemNoticeByIdPublishParams {
  /**
   * 通知 ID
   * @format uuid
   * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
   */
  id: string;
}

export interface PostApiSystemNoticeByIdWithdrawData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemNoticeByIdWithdrawParams {
  /**
   * 通知 ID
   * @format uuid
   * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
   */
  id: string;
}

export interface PostApiSystemNoticeData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemNoticeMyData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

/** 排序字段 */
export enum PostApiSystemNoticeMyFieldEnum {
  PublishedAt = "publishedAt",
  CreatedAt = "createdAt",
}

/** 排序方向 */
export enum PostApiSystemNoticeMyOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemNoticeMyPayload {
  filter?: {
    /** 是否已读 */
    isRead?: boolean;
    /** 类型：1=通知，2=公告 */
    type?: string;
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  sort?: {
    /** 排序字段 */
    field: PostApiSystemNoticeMyFieldEnum;
    /** 排序方向 */
    order: PostApiSystemNoticeMyOrderEnum;
  };
}

export interface PostApiSystemNoticeQueryData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

/** 排序字段 */
export enum PostApiSystemNoticeQueryFieldEnum {
  Title = "title",
  Type = "type",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向 */
export enum PostApiSystemNoticeQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemNoticeQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 创建时间结束 */
    createdAtEnd?: string;
    /** 创建时间起始 */
    createdAtStart?: string;
    /** 通知 ID 列表，批量查询 */
    ids?: string[];
    /** 状态：0=正常，1=关闭 */
    status?: PostApiSystemNoticeQueryStatusEnum;
    /** 标题（模糊匹配） */
    title?: string;
    /** 标题列表，批量查询 */
    titles?: string[];
    /** 类型：1=通知，2=公告 */
    type?: string;
    /** 类型列表：1=通知，2=公告 */
    types?: string[];
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemNoticeQueryFieldEnum;
    /** 排序方向 */
    order: PostApiSystemNoticeQueryOrderEnum;
  };
}

/** 状态：0=正常，1=关闭 */
export enum PostApiSystemNoticeQueryStatusEnum {
  Value0 = "0",
  Value1 = "1",
}

export interface PostApiSystemNoticeReadMarkData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemNoticeReadMarkManyData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiSystemNoticeReadMarkManyPayload {
  /** 通知 ID 列表 */
  noticeIds: string[];
}

export interface PostApiSystemNoticeReadMarkPayload {
  /**
   * 通知 ID
   * @format uuid
   * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
   */
  noticeId: string;
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

/** 排序字段 */
export enum PostApiSystemOperationLogQueryFieldEnum {
  Title = "title",
  Name = "name",
  Time = "time",
}

/** 排序方向 */
export enum PostApiSystemOperationLogQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemOperationLogQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 日志 ID 列表，批量查询 */
    ids?: string[];
    /** 操作人员（模糊匹配） */
    name?: string;
    /** 操作人员列表，批量查询 */
    names?: string[];
    /** 状态：0=成功，1=失败 */
    status?: PostApiSystemOperationLogQueryStatusEnum;
    /** 操作时间结束 */
    timeEnd?: string;
    /** 操作时间起始 */
    timeStart?: string;
    /** 操作模块（模糊匹配） */
    title?: string;
    /** 操作模块列表，批量查询 */
    titles?: string[];
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemOperationLogQueryFieldEnum;
    /** 排序方向 */
    order: PostApiSystemOperationLogQueryOrderEnum;
  };
}

/** 状态：0=成功，1=失败 */
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

/** 排序字段 */
export enum PostApiSystemPermissionQueryFieldEnum {
  Code = "code",
  Name = "name",
  OrderNum = "orderNum",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向 */
export enum PostApiSystemPermissionQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemPermissionQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 权限编码（模糊匹配） */
    code?: string;
    /** 权限编码列表，批量查询 */
    codes?: string[];
    /** 权限 ID 列表，批量查询 */
    ids?: string[];
    /** 模块列表：system/ai/im/knowledge 等 */
    modules?: string[];
    /** 权限名称（模糊匹配） */
    name?: string;
    /** 父级权限 ID，null 表示顶级权限 */
    parentId?: string | null;
    /** 状态：true=启用，false=禁用 */
    status?: boolean;
    /** 权限类型列表：menu=菜单权限，button=按钮权限，api=接口权限 */
    types?: string[];
  };
  /**
   * 每页数量
   * @min 1
   * @max 1000
   * @default 100
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemPermissionQueryFieldEnum;
    /** 排序方向 */
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

/** 排序字段 */
export enum PostApiSystemPostQueryFieldEnum {
  Code = "code",
  Name = "name",
  Sort = "sort",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向 */
export enum PostApiSystemPostQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemPostQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 岗位编码（模糊匹配） */
    code?: string;
    /** 岗位编码列表，批量查询 */
    codes?: string[];
    /** 创建时间结束 */
    createdAtEnd?: string;
    /** 创建时间起始 */
    createdAtStart?: string;
    /** 岗位 ID 列表，批量查询 */
    ids?: string[];
    /** 岗位名称（模糊匹配） */
    name?: string;
    /** 岗位名称列表，批量查询 */
    names?: string[];
    /** 状态：0=正常，1=禁用 */
    status?: PostApiSystemPostQueryStatusEnum;
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemPostQueryFieldEnum;
    /** 排序方向 */
    order: PostApiSystemPostQueryOrderEnum;
  };
}

/** 状态：0=正常，1=禁用 */
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

/** 排序字段 */
export enum PostApiSystemRoleDepartmentQueryFieldEnum {
  RoleId = "roleId",
  DepartmentId = "departmentId",
}

/** 排序方向 */
export enum PostApiSystemRoleDepartmentQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemRoleDepartmentQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 部门 ID */
    departmentId?: string;
    /** 部门 ID 列表，批量查询 */
    departmentIds?: string[];
    /** 角色 ID */
    roleId?: string;
    /** 角色 ID 列表，批量查询 */
    roleIds?: string[];
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemRoleDepartmentQueryFieldEnum;
    /** 排序方向 */
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

/** 排序字段 */
export enum PostApiSystemRoleMenuQueryFieldEnum {
  RoleId = "roleId",
  MenuId = "menuId",
}

/** 排序方向 */
export enum PostApiSystemRoleMenuQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemRoleMenuQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 菜单 ID */
    menuId?: string;
    /** 菜单 ID 列表，批量查询 */
    menuIds?: string[];
    /** 角色 ID */
    roleId?: string;
    /** 角色 ID 列表，批量查询 */
    roleIds?: string[];
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemRoleMenuQueryFieldEnum;
    /** 排序方向 */
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

/** 排序字段 */
export enum PostApiSystemRoleQueryFieldEnum {
  Name = "name",
  Key = "key",
  Sort = "sort",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
}

/** 排序方向 */
export enum PostApiSystemRoleQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemRoleQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 创建时间结束 */
    createdAtEnd?: string;
    /** 创建时间起始 */
    createdAtStart?: string;
    /** 角色 ID 列表，批量查询 */
    ids?: string[];
    /** 角色标识（模糊匹配） */
    key?: string;
    /** 角色标识列表，批量查询 */
    keys?: string[];
    /** 角色名称（模糊匹配） */
    name?: string;
    /** 角色名称列表，批量查询 */
    names?: string[];
    /** 状态：0=正常，1=禁用 */
    status?: PostApiSystemRoleQueryStatusEnum;
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemRoleQueryFieldEnum;
    /** 排序方向 */
    order: PostApiSystemRoleQueryOrderEnum;
  };
}

/** 状态：0=正常，1=禁用 */
export enum PostApiSystemRoleQueryStatusEnum {
  Value0 = "0",
  Value1 = "1",
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

/** 排序字段 */
export enum PostApiSystemUserPostQueryFieldEnum {
  UserId = "userId",
  PostId = "postId",
}

/** 排序方向 */
export enum PostApiSystemUserPostQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemUserPostQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 岗位 ID */
    postId?: string;
    /** 岗位 ID 列表，批量查询 */
    postIds?: string[];
    /** 用户 ID */
    userId?: string;
    /** 用户 ID 列表，批量查询 */
    userIds?: string[];
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemUserPostQueryFieldEnum;
    /** 排序方向 */
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

/** 排序字段 */
export enum PostApiSystemUserQueryFieldEnum {
  LoginName = "loginName",
  Name = "name",
  CreatedAt = "createdAt",
  UpdatedAt = "updatedAt",
  LoginDate = "loginDate",
}

/** 排序方向 */
export enum PostApiSystemUserQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemUserQueryPayload {
  /** 过滤条件 */
  filter?: {
    /**
     * 创建时间结束
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtEnd: string;
    /**
     * 创建时间起始
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    createdAtStart: string;
    /** 部门 ID */
    deptId: string;
    /** 邮箱（模糊匹配） */
    email: string;
    /** 用户 ID 列表，批量查询 */
    ids: string[];
    /**
     * 最后登录时间结束
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    loginDateEnd: string;
    /**
     * 最后登录时间起始
     * @format date-time
     * @pattern ^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z))$
     */
    loginDateStart: string;
    /** 登录名（模糊匹配） */
    loginName: string;
    /** 登录名列表，批量查询 */
    loginNames: string[];
    /** 用户名（模糊匹配） */
    name: string;
    /** 手机号（模糊匹配） */
    phonenumber: string;
    /** 性别：0=男，1=女，2=未知 */
    sex: string;
    /** 状态：0=正常，1=禁用 */
    status: string;
    /** 用户类型：00=系统管理员，01=普通用户 */
    userType: string;
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemUserQueryFieldEnum;
    /** 排序方向 */
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

/** 排序字段 */
export enum PostApiSystemUserRoleQueryFieldEnum {
  UserId = "userId",
  RoleId = "roleId",
}

/** 排序方向 */
export enum PostApiSystemUserRoleQueryOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

export interface PostApiSystemUserRoleQueryPayload {
  /** 过滤条件 */
  filter?: {
    /** 角色 ID */
    roleId?: string;
    /** 角色 ID 列表，批量查询 */
    roleIds?: string[];
    /** 用户 ID */
    userId?: string;
    /** 用户 ID 列表，批量查询 */
    userIds?: string[];
  };
  /**
   * 每页数量
   * @min 1
   * @max 100
   * @default 20
   */
  limit?: number;
  /**
   * 偏移量
   * @min 0
   * @max 9007199254740991
   * @default 0
   */
  offset?: number;
  /** 排序配置 */
  sort?: {
    /** 排序字段 */
    field: PostApiSystemUserRoleQueryFieldEnum;
    /** 排序方向 */
    order: PostApiSystemUserRoleQueryOrderEnum;
  };
}

export interface PostApiWsMessageGroupData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiWsMessageGroupPayload {
  /** @的用户 ID 列表 */
  atUserIds?: string[];
  /** 消息内容 */
  content: any;
  /** 群聊会话 ID */
  conversationId: string;
  /**
   * 消息类型：01=文本，02=链接，03=图片，04=视频，05=音频，06=文件
   * @default "01"
   */
  msgType?: string;
  /** 回复的消息 ID */
  replyToId?: string;
}

export interface PostApiWsMessagePrivateData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiWsMessagePrivatePayload {
  /** 消息内容 */
  content: any;
  /**
   * 消息类型：01=文本，02=链接，03=图片，04=视频，05=音频，06=文件
   * @default "01"
   */
  msgType?: string;
  /** 回复的消息 ID */
  replyToId?: string;
  /** 目标用户 ID */
  targetUserId: string;
}

export interface PostApiWsMessageSendData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiWsMessageSendPayload {
  /** @的用户 ID 列表 */
  atUserIds?: string[];
  /** 消息内容，根据 msgType 不同结构不同 */
  content: any;
  /** 目标会话 ID */
  conversationId: string;
  /**
   * 消息类型：01=文本，02=链接，03=图片，04=视频，05=音频，06=文件
   * @default "01"
   */
  msgType?: string;
  /** 回复的消息 ID */
  replyToId?: string;
}

export interface PostApiWsNotificationBroadcastData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiWsNotificationBroadcastPayload {
  /** 通知内容 */
  content: string;
  /** 附加数据，可包含链接等信息 */
  data?: Record<string, any>;
  /** 通知标题 */
  title: string;
  /**
   * 通知类型
   * @default "info"
   */
  type?: PostApiWsNotificationBroadcastTypeEnum;
  /** 目标用户 ID 列表 */
  userIds: string[];
}

/**
 * 通知类型
 * @default "info"
 */
export enum PostApiWsNotificationBroadcastTypeEnum {
  Info = "info",
  Success = "success",
  Warning = "warning",
  Error = "error",
}

export interface PostApiWsUsersCheckOnlineData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PostApiWsUsersCheckOnlinePayload {
  /** 要检查的用户 ID 列表 */
  userIds: string[];
}

export interface PostMcpByIdParams {
  id: string;
}

export type PostMcpByIdPayload = any;

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

export interface PutApiAiUserMemoryByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiAiUserMemoryByIdParams {
  /** 记忆ID */
  id: string;
}

/** 更新用户记忆请求体 */
export interface PutApiAiUserMemoryByIdPayload {
  /** 更新数据 */
  data: {
    /**
     * 访问次数
     * @min -2147483648
     * @max 2147483647
     */
    accessCount?: number;
    /** Agent ID */
    agentId?: string | null;
    /** 记忆内容 */
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
    /** 向量嵌入 */
    embedding?: number[];
    /** 过期时间 */
    expireAt?: string | null;
    /**
     * 主键ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    id?: string;
    /**
     * 重要性
     * @min -2147483648
     * @max 2147483647
     */
    importance?: number;
    /** 最后访问时间 */
    lastAccessAt?: string | null;
    /**
     * 记忆类型
     * @maxLength 16
     */
    memoryType?: string;
    /** 元数据 */
    metadata?: Record<string, any>;
    /** 会话ID */
    sessionId?: string | null;
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
     * 用户ID
     * @format uuid
     * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
     */
    userId?: string;
  };
  /**
   * 是否重新生成向量嵌入
   * @default false
   */
  regenerateEmbedding?: boolean;
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

export interface PutApiKnowledgeNodesByIdData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiKnowledgeNodesByIdParams {
  id: string;
}

export interface PutApiKnowledgeNodesByIdPayload {
  /** 颜色（文件夹） */
  color?: string | null;
  /** 描述 */
  description?: string | null;
  /** 图标（文件夹） */
  icon?: string | null;
  /** 是否公开 */
  isPublic?: boolean;
  /**
   * 节点名称
   * @minLength 1
   * @maxLength 255
   */
  name?: string;
  /**
   * 排序序号
   * @min -9007199254740991
   * @max 9007199254740991
   */
  orderNum?: number;
  /** 标签列表 */
  tags?: string[];
}

export interface PutApiKnowledgeNodesByIdPermissionsData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

/**
 * 权限效果：allow=允许，deny=拒绝
 * @default "allow"
 */
export enum PutApiKnowledgeNodesByIdPermissionsEffectEnum {
  Allow = "allow",
  Deny = "deny",
}

export interface PutApiKnowledgeNodesByIdPermissionsParams {
  /** 节点 ID */
  id: string;
}

export interface PutApiKnowledgeNodesByIdPermissionsPayload {
  /** 权限条目列表 */
  permissions: {
    /**
     * 权限效果：allow=允许，deny=拒绝
     * @default "allow"
     */
    effect?: PutApiKnowledgeNodesByIdPermissionsEffectEnum;
    /** 权限类型：read=读取，write=写入，delete=删除，manage=管理 */
    permission: PutApiKnowledgeNodesByIdPermissionsPermissionEnum;
    /** 主体 ID */
    subjectId: string;
    /** 主体类型：user=用户，role=角色，dept=部门 */
    subjectType: PutApiKnowledgeNodesByIdPermissionsSubjectTypeEnum;
  }[];
}

/** 权限类型：read=读取，write=写入，delete=删除，manage=管理 */
export enum PutApiKnowledgeNodesByIdPermissionsPermissionEnum {
  Read = "read",
  Write = "write",
  Delete = "delete",
  Manage = "manage",
}

/** 主体类型：user=用户，role=角色，dept=部门 */
export enum PutApiKnowledgeNodesByIdPermissionsSubjectTypeEnum {
  User = "user",
  Role = "role",
  Dept = "dept",
}

export interface PutApiKnowledgeNodesByIdTextData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiKnowledgeNodesByIdTextParams {
  /** 文件节点 ID */
  id: string;
}

export interface PutApiKnowledgeNodesByIdTextPayload {
  /** 要保存的文本内容 */
  content: string;
}

export interface PutApiKnowledgeNodesOrderData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export interface PutApiKnowledgeNodesOrderPayload {
  /** 排序项列表 */
  items: {
    /** 节点 ID */
    id: string;
    /**
     * 排序序号
     * @min -9007199254740991
     * @max 9007199254740991
     */
    orderNum: number;
  }[];
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
    /** UUID物化路径（用于高效查询祖先/后代） */
    materializedPath?: string;
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
    /** UUID物化路径（用于高效查询祖先/后代） */
    materializedPath?: string;
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

export interface PutApiSystemUserPreferencesData {
  data: any;
  /** @default "ok" */
  message: string;
  /** @default 200 */
  status: number;
}

export enum PutApiSystemUserPreferencesLanguageEnum {
  ZhCN = "zh-CN",
  En = "en",
}

export interface PutApiSystemUserPreferencesPayload {
  preferences: {
    defaultImageModelId?: string | null;
    defaultObjectModelId?: string | null;
    defaultTextModelId?: string | null;
    /**
     * @min 10
     * @max 24
     */
    fontSize?: number;
    language?: PutApiSystemUserPreferencesLanguageEnum;
    /**
     * @min 0
     * @max 2
     */
    radius?: number;
    theme?: PutApiSystemUserPreferencesThemeEnum;
    themeColor?: PutApiSystemUserPreferencesThemeColorEnum;
    [key: string]: any;
  };
}

export enum PutApiSystemUserPreferencesThemeColorEnum {
  Slate = "slate",
  Zinc = "zinc",
  Neutral = "neutral",
  Stone = "stone",
  Blue = "blue",
  Green = "green",
  Violet = "violet",
  Orange = "orange",
  Rose = "rose",
}

export enum PutApiSystemUserPreferencesThemeEnum {
  Light = "light",
  Dark = "dark",
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

/** 主体类型：user=用户，role=角色，dept=部门 */
export enum SubjectTypeEnum {
  User = "user",
  Role = "role",
  Dept = "dept",
}

export enum TypeEnum {
  Folder = "folder",
  File = "file",
}

export namespace Mcp {
  /**
   * No description
   * @name DeleteMcpById
   * @request DELETE:/mcp/{id}
   */
  export namespace DeleteMcpById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @name GetMcp
   * @request GET:/mcp
   */
  export namespace GetMcp {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @name GetMcpByIdInfo
   * @request GET:/mcp/{id}/info
   */
  export namespace GetMcpByIdInfo {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }

  /**
   * No description
   * @name PostMcpById
   * @request POST:/mcp/{id}
   */
  export namespace PostMcpById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PostMcpByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = any;
  }
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
   * @description 根据ID删除单条Agent消息，并更新会话统计。 **参数说明：** - id: 消息UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 自动更新会话的 messageCount **返回值：** - success: true=删除成功，false=消息不存在 **注意事项：** - 删除消息不会重新排列其他消息的 msgSeq - 如需删除某条消息及之后的所有消息，使用 deleteFromSeq **示例：** DELETE /api/ai/agent-message/550e8400-e29b-41d4-a716-446655440000
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
   * @description 删除会话中指定 msgSeq 及之后的所有消息，用于"重新生成"功能。 **路径参数：** - sessionId: 会话UUID - msgSeq: 起始消息序号（包含） **删除行为：** - 删除 msgSeq >= 指定值的所有消息 - 更新会话的 messageCount 和 lastMessageAt **返回值：** - deletedCount: 删除的消息数量 **使用场景：** 1. 用户点击"重新生成"，删除AI回复及之后的消息 2. 回退到某个历史节点重新对话 3. 清理错误的对话内容 **示例：** DELETE /api/ai/agent-message/from-seq/session-uuid/10 （删除 msgSeq >= 10 的所有消息）
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
   * @description 根据ID软删除Agent会话（逻辑删除，数据保留）。 **参数说明：** - id: 会话UUID **删除行为：** - 软删除：设置 deletedAt、deletedBy、deletedById - 数据保留在数据库中 - 查询时自动过滤已删除记录 **返回值：** - true: 删除成功 - false: 会话不存在或已删除 **注意事项：** - 删除会话后，关联的消息记录仍然保留 - 如需彻底清理，需要单独删除消息 **示例：** DELETE /api/ai/agent-session/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据ID删除API密钥（物理删除）。 **路径参数：** - id: API密钥的UUID **注意事项：** - 删除后无法恢复 - 会同时删除关联的MCP服务权限配置 - 建议先撤销再删除，或直接撤销而不删除（保留审计记录） **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/ai/api-key/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据ID删除单个MCP服务（物理删除）。 **路径参数：** - id: MCP服务的UUID **注意事项：** - 删除后无法恢复 - 关联的API Key权限配置会失效 **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/ai/mcp-server/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据ID删除单个AI模型（物理删除）。 **路径参数：** - id: 模型的UUID **注意事项：** - 删除后无法恢复 - 如果模型正在被使用（如智能体引用），建议先禁用而非删除 **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/ai/model/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据ID删除单个AI提供商（物理删除）。 **路径参数：** - id: 提供商的UUID **注意事项：** - 删除后无法恢复 - 如果提供商下有关联的模型，需要先删除或迁移模型 - 建议先禁用而非直接删除 **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/ai/provider/550e8400-e29b-41d4-a716-446655440000
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
   * @description 软删除AI会话。 **路径参数：** - id: 会话的UUID **注意事项：** - 软删除，数据保留但标记为已删除 - 会话下的消息不会被删除，但会话不再显示 **返回：** - success: true 表示删除成功 **示例：** DELETE /api/ai/session/550e8400-e29b-41d4-a716-446655440000
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
   * @description 删除会话中指定msgSeq及之后的所有消息，用于重新生成回复。 **路径参数：** - sessionId: 会话的UUID - msgSeq: 起始消息序号 **使用场景：** - 用户对AI回复不满意，想要重新生成 - 删除某条消息及其后续所有消息 **自动处理：** - 更新会话的 messageCount、lastMessageAt、tokenUsage **示例：** DELETE /api/ai/session-message/from-seq/session-uuid/10 （删除序号>=10的所有消息） **返回：** - deletedCount: 删除的消息数量
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
   * @description 根据ID物理删除工具组。 **示例：** DELETE /api/ai/tool-group/550e8400-e29b-41d4-a716-446655440000
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
   * @description 软删除用户记忆（设置状态为禁用）
   * @tags ai, memory
   * @name DeleteApiAiUserMemoryById
   * @summary 删除用户记忆
   * @request DELETE:/api/ai/user-memory/{id}
   * @response `200` `DeleteApiAiUserMemoryByIdData` Response for status 200
   */
  export namespace DeleteApiAiUserMemoryById {
    export type RequestParams = {
      /** 记忆ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiAiUserMemoryByIdData;
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
   * @description 根据主键ID查询单个Agent消息详情。 **参数说明：** - id: 消息的UUID主键 **返回值：** - 成功：返回消息完整信息（id, sessionId, role, content, contentType, tokenUsage, finishReason等） - 未找到：返回 null **使用场景：** 1. 查看消息详情 2. 获取消息的Token使用情况 3. 验证消息是否存在 **示例：** GET /api/ai/agent-message/550e8400-e29b-41d4-a716-446655440000
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
   * @description 获取指定会话的消息历史，支持分页加载更早的消息。 **路径参数：** - sessionId: 会话UUID **查询参数：** - limit: 返回消息数量，1-200，默认50 - beforeSeq: 获取此序号之前的消息（用于加载更早的历史） **返回值：** - 消息数组，按 msgSeq 升序排列 **使用场景：** 1. 进入会话时加载最近消息 2. 滚动加载更早的历史消息 3. 获取上下文用于AI对话 **示例：** ``` GET /api/ai/agent-message/history/session-uuid?limit=50 GET /api/ai/agent-message/history/session-uuid?limit=50&beforeSeq=100 ```
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
   * @description 获取Agent消息表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成消息编辑表单 2. 数据导入时的格式验证 3. API文档生成
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
   * @description 根据主键ID查询单个Agent会话详情。 **参数说明：** - id: 会话的UUID主键 **返回值：** - 成功：返回会话完整信息（id, agentId, userId, title, messageCount, tokenUsage, lastMessageAt等） - 未找到或已删除：返回 null **使用场景：** 1. 进入会话详情页 2. 获取会话的统计信息（消息数、Token使用量） 3. 验证会话是否存在 **示例：** GET /api/ai/agent-session/550e8400-e29b-41d4-a716-446655440000
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
   * @description 获取Agent会话表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成会话编辑表单 2. 数据导入时的格式验证 3. API文档生成
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
   * @description 根据API密钥ID获取详情，包含关联的MCP服务ID列表。URL参数id为API密钥UUID。返回null表示不存在。
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
   * @description 获取API密钥表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
   * @description 根据主键ID查询单个MCP服务的详细信息。 **路径参数：** - id: MCP服务的UUID **返回：** - 找到时返回完整的MCP服务对象 - 未找到时返回 null **示例：** GET /api/ai/mcp-server/550e8400-e29b-41d4-a716-446655440000
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
   * @description 获取MCP服务的配置JSON，用于集成到AI工具（如Claude Desktop、Cursor等）。 **路径参数：** - id: MCP服务的UUID **返回：** - endpoint: MCP服务端点URL - config: 配置对象，可直接用于AI工具配置 - configJson: 格式化的JSON字符串 **使用方式：** 将返回的 configJson 复制到AI工具的MCP配置文件中。 如果服务不是公开的，需要替换 <YOUR_API_KEY> 为实际的API Key。 **示例响应：** ```json { "endpoint": "http://localhost:3030/mcp/xxx-uuid", "config": { "mcpServers": { "weather-service": { "url": "http://localhost:3030/mcp/xxx-uuid", "headers": { "Authorization": "Bearer <YOUR_API_KEY>" } } } }, "configJson": "..." } ```
   * @tags ai, mcpServer
   * @name GetApiAiMcpServerByIdConfig
   * @summary 获取MCP配置
   * @request GET:/api/ai/mcp-server/{id}/config
   * @response `200` `GetApiAiMcpServerByIdConfigData` Response for status 200
   */
  export namespace GetApiAiMcpServerByIdConfig {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiMcpServerByIdConfigData;
  }

  /**
   * @description 获取MCP服务表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
   * @description 根据主键ID查询单个AI模型的详细信息。 **路径参数：** - id: 模型的UUID **返回：** - 找到时返回完整的模型对象 - 未找到时返回 null **示例：** GET /api/ai/model/550e8400-e29b-41d4-a716-446655440000
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
   * @description 获取AI模型表的JSON Schema定义，用于动态表单生成或数据验证。 **返回：** JSON Schema 对象，包含所有字段的类型定义 **使用场景：** - 前端动态生成表单 - API文档生成 - 数据验证
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
   * @description 根据主键ID查询单个AI提供商的详细信息。 **路径参数：** - id: 提供商的UUID **返回：** - 找到时返回完整的提供商对象（包含 baseUrl, token 等敏感信息） - 未找到时返回 null **示例：** GET /api/ai/provider/550e8400-e29b-41d4-a716-446655440000
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
   * @description 获取AI提供商表的JSON Schema定义，用于动态表单生成或数据验证。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
   * @description 根据主键ID查询单个AI会话的详细信息。 **路径参数：** - id: 会话的UUID **返回：** - 找到时返回完整的会话对象（包含消息统计、token使用量等） - 未找到或已删除时返回 null **示例：** GET /api/ai/session/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据主键ID查询单条AI会话消息的详细信息。 **路径参数：** - id: 消息的UUID **返回：** - 找到时返回完整的消息对象（包含内容、token使用量等） - 未找到时返回 null **示例：** GET /api/ai/session-message/550e8400-e29b-41d4-a716-446655440000
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
   * @description 获取指定会话的消息历史，支持分页加载更早的消息。 **路径参数：** - sessionId: 会话的UUID **查询参数：** - limit: 返回消息数量，1-200，默认50 - beforeSeq: 获取此序号之前的消息（用于加载更早的历史） **返回：** 消息数组，按序号升序排列 **使用场景：** 1. 初始加载会话消息 2. 滚动加载更早的历史消息 **示例：** ``` GET /api/ai/session-message/history/session-uuid?limit=50 GET /api/ai/session-message/history/session-uuid?limit=20&beforeSeq=100 ```
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
   * @description 获取AI会话消息表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
   * @description 获取AI会话表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
   * @description 根据主键ID查询单个工具组详情。 **参数说明：** - id: 工具组的UUID主键 **返回值：** - 成功：返回工具组完整信息 - 未找到：返回 null **示例：** GET /api/ai/tool-group/550e8400-e29b-41d4-a716-446655440000
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
   * @description 获取工具组表的JSON Schema定义。
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
   * @description 根据ID查询单条用户记忆详情
   * @tags ai, memory
   * @name GetApiAiUserMemoryById
   * @summary 查询用户记忆详情
   * @request GET:/api/ai/user-memory/{id}
   * @response `200` `GetApiAiUserMemoryByIdData` Response for status 200
   */
  export namespace GetApiAiUserMemoryById {
    export type RequestParams = {
      /** 记忆ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiAiUserMemoryByIdData;
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
   * @description 创建单条Agent消息记录，自动分配消息序号并更新会话统计。 **必填字段：** - sessionId: 所属会话ID - role: 消息角色，"user" | "assistant" | "system" | "tool" - content: 消息内容 **可选字段：** - contentType: 内容类型，默认 "text" - tokenUsage: Token使用统计 { totalTokens, inputTokens, outputTokens } - finishReason: 完成原因，如 "stop"、"length" - metadata: 元数据 **自动处理：** - msgSeq: 自动分配递增序号 - 更新会话的 messageCount、lastMessageAt、tokenUsage **使用场景：** 1. 用户发送消息 2. AI回复消息 3. 系统消息 **示例：** ```json { "data": { "sessionId": "session-uuid", "role": "user", "content": "你好，请帮我分析这段代码", "contentType": "text" } } ```
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
   * @description 批量创建Agent消息，自动分配递增序号并更新会话统计。 **参数说明：** - sessionId: 目标会话ID - messages: 消息数组（不需要包含 sessionId 和 msgSeq） **自动处理：** - 为每条消息分配递增的 msgSeq - 更新会话的 messageCount、lastMessageAt、tokenUsage **使用场景：** 1. 导入历史对话 2. 一次性添加多轮对话 3. 批量添加系统消息 **示例：** ```json { "sessionId": "session-uuid", "messages": [ { "role": "user", "content": "你好" }, { "role": "assistant", "content": "你好！有什么可以帮助你的？" } ] } ```
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
   * @description 分页查询Agent消息列表。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - sessionId: 按会话ID过滤（获取某会话的所有消息） - sessionIds: 按多个会话ID过滤 - role: 按角色过滤，"user" | "assistant" | "system" | "tool" - roles: 按多个角色过滤 - contentType: 按内容类型过滤 - finishReason: 按完成原因过滤，如 "stop"、"length" - msgSeqStart/msgSeqEnd: 消息序号范围 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: msgSeq | createdAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认50 **使用场景：** 1. 获取会话的消息列表：filter.sessionId = "xxx" 2. 只获取用户消息：filter.role = "user" 3. 按消息序号排序：sort = { field: "msgSeq", order: "asc" } **示例：** ```json { "filter": { "sessionId": "xxx", "roles": ["user", "assistant"] }, "sort": { "field": "msgSeq", "order": "asc" }, "offset": 0, "limit": 50 } ```
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
   * @description 创建单个Agent会话记录。 **必填字段：** - agentId: 关联的Agent ID - userId: 用户ID **可选字段：** - title: 会话标题（可后续根据首条消息自动生成） - status: 状态 - isArchived: 是否归档，默认 false - isPinned: 是否置顶，默认 false - metadata: 元数据（JSON对象） **自动初始化字段：** - messageCount: 0 - tokenUsage: { totalTokens: 0, promptTokens: 0, completionTokens: 0 } **使用场景：** 1. 用户开始新对话时创建会话 2. 从Agent详情页发起对话 **示例：** ```json { "data": { "agentId": "agent-uuid", "userId": "user-uuid", "title": "新对话" } } ```
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
   * @description 分页查询Agent会话列表，用于管理用户与AI Agent的对话会话。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - agentId: 按单个Agent ID过滤 - agentIds: 按多个Agent ID过滤 - userId: 按单个用户ID过滤（查看某用户的所有会话） - userIds: 按多个用户ID过滤 - title: 按会话标题模糊搜索 - status: 按状态过滤 - isArchived: 是否已归档，true/false - isPinned: 是否已置顶，true/false - lastMessageAtStart/lastMessageAtEnd: 最后消息时间范围 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: title | lastMessageAt | createdAt | updatedAt | messageCount - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 获取当前用户的会话列表：filter.userId = "当前用户ID" 2. 获取置顶会话：filter.isPinned = true 3. 按最后消息时间排序：sort = { field: "lastMessageAt", order: "desc" } **示例：** ```json { "filter": { "userId": "xxx", "isArchived": false }, "sort": { "field": "lastMessageAt", "order": "desc" }, "offset": 0, "limit": 20 } ```
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
   * @description 创建新的API密钥用于MCP服务访问。accessAll=true表示可访问所有MCP服务，否则需指定mcpServerIds数组。创建成功后返回完整token（仅此一次显示）。示例：{"data":{"name":"我的密钥","accessAll":false,"mcpServerIds":["server-id-1"]}}
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
   * @description 撤销指定的API密钥，使其立即失效。 **路径参数：** - id: API密钥的UUID **注意事项：** - 撤销后密钥立即失效，无法恢复 - 使用该密钥的所有请求将被拒绝 - 建议在密钥泄露或不再需要时使用 **返回：** - true: 撤销成功 - false: 未找到或撤销失败 **示例：** POST /api/ai/api-key/550e8400-e29b-41d4-a716-446655440000/revoke
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
   * @description 查询API密钥列表，支持分页和过滤。filter可选字段：name(模糊匹配)、isRevoked(是否已撤销)、status。sort支持createdAt/name/lastUsedAt排序。返回包含关联MCP服务ID列表。示例：{"filter":{"isRevoked":false},"limit":20,"offset":0}
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
   * @description 创建单个MCP服务配置。MCP服务用于暴露工具给AI调用。 **必填字段：** - name: 服务名称（唯一标识） - description: 服务描述 **可选字段：** - isPublic: 是否公开访问，默认false（需要API Key） - status: 状态，"0"=正常（默认），"1"=禁用 - remark: 备注 **示例：** ```json { "data": { "name": "weather-service", "description": "天气查询服务", "isPublic": false, "status": "0" } } ```
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
   * @description 分页查询MCP服务列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - name: 按名称模糊搜索 - isPublic: 是否公开访问，true=公开，false=需要API Key - status: 按状态过滤，"0"=正常，"1"=禁用 **排序参数 (sort)：** - field: createdAt | name - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例：** ```json { "filter": { "isPublic": true, "status": "0" }, "sort": { "field": "name", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
   * @description 创建单个AI模型配置。 **必填字段：** - name: 模型显示名称 - modelId: 模型标识（如 gpt-4, claude-3-opus） - providerId: 所属提供商ID **可选字段：** - status: 状态，"0"=正常（默认），"1"=禁用 - supportTools: 是否支持工具调用，默认false - supportThinking: 是否支持思考模式，默认false - maxTokens: 最大token数 - temperature: 温度参数 - remark: 备注 **示例：** ```json { "data": { "name": "GPT-4 Turbo", "modelId": "gpt-4-turbo", "providerId": "provider-uuid", "supportTools": true, "maxTokens": 128000 } } ```
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
   * @description 批量创建多个AI模型配置，适用于初始化或导入场景。 **请求体：** - data: 模型对象数组，每个对象包含 name, modelId, providerId 等字段 **示例：** ```json { "data": [ { "name": "GPT-4", "modelId": "gpt-4", "providerId": "xxx", "supportTools": true }, { "name": "GPT-3.5", "modelId": "gpt-3.5-turbo", "providerId": "xxx", "supportTools": true } ] } ``` **返回：** 创建成功的模型对象数组
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
   * @description 发送测试消息验证AI模型是否正常工作。 **路径参数：** - id: 模型的UUID **请求体：** - message: 测试消息内容，默认为 "Hello, please respond with a brief greeting." **返回：** - success: 是否成功 - response: 模型响应内容 - thinking: 思考过程（如果模型支持） - supportThinking: 是否支持思考模式 - error: 错误信息（失败时） - latencyMs: 响应延迟（毫秒） **示例：** ```json POST /api/ai/model/xxx-uuid/test { "message": "你好，请用中文回复" } ```
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
   * @description 分页查询AI模型列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询，如 ["id1", "id2"] - modelIds: 按模型标识列表查询，如 ["gpt-4", "claude-3"] - providerId: 按单个提供商ID过滤 - providerIds: 按多个提供商ID过滤 - name: 按名称模糊搜索 - modelId: 按模型标识模糊搜索 - status: 按状态过滤，"0"=正常，"1"=禁用 - supportTools: 是否支持工具调用，true/false - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | modelId | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例：** ```json { "filter": { "providerId": "xxx", "supportTools": true }, "sort": { "field": "createdAt", "order": "desc" }, "offset": 0, "limit": 20 } ```
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
   * @description 创建单个AI提供商配置。 **必填字段：** - name: 提供商名称（如 OpenAI, Anthropic, 火山引擎） - baseUrl: API基础URL - token: API密钥/Token **可选字段：** - status: 状态，"0"=正常（默认），"1"=禁用 - remark: 备注 **示例：** ```json { "data": { "name": "OpenAI", "baseUrl": "https://api.openai.com/v1", "token": "sk-xxx", "status": "0" } } ```
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
   * @description 批量创建多个AI提供商配置，适用于初始化场景。 **请求体：** - data: 提供商对象数组 **示例：** ```json { "data": [ { "name": "OpenAI", "baseUrl": "https://api.openai.com/v1", "token": "sk-xxx" }, { "name": "Anthropic", "baseUrl": "https://api.anthropic.com", "token": "sk-ant-xxx" } ] } ``` **返回：** 创建成功的提供商对象数组
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
   * @description 分页查询AI提供商列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - names: 按名称列表精确查询，如 ["OpenAI", "Anthropic"] - name: 按名称模糊搜索 - status: 按状态过滤，"0"=正常，"1"=禁用 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例：** ```json { "filter": { "status": "0" }, "sort": { "field": "name", "order": "asc" }, "offset": 0, "limit": 50 } ```
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
   * @description 创建单个AI会话。 **必填字段：** - userId: 所属用户ID **可选字段：** - title: 会话标题（可后续根据首条消息自动生成） - modelId: 使用的模型ID - agentId: 使用的智能体ID - systemPrompt: 系统提示词 - isPinned: 是否置顶，默认false - isArchived: 是否归档，默认false - status: 状态 **示例：** ```json { "data": { "userId": "user-uuid", "title": "新对话", "modelId": "model-uuid" } } ```
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
   * @description 创建单条AI会话消息，自动分配消息序号并更新会话统计。 **必填字段：** - sessionId: 所属会话ID - role: 消息角色，user=用户消息，assistant=AI回复，system=系统消息 - content: 消息内容 **可选字段：** - contentType: 内容类型，默认text - tokenUsage: token使用量统计 - finishReason: 完成原因（AI回复时） - metadata: 元数据 **自动处理：** - msgSeq: 自动分配递增序号 - 更新会话的 messageCount、lastMessageAt、tokenUsage **示例：** ```json { "data": { "sessionId": "session-uuid", "role": "user", "content": "你好，请介绍一下React" } } ```
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
   * @description 批量创建多条AI会话消息，自动分配递增序号并更新会话统计。 **请求体：** - sessionId: 所属会话ID - messages: 消息对象数组（不需要指定 sessionId 和 msgSeq） **使用场景：** - 导入历史对话 - 一次性添加多轮对话 **示例：** ```json { "sessionId": "session-uuid", "messages": [ { "role": "user", "content": "你好" }, { "role": "assistant", "content": "你好！有什么可以帮助你的吗？" } ] } ``` **返回：** 创建成功的消息对象数组
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
   * @description 分页查询AI会话消息列表。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - sessionId: 按会话ID过滤（最常用） - sessionIds: 按会话ID列表过滤 - role: 按角色过滤，user=用户消息，assistant=AI回复，system=系统消息 - roles: 按角色列表过滤 - contentType: 按内容类型过滤 - finishReason: 按完成原因过滤 - msgSeqStart/msgSeqEnd: 消息序号范围 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: msgSeq | createdAt - order: asc | desc **常用场景：** 1. 获取某会话的所有消息（按序号升序） 2. 获取最近N条消息 **示例：** ```json { "filter": { "sessionId": "session-uuid" }, "sort": { "field": "msgSeq", "order": "asc" }, "offset": 0, "limit": 50 } ```
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
   * @description 分页查询AI会话列表，自动排除已删除的会话。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - userId: 按用户ID过滤（查询某用户的所有会话） - userIds: 按用户ID列表过滤 - title: 按标题模糊搜索 - isArchived: 是否已归档 - isPinned: 是否已置顶 - status: 按状态过滤 - createdAtStart/createdAtEnd: 创建时间范围 - lastMessageAtStart/lastMessageAtEnd: 最后消息时间范围 **排序参数 (sort)：** - field: title | lastMessageAt | createdAt | updatedAt | messageCount - order: asc | desc **常用场景：** 1. 获取当前用户的会话列表（按最后消息时间倒序） 2. 获取置顶的会话 3. 获取归档的会话 **示例：** ```json { "filter": { "userId": "user-uuid", "isArchived": false }, "sort": { "field": "lastMessageAt", "order": "desc" }, "offset": 0, "limit": 20 } ```
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
   * @description 创建单个工具组记录。 **必填字段：** - name: 工具组名称 **可选字段：** - description: 描述 - icon: 图标 - orderNum: 排序号 - status: 状态 **示例：** ```json { "data": { "name": "代码工具", "description": "代码相关的AI工具", "orderNum": 1 } } ```
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
   * @description 批量创建多个工具组记录。 **示例：** ```json { "data": [ { "name": "代码工具", "orderNum": 1 }, { "name": "文档工具", "orderNum": 2 } ] } ```
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
   * @description 分页查询AI工具组列表，工具组用于组织和管理AI可调用的工具。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - names: 按名称列表精确查询 - name: 按名称模糊搜索 - status: 按状态过滤 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | orderNum | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例：** ```json { "filter": { "name": "代码" }, "sort": { "field": "orderNum", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
   * @description 创建一条新的用户记忆，支持自动生成向量嵌入
   * @tags ai, memory
   * @name PostApiAiUserMemory
   * @summary 创建用户记忆
   * @request POST:/api/ai/user-memory
   * @response `200` `PostApiAiUserMemoryData` Response for status 200
   */
  export namespace PostApiAiUserMemory {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiUserMemoryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiUserMemoryData;
  }

  /**
   * @description 分页查询用户记忆列表，支持多种过滤条件
   * @tags ai, memory
   * @name PostApiAiUserMemoryQuery
   * @summary 分页查询用户记忆
   * @request POST:/api/ai/user-memory/query
   * @response `200` `PostApiAiUserMemoryQueryData` Response for status 200
   */
  export namespace PostApiAiUserMemoryQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiUserMemoryQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiUserMemoryQueryData;
  }

  /**
   * @description 使用向量相似度搜索用户记忆，支持记忆衰减计算
   * @tags ai, memory
   * @name PostApiAiUserMemorySemanticSearch
   * @summary 语义检索用户记忆
   * @request POST:/api/ai/user-memory/semantic-search
   * @response `200` `PostApiAiUserMemorySemanticSearchData` Response for status 200
   */
  export namespace PostApiAiUserMemorySemanticSearch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiAiUserMemorySemanticSearchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiAiUserMemorySemanticSearchData;
  }

  /**
   * @description 批量更新多个智能体配置。传入ids数组指定要更新的智能体，data对象包含要更新的字段。只能更新自己创建的智能体，管理员可更新所有。示例：{"ids":["id1","id2"],"data":{"status":"1","temperature":0.8}}
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
   * @description 根据ID更新单个Agent会话信息。 **路径参数：** - id: 会话UUID **可更新字段：** - title: 会话标题 - status: 状态 - isArchived: 是否归档 - isPinned: 是否置顶 - metadata: 元数据 **使用场景：** 1. 修改会话标题 2. 更新会话状态 3. 修改元数据 **示例：** ```json // PUT /api/ai/agent-session/550e8400-e29b-41d4-a716-446655440000 { "data": { "title": "关于项目架构的讨论" } } ```
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
   * @description 归档或取消归档指定Agent会话。 **路径参数：** - id: 会话UUID **请求体：** - isArchived: true=归档，false=取消归档 **归档行为：** - 归档后会话不会出现在默认列表中 - 可通过 filter.isArchived = true 查看归档会话 - 归档不会删除会话数据 **使用场景：** 1. 整理会话列表，归档不常用的会话 2. 恢复误归档的会话 **示例：** ```json // PUT /api/ai/agent-session/xxx/archive { "isArchived": true } ```
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
   * @description 置顶或取消置顶Agent会话。 **路径参数：** - id: 会话UUID **请求体：** - isPinned: true=置顶，false=取消置顶 **置顶行为：** - 置顶会话在列表中优先显示 - 可通过 filter.isPinned = true 只查看置顶会话 **使用场景：** 1. 将重要会话置顶方便快速访问 2. 取消不再重要的会话置顶 **示例：** ```json // PUT /api/ai/agent-session/xxx/pin { "isPinned": true } ```
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
   * @description 更新API密钥信息和关联的MCP服务。URL参数id为密钥ID。可更新name、accessAll、mcpServerIds、expiresAt、remark。修改accessAll或mcpServerIds会重建MCP关联。示例：{"data":{"name":"新名称","accessAll":true}}
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
   * @description 根据ID更新单个MCP服务的配置信息。 **路径参数：** - id: MCP服务的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - name: 服务名称 - description: 服务描述 - isPublic: 是否公开访问 - status: 状态，"0"=正常，"1"=禁用 - remark: 备注 **示例：** ```json PUT /api/ai/mcp-server/xxx-uuid { "data": { "isPublic": true, "description": "更新后的描述" } } ```
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
   * @description 根据ID列表批量更新多个AI模型的配置。 **请求体：** - ids: 要更新的模型ID数组 - data: 更新数据对象，包含要修改的字段 **使用场景：** - 批量启用/禁用模型 - 批量修改配置参数 **示例：** ```json { "ids": ["model-id-1", "model-id-2"], "data": { "status": "1" } } ``` **返回：** 更新成功的模型对象数组
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
   * @description 根据ID更新单个AI模型的配置信息。 **路径参数：** - id: 模型的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - name: 模型显示名称 - modelId: 模型标识 - status: 状态，"0"=正常，"1"=禁用 - supportTools: 是否支持工具调用 - supportThinking: 是否支持思考模式 - maxTokens: 最大token数 - temperature: 温度参数 - remark: 备注 **示例：** ```json PUT /api/ai/model/xxx-uuid { "data": { "status": "1", "maxTokens": 64000 } } ```
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
   * @description 根据ID列表批量更新多个AI提供商的配置。 **请求体：** - ids: 要更新的提供商ID数组 - data: 更新数据对象 **使用场景：** - 批量启用/禁用提供商 **示例：** ```json { "ids": ["provider-id-1", "provider-id-2"], "data": { "status": "1" } } ``` **返回：** 更新成功的提供商对象数组
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
   * @description 根据ID更新单个AI提供商的配置信息。 **路径参数：** - id: 提供商的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - name: 提供商名称 - baseUrl: API基础URL - token: API密钥（更新密钥时使用） - status: 状态，"0"=正常，"1"=禁用 - remark: 备注 **示例：** ```json PUT /api/ai/provider/xxx-uuid { "data": { "token": "sk-new-token", "status": "0" } } ```
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
   * @description 更新单个AI会话的信息。 **路径参数：** - id: 会话的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - title: 会话标题 - modelId: 使用的模型ID - agentId: 使用的智能体ID - systemPrompt: 系统提示词 - isPinned: 是否置顶 - isArchived: 是否归档 - status: 状态 **常用场景：** 1. 重命名会话 2. 置顶/取消置顶 3. 归档会话 4. 切换模型 **示例：** ```json PUT /api/ai/session/xxx-uuid { "data": { "title": "关于React的讨论", "isPinned": true } } ```
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
   * @description 根据ID列表批量更新工具组。 **示例：** ```json { "ids": ["id1", "id2"], "data": { "status": "1" } } ```
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
   * @description 根据ID更新单个工具组信息。 **路径参数：** - id: 工具组UUID **示例：** ```json // PUT /api/ai/tool-group/xxx { "data": { "name": "代码工具（更新）", "orderNum": 2 } } ```
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

  /**
   * @description 更新用户记忆内容、重要性等信息
   * @tags ai, memory
   * @name PutApiAiUserMemoryById
   * @summary 更新用户记忆
   * @request PUT:/api/ai/user-memory/{id}
   * @response `200` `PutApiAiUserMemoryByIdData` Response for status 200
   */
  export namespace PutApiAiUserMemoryById {
    export type RequestParams = {
      /** 记忆ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiAiUserMemoryByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiAiUserMemoryByIdData;
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
 * @description 获取当前登录用户的详细信息、菜单和权限
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
   * @description 获取当前所有在线用户的 ID 列表。 使用场景： - 显示在线用户列表 - 统计在线用户数 - 判断是否需要发送离线通知 返回说明： - users: 在线用户 ID 列表 - count: 在线用户数量
   * @tags ws, users, online
   * @name GetApiWsUsersOnline
   * @summary 获取在线用户
   * @request GET:/api/ws/users/online
   * @response `200` `GetApiWsUsersOnlineData` Response for status 200
   */
  export namespace GetApiWsUsersOnline {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiWsUsersOnlineData;
  }

  /**
   * @description 发送消息到群聊会话并通过 WebSocket 实时通知在线成员。 参数说明： - conversationId: 群聊会话 ID（必填） - msgType: 消息类型，01=文本，02=链接，03=图片等（默认 01） - content: 消息内容 - replyToId: 回复的消息 ID（可选） - atUserIds: @的用户 ID 列表（可选） 使用场景： - AI Agent 在群聊中回复 - 群公告推送 - 机器人消息 请求示例： { "conversationId": "550e8400-e29b-41d4-a716-446655440000", "msgType": "01", "content": { "text": "这是一条群聊消息" }, "atUserIds": ["user-uuid-1", "user-uuid-2"] }
   * @tags ws, im, message, group
   * @name PostApiWsMessageGroup
   * @summary 发送群聊消息
   * @request POST:/api/ws/message/group
   * @response `200` `PostApiWsMessageGroupData` Response for status 200
   */
  export namespace PostApiWsMessageGroup {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiWsMessageGroupPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiWsMessageGroupData;
  }

  /**
   * @description 发送私聊消息给指定用户，如果会话不存在会自动创建。 参数说明： - targetUserId: 目标用户 ID（必填） - msgType: 消息类型，01=文本，02=链接，03=图片等（默认 01） - content: 消息内容 - replyToId: 回复的消息 ID（可选） 使用场景： - AI Agent 主动联系用户 - 系统私信通知 - 客服系统集成 请求示例： { "targetUserId": "550e8400-e29b-41d4-a716-446655440000", "msgType": "01", "content": { "text": "你好，这是一条私聊消息" } } 返回说明： - isNewConversation: 是否新创建的会话 - conversationId: 会话 ID（可用于后续发送消息）
   * @tags ws, im, message, private
   * @name PostApiWsMessagePrivate
   * @summary 发送单聊消息
   * @request POST:/api/ws/message/private
   * @response `200` `PostApiWsMessagePrivateData` Response for status 200
   */
  export namespace PostApiWsMessagePrivate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiWsMessagePrivatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiWsMessagePrivateData;
  }

  /**
   * @description 发送消息到指定会话并通过 WebSocket 实时通知在线用户。 参数说明： - conversationId: 目标会话 ID（必填） - msgType: 消息类型，01=文本，02=链接，03=图片，04=视频，05=音频，06=文件（默认 01） - content: 消息内容，根据 msgType 不同结构不同 - replyToId: 回复的消息 ID（可选） - atUserIds: @的用户 ID 列表（可选） 使用场景： - AI Agent 自动回复用户消息 - 系统通知推送 - 第三方服务集成 请求示例： { "conversationId": "550e8400-e29b-41d4-a716-446655440000", "msgType": "01", "content": { "text": "你好，这是一条消息" } }
   * @tags ws, im, message
   * @name PostApiWsMessageSend
   * @summary 发送消息到会话
   * @request POST:/api/ws/message/send
   * @response `200` `PostApiWsMessageSendData` Response for status 200
   */
  export namespace PostApiWsMessageSend {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiWsMessageSendPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiWsMessageSendData;
  }

  /**
   * @description 向指定用户发送实时通知（不创建 IM 消息记录）。 参数说明： - userIds: 目标用户 ID 列表（必填） - title: 通知标题（必填） - content: 通知内容（必填） - type: 通知类型，info/success/warning/error（默认 info） - data: 附加数据，可包含链接等信息（可选） 使用场景： - 系统公告推送 - 任务完成通知 - 审批提醒 - AI 处理结果通知 请求示例： { "userIds": ["user-uuid-1", "user-uuid-2"], "title": "系统通知", "content": "您有一条新的审批待处理", "type": "info", "data": { "approvalId": "xxx", "link": "/approvals/xxx" } } 返回说明： - notifiedUsers: 实际收到通知的用户数（在线用户） - onlineUsers: 目标用户中在线的用户数
   * @tags ws, notification, broadcast
   * @name PostApiWsNotificationBroadcast
   * @summary 广播通知
   * @request POST:/api/ws/notification/broadcast
   * @response `200` `PostApiWsNotificationBroadcastData` Response for status 200
   */
  export namespace PostApiWsNotificationBroadcast {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiWsNotificationBroadcastPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiWsNotificationBroadcastData;
  }

  /**
   * @description 检查指定用户是否在线。 参数说明： - userIds: 要检查的用户 ID 列表（必填） 使用场景： - 显示用户在线状态 - 判断是否发送推送通知 - 选择消息发送方式（在线用 WS，离线用推送） 请求示例： { "userIds": ["user-uuid-1", "user-uuid-2"] } 返回说明： - status: 用户在线状态映射，key 为用户 ID，value 为是否在线
   * @tags ws, users, online, check
   * @name PostApiWsUsersCheckOnline
   * @summary 检查用户在线状态
   * @request POST:/api/ws/users/check-online
   * @response `200` `PostApiWsUsersCheckOnlineData` Response for status 200
   */
  export namespace PostApiWsUsersCheckOnline {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiWsUsersCheckOnlinePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiWsUsersCheckOnlineData;
  }

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
   * @description 根据ID物理删除系统配置（永久删除，不可恢复）。 **参数说明：** - id: 配置UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 **返回值：** - true: 删除成功 - false: 配置不存在 **注意事项：** - 系统内置配置（isSystem=true）不建议删除 - 删除前确认没有功能依赖此配置 - 建议先备份配置值 **示例：** DELETE /api/system/config/550e8400-e29b-41d4-a716-446655440000
   * @tags system, config
   * @name DeleteApiSystemConfigById
   * @summary 删除系统配置
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
   * @description 根据ID软删除字典项。 **路径参数：** - id: 字典项的UUID **注意事项：** - 软删除，数据保留但标记为已删除 - 删除后前端下拉框等组件将不再显示该选项 **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/system/dict/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据Key物理删除字典组（永久删除，不可恢复）。 **参数说明：** - key: 字典组键 **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 - 关联的字典项也应一并删除 **返回值：** - true: 删除成功 - false: 字典组不存在 **注意事项：** - 删除前确认没有功能依赖此字典组 - 建议先禁用（status="1"）而非直接删除 **示例：** DELETE /api/system/dict-group/sys_user_sex
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
   * @description 根据ID物理删除定时任务（永久删除，不可恢复）。 **参数说明：** - id: 任务UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 - 任务将停止执行 **返回值：** - true: 删除成功 - false: 任务不存在 **注意事项：** - 删除前建议先暂停任务 - 确认任务不再需要后再删除 - 如需保留配置，建议暂停而非删除 **示例：** DELETE /api/system/job/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据ID物理删除任务执行日志（永久删除，不可恢复）。 **参数说明：** - id: 日志UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 **返回值：** - true: 删除成功 - false: 日志不存在 **注意事项：** - 任务日志通常需要保留用于问题排查 - 建议设置定期清理策略而非手动删除 **示例：** DELETE /api/system/job-log/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据ID物理删除登录日志（永久删除，不可恢复）。 **参数说明：** - id: 登录日志UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 **返回值：** - true: 删除成功 - false: 日志不存在 **注意事项：** - 登录日志通常需要保留用于审计 - 建议设置定期清理策略而非手动删除 - 删除前确认符合安全合规要求 **示例：** DELETE /api/system/login-info/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据ID删除菜单（物理删除）。 **路径参数：** - id: 菜单的UUID **注意事项：** - 删除后无法恢复 - 删除目录前应先删除其下的子菜单 - 删除菜单会影响已分配该菜单的角色 **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/system/menu/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据ID物理删除通知公告（永久删除，不可恢复）。 **参数说明：** - id: 通知公告UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 **返回值：** - true: 删除成功 - false: 通知不存在 **注意事项：** - 删除前建议确认通知已过期或不再需要 - 如需保留历史记录，建议使用 status="1" 关闭而非删除 **示例：** DELETE /api/system/notice/550e8400-e29b-41d4-a716-446655440000
   * @tags system, notice
   * @name DeleteApiSystemNoticeById
   * @summary 删除通知公告
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
   * @description 根据ID物理删除操作日志（永久删除，不可恢复）。 **参数说明：** - id: 操作日志UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 **返回值：** - true: 删除成功 - false: 日志不存在 **注意事项：** - 操作日志通常需要保留用于审计 - 建议设置定期清理策略而非手动删除 - 删除前确认符合安全合规要求 **示例：** DELETE /api/system/operation-log/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据ID删除权限，会递归删除所有子权限。 **路径参数：** - id: 权限UUID，必填 **注意事项：** - 删除操作会递归删除该权限下的所有子权限 - 删除前请确认没有角色关联该权限 - 此操作不可恢复 **返回：** - true: 删除成功 - false: 删除失败（权限不存在） **示例：** DELETE /api/system/permission/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据ID软删除岗位（逻辑删除，数据保留）。 **参数说明：** - id: 岗位UUID **删除行为：** - 软删除：设置 deletedAt、deletedBy、deletedById - 数据保留在数据库中，可恢复 - 查询时自动过滤已删除记录 **返回值：** - true: 删除成功 - false: 岗位不存在或已删除 **注意事项：** - 删除前应检查是否有用户关联此岗位 - 已删除的岗位不会出现在查询结果中 **示例：** DELETE /api/system/post/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据ID软删除角色。 **路径参数：** - id: 角色的UUID **注意事项：** - 管理员角色（key=admin）不允许删除 - 软删除，数据保留但标记为已删除 **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/system/role/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据复合主键删除角色与部门的关联关系。 **路径参数：** - roleId: 角色UUID，必填 - departmentId: 部门UUID，必填 **返回：** - true: 删除成功 - false: 删除失败（关联不存在） **示例：** DELETE /api/system/role-department/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
   * @description 根据复合主键删除角色与菜单的关联关系。 **路径参数：** - roleId: 角色UUID，必填 - menuId: 菜单UUID，必填 **返回：** - true: 删除成功 - false: 删除失败（关联不存在） **示例：** DELETE /api/system/role-menu/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
   * @description 根据复合主键删除用户与岗位的关联关系。 **路径参数：** - userId: 用户UUID，必填 - postId: 岗位UUID，必填 **返回：** - true: 删除成功 - false: 删除失败（关联不存在） **示例：** DELETE /api/system/user-post/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
   * @description 根据复合主键删除用户与角色的关联关系。 **路径参数：** - userId: 用户UUID，必填 - roleId: 角色UUID，必填 **返回：** - true: 删除成功 - false: 删除失败（关联不存在） **示例：** DELETE /api/system/user-role/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
   * @description 根据主键ID查询单个系统配置详情。 **参数说明：** - id: 配置的UUID主键 **返回值：** - 成功：返回配置完整信息（id, name, key, value, isSystem等） - 未找到：返回 null **使用场景：** 1. 查看配置详情 2. 编辑配置前获取当前数据 3. 验证配置是否存在 **示例：** GET /api/system/config/550e8400-e29b-41d4-a716-446655440000
   * @tags system, config
   * @name GetApiSystemConfigById
   * @summary 根据ID查询系统配置
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
   * @description 获取系统配置表的JSON Schema定义，用于动态表单生成或数据验证。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束（长度、格式等） **使用场景：** 1. 前端动态生成配置编辑表单 2. 数据导入时的格式验证 3. API文档生成
   * @tags system, config
   * @name GetApiSystemConfigSchema
   * @summary 获取系统配置Schema
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
   * @description 根据主键ID查询单个字典项的详细信息。 **路径参数：** - id: 字典项的UUID **返回：** - 找到时返回完整的字典对象 - 未找到或已删除时返回 null **示例：** GET /api/system/dict/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据主键Key查询单个字典组详情。 **参数说明：** - key: 字典组的唯一键，如 "sys_user_sex"、"sys_normal_disable" **返回值：** - 成功：返回字典组完整信息（key, name, status, remark等） - 未找到：返回 null **使用场景：** 1. 查看字典组详情 2. 编辑字典组前获取当前数据 3. 验证字典组是否存在 **示例：** GET /api/system/dict-group/sys_user_sex
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
   * @description 获取字典组表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成字典组编辑表单 2. 数据导入时的格式验证 3. API文档生成
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
   * @description 获取字典表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
   * @description 根据主键ID查询单个定时任务详情。 **参数说明：** - id: 定时任务的UUID主键 **返回值：** - 成功：返回任务完整信息（name, group, invokeTarget, cronExpression, misfirePolicy, concurrent, status等） - 未找到：返回 null **使用场景：** 1. 查看任务详情 2. 编辑任务前获取当前配置 3. 验证任务是否存在 **示例：** GET /api/system/job/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据主键ID查询单个任务执行日志详情。 **参数说明：** - id: 任务日志的UUID主键 **返回值：** - 成功：返回日志完整信息（jobName, jobGroup, invokeTarget, jobMessage, status, exceptionInfo, startTime, stopTime等） - 未找到：返回 null **使用场景：** 1. 查看任务执行详情 2. 分析任务执行失败原因（查看 exceptionInfo） 3. 查看任务执行耗时 **示例：** GET /api/system/job-log/550e8400-e29b-41d4-a716-446655440000
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
   * @description 获取任务日志表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成查询表单 2. 数据导出时的格式参考 3. API文档生成
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
   * @description 获取定时任务表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成任务编辑表单 2. 数据导入时的格式验证 3. API文档生成
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
   * @description 根据主键ID查询单个登录日志详情。 **参数说明：** - id: 登录日志的UUID主键 **返回值：** - 成功：返回登录日志完整信息（loginName, ipaddr, loginLocation, browser, os, status, msg, loginTime等） - 未找到：返回 null **使用场景：** 1. 查看登录详情（浏览器、操作系统、地理位置等） 2. 分析登录失败原因 3. 安全审计 **示例：** GET /api/system/login-info/550e8400-e29b-41d4-a716-446655440000
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
   * @description 获取登录日志表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成查询表单 2. 数据导出时的格式参考 3. API文档生成
   * @tags system, loginInfo
   * @name GetApiSystemLoginInfoSchema
   * @summary 获取登录日志Schema
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
   * @description 根据主键ID查询单个菜单的详细信息。 **路径参数：** - id: 菜单的UUID **返回：** - 找到时返回完整的菜单对象 - 未找到时返回 null **示例：** GET /api/system/menu/550e8400-e29b-41d4-a716-446655440000
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
   * @description 获取菜单表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
   * @description 根据主键ID查询单个通知公告详情。 **参数说明：** - id: 通知公告的UUID主键 **返回值：** - 成功：返回通知完整信息（id, title, type, content, status等） - 未找到：返回 null **使用场景：** 1. 查看通知详情页 2. 编辑通知前获取当前数据 3. 验证通知是否存在 **示例：** GET /api/system/notice/550e8400-e29b-41d4-a716-446655440000
   * @tags system, notice
   * @name GetApiSystemNoticeById
   * @summary 根据ID查询通知公告
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
   * @description 获取当前用户的未读通知数量
   * @tags system, noticeRead
   * @name GetApiSystemNoticeReadUnreadCount
   * @summary 获取未读通知数量
   * @request GET:/api/system/notice-read/unread-count
   * @response `200` `GetApiSystemNoticeReadUnreadCountData` Response for status 200
   */
  export namespace GetApiSystemNoticeReadUnreadCount {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemNoticeReadUnreadCountData;
  }

  /**
   * @description 获取通知公告表的JSON Schema定义，用于动态表单生成或数据验证。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束（长度、格式等） **使用场景：** 1. 前端动态生成通知编辑表单 2. 数据导入时的格式验证 3. API文档生成
   * @tags system, notice
   * @name GetApiSystemNoticeSchema
   * @summary 获取通知公告Schema
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
   * @description 根据主键ID查询单个操作日志详情。 **参数说明：** - id: 操作日志的UUID主键 **返回值：** - 成功：返回操作日志完整信息（title, method, url, param, result, status, errorMsg, time等） - 未找到：返回 null **使用场景：** 1. 查看操作详情（请求参数、返回结果） 2. 分析操作失败原因 3. 安全审计和问题排查 **示例：** GET /api/system/operation-log/550e8400-e29b-41d4-a716-446655440000
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
   * @description 获取操作日志表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成查询表单 2. 数据导出时的格式参考 3. API文档生成
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
   * @description 根据权限ID查询单个权限详情。 **路径参数：** - id: 权限UUID，必填 **返回：** - 成功：返回权限对象，包含 id, code, name, type, module, parentId, status, orderNum 等字段 - 未找到：返回 null **示例：** GET /api/system/permission/550e8400-e29b-41d4-a716-446655440000
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
   * @description 获取权限表的JSON Schema定义，用于动态表单生成和数据验证。 **返回：** - JSON Schema格式的权限表结构定义 **示例：** GET /api/system/permission/schema
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
   * @description 获取完整的权限树结构，按排序号升序排列。 **返回：** - 返回所有权限的扁平列表，按 orderNum 升序排列 - 前端可根据 parentId 构建树形结构 **使用场景：** - 权限管理页面展示权限树 - 角色授权时选择权限 - 菜单配置时关联权限 **返回字段：** - id: 权限ID - code: 权限编码 - name: 权限名称 - type: 权限类型 - module: 所属模块 - parentId: 父级ID（null表示顶级） - status: 状态 - orderNum: 排序号 **示例：** GET /api/system/permission/tree
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
   * @description 根据主键ID查询单个岗位详情。 **参数说明：** - id: 岗位的UUID主键 **返回值：** - 成功：返回岗位完整信息（id, code, name, sort, status, remark等） - 未找到：返回 null **使用场景：** 1. 查看岗位详情 2. 编辑岗位前获取当前数据 3. 验证岗位是否存在 **示例：** GET /api/system/post/550e8400-e29b-41d4-a716-446655440000
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
   * @description 获取岗位表的JSON Schema定义，用于动态表单生成或数据验证。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束（长度、格式等） **使用场景：** 1. 前端动态生成表单 2. 数据导入时的格式验证 3. API文档生成
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
   * @description 根据主键ID查询单个角色的详细信息。 **路径参数：** - id: 角色的UUID **返回：** - 找到时返回完整的角色对象 - 未找到或已删除时返回 null **示例：** GET /api/system/role/550e8400-e29b-41d4-a716-446655440000
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
   * @description 根据角色ID和部门ID的复合主键查询关联记录。 **路径参数：** - roleId: 角色UUID，必填 - departmentId: 部门UUID，必填 **返回：** - 成功：返回关联对象 { roleId, departmentId } - 未找到：返回 null **示例：** GET /api/system/role-department/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
   * @description 获取角色部门关联表的JSON Schema定义。 **返回：** - JSON Schema格式的表结构定义 **示例：** GET /api/system/role-department/schema
   * @tags system, roleDepartment
   * @name GetApiSystemRoleDepartmentSchema
   * @summary 获取角色部门关联Schema
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
   * @description 根据角色ID和菜单ID的复合主键查询关联记录。 **路径参数：** - roleId: 角色UUID，必填 - menuId: 菜单UUID，必填 **返回：** - 成功：返回关联对象 { roleId, menuId } - 未找到：返回 null **示例：** GET /api/system/role-menu/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
   * @description 获取指定角色的所有菜单ID列表。 **路径参数：** - roleId: 角色UUID，必填 **返回：** - 菜单ID数组，如 ["menu-id-1", "menu-id-2", "menu-id-3"] **使用场景：** - 角色菜单权限配置页面，获取当前角色已分配的菜单 - 用户登录后获取可访问的菜单列表 **示例：** GET /api/system/role-menu/role/550e8400-e29b-41d4-a716-446655440000 **返回示例：** ```json ["menu-id-1", "menu-id-2", "menu-id-3"] ```
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
   * @description 获取角色菜单关联表的JSON Schema定义。 **返回：** - JSON Schema格式的表结构定义 **示例：** GET /api/system/role-menu/schema
   * @tags system, roleMenu
   * @name GetApiSystemRoleMenuSchema
   * @summary 获取角色菜单关联Schema
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
   * @description 获取角色表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
   * @description 根据用户ID和岗位ID的复合主键查询关联记录。 **路径参数：** - userId: 用户UUID，必填 - postId: 岗位UUID，必填 **返回：** - 成功：返回关联对象 { userId, postId } - 未找到：返回 null **示例：** GET /api/system/user-post/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
   * @description 获取用户岗位关联表的JSON Schema定义。 **返回：** - JSON Schema格式的表结构定义 **示例：** GET /api/system/user-post/schema
   * @tags system, userPost
   * @name GetApiSystemUserPostSchema
   * @summary 获取用户岗位关联Schema
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
   * @description 获取指定用户的所有岗位ID列表。 **路径参数：** - userId: 用户UUID，必填 **返回：** - 岗位ID数组，如 ["post-id-1", "post-id-2", "post-id-3"] **使用场景：** - 用户详情页面，显示用户所属岗位 - 用户编辑页面，获取当前用户已分配的岗位 - 权限判断，检查用户是否属于某岗位 **示例：** GET /api/system/user-post/user/550e8400-e29b-41d4-a716-446655440000 **返回示例：** ```json ["post-id-1", "post-id-2", "post-id-3"] ```
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
   * @description 获取当前用户的偏好设置
   * @tags system, user, preferences
   * @name GetApiSystemUserPreferences
   * @summary 获取用户偏好设置
   * @request GET:/api/system/user/preferences
   * @response `200` `GetApiSystemUserPreferencesData` Response for status 200
   */
  export namespace GetApiSystemUserPreferences {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiSystemUserPreferencesData;
  }

  /**
   * @description 根据用户ID和角色ID的复合主键查询关联记录。 **路径参数：** - userId: 用户UUID，必填 - roleId: 角色UUID，必填 **返回：** - 成功：返回关联对象 { userId, roleId } - 未找到：返回 null **示例：** GET /api/system/user-role/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
   * @description 获取用户角色关联表的JSON Schema定义。 **返回：** - JSON Schema格式的表结构定义 **示例：** GET /api/system/user-role/schema
   * @tags system, userRole
   * @name GetApiSystemUserRoleSchema
   * @summary 获取用户角色关联Schema
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
   * @description 获取指定用户的所有角色ID列表。 **路径参数：** - userId: 用户UUID，必填 **返回：** - 角色ID数组，如 ["role-id-1", "role-id-2", "role-id-3"] **使用场景：** - 用户详情页面，显示用户所属角色 - 用户编辑页面，获取当前用户已分配的角色 - 权限判断，检查用户是否拥有某角色 - 用户登录后获取角色列表 **示例：** GET /api/system/user-role/user/550e8400-e29b-41d4-a716-446655440000 **返回示例：** ```json ["role-id-1", "role-id-2", "role-id-3"] ```
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
   * @description 创建单个系统配置记录。 **必填字段：** - name: 配置名称，如 "系统名称"、"邮件服务器" - key: 配置键，唯一标识，如 "sys.name"、"mail.host" - value: 配置值 **可选字段：** - isSystem: 是否系统内置，默认 false - remark: 备注说明 **配置键命名规范：** - 使用点号分隔层级：module.submodule.key - 系统配置：sys.* - 邮件配置：mail.* - 存储配置：storage.* **使用场景：** 1. 添加新的系统参数 2. 配置第三方服务连接信息 3. 自定义业务参数 **示例：** ```json { "data": { "name": "邮件服务器地址", "key": "mail.host", "value": "smtp.example.com", "isSystem": false, "remark": "SMTP服务器地址" } } ```
   * @tags system, config
   * @name PostApiSystemConfig
   * @summary 创建系统配置
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
   * @description 批量创建多个系统配置记录。 **参数说明：** - data: 配置数组，每个元素包含 name、key、value 等字段 **使用场景：** 1. 系统初始化时批量创建默认配置 2. 导入配置模板 3. 批量添加某个模块的配置项 **示例：** ```json { "data": [ { "name": "系统名称", "key": "sys.name", "value": "AI管理系统", "isSystem": true }, { "name": "系统Logo", "key": "sys.logo", "value": "/logo.png", "isSystem": true }, { "name": "版权信息", "key": "sys.copyright", "value": "© 2024", "isSystem": true } ] } ```
   * @tags system, config
   * @name PostApiSystemConfigBatch
   * @summary 批量创建系统配置
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
   * @description 分页查询系统配置列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - names: 按配置名称列表精确查询 - keys: 按配置键列表精确查询，如 ["sys.name", "sys.logo"] - isSystem: 是否系统内置配置，true=内置，false=自定义 - name: 按配置名称模糊搜索 - key: 按配置键模糊搜索，如 "sys" 匹配所有 sys.* 配置 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | key | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 获取所有系统内置配置：filter.isSystem = true 2. 搜索包含"邮件"的配置：filter.name = "邮件" 3. 获取所有 sys.* 开头的配置：filter.key = "sys" **示例：** ```json { "filter": { "isSystem": false, "key": "mail" }, "sort": { "field": "key", "order": "asc" }, "offset": 0, "limit": 20 } ```
   * @tags system, config
   * @name PostApiSystemConfigQuery
   * @summary 分页查询系统配置
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
   * @description 创建单个字典项。 **必填字段：** - group: 字典分组（如 sys_user_status） - label: 显示标签 - value: 字典值 **可选字段：** - status: 状态，"0"=正常（默认），"1"=禁用 - isDefault: 是否默认值，默认false - sort: 排序号，默认0 - remark: 备注 **示例：** ```json { "data": { "group": "sys_user_status", "label": "正常", "value": "0", "isDefault": true, "sort": 1 } } ```
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
   * @description 批量创建多个字典项，适用于初始化场景。 **请求体：** - data: 字典对象数组 **示例：** ```json { "data": [ { "group": "sys_user_status", "label": "正常", "value": "0", "sort": 1 }, { "group": "sys_user_status", "label": "禁用", "value": "1", "sort": 2 } ] } ``` **返回：** 创建成功的字典对象数组
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
   * @description 创建单个字典组记录。 **必填字段：** - key: 字典组键，唯一标识，如 "sys_user_sex" - name: 字典组名称，如 "用户性别" **可选字段：** - status: 状态，"0"=正常（默认），"1"=禁用 - remark: 备注说明 **键命名规范：** - 使用下划线分隔：module_entity_field - 系统字典：sys_* - 业务字典：biz_* **使用场景：** 1. 添加新的字典分类 2. 系统初始化时创建默认字典组 **示例：** ```json { "data": { "key": "sys_user_sex", "name": "用户性别", "status": "0", "remark": "用户性别选项" } } ```
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
   * @description 批量创建多个字典组记录。 **参数说明：** - data: 字典组数组，每个元素包含 key、name 等字段 **使用场景：** 1. 系统初始化时批量创建默认字典组 2. 导入字典配置 **示例：** ```json { "data": [ { "key": "sys_user_sex", "name": "用户性别" }, { "key": "sys_normal_disable", "name": "状态" }, { "key": "sys_yes_no", "name": "是否" } ] } ```
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
   * @description 分页查询字典组列表，字典组用于管理一组相关的字典项。 **过滤参数 (filter)：** - keys: 按字典组键列表精确查询，如 ["sys_user_sex", "sys_normal_disable"] - names: 按字典组名称列表精确查询 - status: 按状态过滤，"0"=正常，"1"=禁用 - key: 按字典组键模糊搜索，如 "sys" 匹配所有系统字典 - name: 按字典组名称模糊搜索 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: key | name | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 获取所有正常状态的字典组：filter.status = "0" 2. 搜索系统相关字典：filter.key = "sys" 3. 按键名排序：sort = { field: "key", order: "asc" } **示例：** ```json { "filter": { "status": "0", "key": "sys" }, "sort": { "field": "key", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
   * @description 分页查询字典列表，自动排除已删除数据。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - groups: 按分组列表精确查询，如 ["sys_user_status", "sys_normal_disable"] - labels: 按标签列表精确查询 - status: 按状态过滤，"0"=正常，"1"=禁用 - isDefault: 是否默认值 - group: 按分组模糊搜索 - label: 按标签模糊搜索 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: group | label | sort | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例 - 查询某分组的所有字典项：** ```json { "filter": { "groups": ["sys_user_status"] }, "sort": { "field": "sort", "order": "asc" } } ```
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
   * @description 创建单个定时任务记录。 **必填字段：** - name: 任务名称，如 "清理临时文件" - group: 任务分组，如 "DEFAULT"、"SYSTEM" - invokeTarget: 调用目标（类名.方法名） - cronExpression: Cron表达式，如 "0 0 2 * * ?" 表示每天凌晨2点 **可选字段：** - misfirePolicy: 错过执行策略（0=默认，1=立即执行，2=执行一次，3=放弃执行） - concurrent: 是否允许并发执行，默认 false - status: 状态，"0"=正常（默认），"1"=暂停 - remark: 备注说明 **Cron表达式示例：** - "0 0 2 * * ?": 每天凌晨2点 - "0 0/30 * * * ?": 每30分钟 - "0 0 10,14,16 * * ?": 每天10点、14点、16点 **示例：** ```json { "data": { "name": "清理临时文件", "group": "SYSTEM", "invokeTarget": "cleanTask.execute", "cronExpression": "0 0 2 * * ?", "misfirePolicy": "1", "concurrent": false, "status": "0" } } ```
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
   * @description 批量创建多个定时任务记录。 **参数说明：** - data: 任务数组，每个元素包含 name、group、invokeTarget、cronExpression 等字段 **使用场景：** 1. 系统初始化时批量创建默认任务 2. 导入任务配置 3. 批量添加某类任务 **示例：** ```json { "data": [ { "name": "清理日志", "group": "SYSTEM", "invokeTarget": "logTask.clean", "cronExpression": "0 0 3 * * ?" }, { "name": "数据备份", "group": "SYSTEM", "invokeTarget": "backupTask.run", "cronExpression": "0 0 4 * * ?" } ] } ```
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
   * @description 创建单个任务执行日志记录（通常由任务调度器自动调用）。 **必填字段：** - jobName: 任务名称 - jobGroup: 任务分组 - invokeTarget: 调用目标 **可选字段：** - jobMessage: 执行消息 - status: 执行状态，"0"=成功，"1"=失败 - exceptionInfo: 异常信息（失败时记录） - startTime: 开始时间 - stopTime: 结束时间 **使用场景：** 1. 任务执行开始时创建日志 2. 任务执行完成后更新状态 3. 手动记录任务执行情况 **示例：** ```json { "data": { "jobName": "清理临时文件", "jobGroup": "SYSTEM", "invokeTarget": "cleanTask.execute", "status": "0", "jobMessage": "清理完成，删除100个文件", "startTime": "2024-01-01T02:00:00Z", "stopTime": "2024-01-01T02:00:30Z" } } ```
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
   * @description 批量创建多个任务执行日志记录。 **参数说明：** - data: 日志数组，每个元素包含 jobName、jobGroup、invokeTarget 等字段 **使用场景：** 1. 批量导入历史执行记录 2. 批量任务执行后统一记录 **示例：** ```json { "data": [ { "jobName": "任务A", "jobGroup": "DEFAULT", "invokeTarget": "taskA.run", "status": "0" }, { "jobName": "任务B", "jobGroup": "DEFAULT", "invokeTarget": "taskB.run", "status": "0" } ] } ```
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
   * @description 分页查询定时任务执行日志，用于监控任务执行情况。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - jobNames: 按任务名称列表精确查询 - jobGroups: 按任务分组列表精确查询 - status: 按状态过滤，"0"=成功，"1"=失败 - jobName: 按任务名称模糊搜索 - jobGroup: 按任务分组模糊搜索 - startTimeStart/startTimeEnd: 执行开始时间范围 - createdAtStart/createdAtEnd: 记录创建时间范围 **排序参数 (sort)：** - field: jobName | jobGroup | startTime | stopTime | createdAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 查看某任务的执行历史：filter.jobName = "清理日志" 2. 查看执行失败的任务：filter.status = "1" 3. 查看今日执行记录：设置 startTimeStart/startTimeEnd **示例：** ```json { "filter": { "status": "1", "jobGroup": "SYSTEM" }, "sort": { "field": "startTime", "order": "desc" }, "offset": 0, "limit": 50 } ```
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
   * @description 分页查询定时任务列表，用于管理系统定时任务。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - names: 按任务名称列表精确查询 - groups: 按任务分组列表精确查询，如 ["DEFAULT", "SYSTEM"] - status: 按状态过滤，"0"=正常，"1"=暂停 - concurrent: 是否允许并发，true/false - name: 按任务名称模糊搜索 - group: 按任务分组模糊搜索 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | group | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 获取所有正常运行的任务：filter.status = "0" 2. 获取某分组的任务：filter.group = "SYSTEM" 3. 搜索任务名称：filter.name = "清理" **示例：** ```json { "filter": { "status": "0", "group": "DEFAULT" }, "sort": { "field": "name", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
   * @description 创建单个登录日志记录（通常由系统自动调用）。 **必填字段：** - loginName: 登录账号 - ipaddr: 登录IP地址 - status: 登录状态，"0"=成功，"1"=失败 **可选字段：** - loginLocation: 登录地点（根据IP解析） - browser: 浏览器类型 - os: 操作系统 - msg: 提示消息（失败时记录原因） - loginTime: 登录时间 **使用场景：** 1. 用户登录成功后记录 2. 用户登录失败后记录（含失败原因） 3. 安全审计日志 **示例：** ```json { "data": { "loginName": "admin", "ipaddr": "192.168.1.100", "loginLocation": "内网IP", "browser": "Chrome 120", "os": "Windows 10", "status": "0", "msg": "登录成功", "loginTime": "2024-01-01T10:00:00Z" } } ```
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
   * @description 分页查询登录日志列表，用于审计和安全监控。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - loginNames: 按登录账号列表精确查询 - status: 按状态过滤，"0"=成功，"1"=失败 - loginName: 按登录账号模糊搜索 - ipaddr: 按IP地址模糊搜索，如 "192.168" 匹配内网IP - loginTimeStart/loginTimeEnd: 登录时间范围 - createdAtStart/createdAtEnd: 记录创建时间范围 **排序参数 (sort)：** - field: loginName | ipaddr | loginTime | createdAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 查看某用户的登录历史：filter.loginName = "admin" 2. 查看登录失败记录：filter.status = "1" 3. 查看某IP的登录记录：filter.ipaddr = "192.168.1" 4. 查看今日登录记录：设置 loginTimeStart/loginTimeEnd **示例：** ```json { "filter": { "status": "1", "loginName": "admin" }, "sort": { "field": "loginTime", "order": "desc" }, "offset": 0, "limit": 50 } ```
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
   * @description 创建单个菜单项。 **必填字段：** - name: 菜单名称 - type: 菜单类型，M=目录，C=菜单，F=按钮 **可选字段：** - parentId: 父级菜单ID，null表示顶级 - path: 路由路径（菜单类型需要） - component: 组件路径 - permission: 权限标识（按钮类型需要） - icon: 图标 - orderNum: 排序号，默认0 - visible: 是否可见，默认true - status: 状态，"0"=正常，"1"=禁用 **示例 - 创建目录：** ```json { "data": { "name": "系统管理", "type": "M", "icon": "setting", "orderNum": 1 } } ``` **示例 - 创建菜单：** ```json { "data": { "name": "用户管理", "type": "C", "parentId": "parent-uuid", "path": "/system/users", "component": "system/users/index" } } ```
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
   * @description 批量创建多个菜单项，适用于初始化场景。 **请求体：** - data: 菜单对象数组 **示例：** ```json { "data": [ { "name": "系统管理", "type": "M", "orderNum": 1 }, { "name": "用户管理", "type": "C", "parentId": "xxx", "path": "/system/users" } ] } ``` **返回：** 创建成功的菜单对象数组
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
   * @description 分页查询菜单列表，支持树形结构查询。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - names: 按名称列表精确查询 - types: 按类型列表查询，M=目录，C=菜单，F=按钮 - parentId: 按父级ID过滤，null表示查询顶级菜单 - type: 按单个类型过滤 - visible: 是否可见 - name: 按名称模糊搜索 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | orderNum | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例 - 查询顶级目录：** ```json { "filter": { "parentId": null, "type": "M" }, "sort": { "field": "orderNum", "order": "asc" } } ``` **示例 - 查询某目录下的菜单：** ```json { "filter": { "parentId": "parent-uuid", "types": ["C", "F"] } } ```
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
   * @description 创建单个通知公告记录。 **必填字段：** - title: 通知标题 - type: 通知类型，"1"=通知，"2"=公告 - content: 通知内容（支持富文本HTML） **可选字段：** - status: 状态，"0"=正常（默认），"1"=关闭 - remark: 备注说明 **审计字段（自动填充）：** - createdBy/updatedBy: 创建人/更新人姓名 - createdAt/updatedAt: 创建/更新时间 **使用场景：** 1. 发布系统通知 2. 发布公司公告 3. 发布维护通知 **示例：** ```json { "data": { "title": "系统维护通知", "type": "1", "content": "<p>系统将于今晚22:00-24:00进行维护升级</p>", "status": "0" } } ```
   * @tags system, notice
   * @name PostApiSystemNotice
   * @summary 创建通知公告
   * @request POST:/api/system/notice
   * @response `200` `PostApiSystemNoticeData` Response for status 200
   */
  export namespace PostApiSystemNotice {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemNoticeData;
  }

  /**
   * @description 批量创建多个通知公告记录。 **参数说明：** - data: 通知数组，每个元素包含 title、type、content 等字段 **使用场景：** 1. 批量导入历史通知 2. 系统初始化时创建默认通知 3. 批量发布多条公告 **示例：** ```json { "data": [ { "title": "欢迎使用", "type": "1", "content": "欢迎使用本系统" }, { "title": "使用须知", "type": "2", "content": "请遵守使用规范" } ] } ```
   * @tags system, notice
   * @name PostApiSystemNoticeBatch
   * @summary 批量创建通知公告
   * @request POST:/api/system/notice/batch
   * @response `200` `PostApiSystemNoticeBatchData` Response for status 200
   */
  export namespace PostApiSystemNoticeBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemNoticeBatchData;
  }

  /**
   * @description 将草稿状态的通知发布，发布后用户可见
   * @tags system, notice
   * @name PostApiSystemNoticeByIdPublish
   * @summary 发布通知
   * @request POST:/api/system/notice/{id}/publish
   * @response `200` `PostApiSystemNoticeByIdPublishData` Response for status 200
   */
  export namespace PostApiSystemNoticeByIdPublish {
    export type RequestParams = {
      /**
       * 通知 ID
       * @format uuid
       * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemNoticeByIdPublishData;
  }

  /**
   * @description 撤回已发布的通知，撤回后用户不可见
   * @tags system, notice
   * @name PostApiSystemNoticeByIdWithdraw
   * @summary 撤回通知
   * @request POST:/api/system/notice/{id}/withdraw
   * @response `200` `PostApiSystemNoticeByIdWithdrawData` Response for status 200
   */
  export namespace PostApiSystemNoticeByIdWithdraw {
    export type RequestParams = {
      /**
       * 通知 ID
       * @format uuid
       * @pattern ^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemNoticeByIdWithdrawData;
  }

  /**
   * @description 获取当前用户可见的通知列表，支持按已读状态过滤。 **过滤参数 (filter)：** - type: 按类型过滤，"1"=通知，"2"=公告 - isRead: 按已读状态过滤，true=已读，false=未读 **排序参数 (sort)：** - field: publishedAt | createdAt - order: asc | desc **返回数据：** - 包含 isRead 和 readAt 字段表示已读状态
   * @tags system, notice
   * @name PostApiSystemNoticeMy
   * @summary 获取我的通知
   * @request POST:/api/system/notice/my
   * @response `200` `PostApiSystemNoticeMyData` Response for status 200
   */
  export namespace PostApiSystemNoticeMy {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemNoticeMyPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemNoticeMyData;
  }

  /**
   * @description 分页查询通知公告列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - titles: 按标题列表精确查询 - types: 按类型列表精确查询，如 ["1", "2"] - type: 按类型精确匹配，"1"=通知，"2"=公告 - status: 按状态过滤，"0"=正常，"1"=关闭 - title: 按标题模糊搜索 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: title | type | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 获取所有公告：filter.type = "2" 2. 搜索标题包含"系统"的通知：filter.title = "系统" 3. 获取最近一周的通知：设置 createdAtStart **示例：** ```json { "filter": { "type": "1", "status": "0" }, "sort": { "field": "createdAt", "order": "desc" }, "offset": 0, "limit": 10 } ```
   * @tags system, notice
   * @name PostApiSystemNoticeQuery
   * @summary 分页查询通知公告
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
   * @description 将指定通知标记为当前用户已读
   * @tags system, noticeRead
   * @name PostApiSystemNoticeReadMark
   * @summary 标记通知为已读
   * @request POST:/api/system/notice-read/mark
   * @response `200` `PostApiSystemNoticeReadMarkData` Response for status 200
   */
  export namespace PostApiSystemNoticeReadMark {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemNoticeReadMarkPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemNoticeReadMarkData;
  }

  /**
   * @description 将多个通知标记为当前用户已读
   * @tags system, noticeRead
   * @name PostApiSystemNoticeReadMarkMany
   * @summary 批量标记通知为已读
   * @request POST:/api/system/notice-read/mark-many
   * @response `200` `PostApiSystemNoticeReadMarkManyData` Response for status 200
   */
  export namespace PostApiSystemNoticeReadMarkMany {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiSystemNoticeReadMarkManyPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiSystemNoticeReadMarkManyData;
  }

  /**
   * @description 创建单个操作日志记录（通常由系统自动调用）。 **必填字段：** - title: 操作模块，如 "用户管理"、"角色管理" - name: 操作人员姓名 - method: 请求方法，如 "POST"、"PUT"、"DELETE" - url: 请求URL **可选字段：** - businessType: 业务类型（0=其它，1=新增，2=修改，3=删除） - param: 请求参数（JSON字符串） - result: 返回结果（JSON字符串） - status: 操作状态，"0"=成功，"1"=失败 - errorMsg: 错误消息 - time: 操作时间 - costTime: 耗时（毫秒） **使用场景：** 1. API请求拦截器自动记录 2. 关键业务操作手动记录 3. 安全审计日志 **示例：** ```json { "data": { "title": "用户管理", "name": "admin", "method": "POST", "url": "/api/system/user", "businessType": 1, "param": "{\"name\":\"张三\"}", "status": "0", "costTime": 150 } } ```
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
   * @description 分页查询操作日志列表，用于审计用户操作行为。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - titles: 按操作模块列表精确查询，如 ["用户管理", "角色管理"] - names: 按操作人员列表精确查询 - status: 按状态过滤，"0"=成功，"1"=失败 - title: 按操作模块模糊搜索，如 "用户" 匹配用户相关操作 - name: 按操作人员模糊搜索 - timeStart/timeEnd: 操作时间范围 **排序参数 (sort)：** - field: title | name | time - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 查看某用户的操作历史：filter.name = "admin" 2. 查看某模块的操作记录：filter.title = "用户管理" 3. 查看操作失败记录：filter.status = "1" 4. 查看今日操作记录：设置 timeStart/timeEnd **示例：** ```json { "filter": { "title": "用户", "status": "0" }, "sort": { "field": "time", "order": "desc" }, "offset": 0, "limit": 50 } ```
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
   * @description 创建单个权限记录。 **请求体参数 (data)：** - code: 权限编码，必填，如 "system:user:view" - name: 权限名称，必填，如 "查看用户" - type: 权限类型，必填，可选值：menu(菜单), button(按钮), api(接口) - module: 所属模块，必填，如 "system", "ai", "im" - parentId: 父级权限ID，可选，null表示顶级权限 - status: 状态，可选，默认true(启用) - orderNum: 排序号，可选，默认0 - remark: 备注，可选 **示例：** ```json { "data": { "code": "system:user:view", "name": "查看用户", "type": "menu", "module": "system", "parentId": null, "status": true, "orderNum": 1 } } ```
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
   * @description 分页查询权限列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询，如 ["id1", "id2"] - codes: 按权限编码列表查询，如 ["system:user:view", "system:user:edit"] - types: 按类型列表查询，如 ["menu", "button", "api"] - modules: 按模块列表查询，如 ["system", "ai", "im"] - parentId: 按父级ID查询，null表示查询顶级权限 - status: 按状态过滤，true=启用，false=禁用 - code: 按权限编码模糊搜索 - name: 按权限名称模糊搜索 **排序参数 (sort)：** - field: code | name | orderNum | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-1000，默认100 **示例：** ```json { "filter": { "modules": ["system"], "status": true }, "sort": { "field": "orderNum", "order": "asc" }, "offset": 0, "limit": 100 } ```
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
   * @description 创建单个岗位记录。 **必填字段：** - code: 岗位编码，唯一标识，如 "CEO"、"CTO"、"PM" - name: 岗位名称，如 "首席执行官"、"技术总监" **可选字段：** - sort: 排序号，数字越小越靠前，默认0 - status: 状态，"0"=正常（默认），"1"=禁用 - remark: 备注说明 **审计字段（自动填充）：** - createdBy/updatedBy: 创建人/更新人姓名 - createdAt/updatedAt: 创建/更新时间 **使用场景：** 1. 新增组织架构中的岗位 2. 初始化系统岗位数据 **示例：** ```json { "data": { "code": "PM", "name": "项目经理", "sort": 10, "status": "0", "remark": "负责项目管理" } } ```
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
   * @description 批量创建多个岗位记录，适用于初始化或批量导入场景。 **参数说明：** - data: 岗位数组，每个元素包含 code、name 等字段 **使用场景：** 1. 系统初始化时批量创建岗位 2. 从Excel导入岗位数据 3. 复制其他系统的岗位配置 **示例：** ```json { "data": [ { "code": "CEO", "name": "首席执行官", "sort": 1 }, { "code": "CTO", "name": "技术总监", "sort": 2 }, { "code": "CFO", "name": "财务总监", "sort": 3 } ] } ```
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
   * @description 分页查询岗位列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询，如 ["id1", "id2"] - codes: 按岗位编码列表精确查询，如 ["CEO", "CTO", "PM"] - names: 按岗位名称列表精确查询 - status: 按状态过滤，"0"=正常，"1"=禁用 - code: 按岗位编码模糊搜索，如 "C" 匹配 CEO、CTO - name: 按岗位名称模糊搜索 **排序参数 (sort)：** - field: code | name | sort | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 获取所有正常状态的岗位：filter.status = "0" 2. 搜索包含"经理"的岗位：filter.name = "经理" 3. 按排序号升序排列：sort = { field: "sort", order: "asc" } **示例：** ```json { "filter": { "status": "0", "name": "经理" }, "sort": { "field": "sort", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
   * @description 创建单个角色。 **必填字段：** - name: 角色名称 - key: 角色标识（唯一，如 admin, user, editor） **可选字段：** - status: 状态，"0"=正常（默认），"1"=禁用 - sort: 排序号，默认0 - remark: 备注 **示例：** ```json { "data": { "name": "编辑员", "key": "editor", "status": "0", "sort": 10 } } ```
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
   * @description 批量创建多个角色，适用于初始化场景。 **请求体：** - data: 角色对象数组 **示例：** ```json { "data": [ { "name": "管理员", "key": "admin" }, { "name": "普通用户", "key": "user" } ] } ``` **返回：** 创建成功的角色对象数组
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
   * @description 创建单个角色与部门的关联关系。 **请求体参数 (data)：** - roleId: 角色UUID，必填 - departmentId: 部门UUID，必填 **使用场景：** - 为角色配置数据权限范围 - 角色可访问指定部门的数据 **示例：** ```json { "data": { "roleId": "550e8400-e29b-41d4-a716-446655440001", "departmentId": "550e8400-e29b-41d4-a716-446655440002" } } ```
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
   * @description 批量创建多个角色与部门的关联关系。 **请求体参数 (data)：** - 数组，每个元素包含： - roleId: 角色UUID，必填 - departmentId: 部门UUID，必填 **使用场景：** - 为角色一次性配置多个部门的数据权限 - 批量导入角色部门关联 **示例：** ```json { "data": [ { "roleId": "role-1", "departmentId": "dept-1" }, { "roleId": "role-1", "departmentId": "dept-2" }, { "roleId": "role-1", "departmentId": "dept-3" } ] } ```
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
   * @description 分页查询角色与部门的关联关系，用于数据权限控制。 **过滤参数 (filter)：** - roleIds: 按角色ID列表查询，如 ["role-id-1", "role-id-2"] - departmentIds: 按部门ID列表查询，如 ["dept-id-1", "dept-id-2"] - roleId: 按单个角色ID精确查询 - departmentId: 按单个部门ID精确查询 **排序参数 (sort)：** - field: roleId | departmentId - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** - 查询某角色关联的所有部门 - 查询某部门关联的所有角色 - 数据权限范围配置 **示例：** ```json { "filter": { "roleId": "550e8400-e29b-41d4-a716-446655440000" }, "sort": { "field": "departmentId", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
   * @description 创建单个角色与菜单的关联关系。 **请求体参数 (data)：** - roleId: 角色UUID，必填 - menuId: 菜单UUID，必填 **使用场景：** - 为角色分配单个菜单权限 - 动态添加菜单访问权限 **示例：** ```json { "data": { "roleId": "550e8400-e29b-41d4-a716-446655440001", "menuId": "550e8400-e29b-41d4-a716-446655440002" } } ```
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
   * @description 批量创建多个角色与菜单的关联关系。 **请求体参数 (data)：** - 数组，每个元素包含： - roleId: 角色UUID，必填 - menuId: 菜单UUID，必填 **使用场景：** - 为角色一次性分配多个菜单权限 - 批量导入角色菜单关联 **示例：** ```json { "data": [ { "roleId": "role-1", "menuId": "menu-1" }, { "roleId": "role-1", "menuId": "menu-2" }, { "roleId": "role-1", "menuId": "menu-3" } ] } ```
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
   * @description 分页查询角色与菜单的关联关系，用于菜单权限控制。 **过滤参数 (filter)：** - roleIds: 按角色ID列表查询，如 ["role-id-1", "role-id-2"] - menuIds: 按菜单ID列表查询，如 ["menu-id-1", "menu-id-2"] - roleId: 按单个角色ID精确查询 - menuId: 按单个菜单ID精确查询 **排序参数 (sort)：** - field: roleId | menuId - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** - 查询某角色关联的所有菜单 - 查询某菜单关联的所有角色 - 菜单权限配置 **示例：** ```json { "filter": { "roleId": "550e8400-e29b-41d4-a716-446655440000" }, "sort": { "field": "menuId", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
   * @description 分页查询角色列表，自动排除已删除数据。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - names: 按名称列表精确查询 - keys: 按角色标识列表精确查询，如 ["admin", "user"] - status: 按状态过滤，"0"=正常，"1"=禁用 - name: 按名称模糊搜索 - key: 按角色标识模糊搜索 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | key | sort | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例：** ```json { "filter": { "status": "0" }, "sort": { "field": "sort", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
   * @description 创建单个用户与岗位的关联关系。 **请求体参数 (data)：** - userId: 用户UUID，必填 - postId: 岗位UUID，必填 **使用场景：** - 为用户分配单个岗位 - 用户入职时配置岗位 **示例：** ```json { "data": { "userId": "550e8400-e29b-41d4-a716-446655440001", "postId": "550e8400-e29b-41d4-a716-446655440002" } } ```
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
   * @description 批量创建多个用户与岗位的关联关系。 **请求体参数 (data)：** - 数组，每个元素包含： - userId: 用户UUID，必填 - postId: 岗位UUID，必填 **使用场景：** - 为用户一次性分配多个岗位 - 批量导入用户岗位关联 **示例：** ```json { "data": [ { "userId": "user-1", "postId": "post-1" }, { "userId": "user-1", "postId": "post-2" }, { "userId": "user-2", "postId": "post-1" } ] } ```
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
   * @description 分页查询用户与岗位的关联关系。 **过滤参数 (filter)：** - userIds: 按用户ID列表查询，如 ["user-id-1", "user-id-2"] - postIds: 按岗位ID列表查询，如 ["post-id-1", "post-id-2"] - userId: 按单个用户ID精确查询 - postId: 按单个岗位ID精确查询 **排序参数 (sort)：** - field: userId | postId - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** - 查询某用户关联的所有岗位 - 查询某岗位关联的所有用户 - 用户岗位配置管理 **示例：** ```json { "filter": { "userId": "550e8400-e29b-41d4-a716-446655440000" }, "sort": { "field": "postId", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
   * @description 创建单个用户与角色的关联关系。 **请求体参数 (data)：** - userId: 用户UUID，必填 - roleId: 角色UUID，必填 **使用场景：** - 为用户分配单个角色 - 动态添加用户权限 **示例：** ```json { "data": { "userId": "550e8400-e29b-41d4-a716-446655440001", "roleId": "550e8400-e29b-41d4-a716-446655440002" } } ```
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
   * @description 批量创建多个用户与角色的关联关系。 **请求体参数 (data)：** - 数组，每个元素包含： - userId: 用户UUID，必填 - roleId: 角色UUID，必填 **使用场景：** - 为用户一次性分配多个角色 - 批量导入用户角色关联 **示例：** ```json { "data": [ { "userId": "user-1", "roleId": "role-1" }, { "userId": "user-1", "roleId": "role-2" }, { "userId": "user-2", "roleId": "role-1" } ] } ```
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
   * @description 分页查询用户与角色的关联关系，用于权限控制。 **过滤参数 (filter)：** - userIds: 按用户ID列表查询，如 ["user-id-1", "user-id-2"] - roleIds: 按角色ID列表查询，如 ["role-id-1", "role-id-2"] - userId: 按单个用户ID精确查询 - roleId: 按单个角色ID精确查询 **排序参数 (sort)：** - field: userId | roleId - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** - 查询某用户关联的所有角色 - 查询某角色关联的所有用户 - 用户角色配置管理 **示例：** ```json { "filter": { "userId": "550e8400-e29b-41d4-a716-446655440000" }, "sort": { "field": "roleId", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
   * @description 根据ID列表批量更新系统配置，所有指定的配置将应用相同的更新数据。 **参数说明：** - ids: 要更新的配置ID数组 - data: 更新的字段数据 **使用场景：** 1. 批量修改配置属性 2. 批量添加备注 3. 批量调整 isSystem 标识 **示例：** ```json { "ids": ["id1", "id2", "id3"], "data": { "isSystem": false, "remark": "已迁移为自定义配置" } } ```
   * @tags system, config
   * @name PutApiSystemConfigBatch
   * @summary 批量更新系统配置
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
   * @description 根据ID更新单个系统配置信息。 **路径参数：** - id: 配置UUID **可更新字段：** - name: 配置名称 - key: 配置键（建议不要修改已使用的key） - value: 配置值 - isSystem: 是否系统内置 - remark: 备注 **使用场景：** 1. 修改配置值 2. 更新配置说明 3. 调整配置属性 **注意事项：** - 系统内置配置（isSystem=true）修改需谨慎 - 修改 key 可能影响依赖此配置的功能 **示例：** ```json // PUT /api/system/config/550e8400-e29b-41d4-a716-446655440000 { "data": { "value": "新的配置值", "remark": "更新于2024-01-01" } } ```
   * @tags system, config
   * @name PutApiSystemConfigById
   * @summary 更新系统配置
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
   * @description 根据ID列表批量更新多个字典项。 **请求体：** - ids: 要更新的字典ID数组 - data: 更新数据对象 **使用场景：** - 批量启用/禁用字典项 **示例：** ```json { "ids": ["dict-id-1", "dict-id-2"], "data": { "status": "1" } } ``` **返回：** 更新成功的字典对象数组
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
   * @description 根据ID更新单个字典项的信息。 **路径参数：** - id: 字典项的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - group: 字典分组 - label: 显示标签 - value: 字典值 - status: 状态 - isDefault: 是否默认值 - sort: 排序号 - remark: 备注 **示例：** ```json PUT /api/system/dict/xxx-uuid { "data": { "label": "已启用", "sort": 1 } } ```
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
   * @description 根据Key列表批量更新字典组。 **参数说明：** - keys: 要更新的字典组键数组 - data: 更新的字段数据 **使用场景：** 1. 批量启用/禁用字典组 2. 批量添加备注 **示例：** ```json { "keys": ["sys_user_sex", "sys_normal_disable"], "data": { "status": "1", "remark": "已停用" } } ```
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
   * @description 根据Key更新单个字典组信息。 **路径参数：** - key: 字典组键 **可更新字段：** - name: 字典组名称 - status: 状态，"0"=正常，"1"=禁用 - remark: 备注 **注意事项：** - key 作为主键不可修改 - 禁用字典组会影响使用该字典的功能 **示例：** ```json // PUT /api/system/dict-group/sys_user_sex { "data": { "name": "性别", "status": "0" } } ```
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
   * @description 根据ID列表批量更新定时任务，所有指定的任务将应用相同的更新数据。 **参数说明：** - ids: 要更新的任务ID数组 - data: 更新的字段数据 **使用场景：** 1. 批量暂停任务：设置 status = "1" 2. 批量恢复任务：设置 status = "0" 3. 批量修改任务分组 **示例：** ```json { "ids": ["id1", "id2", "id3"], "data": { "status": "1", "remark": "维护期间暂停" } } ```
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
   * @description 根据ID更新单个定时任务信息。 **路径参数：** - id: 任务UUID **可更新字段：** - name: 任务名称 - group: 任务分组 - invokeTarget: 调用目标 - cronExpression: Cron表达式 - misfirePolicy: 错过执行策略 - concurrent: 是否允许并发 - status: 状态，"0"=正常，"1"=暂停 - remark: 备注 **使用场景：** 1. 修改任务执行时间（cronExpression） 2. 暂停/恢复任务（status） 3. 调整任务配置 **示例：** ```json // PUT /api/system/job/550e8400-e29b-41d4-a716-446655440000 { "data": { "cronExpression": "0 0 3 * * ?", "status": "0" } } ```
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
   * @description 根据ID列表批量更新任务执行日志。 **参数说明：** - ids: 要更新的日志ID数组 - data: 更新的字段数据 **使用场景：** 1. 批量标记日志状态 2. 批量添加备注 **示例：** ```json { "ids": ["id1", "id2", "id3"], "data": { "status": "1" } } ```
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
   * @description 根据ID更新单个任务执行日志信息。 **路径参数：** - id: 日志UUID **可更新字段：** - jobMessage: 执行消息 - status: 执行状态 - exceptionInfo: 异常信息 - stopTime: 结束时间 **使用场景：** 1. 任务执行完成后更新状态和结束时间 2. 记录任务执行异常信息 **示例：** ```json // PUT /api/system/job-log/550e8400-e29b-41d4-a716-446655440000 { "data": { "status": "1", "exceptionInfo": "连接超时", "stopTime": "2024-01-01T02:01:00Z" } } ```
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
   * @description 根据ID列表批量更新多个菜单。 **请求体：** - ids: 要更新的菜单ID数组 - data: 更新数据对象 **使用场景：** - 批量显示/隐藏菜单 - 批量启用/禁用菜单 **示例：** ```json { "ids": ["menu-id-1", "menu-id-2"], "data": { "visible": false } } ``` **返回：** 更新成功的菜单对象数组
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
   * @description 根据ID更新单个菜单的信息。 **路径参数：** - id: 菜单的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - name: 菜单名称 - type: 菜单类型 - parentId: 父级菜单ID - path: 路由路径 - component: 组件路径 - permission: 权限标识 - icon: 图标 - orderNum: 排序号 - visible: 是否可见 - status: 状态 **示例：** ```json PUT /api/system/menu/xxx-uuid { "data": { "visible": false, "orderNum": 10 } } ```
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
   * @description 根据ID列表批量更新通知公告，所有指定的通知将应用相同的更新数据。 **参数说明：** - ids: 要更新的通知ID数组 - data: 更新的字段数据 **使用场景：** 1. 批量关闭过期通知：设置 status = "1" 2. 批量修改通知类型 3. 批量添加备注 **示例：** ```json { "ids": ["id1", "id2", "id3"], "data": { "status": "1", "remark": "已过期" } } ```
   * @tags system, notice
   * @name PutApiSystemNoticeBatch
   * @summary 批量更新通知公告
   * @request PUT:/api/system/notice/batch
   * @response `200` `PutApiSystemNoticeBatchData` Response for status 200
   */
  export namespace PutApiSystemNoticeBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemNoticeBatchData;
  }

  /**
   * @description 根据ID更新单个通知公告信息。 **路径参数：** - id: 通知公告UUID **可更新字段：** - title: 通知标题 - type: 通知类型，"1"=通知，"2"=公告 - content: 通知内容 - status: 状态，"0"=正常，"1"=关闭 - remark: 备注 **使用场景：** 1. 修改通知内容 2. 关闭过期通知 3. 更改通知类型 **示例：** ```json // PUT /api/system/notice/550e8400-e29b-41d4-a716-446655440000 { "data": { "title": "系统维护通知（已完成）", "status": "1" } } ```
   * @tags system, notice
   * @name PutApiSystemNoticeById
   * @summary 更新通知公告
   * @request PUT:/api/system/notice/{id}
   * @response `200` `PutApiSystemNoticeByIdData` Response for status 200
   */
  export namespace PutApiSystemNoticeById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemNoticeByIdData;
  }

  /**
   * @description 根据ID更新权限信息。 **路径参数：** - id: 权限UUID，必填 **请求体参数 (data)：** - code: 权限编码，可选 - name: 权限名称，可选 - type: 权限类型，可选 - module: 所属模块，可选 - parentId: 父级权限ID，可选 - status: 状态，可选 - orderNum: 排序号，可选 - remark: 备注，可选 **示例：** PUT /api/system/permission/550e8400-e29b-41d4-a716-446655440000 ```json { "data": { "name": "用户管理", "status": false, "orderNum": 10 } } ```
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
   * @description 根据ID列表批量更新岗位，所有指定的岗位将应用相同的更新数据。 **参数说明：** - ids: 要更新的岗位ID数组 - data: 更新的字段数据 **使用场景：** 1. 批量启用/禁用岗位：设置 status 2. 批量调整排序：设置 sort 3. 批量添加备注 **示例：** ```json { "ids": ["id1", "id2", "id3"], "data": { "status": "1", "remark": "已停用" } } ```
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
   * @description 根据ID更新单个岗位信息。 **路径参数：** - id: 岗位UUID **可更新字段：** - code: 岗位编码 - name: 岗位名称 - sort: 排序号 - status: 状态，"0"=正常，"1"=禁用 - remark: 备注 **使用场景：** 1. 修改岗位名称或编码 2. 调整岗位排序 3. 启用/禁用岗位 **示例：** ```json // PUT /api/system/post/550e8400-e29b-41d4-a716-446655440000 { "data": { "name": "高级项目经理", "sort": 5, "status": "0" } } ```
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
   * @description 根据ID列表批量更新多个角色。 **请求体：** - ids: 要更新的角色ID数组 - data: 更新数据对象 **注意事项：** - 如果列表中包含管理员角色，会抛出错误 **示例：** ```json { "ids": ["role-id-1", "role-id-2"], "data": { "status": "1" } } ``` **返回：** 更新成功的角色对象数组
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
   * @description 根据ID更新单个角色的信息。 **路径参数：** - id: 角色的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - name: 角色名称 - key: 角色标识 - status: 状态，"0"=正常，"1"=禁用 - sort: 排序号 - remark: 备注 **注意事项：** - 管理员角色（key=admin）不允许修改 **示例：** ```json PUT /api/system/role/xxx-uuid { "data": { "status": "1", "remark": "已禁用" } } ```
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
   * @description 设置指定角色的菜单列表，采用全量替换方式。 **路径参数：** - roleId: 角色UUID，必填 **请求体参数：** - menuIds: 菜单ID数组，必填，可为空数组（清空所有菜单权限） **操作逻辑：** 1. 删除该角色的所有现有菜单关联 2. 插入新的菜单关联列表 **使用场景：** - 角色菜单权限配置页面，保存角色的菜单权限 - 批量更新角色的菜单访问权限 **示例：** PUT /api/system/role-menu/role/550e8400-e29b-41d4-a716-446655440000 ```json { "menuIds": ["menu-id-1", "menu-id-2", "menu-id-3"] } ``` **清空菜单权限：** ```json { "menuIds": [] } ```
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
   * @description 更新当前用户的偏好设置
   * @tags system, user, preferences
   * @name PutApiSystemUserPreferences
   * @summary 更新用户偏好设置
   * @request PUT:/api/system/user/preferences
   * @response `200` `PutApiSystemUserPreferencesData` Response for status 200
   */
  export namespace PutApiSystemUserPreferences {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiSystemUserPreferencesPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiSystemUserPreferencesData;
  }

  /**
   * @description 设置指定用户的角色列表，采用全量替换方式。 **路径参数：** - userId: 用户UUID，必填 **请求体参数：** - roleIds: 角色ID数组，必填，可为空数组（清空所有角色） **操作逻辑：** 1. 删除该用户的所有现有角色关联 2. 插入新的角色关联列表 **使用场景：** - 用户编辑页面，保存用户的角色配置 - 批量更新用户的角色权限 **示例：** PUT /api/system/user-role/user/550e8400-e29b-41d4-a716-446655440000 ```json { "roleIds": ["role-id-1", "role-id-2", "role-id-3"] } ``` **清空角色：** ```json { "roleIds": [] } ```
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
   * @description 取消收藏知识库节点。 **路径参数：** - nodeId: 节点UUID **返回：** - success: 是否成功（true表示已取消，false表示未找到收藏记录） **示例：** DELETE /api/knowledge/favorites/550e8400-e29b-41d4-a716-446655440000
   * @tags knowledge, favorite
   * @name DeleteApiKnowledgeFavoritesByNodeId
   * @summary 取消收藏
   * @request DELETE:/api/knowledge/favorites/{nodeId}
   * @response `200` `DeleteApiKnowledgeFavoritesByNodeIdData` Response for status 200
   */
  export namespace DeleteApiKnowledgeFavoritesByNodeId {
    export type RequestParams = {
      /** 节点 ID */
      nodeId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiKnowledgeFavoritesByNodeIdData;
  }

  /**
   * @description 软删除节点（文件夹会递归删除所有子节点）。 **路径参数：** - id: 节点UUID **权限检查：** - 需要对该节点有 delete 权限 **行为：** - 软删除：设置 deletedAt 时间戳，不物理删除 - 文件夹：递归删除所有后代节点（使用物化路径批量更新） **返回：** - success: 是否成功 - deletedCount: 删除的节点数量（包括子节点） **示例：** DELETE /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000
   * @tags knowledge, node, mutation
   * @name DeleteApiKnowledgeNodesById
   * @summary 删除节点
   * @request DELETE:/api/knowledge/nodes/{id}
   * @response `200` `DeleteApiKnowledgeNodesByIdData` Response for status 200
   */
  export namespace DeleteApiKnowledgeNodesById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteApiKnowledgeNodesByIdData;
  }

  /**
   * @description 移除节点的权限条目。 **路径参数：** - id: 节点UUID - subjectType: "user" | "role" | "dept" - subjectId: 主体ID **查询参数：** - permission: 可选，指定移除的权限类型；不指定则移除该主体的所有权限 **权限检查：** - 需要是节点创建者或有 manage 权限 **返回：** - success: 是否成功 **示例：** DELETE /api/knowledge/nodes/node-uuid/permissions/user/user-uuid?permission=write
   * @tags knowledge, permission
   * @name DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectId
   * @summary 移除权限
   * @request DELETE:/api/knowledge/nodes/{id}/permissions/{subjectType}/{subjectId}
   * @response `200` `DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectIdData` Response for status 200
   */
  export namespace DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectId {
    export type RequestParams = {
      /** 节点 ID */
      id: string;
      /** 主体 ID */
      subjectId: string;
      /** 主体类型：user=用户，role=角色，dept=部门 */
      subjectType: DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectIdParams1SubjectTypeEnum;
    };
    export type RequestQuery = {
      /** 要移除的特定权限，不指定则移除所有 */
      permission?: DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectIdParams1PermissionEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody =
      DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectIdData;
  }

  /**
   * @description 根据主键ID查询单个节点详情。 **路径参数：** - id: 节点UUID **返回：** - 节点完整信息，包含 id, name, type, path, size, mimeType 等 - 如果节点不存在或无权限，返回 null **权限检查：** - 需要对该节点有 read 权限 **示例：** GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000
   * @tags knowledge, node, query
   * @name GetApiKnowledgeNodesById
   * @summary 根据ID查询节点
   * @request GET:/api/knowledge/nodes/{id}
   * @response `200` `GetApiKnowledgeNodesByIdData` Response for status 200
   */
  export namespace GetApiKnowledgeNodesById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeNodesByIdData;
  }

  /**
   * @description 获取指定父节点下的所有子节点。 **路径参数：** - id: 父节点ID，使用 "root" 表示根目录 **查询参数：** - type: 可选，筛选类型 "folder" | "file" **返回：** - data: 子节点数组，按类型和名称排序（文件夹在前） **使用场景：** - 文件管理器目录浏览 - 获取文件夹内容 **示例：** GET /api/knowledge/nodes/root/children?type=folder
   * @tags knowledge, node, query
   * @name GetApiKnowledgeNodesByIdChildren
   * @summary 获取子节点
   * @request GET:/api/knowledge/nodes/{id}/children
   * @response `200` `GetApiKnowledgeNodesByIdChildrenData` Response for status 200
   */
  export namespace GetApiKnowledgeNodesByIdChildren {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {
      type?: GetApiKnowledgeNodesByIdChildrenParams1TypeEnum;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeNodesByIdChildrenData;
  }

  /**
   * @description 获取文件原始内容（不验证文件类型）。 **路径参数：** - id: 文件节点UUID **权限检查：** - 需要对该节点有 read 权限 **返回：** - content: 文件内容（字符串） - mimeType: MIME类型 **使用场景：** - 获取任意文件的原始内容 - 文件预览 **示例：** GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/content
   * @tags knowledge, content
   * @name GetApiKnowledgeNodesByIdContent
   * @summary 获取原始内容
   * @request GET:/api/knowledge/nodes/{id}/content
   * @response `200` `GetApiKnowledgeNodesByIdContentData` Response for status 200
   */
  export namespace GetApiKnowledgeNodesByIdContent {
    export type RequestParams = {
      /** 文件节点 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeNodesByIdContentData;
  }

  /**
   * @description 获取文件预签名下载URL（1小时有效）。 **路径参数：** - id: 文件节点UUID **权限检查：** - 需要对该节点有 read 权限 **返回：** - url: 预签名下载URL - expiresAt: URL过期时间（ISO 8601） **副作用：** - 自动增加文件下载次数计数 **示例：** GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/download-url
   * @tags knowledge, content
   * @name GetApiKnowledgeNodesByIdDownloadUrl
   * @summary 获取下载URL
   * @request GET:/api/knowledge/nodes/{id}/download-url
   * @response `200` `GetApiKnowledgeNodesByIdDownloadUrlData` Response for status 200
   */
  export namespace GetApiKnowledgeNodesByIdDownloadUrl {
    export type RequestParams = {
      /** 文件节点 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeNodesByIdDownloadUrlData;
  }

  /**
   * @description 获取用户对节点的有效权限（考虑继承和角色）。 **路径参数：** - id: 节点UUID **查询参数：** - userId: 可选，目标用户ID；不指定则查询当前用户 **返回：** - data: 有效权限数组 - permission: "read" | "write" | "delete" | "manage" - effect: "allow" | "deny" - source: "direct" | "inherited" | "role" | "dept"（权限来源） - sourceId: 来源ID（如角色ID） **特殊情况：** - 节点创建者自动拥有所有权限 **示例：** GET /api/knowledge/nodes/node-uuid/effective-permissions?userId=user-uuid
   * @tags knowledge, permission
   * @name GetApiKnowledgeNodesByIdEffectivePermissions
   * @summary 获取有效权限
   * @request GET:/api/knowledge/nodes/{id}/effective-permissions
   * @response `200` `GetApiKnowledgeNodesByIdEffectivePermissionsData` Response for status 200
   */
  export namespace GetApiKnowledgeNodesByIdEffectivePermissions {
    export type RequestParams = {
      /** 节点 ID */
      id: string;
    };
    export type RequestQuery = {
      /** 用户 ID，不指定则查询当前用户 */
      userId?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeNodesByIdEffectivePermissionsData;
  }

  /**
   * @description 获取节点的完整路径（面包屑导航）。 **路径参数：** - id: 节点UUID **返回：** - data: 路径节点数组（从根到当前节点） - id: 节点ID - name: 节点名称 - type: 节点类型 **使用场景：** - 面包屑导航 - 显示文件完整路径 **示例响应：** ```json { "data": [ { "id": "root-folder", "name": "文档", "type": "folder" }, { "id": "sub-folder", "name": "项目", "type": "folder" }, { "id": "current-file", "name": "readme.md", "type": "file" } ] } ```
   * @tags knowledge, operations
   * @name GetApiKnowledgeNodesByIdPath
   * @summary 获取节点路径
   * @request GET:/api/knowledge/nodes/{id}/path
   * @response `200` `GetApiKnowledgeNodesByIdPathData` Response for status 200
   */
  export namespace GetApiKnowledgeNodesByIdPath {
    export type RequestParams = {
      /** 节点 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeNodesByIdPathData;
  }

  /**
   * @description 获取节点的权限列表（所有被授权的主体）。 **路径参数：** - id: 节点UUID **权限检查：** - 需要对该节点有 read 权限 **返回：** - permissions: 权限数组 - subjectType: "user" | "role" | "dept" - subjectId: 主体ID - resourceId: 节点ID - permission: "read" | "write" | "delete" | "manage" - effect: "allow" | "deny" **示例：** GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/permissions
   * @tags knowledge, permission
   * @name GetApiKnowledgeNodesByIdPermissions
   * @summary 获取节点权限
   * @request GET:/api/knowledge/nodes/{id}/permissions
   * @response `200` `GetApiKnowledgeNodesByIdPermissionsData` Response for status 200
   */
  export namespace GetApiKnowledgeNodesByIdPermissions {
    export type RequestParams = {
      /** 节点 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeNodesByIdPermissionsData;
  }

  /**
   * @description 获取文本文件内容（用于在线编辑）。 **路径参数：** - id: 文件节点UUID **权限检查：** - 需要对该节点有 read 权限 **限制：** - 仅支持文本类型文件（.txt, .md, .json, .js, .ts 等） **返回：** - id: 节点ID - name: 文件名 - content: 文件内容（UTF-8字符串） - mimeType: MIME类型 - extension: 扩展名 - parentId: 父节点ID **使用场景：** - 在线文本编辑器 - Markdown 预览 **示例：** GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/text
   * @tags knowledge, content
   * @name GetApiKnowledgeNodesByIdText
   * @summary 获取文本内容
   * @request GET:/api/knowledge/nodes/{id}/text
   * @response `200` `GetApiKnowledgeNodesByIdTextData` Response for status 200
   */
  export namespace GetApiKnowledgeNodesByIdText {
    export type RequestParams = {
      /** 文件节点 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeNodesByIdTextData;
  }

  /**
   * @description 获取文件的所有历史版本列表。 **路径参数：** - id: 文件节点UUID **权限检查：** - 需要对该节点有 read 权限 **限制：** - 仅支持文件类型节点 **返回：** - data: 版本数组，按创建时间倒序 **示例：** GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/versions
   * @tags knowledge, version
   * @name GetApiKnowledgeNodesByIdVersions
   * @summary 获取版本列表
   * @request GET:/api/knowledge/nodes/{id}/versions
   * @response `200` `GetApiKnowledgeNodesByIdVersionsData` Response for status 200
   */
  export namespace GetApiKnowledgeNodesByIdVersions {
    export type RequestParams = {
      /** 节点 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeNodesByIdVersionsData;
  }

  /**
   * @description 获取知识库节点表的 JSON Schema 定义。 **返回：** - JSON Schema 对象，描述节点数据结构 **使用场景：** - 前端表单动态生成 - API 文档生成 - 数据验证
   * @tags knowledge, node, schema
   * @name GetApiKnowledgeNodesSchema
   * @summary 获取节点Schema
   * @request GET:/api/knowledge/nodes/schema
   * @response `200` `GetApiKnowledgeNodesSchemaData` Response for status 200
   */
  export namespace GetApiKnowledgeNodesSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeNodesSchemaData;
  }

  /**
   * @description 获取历史版本的预签名下载URL（1小时有效）。 **路径参数：** - id: 版本记录UUID **权限检查：** - 需要对关联的文件节点有 read 权限 **返回：** - url: 预签名下载URL - expiresAt: URL过期时间（ISO 8601） **文件名格式：** - 自动添加版本号后缀，如 "document_v2.pdf" **示例：** GET /api/knowledge/versions/version-uuid/download-url
   * @tags knowledge, version
   * @name GetApiKnowledgeVersionsByIdDownloadUrl
   * @summary 下载历史版本
   * @request GET:/api/knowledge/versions/{id}/download-url
   * @response `200` `GetApiKnowledgeVersionsByIdDownloadUrlData` Response for status 200
   */
  export namespace GetApiKnowledgeVersionsByIdDownloadUrl {
    export type RequestParams = {
      /** 版本 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeVersionsByIdDownloadUrlData;
  }

  /**
   * @description 获取文件版本表的 JSON Schema 定义。 **返回：** - JSON Schema 对象，描述版本数据结构 **使用场景：** - 前端表单动态生成 - API 文档生成
   * @tags knowledge, version
   * @name GetApiKnowledgeVersionsSchema
   * @summary 获取版本Schema
   * @request GET:/api/knowledge/versions/schema
   * @response `200` `GetApiKnowledgeVersionsSchemaData` Response for status 200
   */
  export namespace GetApiKnowledgeVersionsSchema {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetApiKnowledgeVersionsSchemaData;
  }

  /**
   * @description 收藏知识库节点（文件或文件夹）。 **请求体参数：** - nodeId: 节点UUID，必填 **行为：** - 如果已收藏，返回现有收藏记录（幂等操作） - 自动获取节点类型（folder/file） **返回：** - 收藏记录完整信息 **示例：** ```json { "nodeId": "550e8400-e29b-41d4-a716-446655440000" } ```
   * @tags knowledge, favorite
   * @name PostApiKnowledgeFavorites
   * @summary 添加收藏
   * @request POST:/api/knowledge/favorites
   * @response `200` `PostApiKnowledgeFavoritesData` Response for status 200
   */
  export namespace PostApiKnowledgeFavorites {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFavoritesPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFavoritesData;
  }

  /**
   * @description 批量检查节点是否已收藏。 **请求体参数：** - nodeIds: 节点ID数组，必填 **返回：** - favorites: 收藏状态映射 { nodeId: boolean } **使用场景：** - 文件列表显示收藏状态 - 批量操作前检查 **示例：** ```json { "nodeIds": ["uuid1", "uuid2", "uuid3"] } ``` **响应：** ```json { "favorites": { "uuid1": true, "uuid2": false, "uuid3": true } } ```
   * @tags knowledge, favorite
   * @name PostApiKnowledgeFavoritesCheck
   * @summary 检查收藏状态
   * @request POST:/api/knowledge/favorites/check
   * @response `200` `PostApiKnowledgeFavoritesCheckData` Response for status 200
   */
  export namespace PostApiKnowledgeFavoritesCheck {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFavoritesCheckPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFavoritesCheckData;
  }

  /**
   * @description 获取当前用户的收藏列表（带节点详情）。 **请求体参数：** - type: 节点类型筛选，可选 "folder" | "file" - limit: 每页数量，默认50，最大100 - offset: 偏移量，默认0 **返回：** - data: 收藏项数组，包含节点详情 - favoriteId: 收藏记录ID - nodeId: 节点ID - type: 节点类型 - name: 名称 - parentId: 父节点ID - icon, color, extension, mimeType, size - createdAt: 节点创建时间 - favoritedAt: 收藏时间 - total: 总数 **示例：** ```json { "type": "file", "limit": 20, "offset": 0 } ```
   * @tags knowledge, favorite
   * @name PostApiKnowledgeFavoritesList
   * @summary 获取收藏列表
   * @request POST:/api/knowledge/favorites/list
   * @response `200` `PostApiKnowledgeFavoritesListData` Response for status 200
   */
  export namespace PostApiKnowledgeFavoritesList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeFavoritesListPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeFavoritesListData;
  }

  /**
   * @description 创建文件夹或文件节点。 **请求体参数：** - type: 节点类型，必填，"folder" | "file" - parentId: 父节点ID，可选，null表示根目录 - name: 名称，必填，1-255字符 - description: 描述，可选 - 文件夹特有：icon, color - 文件特有：extension, mimeType, size, storageKey, bucket, etag, versionId **权限检查：** - 如果指定 parentId，需要对父节点有 write 权限 **返回：** - 创建的节点完整信息 **示例（创建文件夹）：** ```json { "type": "folder", "parentId": null, "name": "我的文档", "icon": "folder", "color": "#4A90E2" } ```
   * @tags knowledge, node, mutation
   * @name PostApiKnowledgeNodes
   * @summary 创建节点
   * @request POST:/api/knowledge/nodes
   * @response `200` `PostApiKnowledgeNodesData` Response for status 200
   */
  export namespace PostApiKnowledgeNodes {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeNodesPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeNodesData;
  }

  /**
   * @description 复制节点到目标文件夹（自动处理重名）。 **路径参数：** - id: 要复制的节点UUID **请求体参数：** - targetParentId: 目标父节点ID，null表示复制到根目录 **权限检查：** - 需要对源节点有 read 权限 - 需要对目标文件夹有 write 权限 **行为：** - 如果目标位置存在同名文件，自动重命名（如 "file (1).txt"） - 复制文件的存储引用，不复制实际文件内容 **返回：** - 复制后的新节点完整信息 **示例：** ```json { "targetParentId": "target-folder-uuid" } ```
   * @tags knowledge, operations
   * @name PostApiKnowledgeNodesByIdCopy
   * @summary 复制节点
   * @request POST:/api/knowledge/nodes/{id}/copy
   * @response `200` `PostApiKnowledgeNodesByIdCopyData` Response for status 200
   */
  export namespace PostApiKnowledgeNodesByIdCopy {
    export type RequestParams = {
      /** 节点 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeNodesByIdCopyPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeNodesByIdCopyData;
  }

  /**
   * @description 移动节点到目标文件夹。 **路径参数：** - id: 要移动的节点UUID **请求体参数：** - targetParentId: 目标父节点ID，null表示移动到根目录 **权限检查：** - 需要对源节点有 write 权限 - 需要对目标文件夹有 write 权限 **限制：** - 不能移动到自身 - 文件夹不能移动到自己的后代节点 **返回：** - 移动后的节点完整信息 **示例：** ```json { "targetParentId": "target-folder-uuid" } ```
   * @tags knowledge, operations
   * @name PostApiKnowledgeNodesByIdMove
   * @summary 移动节点
   * @request POST:/api/knowledge/nodes/{id}/move
   * @response `200` `PostApiKnowledgeNodesByIdMoveData` Response for status 200
   */
  export namespace PostApiKnowledgeNodesByIdMove {
    export type RequestParams = {
      /** 节点 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeNodesByIdMovePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeNodesByIdMoveData;
  }

  /**
   * @description 为节点添加单个权限条目。 **路径参数：** - id: 节点UUID **请求体参数：** - subjectType: "user" | "role" | "dept" - subjectId: 主体ID - permission: "read" | "write" | "delete" | "manage" - effect: "allow" | "deny"，默认 "allow" **权限检查：** - 需要是节点创建者或有 manage 权限 **返回：** - success: 是否成功 **示例：** ```json { "subjectType": "user", "subjectId": "user-uuid", "permission": "write", "effect": "allow" } ```
   * @tags knowledge, permission
   * @name PostApiKnowledgeNodesByIdPermissions
   * @summary 添加权限
   * @request POST:/api/knowledge/nodes/{id}/permissions
   * @response `200` `PostApiKnowledgeNodesByIdPermissionsData` Response for status 200
   */
  export namespace PostApiKnowledgeNodesByIdPermissions {
    export type RequestParams = {
      /** 节点 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeNodesByIdPermissionsPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeNodesByIdPermissionsData;
  }

  /**
   * @description 快速共享节点给多个用户（简化的权限设置）。 **路径参数：** - id: 节点UUID **请求体参数：** - userIds: 用户ID数组 - level: 共享级别 - "read": 只读（read权限） - "edit": 可编辑（read + write权限） - "full": 完全控制（read + write + delete + manage权限） **权限检查：** - 需要是节点创建者或有 manage 权限 **返回：** - success: 是否成功 - sharedCount: 实际共享的用户数（排除自己） **示例：** ```json { "userIds": ["user1-uuid", "user2-uuid"], "level": "edit" } ```
   * @tags knowledge, permission
   * @name PostApiKnowledgeNodesByIdQuickShare
   * @summary 快捷共享
   * @request POST:/api/knowledge/nodes/{id}/quick-share
   * @response `200` `PostApiKnowledgeNodesByIdQuickShareData` Response for status 200
   */
  export namespace PostApiKnowledgeNodesByIdQuickShare {
    export type RequestParams = {
      /** 节点 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeNodesByIdQuickSharePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeNodesByIdQuickShareData;
  }

  /**
   * @description 取消用户对节点的所有权限（批量撤销）。 **路径参数：** - id: 节点UUID **请求体参数：** - userIds: 用户ID数组 **权限检查：** - 需要是节点创建者或有 manage 权限 **返回：** - success: 是否成功 - revokedCount: 撤销的用户数 **示例：** ```json { "userIds": ["user1-uuid", "user2-uuid"] } ```
   * @tags knowledge, permission
   * @name PostApiKnowledgeNodesByIdRevokeShare
   * @summary 取消共享
   * @request POST:/api/knowledge/nodes/{id}/revoke-share
   * @response `200` `PostApiKnowledgeNodesByIdRevokeShareData` Response for status 200
   */
  export namespace PostApiKnowledgeNodesByIdRevokeShare {
    export type RequestParams = {
      /** 节点 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeNodesByIdRevokeSharePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeNodesByIdRevokeShareData;
  }

  /**
   * @description 检查指定父节点下是否存在同名节点（批量检查）。 **请求体参数：** - parentId: 父节点ID，可选，null表示根目录 - names: 要检查的名称数组，必填 - type: 节点类型筛选，可选 "folder" | "file" **返回：** - exists: 已存在的节点数组 - name: 文件名 - nodeId: 节点ID - type: 类型 - size: 大小 - updatedAt: 更新时间 **使用场景：** - 上传前检查文件是否存在 - 批量操作前的冲突检测 **示例：** ```json { "parentId": "folder-uuid", "names": ["file1.txt", "file2.txt", "folder1"], "type": "file" } ```
   * @tags knowledge, operations
   * @name PostApiKnowledgeNodesCheckExists
   * @summary 检查节点是否存在
   * @request POST:/api/knowledge/nodes/check-exists
   * @response `200` `PostApiKnowledgeNodesCheckExistsData` Response for status 200
   */
  export namespace PostApiKnowledgeNodesCheckExists {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeNodesCheckExistsPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeNodesCheckExistsData;
  }

  /**
   * @description 批量软删除多个节点。 **请求体参数：** - ids: 节点ID数组 **权限检查：** - 逐个检查 delete 权限，无权限的节点会被跳过 **行为：** - 软删除：设置 deletedAt 时间戳 - 文件夹：递归删除所有后代节点 **返回：** - deletedCount: 实际删除的节点数量 **示例：** ```json { "ids": ["uuid1", "uuid2", "uuid3"] } ```
   * @tags knowledge, node, mutation
   * @name PostApiKnowledgeNodesDeleteBatch
   * @summary 批量删除节点
   * @request POST:/api/knowledge/nodes/delete-batch
   * @response `200` `PostApiKnowledgeNodesDeleteBatchData` Response for status 200
   */
  export namespace PostApiKnowledgeNodesDeleteBatch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeNodesDeleteBatchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeNodesDeleteBatchData;
  }

  /**
   * @description 分页查询知识库节点列表，自动筛选当前用户的节点。 **请求体参数：** - filter: 过滤条件，可选 - ids: 节点ID数组（IN查询） - types: 类型数组 ["folder", "file"] - parentId: 父节点ID，null表示根目录 - type: 单个类型 "folder" | "file" - name: 名称模糊匹配 - extension: 扩展名模糊匹配 - createdAtStart/createdAtEnd: 创建时间范围 - isPublic: 是否公开 - sort: 排序，可选 - field: "name" | "type" | "size" | "orderNum" | "createdAt" | "updatedAt" - order: "asc" | "desc" - offset: 偏移量，默认0 - limit: 每页数量，默认20，最大100 **返回：** - data: 节点数组 - total: 总数 **示例：** ```json { "filter": { "parentId": null, "type": "folder" }, "sort": { "field": "name", "order": "asc" }, "limit": 20, "offset": 0 } ```
   * @tags knowledge, node, query
   * @name PostApiKnowledgeNodesQuery
   * @summary 分页查询节点
   * @request POST:/api/knowledge/nodes/query
   * @response `200` `PostApiKnowledgeNodesQueryData` Response for status 200
   */
  export namespace PostApiKnowledgeNodesQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeNodesQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeNodesQueryData;
  }

  /**
   * @description 全文搜索知识库节点（按名称模糊匹配）。 **请求体参数：** - keyword: 搜索关键词，必填，1-100字符 - type: 节点类型筛选，可选 "folder" | "file" - limit: 返回数量限制，默认20，最大50 **返回：** - data: 匹配的节点数组 **使用场景：** - 文件搜索 - 快速定位文件 **示例：** ```json { "keyword": "readme", "type": "file", "limit": 10 } ```
   * @tags knowledge, operations
   * @name PostApiKnowledgeNodesSearch
   * @summary 搜索节点
   * @request POST:/api/knowledge/nodes/search
   * @response `200` `PostApiKnowledgeNodesSearchData` Response for status 200
   */
  export namespace PostApiKnowledgeNodesSearch {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeNodesSearchPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeNodesSearchData;
  }

  /**
   * @description 获取当前用户共享给他人的节点列表。 **请求体参数：** - type: 节点类型筛选，可选 "folder" | "file" - limit: 每页数量，默认50，最大100 - offset: 偏移量，默认0 **返回：** - data: 共享项数组 - node: 节点完整信息 - sharedTo: 共享对象数组 - subjectType: "user" | "role" | "dept" - subjectId: 对象ID - permission: 权限级别 - total: 总数 **使用场景：** - "我的共享"页面 - 管理已共享的文件 **示例：** ```json { "type": "file", "limit": 20 } ```
   * @tags knowledge, share
   * @name PostApiKnowledgeShareMyShared
   * @summary 获取我共享的资源
   * @request POST:/api/knowledge/share/my-shared
   * @response `200` `PostApiKnowledgeShareMySharedData` Response for status 200
   */
  export namespace PostApiKnowledgeShareMyShared {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeShareMySharedPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeShareMySharedData;
  }

  /**
   * @description 获取他人共享给当前用户的节点，支持文件夹层级浏览。 **请求体参数：** - folderId: 文件夹ID，可选，用于浏览共享文件夹内容 - type: 节点类型筛选，可选 "folder" | "file" - limit: 每页数量，默认50，最大100 - offset: 偏移量，默认0 **返回：** - data: 共享项数组 - node: 节点完整信息 - permissions: 权限数组 ["read", "write", ...] - permissionSource: "direct" | "inherited"（权限来源） - sharedBy: 共享者信息 { userId, userName } - total: 总数 **权限继承：** - 进入共享文件夹后，子节点继承父节点权限 - 直接权限优先于继承权限 **使用场景：** - "收到的共享"页面 - 浏览他人共享的文件夹 **示例：** ```json { "folderId": "shared-folder-uuid", "type": "file", "limit": 20 } ```
   * @tags knowledge, share
   * @name PostApiKnowledgeShareSharedWithMe
   * @summary 获取共享给我的资源
   * @request POST:/api/knowledge/share/shared-with-me
   * @response `200` `PostApiKnowledgeShareSharedWithMeData` Response for status 200
   */
  export namespace PostApiKnowledgeShareSharedWithMe {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeShareSharedWithMePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeShareSharedWithMeData;
  }

  /**
   * @description 确认文件上传完成并创建节点记录。 **请求体参数：** - parentId: 父文件夹ID，可选 - name: 文件名，必填，1-255字符 - storageKey: 存储路径，必填（从 getUrl 返回） - mimeType: MIME类型，必填 - size: 文件大小（字节），必填 - description: 描述，可选 **权限检查：** - 如果指定 parentId，需要对父节点有 write 权限 **返回：** - 创建的文件节点完整信息 **使用场景：** - 大文件上传完成后调用 - 配合 getUrl 使用 **示例：** ```json { "parentId": "folder-uuid", "name": "document.pdf", "storageKey": "knowledge/user-id/xxx/document.pdf", "mimeType": "application/pdf", "size": 1048576 } ```
   * @tags knowledge, upload
   * @name PostApiKnowledgeUploadConfirm
   * @summary 确认上传
   * @request POST:/api/knowledge/upload/confirm
   * @response `200` `PostApiKnowledgeUploadConfirmData` Response for status 200
   */
  export namespace PostApiKnowledgeUploadConfirm {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeUploadConfirmPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeUploadConfirmData;
  }

  /**
   * @description 直接上传小文件（Base64编码），自动检测同名冲突。 **请求体参数：** - parentId: 父文件夹ID，可选，null表示根目录 - name: 文件名，必填，1-255字符 - content: 文件内容，必填，Base64编码 - mimeType: MIME类型，可选，默认 application/octet-stream - description: 描述，可选 **返回：** - success: 是否成功 - node: 创建的节点（成功时） - conflict: 冲突信息（存在同名文件时） - nodeId: 已存在节点ID - name: 文件名 - size: 文件大小 - updatedAt: 更新时间 **使用场景：** - 小文件快速上传（<5MB） - 文本文件创建 **示例：** ```json { "parentId": null, "name": "readme.md", "content": "IyBIZWxsbyBXb3JsZA==", "mimeType": "text/markdown" } ```
   * @tags knowledge, upload
   * @name PostApiKnowledgeUploadDirect
   * @summary 直接上传
   * @request POST:/api/knowledge/upload/direct
   * @response `200` `PostApiKnowledgeUploadDirectData` Response for status 200
   */
  export namespace PostApiKnowledgeUploadDirect {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeUploadDirectPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeUploadDirectData;
  }

  /**
   * @description 上传文件并处理同名冲突，支持覆盖、新版本、副本三种模式。 **请求体参数：** - parentId: 父文件夹ID，可选 - name: 文件名，必填，1-255字符 - content: 文件内容，必填，Base64编码 - mimeType: MIME类型，可选 - description: 描述，可选 - conflictMode: 冲突处理模式，必填 - "overwrite": 覆盖现有文件 - "newVersion": 保存为新版本（保留历史） - "copy": 创建副本（自动重命名） - existingNodeId: 现有节点ID（overwrite/newVersion模式必填） **权限检查：** - overwrite/newVersion: 需要对现有节点有 write 权限 - copy: 需要对父节点有 write 权限 **返回：** - 创建/更新的节点完整信息 **示例（覆盖）：** ```json { "name": "report.xlsx", "content": "...", "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "conflictMode": "overwrite", "existingNodeId": "existing-file-uuid" } ```
   * @tags knowledge, upload
   * @name PostApiKnowledgeUploadForce
   * @summary 强制上传
   * @request POST:/api/knowledge/upload/force
   * @response `200` `PostApiKnowledgeUploadForceData` Response for status 200
   */
  export namespace PostApiKnowledgeUploadForce {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeUploadForcePayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeUploadForceData;
  }

  /**
   * @description 获取预签名上传URL，用于大文件分片上传。 **请求体参数：** - parentId: 父文件夹ID，可选，null表示根目录 - filename: 文件名，必填，1-255字符 - mimeType: MIME类型，必填 **返回：** - uploadUrl: 预签名上传URL（直接PUT到此URL） - storageKey: 存储路径，用于后续确认上传 - expiresAt: URL过期时间（ISO 8601） **使用场景：** - 大文件上传（>5MB） - 前端直传S3/MinIO **示例：** ```json { "parentId": "folder-uuid", "filename": "large-file.zip", "mimeType": "application/zip" } ```
   * @tags knowledge, upload
   * @name PostApiKnowledgeUploadUrl
   * @summary 获取上传URL
   * @request POST:/api/knowledge/upload/url
   * @response `200` `PostApiKnowledgeUploadUrlData` Response for status 200
   */
  export namespace PostApiKnowledgeUploadUrl {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeUploadUrlPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeUploadUrlData;
  }

  /**
   * @description 将历史版本恢复为当前版本。 **路径参数：** - id: 版本记录UUID **权限检查：** - 需要对关联的文件节点有 write 权限 **行为：** 1. 将当前文件保存为新版本（保留历史） 2. 将历史版本的存储信息更新到主节点 3. 增加版本计数 **返回：** - 更新后的文件节点完整信息 **示例：** POST /api/knowledge/versions/version-uuid/restore
   * @tags knowledge, version
   * @name PostApiKnowledgeVersionsByIdRestore
   * @summary 恢复历史版本
   * @request POST:/api/knowledge/versions/{id}/restore
   * @response `200` `PostApiKnowledgeVersionsByIdRestoreData` Response for status 200
   */
  export namespace PostApiKnowledgeVersionsByIdRestore {
    export type RequestParams = {
      /** 版本 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeVersionsByIdRestoreData;
  }

  /**
   * @description 分页查询文件版本列表。 **请求体参数：** - filter: 过滤条件，可选 - nodeIds: 节点ID数组（IN查询） - nodeId: 单个节点ID - versionNumber: 版本号模糊匹配 - createdAtStart/createdAtEnd: 创建时间范围 - sort: 排序，可选 - field: "versionNumber" | "size" | "createdAt" - order: "asc" | "desc" - offset: 偏移量，默认0 - limit: 每页数量，默认20，最大100 **返回：** - data: 版本数组 - total: 总数 **示例：** ```json { "filter": { "nodeId": "file-uuid" }, "sort": { "field": "createdAt", "order": "desc" }, "limit": 10 } ```
   * @tags knowledge, version
   * @name PostApiKnowledgeVersionsQuery
   * @summary 分页查询版本
   * @request POST:/api/knowledge/versions/query
   * @response `200` `PostApiKnowledgeVersionsQueryData` Response for status 200
   */
  export namespace PostApiKnowledgeVersionsQuery {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PostApiKnowledgeVersionsQueryPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PostApiKnowledgeVersionsQueryData;
  }

  /**
   * @description 更新节点信息（重命名、修改描述等）。 **路径参数：** - id: 节点UUID **请求体参数（均可选）：** - name: 新名称，1-255字符 - description: 描述 - icon: 图标（文件夹） - color: 颜色（文件夹） - orderNum: 排序号 - isPublic: 是否公开 - tags: 标签数组 **权限检查：** - 需要对该节点有 write 权限 **返回：** - 更新后的节点完整信息 **示例：** ```json { "name": "新文件名.md", "description": "更新的描述", "tags": ["重要", "工作"] } ```
   * @tags knowledge, node, mutation
   * @name PutApiKnowledgeNodesById
   * @summary 更新节点
   * @request PUT:/api/knowledge/nodes/{id}
   * @response `200` `PutApiKnowledgeNodesByIdData` Response for status 200
   */
  export namespace PutApiKnowledgeNodesById {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiKnowledgeNodesByIdPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiKnowledgeNodesByIdData;
  }

  /**
   * @description 设置节点的权限（替换现有所有权限）。 **路径参数：** - id: 节点UUID **请求体参数：** - permissions: 权限数组 - subjectType: "user" | "role" | "dept" - subjectId: 主体ID - permission: "read" | "write" | "delete" | "manage" - effect: "allow" | "deny"，默认 "allow" **权限检查：** - 需要是节点创建者或有 manage 权限 **返回：** - success: 是否成功 **示例：** ```json { "permissions": [ { "subjectType": "user", "subjectId": "user-uuid", "permission": "read" }, { "subjectType": "role", "subjectId": "role-uuid", "permission": "write" } ] } ```
   * @tags knowledge, permission
   * @name PutApiKnowledgeNodesByIdPermissions
   * @summary 设置节点权限
   * @request PUT:/api/knowledge/nodes/{id}/permissions
   * @response `200` `PutApiKnowledgeNodesByIdPermissionsData` Response for status 200
   */
  export namespace PutApiKnowledgeNodesByIdPermissions {
    export type RequestParams = {
      /** 节点 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiKnowledgeNodesByIdPermissionsPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiKnowledgeNodesByIdPermissionsData;
  }

  /**
   * @description 保存文本文件内容（在线编辑保存）。 **路径参数：** - id: 文件节点UUID **请求体参数：** - content: 文件内容，必填，UTF-8字符串 **权限检查：** - 需要对该节点有 write 权限 **返回：** - 更新后的节点完整信息（包含新的 size） **使用场景：** - 在线文本编辑器保存 - Markdown 编辑保存 **示例：** ```json { "content": "# 标题\n\n这是更新后的内容" } ```
   * @tags knowledge, content
   * @name PutApiKnowledgeNodesByIdText
   * @summary 保存文本内容
   * @request PUT:/api/knowledge/nodes/{id}/text
   * @response `200` `PutApiKnowledgeNodesByIdTextData` Response for status 200
   */
  export namespace PutApiKnowledgeNodesByIdText {
    export type RequestParams = {
      /** 文件节点 ID */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = PutApiKnowledgeNodesByIdTextPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiKnowledgeNodesByIdTextData;
  }

  /**
   * @description 批量更新节点排序号。 **请求体参数：** - items: 排序项数组 - id: 节点UUID - orderNum: 新排序号（整数） **权限检查：** - 逐个检查 write 权限，无权限的节点会被跳过 **返回：** - success: 是否成功 - updatedCount: 实际更新的节点数量 **使用场景：** - 拖拽排序 - 自定义文件顺序 **示例：** ```json { "items": [ { "id": "uuid1", "orderNum": 1 }, { "id": "uuid2", "orderNum": 2 }, { "id": "uuid3", "orderNum": 3 } ] } ```
   * @tags knowledge, operations
   * @name PutApiKnowledgeNodesOrder
   * @summary 更新节点排序
   * @request PUT:/api/knowledge/nodes/order
   * @response `200` `PutApiKnowledgeNodesOrderData` Response for status 200
   */
  export namespace PutApiKnowledgeNodesOrder {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = PutApiKnowledgeNodesOrderPayload;
    export type RequestHeaders = {};
    export type ResponseBody = PutApiKnowledgeNodesOrderData;
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

export namespace Public {
  /**
   * @description 上传头像到公开存储，返回可直接访问的永久URL（无需签名）。 **请求体参数：** - category: 头像分类，必填，可选值： - "agent-avatar": AI Agent头像 - "user-avatar": 用户头像 - "group-avatar": 群组头像 - filename: 文件名，必填，1-255字符 - content: 图片内容，必填，Base64编码 - mimeType: MIME类型，必填，支持：image/jpeg, image/png, image/gif, image/webp, image/svg+xml **限制：** - 最大文件大小：2MB - 仅支持图片格式 **返回：** - success: 是否成功 - url: 公开访问URL（永久有效） - key: 存储路径 **示例：** ```json { "category": "user-avatar", "filename": "avatar.png", "content": "iVBORw0KGgoAAAANSUhEUgAA...", "mimeType": "image/png" } ```
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

export namespace Files {
  /**
   * @description 获取已上传AI聊天附件的新预签名URL（7天有效）。 **请求体参数：** - storageKey: 存储路径，必填，上传时返回的storageKey **返回：** - url: 新的预签名下载URL - expiresAt: URL过期时间（ISO 8601格式） **使用场景：** - 原URL过期后重新获取访问链接 - 历史对话中的附件重新加载 **示例：** ```json { "storageKey": "ai-chat/user-id/1234567890-abc123-image.png" } ```
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
   * @description 上传文件到AI聊天存储，返回可访问的预签名URL（7天有效）。 **请求体参数：** - filename: 文件名，必填，1-255字符 - content: 文件内容，必填，Base64编码 - mimeType: MIME类型，必填，如 "image/png", "application/pdf" **返回：** - url: 预签名下载URL（7天有效） - storageKey: 存储路径，用于后续获取URL - mimeType: 文件MIME类型 - size: 文件大小（字节） **使用场景：** - AI对话中上传图片、文档等附件 - 支持多模态AI模型的文件输入 **示例：** ```json { "filename": "screenshot.png", "content": "iVBORw0KGgoAAAANSUhEUgAA...", "mimeType": "image/png" } ```
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
}

export namespace Dev {
  /**
   * @description 获取 Turborepo monorepo 项目的根目录路径。 **返回：** - root: 项目根目录绝对路径 - name: 项目名称（目录名） **使用场景：** - 开发模式下浏览项目代码结构 - 获取项目基础信息 **示例响应：** ```json { "root": "/home/user/ai-drive-system", "name": "ai-drive-system" } ```
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
   * @description 读取指定目录下的文件和子目录列表。 **请求体参数：** - relativePath: 相对于项目根目录的路径，可选，默认为根目录 "" **返回：** - items: 文件/目录列表，包含 name, path, type, size, extension - currentPath: 当前目录相对路径 **过滤规则：** - 自动忽略：node_modules, .git, .svelte-kit, dist, build 等 - 仅显示代码相关文件：.ts, .js, .svelte, .json, .md 等 **使用场景：** - 开发模式下浏览项目目录结构 - 代码文件导航 **示例：** ```json { "relativePath": "packages/actions/src" } ```
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
   * @description 读取指定代码文件的内容。 **请求体参数：** - relativePath: 相对于项目根目录的文件路径，必填 **返回：** - content: 文件内容（UTF-8） - path: 文件相对路径 - name: 文件名 - extension: 文件扩展名 - size: 文件大小（字节） - language: 编程语言（用于语法高亮） **限制：** - 最大文件大小：1MB - 路径必须在项目根目录内（安全检查） **使用场景：** - 开发模式下查看代码文件内容 - 代码审查和分析 **示例：** ```json { "relativePath": "packages/actions/src/core/define.ts" } ```
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

  mcp = {
    /**
     * No description
     *
     * @name DeleteMcpById
     * @request DELETE:/mcp/{id}
     */
    deleteMcpById: (
      { id, ...query }: DeleteMcpByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<any, any>({
        path: `/mcp/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @name GetMcp
     * @request GET:/mcp
     */
    getMcp: (params: RequestParams = {}) =>
      this.http.request<any, any>({
        path: `/mcp`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @name GetMcpByIdInfo
     * @request GET:/mcp/{id}/info
     */
    getMcpByIdInfo: (
      { id, ...query }: GetMcpByIdInfoParams,
      params: RequestParams = {},
    ) =>
      this.http.request<any, any>({
        path: `/mcp/${id}/info`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @name PostMcpById
     * @request POST:/mcp/{id}
     */
    postMcpById: (
      { id, ...query }: PostMcpByIdParams,
      data: PostMcpByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<any, any>({
        path: `/mcp/${id}`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
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
     * @description 根据ID删除单条Agent消息，并更新会话统计。 **参数说明：** - id: 消息UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 自动更新会话的 messageCount **返回值：** - success: true=删除成功，false=消息不存在 **注意事项：** - 删除消息不会重新排列其他消息的 msgSeq - 如需删除某条消息及之后的所有消息，使用 deleteFromSeq **示例：** DELETE /api/ai/agent-message/550e8400-e29b-41d4-a716-446655440000
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
     * @description 删除会话中指定 msgSeq 及之后的所有消息，用于"重新生成"功能。 **路径参数：** - sessionId: 会话UUID - msgSeq: 起始消息序号（包含） **删除行为：** - 删除 msgSeq >= 指定值的所有消息 - 更新会话的 messageCount 和 lastMessageAt **返回值：** - deletedCount: 删除的消息数量 **使用场景：** 1. 用户点击"重新生成"，删除AI回复及之后的消息 2. 回退到某个历史节点重新对话 3. 清理错误的对话内容 **示例：** DELETE /api/ai/agent-message/from-seq/session-uuid/10 （删除 msgSeq >= 10 的所有消息）
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
     * @description 根据ID软删除Agent会话（逻辑删除，数据保留）。 **参数说明：** - id: 会话UUID **删除行为：** - 软删除：设置 deletedAt、deletedBy、deletedById - 数据保留在数据库中 - 查询时自动过滤已删除记录 **返回值：** - true: 删除成功 - false: 会话不存在或已删除 **注意事项：** - 删除会话后，关联的消息记录仍然保留 - 如需彻底清理，需要单独删除消息 **示例：** DELETE /api/ai/agent-session/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据ID删除API密钥（物理删除）。 **路径参数：** - id: API密钥的UUID **注意事项：** - 删除后无法恢复 - 会同时删除关联的MCP服务权限配置 - 建议先撤销再删除，或直接撤销而不删除（保留审计记录） **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/ai/api-key/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据ID删除单个MCP服务（物理删除）。 **路径参数：** - id: MCP服务的UUID **注意事项：** - 删除后无法恢复 - 关联的API Key权限配置会失效 **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/ai/mcp-server/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据ID删除单个AI模型（物理删除）。 **路径参数：** - id: 模型的UUID **注意事项：** - 删除后无法恢复 - 如果模型正在被使用（如智能体引用），建议先禁用而非删除 **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/ai/model/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据ID删除单个AI提供商（物理删除）。 **路径参数：** - id: 提供商的UUID **注意事项：** - 删除后无法恢复 - 如果提供商下有关联的模型，需要先删除或迁移模型 - 建议先禁用而非直接删除 **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/ai/provider/550e8400-e29b-41d4-a716-446655440000
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
     * @description 软删除AI会话。 **路径参数：** - id: 会话的UUID **注意事项：** - 软删除，数据保留但标记为已删除 - 会话下的消息不会被删除，但会话不再显示 **返回：** - success: true 表示删除成功 **示例：** DELETE /api/ai/session/550e8400-e29b-41d4-a716-446655440000
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
     * @description 删除会话中指定msgSeq及之后的所有消息，用于重新生成回复。 **路径参数：** - sessionId: 会话的UUID - msgSeq: 起始消息序号 **使用场景：** - 用户对AI回复不满意，想要重新生成 - 删除某条消息及其后续所有消息 **自动处理：** - 更新会话的 messageCount、lastMessageAt、tokenUsage **示例：** DELETE /api/ai/session-message/from-seq/session-uuid/10 （删除序号>=10的所有消息） **返回：** - deletedCount: 删除的消息数量
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
     * @description 根据ID物理删除工具组。 **示例：** DELETE /api/ai/tool-group/550e8400-e29b-41d4-a716-446655440000
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
     * @description 软删除用户记忆（设置状态为禁用）
     *
     * @tags ai, memory
     * @name DeleteApiAiUserMemoryById
     * @summary 删除用户记忆
     * @request DELETE:/api/ai/user-memory/{id}
     * @response `200` `DeleteApiAiUserMemoryByIdData` Response for status 200
     */
    deleteApiAiUserMemoryById: (
      { id, ...query }: DeleteApiAiUserMemoryByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiAiUserMemoryByIdData, any>({
        path: `/api/ai/user-memory/${id}`,
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
     * @description 根据主键ID查询单个Agent消息详情。 **参数说明：** - id: 消息的UUID主键 **返回值：** - 成功：返回消息完整信息（id, sessionId, role, content, contentType, tokenUsage, finishReason等） - 未找到：返回 null **使用场景：** 1. 查看消息详情 2. 获取消息的Token使用情况 3. 验证消息是否存在 **示例：** GET /api/ai/agent-message/550e8400-e29b-41d4-a716-446655440000
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
     * @description 获取指定会话的消息历史，支持分页加载更早的消息。 **路径参数：** - sessionId: 会话UUID **查询参数：** - limit: 返回消息数量，1-200，默认50 - beforeSeq: 获取此序号之前的消息（用于加载更早的历史） **返回值：** - 消息数组，按 msgSeq 升序排列 **使用场景：** 1. 进入会话时加载最近消息 2. 滚动加载更早的历史消息 3. 获取上下文用于AI对话 **示例：** ``` GET /api/ai/agent-message/history/session-uuid?limit=50 GET /api/ai/agent-message/history/session-uuid?limit=50&beforeSeq=100 ```
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
     * @description 获取Agent消息表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成消息编辑表单 2. 数据导入时的格式验证 3. API文档生成
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
     * @description 根据主键ID查询单个Agent会话详情。 **参数说明：** - id: 会话的UUID主键 **返回值：** - 成功：返回会话完整信息（id, agentId, userId, title, messageCount, tokenUsage, lastMessageAt等） - 未找到或已删除：返回 null **使用场景：** 1. 进入会话详情页 2. 获取会话的统计信息（消息数、Token使用量） 3. 验证会话是否存在 **示例：** GET /api/ai/agent-session/550e8400-e29b-41d4-a716-446655440000
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
     * @description 获取Agent会话表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成会话编辑表单 2. 数据导入时的格式验证 3. API文档生成
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
     * @description 根据API密钥ID获取详情，包含关联的MCP服务ID列表。URL参数id为API密钥UUID。返回null表示不存在。
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
     * @description 获取API密钥表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
     * @description 根据主键ID查询单个MCP服务的详细信息。 **路径参数：** - id: MCP服务的UUID **返回：** - 找到时返回完整的MCP服务对象 - 未找到时返回 null **示例：** GET /api/ai/mcp-server/550e8400-e29b-41d4-a716-446655440000
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
     * @description 获取MCP服务的配置JSON，用于集成到AI工具（如Claude Desktop、Cursor等）。 **路径参数：** - id: MCP服务的UUID **返回：** - endpoint: MCP服务端点URL - config: 配置对象，可直接用于AI工具配置 - configJson: 格式化的JSON字符串 **使用方式：** 将返回的 configJson 复制到AI工具的MCP配置文件中。 如果服务不是公开的，需要替换 <YOUR_API_KEY> 为实际的API Key。 **示例响应：** ```json { "endpoint": "http://localhost:3030/mcp/xxx-uuid", "config": { "mcpServers": { "weather-service": { "url": "http://localhost:3030/mcp/xxx-uuid", "headers": { "Authorization": "Bearer <YOUR_API_KEY>" } } } }, "configJson": "..." } ```
     *
     * @tags ai, mcpServer
     * @name GetApiAiMcpServerByIdConfig
     * @summary 获取MCP配置
     * @request GET:/api/ai/mcp-server/{id}/config
     * @response `200` `GetApiAiMcpServerByIdConfigData` Response for status 200
     */
    getApiAiMcpServerByIdConfig: (
      { id, ...query }: GetApiAiMcpServerByIdConfigParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiMcpServerByIdConfigData, any>({
        path: `/api/ai/mcp-server/${id}/config`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取MCP服务表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
     * @description 根据主键ID查询单个AI模型的详细信息。 **路径参数：** - id: 模型的UUID **返回：** - 找到时返回完整的模型对象 - 未找到时返回 null **示例：** GET /api/ai/model/550e8400-e29b-41d4-a716-446655440000
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
     * @description 获取AI模型表的JSON Schema定义，用于动态表单生成或数据验证。 **返回：** JSON Schema 对象，包含所有字段的类型定义 **使用场景：** - 前端动态生成表单 - API文档生成 - 数据验证
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
     * @description 根据主键ID查询单个AI提供商的详细信息。 **路径参数：** - id: 提供商的UUID **返回：** - 找到时返回完整的提供商对象（包含 baseUrl, token 等敏感信息） - 未找到时返回 null **示例：** GET /api/ai/provider/550e8400-e29b-41d4-a716-446655440000
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
     * @description 获取AI提供商表的JSON Schema定义，用于动态表单生成或数据验证。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
     * @description 根据主键ID查询单个AI会话的详细信息。 **路径参数：** - id: 会话的UUID **返回：** - 找到时返回完整的会话对象（包含消息统计、token使用量等） - 未找到或已删除时返回 null **示例：** GET /api/ai/session/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据主键ID查询单条AI会话消息的详细信息。 **路径参数：** - id: 消息的UUID **返回：** - 找到时返回完整的消息对象（包含内容、token使用量等） - 未找到时返回 null **示例：** GET /api/ai/session-message/550e8400-e29b-41d4-a716-446655440000
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
     * @description 获取指定会话的消息历史，支持分页加载更早的消息。 **路径参数：** - sessionId: 会话的UUID **查询参数：** - limit: 返回消息数量，1-200，默认50 - beforeSeq: 获取此序号之前的消息（用于加载更早的历史） **返回：** 消息数组，按序号升序排列 **使用场景：** 1. 初始加载会话消息 2. 滚动加载更早的历史消息 **示例：** ``` GET /api/ai/session-message/history/session-uuid?limit=50 GET /api/ai/session-message/history/session-uuid?limit=20&beforeSeq=100 ```
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
     * @description 获取AI会话消息表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
     * @description 获取AI会话表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
     * @description 根据主键ID查询单个工具组详情。 **参数说明：** - id: 工具组的UUID主键 **返回值：** - 成功：返回工具组完整信息 - 未找到：返回 null **示例：** GET /api/ai/tool-group/550e8400-e29b-41d4-a716-446655440000
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
     * @description 获取工具组表的JSON Schema定义。
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
     * @description 根据ID查询单条用户记忆详情
     *
     * @tags ai, memory
     * @name GetApiAiUserMemoryById
     * @summary 查询用户记忆详情
     * @request GET:/api/ai/user-memory/{id}
     * @response `200` `GetApiAiUserMemoryByIdData` Response for status 200
     */
    getApiAiUserMemoryById: (
      { id, ...query }: GetApiAiUserMemoryByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiAiUserMemoryByIdData, any>({
        path: `/api/ai/user-memory/${id}`,
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
     * @description 创建单条Agent消息记录，自动分配消息序号并更新会话统计。 **必填字段：** - sessionId: 所属会话ID - role: 消息角色，"user" | "assistant" | "system" | "tool" - content: 消息内容 **可选字段：** - contentType: 内容类型，默认 "text" - tokenUsage: Token使用统计 { totalTokens, inputTokens, outputTokens } - finishReason: 完成原因，如 "stop"、"length" - metadata: 元数据 **自动处理：** - msgSeq: 自动分配递增序号 - 更新会话的 messageCount、lastMessageAt、tokenUsage **使用场景：** 1. 用户发送消息 2. AI回复消息 3. 系统消息 **示例：** ```json { "data": { "sessionId": "session-uuid", "role": "user", "content": "你好，请帮我分析这段代码", "contentType": "text" } } ```
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
     * @description 批量创建Agent消息，自动分配递增序号并更新会话统计。 **参数说明：** - sessionId: 目标会话ID - messages: 消息数组（不需要包含 sessionId 和 msgSeq） **自动处理：** - 为每条消息分配递增的 msgSeq - 更新会话的 messageCount、lastMessageAt、tokenUsage **使用场景：** 1. 导入历史对话 2. 一次性添加多轮对话 3. 批量添加系统消息 **示例：** ```json { "sessionId": "session-uuid", "messages": [ { "role": "user", "content": "你好" }, { "role": "assistant", "content": "你好！有什么可以帮助你的？" } ] } ```
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
     * @description 分页查询Agent消息列表。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - sessionId: 按会话ID过滤（获取某会话的所有消息） - sessionIds: 按多个会话ID过滤 - role: 按角色过滤，"user" | "assistant" | "system" | "tool" - roles: 按多个角色过滤 - contentType: 按内容类型过滤 - finishReason: 按完成原因过滤，如 "stop"、"length" - msgSeqStart/msgSeqEnd: 消息序号范围 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: msgSeq | createdAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认50 **使用场景：** 1. 获取会话的消息列表：filter.sessionId = "xxx" 2. 只获取用户消息：filter.role = "user" 3. 按消息序号排序：sort = { field: "msgSeq", order: "asc" } **示例：** ```json { "filter": { "sessionId": "xxx", "roles": ["user", "assistant"] }, "sort": { "field": "msgSeq", "order": "asc" }, "offset": 0, "limit": 50 } ```
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
     * @description 创建单个Agent会话记录。 **必填字段：** - agentId: 关联的Agent ID - userId: 用户ID **可选字段：** - title: 会话标题（可后续根据首条消息自动生成） - status: 状态 - isArchived: 是否归档，默认 false - isPinned: 是否置顶，默认 false - metadata: 元数据（JSON对象） **自动初始化字段：** - messageCount: 0 - tokenUsage: { totalTokens: 0, promptTokens: 0, completionTokens: 0 } **使用场景：** 1. 用户开始新对话时创建会话 2. 从Agent详情页发起对话 **示例：** ```json { "data": { "agentId": "agent-uuid", "userId": "user-uuid", "title": "新对话" } } ```
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
     * @description 分页查询Agent会话列表，用于管理用户与AI Agent的对话会话。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - agentId: 按单个Agent ID过滤 - agentIds: 按多个Agent ID过滤 - userId: 按单个用户ID过滤（查看某用户的所有会话） - userIds: 按多个用户ID过滤 - title: 按会话标题模糊搜索 - status: 按状态过滤 - isArchived: 是否已归档，true/false - isPinned: 是否已置顶，true/false - lastMessageAtStart/lastMessageAtEnd: 最后消息时间范围 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: title | lastMessageAt | createdAt | updatedAt | messageCount - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 获取当前用户的会话列表：filter.userId = "当前用户ID" 2. 获取置顶会话：filter.isPinned = true 3. 按最后消息时间排序：sort = { field: "lastMessageAt", order: "desc" } **示例：** ```json { "filter": { "userId": "xxx", "isArchived": false }, "sort": { "field": "lastMessageAt", "order": "desc" }, "offset": 0, "limit": 20 } ```
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
     * @description 创建新的API密钥用于MCP服务访问。accessAll=true表示可访问所有MCP服务，否则需指定mcpServerIds数组。创建成功后返回完整token（仅此一次显示）。示例：{"data":{"name":"我的密钥","accessAll":false,"mcpServerIds":["server-id-1"]}}
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
     * @description 撤销指定的API密钥，使其立即失效。 **路径参数：** - id: API密钥的UUID **注意事项：** - 撤销后密钥立即失效，无法恢复 - 使用该密钥的所有请求将被拒绝 - 建议在密钥泄露或不再需要时使用 **返回：** - true: 撤销成功 - false: 未找到或撤销失败 **示例：** POST /api/ai/api-key/550e8400-e29b-41d4-a716-446655440000/revoke
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
     * @description 查询API密钥列表，支持分页和过滤。filter可选字段：name(模糊匹配)、isRevoked(是否已撤销)、status。sort支持createdAt/name/lastUsedAt排序。返回包含关联MCP服务ID列表。示例：{"filter":{"isRevoked":false},"limit":20,"offset":0}
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
     * @description 创建单个MCP服务配置。MCP服务用于暴露工具给AI调用。 **必填字段：** - name: 服务名称（唯一标识） - description: 服务描述 **可选字段：** - isPublic: 是否公开访问，默认false（需要API Key） - status: 状态，"0"=正常（默认），"1"=禁用 - remark: 备注 **示例：** ```json { "data": { "name": "weather-service", "description": "天气查询服务", "isPublic": false, "status": "0" } } ```
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
     * @description 分页查询MCP服务列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - name: 按名称模糊搜索 - isPublic: 是否公开访问，true=公开，false=需要API Key - status: 按状态过滤，"0"=正常，"1"=禁用 **排序参数 (sort)：** - field: createdAt | name - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例：** ```json { "filter": { "isPublic": true, "status": "0" }, "sort": { "field": "name", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
     * @description 创建单个AI模型配置。 **必填字段：** - name: 模型显示名称 - modelId: 模型标识（如 gpt-4, claude-3-opus） - providerId: 所属提供商ID **可选字段：** - status: 状态，"0"=正常（默认），"1"=禁用 - supportTools: 是否支持工具调用，默认false - supportThinking: 是否支持思考模式，默认false - maxTokens: 最大token数 - temperature: 温度参数 - remark: 备注 **示例：** ```json { "data": { "name": "GPT-4 Turbo", "modelId": "gpt-4-turbo", "providerId": "provider-uuid", "supportTools": true, "maxTokens": 128000 } } ```
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
     * @description 批量创建多个AI模型配置，适用于初始化或导入场景。 **请求体：** - data: 模型对象数组，每个对象包含 name, modelId, providerId 等字段 **示例：** ```json { "data": [ { "name": "GPT-4", "modelId": "gpt-4", "providerId": "xxx", "supportTools": true }, { "name": "GPT-3.5", "modelId": "gpt-3.5-turbo", "providerId": "xxx", "supportTools": true } ] } ``` **返回：** 创建成功的模型对象数组
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
     * @description 发送测试消息验证AI模型是否正常工作。 **路径参数：** - id: 模型的UUID **请求体：** - message: 测试消息内容，默认为 "Hello, please respond with a brief greeting." **返回：** - success: 是否成功 - response: 模型响应内容 - thinking: 思考过程（如果模型支持） - supportThinking: 是否支持思考模式 - error: 错误信息（失败时） - latencyMs: 响应延迟（毫秒） **示例：** ```json POST /api/ai/model/xxx-uuid/test { "message": "你好，请用中文回复" } ```
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
     * @description 分页查询AI模型列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询，如 ["id1", "id2"] - modelIds: 按模型标识列表查询，如 ["gpt-4", "claude-3"] - providerId: 按单个提供商ID过滤 - providerIds: 按多个提供商ID过滤 - name: 按名称模糊搜索 - modelId: 按模型标识模糊搜索 - status: 按状态过滤，"0"=正常，"1"=禁用 - supportTools: 是否支持工具调用，true/false - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | modelId | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例：** ```json { "filter": { "providerId": "xxx", "supportTools": true }, "sort": { "field": "createdAt", "order": "desc" }, "offset": 0, "limit": 20 } ```
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
     * @description 创建单个AI提供商配置。 **必填字段：** - name: 提供商名称（如 OpenAI, Anthropic, 火山引擎） - baseUrl: API基础URL - token: API密钥/Token **可选字段：** - status: 状态，"0"=正常（默认），"1"=禁用 - remark: 备注 **示例：** ```json { "data": { "name": "OpenAI", "baseUrl": "https://api.openai.com/v1", "token": "sk-xxx", "status": "0" } } ```
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
     * @description 批量创建多个AI提供商配置，适用于初始化场景。 **请求体：** - data: 提供商对象数组 **示例：** ```json { "data": [ { "name": "OpenAI", "baseUrl": "https://api.openai.com/v1", "token": "sk-xxx" }, { "name": "Anthropic", "baseUrl": "https://api.anthropic.com", "token": "sk-ant-xxx" } ] } ``` **返回：** 创建成功的提供商对象数组
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
     * @description 分页查询AI提供商列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - names: 按名称列表精确查询，如 ["OpenAI", "Anthropic"] - name: 按名称模糊搜索 - status: 按状态过滤，"0"=正常，"1"=禁用 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例：** ```json { "filter": { "status": "0" }, "sort": { "field": "name", "order": "asc" }, "offset": 0, "limit": 50 } ```
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
     * @description 创建单个AI会话。 **必填字段：** - userId: 所属用户ID **可选字段：** - title: 会话标题（可后续根据首条消息自动生成） - modelId: 使用的模型ID - agentId: 使用的智能体ID - systemPrompt: 系统提示词 - isPinned: 是否置顶，默认false - isArchived: 是否归档，默认false - status: 状态 **示例：** ```json { "data": { "userId": "user-uuid", "title": "新对话", "modelId": "model-uuid" } } ```
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
     * @description 创建单条AI会话消息，自动分配消息序号并更新会话统计。 **必填字段：** - sessionId: 所属会话ID - role: 消息角色，user=用户消息，assistant=AI回复，system=系统消息 - content: 消息内容 **可选字段：** - contentType: 内容类型，默认text - tokenUsage: token使用量统计 - finishReason: 完成原因（AI回复时） - metadata: 元数据 **自动处理：** - msgSeq: 自动分配递增序号 - 更新会话的 messageCount、lastMessageAt、tokenUsage **示例：** ```json { "data": { "sessionId": "session-uuid", "role": "user", "content": "你好，请介绍一下React" } } ```
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
     * @description 批量创建多条AI会话消息，自动分配递增序号并更新会话统计。 **请求体：** - sessionId: 所属会话ID - messages: 消息对象数组（不需要指定 sessionId 和 msgSeq） **使用场景：** - 导入历史对话 - 一次性添加多轮对话 **示例：** ```json { "sessionId": "session-uuid", "messages": [ { "role": "user", "content": "你好" }, { "role": "assistant", "content": "你好！有什么可以帮助你的吗？" } ] } ``` **返回：** 创建成功的消息对象数组
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
     * @description 分页查询AI会话消息列表。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - sessionId: 按会话ID过滤（最常用） - sessionIds: 按会话ID列表过滤 - role: 按角色过滤，user=用户消息，assistant=AI回复，system=系统消息 - roles: 按角色列表过滤 - contentType: 按内容类型过滤 - finishReason: 按完成原因过滤 - msgSeqStart/msgSeqEnd: 消息序号范围 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: msgSeq | createdAt - order: asc | desc **常用场景：** 1. 获取某会话的所有消息（按序号升序） 2. 获取最近N条消息 **示例：** ```json { "filter": { "sessionId": "session-uuid" }, "sort": { "field": "msgSeq", "order": "asc" }, "offset": 0, "limit": 50 } ```
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
     * @description 分页查询AI会话列表，自动排除已删除的会话。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - userId: 按用户ID过滤（查询某用户的所有会话） - userIds: 按用户ID列表过滤 - title: 按标题模糊搜索 - isArchived: 是否已归档 - isPinned: 是否已置顶 - status: 按状态过滤 - createdAtStart/createdAtEnd: 创建时间范围 - lastMessageAtStart/lastMessageAtEnd: 最后消息时间范围 **排序参数 (sort)：** - field: title | lastMessageAt | createdAt | updatedAt | messageCount - order: asc | desc **常用场景：** 1. 获取当前用户的会话列表（按最后消息时间倒序） 2. 获取置顶的会话 3. 获取归档的会话 **示例：** ```json { "filter": { "userId": "user-uuid", "isArchived": false }, "sort": { "field": "lastMessageAt", "order": "desc" }, "offset": 0, "limit": 20 } ```
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
     * @description 创建单个工具组记录。 **必填字段：** - name: 工具组名称 **可选字段：** - description: 描述 - icon: 图标 - orderNum: 排序号 - status: 状态 **示例：** ```json { "data": { "name": "代码工具", "description": "代码相关的AI工具", "orderNum": 1 } } ```
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
     * @description 批量创建多个工具组记录。 **示例：** ```json { "data": [ { "name": "代码工具", "orderNum": 1 }, { "name": "文档工具", "orderNum": 2 } ] } ```
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
     * @description 分页查询AI工具组列表，工具组用于组织和管理AI可调用的工具。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - names: 按名称列表精确查询 - name: 按名称模糊搜索 - status: 按状态过滤 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | orderNum | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例：** ```json { "filter": { "name": "代码" }, "sort": { "field": "orderNum", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
     * @description 创建一条新的用户记忆，支持自动生成向量嵌入
     *
     * @tags ai, memory
     * @name PostApiAiUserMemory
     * @summary 创建用户记忆
     * @request POST:/api/ai/user-memory
     * @response `200` `PostApiAiUserMemoryData` Response for status 200
     */
    postApiAiUserMemory: (
      data: PostApiAiUserMemoryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiUserMemoryData, any>({
        path: `/api/ai/user-memory`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询用户记忆列表，支持多种过滤条件
     *
     * @tags ai, memory
     * @name PostApiAiUserMemoryQuery
     * @summary 分页查询用户记忆
     * @request POST:/api/ai/user-memory/query
     * @response `200` `PostApiAiUserMemoryQueryData` Response for status 200
     */
    postApiAiUserMemoryQuery: (
      data: PostApiAiUserMemoryQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiUserMemoryQueryData, any>({
        path: `/api/ai/user-memory/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 使用向量相似度搜索用户记忆，支持记忆衰减计算
     *
     * @tags ai, memory
     * @name PostApiAiUserMemorySemanticSearch
     * @summary 语义检索用户记忆
     * @request POST:/api/ai/user-memory/semantic-search
     * @response `200` `PostApiAiUserMemorySemanticSearchData` Response for status 200
     */
    postApiAiUserMemorySemanticSearch: (
      data: PostApiAiUserMemorySemanticSearchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiAiUserMemorySemanticSearchData, any>({
        path: `/api/ai/user-memory/semantic-search`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量更新多个智能体配置。传入ids数组指定要更新的智能体，data对象包含要更新的字段。只能更新自己创建的智能体，管理员可更新所有。示例：{"ids":["id1","id2"],"data":{"status":"1","temperature":0.8}}
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
     * @description 根据ID更新单个Agent会话信息。 **路径参数：** - id: 会话UUID **可更新字段：** - title: 会话标题 - status: 状态 - isArchived: 是否归档 - isPinned: 是否置顶 - metadata: 元数据 **使用场景：** 1. 修改会话标题 2. 更新会话状态 3. 修改元数据 **示例：** ```json // PUT /api/ai/agent-session/550e8400-e29b-41d4-a716-446655440000 { "data": { "title": "关于项目架构的讨论" } } ```
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
     * @description 归档或取消归档指定Agent会话。 **路径参数：** - id: 会话UUID **请求体：** - isArchived: true=归档，false=取消归档 **归档行为：** - 归档后会话不会出现在默认列表中 - 可通过 filter.isArchived = true 查看归档会话 - 归档不会删除会话数据 **使用场景：** 1. 整理会话列表，归档不常用的会话 2. 恢复误归档的会话 **示例：** ```json // PUT /api/ai/agent-session/xxx/archive { "isArchived": true } ```
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
     * @description 置顶或取消置顶Agent会话。 **路径参数：** - id: 会话UUID **请求体：** - isPinned: true=置顶，false=取消置顶 **置顶行为：** - 置顶会话在列表中优先显示 - 可通过 filter.isPinned = true 只查看置顶会话 **使用场景：** 1. 将重要会话置顶方便快速访问 2. 取消不再重要的会话置顶 **示例：** ```json // PUT /api/ai/agent-session/xxx/pin { "isPinned": true } ```
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
     * @description 更新API密钥信息和关联的MCP服务。URL参数id为密钥ID。可更新name、accessAll、mcpServerIds、expiresAt、remark。修改accessAll或mcpServerIds会重建MCP关联。示例：{"data":{"name":"新名称","accessAll":true}}
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
     * @description 根据ID更新单个MCP服务的配置信息。 **路径参数：** - id: MCP服务的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - name: 服务名称 - description: 服务描述 - isPublic: 是否公开访问 - status: 状态，"0"=正常，"1"=禁用 - remark: 备注 **示例：** ```json PUT /api/ai/mcp-server/xxx-uuid { "data": { "isPublic": true, "description": "更新后的描述" } } ```
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
     * @description 根据ID列表批量更新多个AI模型的配置。 **请求体：** - ids: 要更新的模型ID数组 - data: 更新数据对象，包含要修改的字段 **使用场景：** - 批量启用/禁用模型 - 批量修改配置参数 **示例：** ```json { "ids": ["model-id-1", "model-id-2"], "data": { "status": "1" } } ``` **返回：** 更新成功的模型对象数组
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
     * @description 根据ID更新单个AI模型的配置信息。 **路径参数：** - id: 模型的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - name: 模型显示名称 - modelId: 模型标识 - status: 状态，"0"=正常，"1"=禁用 - supportTools: 是否支持工具调用 - supportThinking: 是否支持思考模式 - maxTokens: 最大token数 - temperature: 温度参数 - remark: 备注 **示例：** ```json PUT /api/ai/model/xxx-uuid { "data": { "status": "1", "maxTokens": 64000 } } ```
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
     * @description 根据ID列表批量更新多个AI提供商的配置。 **请求体：** - ids: 要更新的提供商ID数组 - data: 更新数据对象 **使用场景：** - 批量启用/禁用提供商 **示例：** ```json { "ids": ["provider-id-1", "provider-id-2"], "data": { "status": "1" } } ``` **返回：** 更新成功的提供商对象数组
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
     * @description 根据ID更新单个AI提供商的配置信息。 **路径参数：** - id: 提供商的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - name: 提供商名称 - baseUrl: API基础URL - token: API密钥（更新密钥时使用） - status: 状态，"0"=正常，"1"=禁用 - remark: 备注 **示例：** ```json PUT /api/ai/provider/xxx-uuid { "data": { "token": "sk-new-token", "status": "0" } } ```
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
     * @description 更新单个AI会话的信息。 **路径参数：** - id: 会话的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - title: 会话标题 - modelId: 使用的模型ID - agentId: 使用的智能体ID - systemPrompt: 系统提示词 - isPinned: 是否置顶 - isArchived: 是否归档 - status: 状态 **常用场景：** 1. 重命名会话 2. 置顶/取消置顶 3. 归档会话 4. 切换模型 **示例：** ```json PUT /api/ai/session/xxx-uuid { "data": { "title": "关于React的讨论", "isPinned": true } } ```
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
     * @description 根据ID列表批量更新工具组。 **示例：** ```json { "ids": ["id1", "id2"], "data": { "status": "1" } } ```
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
     * @description 根据ID更新单个工具组信息。 **路径参数：** - id: 工具组UUID **示例：** ```json // PUT /api/ai/tool-group/xxx { "data": { "name": "代码工具（更新）", "orderNum": 2 } } ```
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

    /**
     * @description 更新用户记忆内容、重要性等信息
     *
     * @tags ai, memory
     * @name PutApiAiUserMemoryById
     * @summary 更新用户记忆
     * @request PUT:/api/ai/user-memory/{id}
     * @response `200` `PutApiAiUserMemoryByIdData` Response for status 200
     */
    putApiAiUserMemoryById: (
      { id, ...query }: PutApiAiUserMemoryByIdParams,
      data: PutApiAiUserMemoryByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiAiUserMemoryByIdData, any>({
        path: `/api/ai/user-memory/${id}`,
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
 * @description 获取当前登录用户的详细信息、菜单和权限
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
     * @description 获取当前所有在线用户的 ID 列表。 使用场景： - 显示在线用户列表 - 统计在线用户数 - 判断是否需要发送离线通知 返回说明： - users: 在线用户 ID 列表 - count: 在线用户数量
     *
     * @tags ws, users, online
     * @name GetApiWsUsersOnline
     * @summary 获取在线用户
     * @request GET:/api/ws/users/online
     * @response `200` `GetApiWsUsersOnlineData` Response for status 200
     */
    getApiWsUsersOnline: (params: RequestParams = {}) =>
      this.http.request<GetApiWsUsersOnlineData, any>({
        path: `/api/ws/users/online`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 发送消息到群聊会话并通过 WebSocket 实时通知在线成员。 参数说明： - conversationId: 群聊会话 ID（必填） - msgType: 消息类型，01=文本，02=链接，03=图片等（默认 01） - content: 消息内容 - replyToId: 回复的消息 ID（可选） - atUserIds: @的用户 ID 列表（可选） 使用场景： - AI Agent 在群聊中回复 - 群公告推送 - 机器人消息 请求示例： { "conversationId": "550e8400-e29b-41d4-a716-446655440000", "msgType": "01", "content": { "text": "这是一条群聊消息" }, "atUserIds": ["user-uuid-1", "user-uuid-2"] }
     *
     * @tags ws, im, message, group
     * @name PostApiWsMessageGroup
     * @summary 发送群聊消息
     * @request POST:/api/ws/message/group
     * @response `200` `PostApiWsMessageGroupData` Response for status 200
     */
    postApiWsMessageGroup: (
      data: PostApiWsMessageGroupPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiWsMessageGroupData, any>({
        path: `/api/ws/message/group`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 发送私聊消息给指定用户，如果会话不存在会自动创建。 参数说明： - targetUserId: 目标用户 ID（必填） - msgType: 消息类型，01=文本，02=链接，03=图片等（默认 01） - content: 消息内容 - replyToId: 回复的消息 ID（可选） 使用场景： - AI Agent 主动联系用户 - 系统私信通知 - 客服系统集成 请求示例： { "targetUserId": "550e8400-e29b-41d4-a716-446655440000", "msgType": "01", "content": { "text": "你好，这是一条私聊消息" } } 返回说明： - isNewConversation: 是否新创建的会话 - conversationId: 会话 ID（可用于后续发送消息）
     *
     * @tags ws, im, message, private
     * @name PostApiWsMessagePrivate
     * @summary 发送单聊消息
     * @request POST:/api/ws/message/private
     * @response `200` `PostApiWsMessagePrivateData` Response for status 200
     */
    postApiWsMessagePrivate: (
      data: PostApiWsMessagePrivatePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiWsMessagePrivateData, any>({
        path: `/api/ws/message/private`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 发送消息到指定会话并通过 WebSocket 实时通知在线用户。 参数说明： - conversationId: 目标会话 ID（必填） - msgType: 消息类型，01=文本，02=链接，03=图片，04=视频，05=音频，06=文件（默认 01） - content: 消息内容，根据 msgType 不同结构不同 - replyToId: 回复的消息 ID（可选） - atUserIds: @的用户 ID 列表（可选） 使用场景： - AI Agent 自动回复用户消息 - 系统通知推送 - 第三方服务集成 请求示例： { "conversationId": "550e8400-e29b-41d4-a716-446655440000", "msgType": "01", "content": { "text": "你好，这是一条消息" } }
     *
     * @tags ws, im, message
     * @name PostApiWsMessageSend
     * @summary 发送消息到会话
     * @request POST:/api/ws/message/send
     * @response `200` `PostApiWsMessageSendData` Response for status 200
     */
    postApiWsMessageSend: (
      data: PostApiWsMessageSendPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiWsMessageSendData, any>({
        path: `/api/ws/message/send`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 向指定用户发送实时通知（不创建 IM 消息记录）。 参数说明： - userIds: 目标用户 ID 列表（必填） - title: 通知标题（必填） - content: 通知内容（必填） - type: 通知类型，info/success/warning/error（默认 info） - data: 附加数据，可包含链接等信息（可选） 使用场景： - 系统公告推送 - 任务完成通知 - 审批提醒 - AI 处理结果通知 请求示例： { "userIds": ["user-uuid-1", "user-uuid-2"], "title": "系统通知", "content": "您有一条新的审批待处理", "type": "info", "data": { "approvalId": "xxx", "link": "/approvals/xxx" } } 返回说明： - notifiedUsers: 实际收到通知的用户数（在线用户） - onlineUsers: 目标用户中在线的用户数
     *
     * @tags ws, notification, broadcast
     * @name PostApiWsNotificationBroadcast
     * @summary 广播通知
     * @request POST:/api/ws/notification/broadcast
     * @response `200` `PostApiWsNotificationBroadcastData` Response for status 200
     */
    postApiWsNotificationBroadcast: (
      data: PostApiWsNotificationBroadcastPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiWsNotificationBroadcastData, any>({
        path: `/api/ws/notification/broadcast`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 检查指定用户是否在线。 参数说明： - userIds: 要检查的用户 ID 列表（必填） 使用场景： - 显示用户在线状态 - 判断是否发送推送通知 - 选择消息发送方式（在线用 WS，离线用推送） 请求示例： { "userIds": ["user-uuid-1", "user-uuid-2"] } 返回说明： - status: 用户在线状态映射，key 为用户 ID，value 为是否在线
     *
     * @tags ws, users, online, check
     * @name PostApiWsUsersCheckOnline
     * @summary 检查用户在线状态
     * @request POST:/api/ws/users/check-online
     * @response `200` `PostApiWsUsersCheckOnlineData` Response for status 200
     */
    postApiWsUsersCheckOnline: (
      data: PostApiWsUsersCheckOnlinePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiWsUsersCheckOnlineData, any>({
        path: `/api/ws/users/check-online`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

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
     * @description 根据ID物理删除系统配置（永久删除，不可恢复）。 **参数说明：** - id: 配置UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 **返回值：** - true: 删除成功 - false: 配置不存在 **注意事项：** - 系统内置配置（isSystem=true）不建议删除 - 删除前确认没有功能依赖此配置 - 建议先备份配置值 **示例：** DELETE /api/system/config/550e8400-e29b-41d4-a716-446655440000
     *
     * @tags system, config
     * @name DeleteApiSystemConfigById
     * @summary 删除系统配置
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
     * @description 根据ID软删除字典项。 **路径参数：** - id: 字典项的UUID **注意事项：** - 软删除，数据保留但标记为已删除 - 删除后前端下拉框等组件将不再显示该选项 **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/system/dict/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据Key物理删除字典组（永久删除，不可恢复）。 **参数说明：** - key: 字典组键 **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 - 关联的字典项也应一并删除 **返回值：** - true: 删除成功 - false: 字典组不存在 **注意事项：** - 删除前确认没有功能依赖此字典组 - 建议先禁用（status="1"）而非直接删除 **示例：** DELETE /api/system/dict-group/sys_user_sex
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
     * @description 根据ID物理删除定时任务（永久删除，不可恢复）。 **参数说明：** - id: 任务UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 - 任务将停止执行 **返回值：** - true: 删除成功 - false: 任务不存在 **注意事项：** - 删除前建议先暂停任务 - 确认任务不再需要后再删除 - 如需保留配置，建议暂停而非删除 **示例：** DELETE /api/system/job/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据ID物理删除任务执行日志（永久删除，不可恢复）。 **参数说明：** - id: 日志UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 **返回值：** - true: 删除成功 - false: 日志不存在 **注意事项：** - 任务日志通常需要保留用于问题排查 - 建议设置定期清理策略而非手动删除 **示例：** DELETE /api/system/job-log/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据ID物理删除登录日志（永久删除，不可恢复）。 **参数说明：** - id: 登录日志UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 **返回值：** - true: 删除成功 - false: 日志不存在 **注意事项：** - 登录日志通常需要保留用于审计 - 建议设置定期清理策略而非手动删除 - 删除前确认符合安全合规要求 **示例：** DELETE /api/system/login-info/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据ID删除菜单（物理删除）。 **路径参数：** - id: 菜单的UUID **注意事项：** - 删除后无法恢复 - 删除目录前应先删除其下的子菜单 - 删除菜单会影响已分配该菜单的角色 **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/system/menu/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据ID物理删除通知公告（永久删除，不可恢复）。 **参数说明：** - id: 通知公告UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 **返回值：** - true: 删除成功 - false: 通知不存在 **注意事项：** - 删除前建议确认通知已过期或不再需要 - 如需保留历史记录，建议使用 status="1" 关闭而非删除 **示例：** DELETE /api/system/notice/550e8400-e29b-41d4-a716-446655440000
     *
     * @tags system, notice
     * @name DeleteApiSystemNoticeById
     * @summary 删除通知公告
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
     * @description 根据ID物理删除操作日志（永久删除，不可恢复）。 **参数说明：** - id: 操作日志UUID **删除行为：** - 物理删除：数据从数据库中永久移除 - 不可恢复：删除后无法找回 **返回值：** - true: 删除成功 - false: 日志不存在 **注意事项：** - 操作日志通常需要保留用于审计 - 建议设置定期清理策略而非手动删除 - 删除前确认符合安全合规要求 **示例：** DELETE /api/system/operation-log/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据ID删除权限，会递归删除所有子权限。 **路径参数：** - id: 权限UUID，必填 **注意事项：** - 删除操作会递归删除该权限下的所有子权限 - 删除前请确认没有角色关联该权限 - 此操作不可恢复 **返回：** - true: 删除成功 - false: 删除失败（权限不存在） **示例：** DELETE /api/system/permission/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据ID软删除岗位（逻辑删除，数据保留）。 **参数说明：** - id: 岗位UUID **删除行为：** - 软删除：设置 deletedAt、deletedBy、deletedById - 数据保留在数据库中，可恢复 - 查询时自动过滤已删除记录 **返回值：** - true: 删除成功 - false: 岗位不存在或已删除 **注意事项：** - 删除前应检查是否有用户关联此岗位 - 已删除的岗位不会出现在查询结果中 **示例：** DELETE /api/system/post/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据ID软删除角色。 **路径参数：** - id: 角色的UUID **注意事项：** - 管理员角色（key=admin）不允许删除 - 软删除，数据保留但标记为已删除 **返回：** - true: 删除成功 - false: 未找到或删除失败 **示例：** DELETE /api/system/role/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据复合主键删除角色与部门的关联关系。 **路径参数：** - roleId: 角色UUID，必填 - departmentId: 部门UUID，必填 **返回：** - true: 删除成功 - false: 删除失败（关联不存在） **示例：** DELETE /api/system/role-department/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
     * @description 根据复合主键删除角色与菜单的关联关系。 **路径参数：** - roleId: 角色UUID，必填 - menuId: 菜单UUID，必填 **返回：** - true: 删除成功 - false: 删除失败（关联不存在） **示例：** DELETE /api/system/role-menu/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
     * @description 根据复合主键删除用户与岗位的关联关系。 **路径参数：** - userId: 用户UUID，必填 - postId: 岗位UUID，必填 **返回：** - true: 删除成功 - false: 删除失败（关联不存在） **示例：** DELETE /api/system/user-post/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
     * @description 根据复合主键删除用户与角色的关联关系。 **路径参数：** - userId: 用户UUID，必填 - roleId: 角色UUID，必填 **返回：** - true: 删除成功 - false: 删除失败（关联不存在） **示例：** DELETE /api/system/user-role/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
     * @description 根据主键ID查询单个系统配置详情。 **参数说明：** - id: 配置的UUID主键 **返回值：** - 成功：返回配置完整信息（id, name, key, value, isSystem等） - 未找到：返回 null **使用场景：** 1. 查看配置详情 2. 编辑配置前获取当前数据 3. 验证配置是否存在 **示例：** GET /api/system/config/550e8400-e29b-41d4-a716-446655440000
     *
     * @tags system, config
     * @name GetApiSystemConfigById
     * @summary 根据ID查询系统配置
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
     * @description 获取系统配置表的JSON Schema定义，用于动态表单生成或数据验证。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束（长度、格式等） **使用场景：** 1. 前端动态生成配置编辑表单 2. 数据导入时的格式验证 3. API文档生成
     *
     * @tags system, config
     * @name GetApiSystemConfigSchema
     * @summary 获取系统配置Schema
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
     * @description 根据主键ID查询单个字典项的详细信息。 **路径参数：** - id: 字典项的UUID **返回：** - 找到时返回完整的字典对象 - 未找到或已删除时返回 null **示例：** GET /api/system/dict/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据主键Key查询单个字典组详情。 **参数说明：** - key: 字典组的唯一键，如 "sys_user_sex"、"sys_normal_disable" **返回值：** - 成功：返回字典组完整信息（key, name, status, remark等） - 未找到：返回 null **使用场景：** 1. 查看字典组详情 2. 编辑字典组前获取当前数据 3. 验证字典组是否存在 **示例：** GET /api/system/dict-group/sys_user_sex
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
     * @description 获取字典组表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成字典组编辑表单 2. 数据导入时的格式验证 3. API文档生成
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
     * @description 获取字典表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
     * @description 根据主键ID查询单个定时任务详情。 **参数说明：** - id: 定时任务的UUID主键 **返回值：** - 成功：返回任务完整信息（name, group, invokeTarget, cronExpression, misfirePolicy, concurrent, status等） - 未找到：返回 null **使用场景：** 1. 查看任务详情 2. 编辑任务前获取当前配置 3. 验证任务是否存在 **示例：** GET /api/system/job/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据主键ID查询单个任务执行日志详情。 **参数说明：** - id: 任务日志的UUID主键 **返回值：** - 成功：返回日志完整信息（jobName, jobGroup, invokeTarget, jobMessage, status, exceptionInfo, startTime, stopTime等） - 未找到：返回 null **使用场景：** 1. 查看任务执行详情 2. 分析任务执行失败原因（查看 exceptionInfo） 3. 查看任务执行耗时 **示例：** GET /api/system/job-log/550e8400-e29b-41d4-a716-446655440000
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
     * @description 获取任务日志表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成查询表单 2. 数据导出时的格式参考 3. API文档生成
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
     * @description 获取定时任务表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成任务编辑表单 2. 数据导入时的格式验证 3. API文档生成
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
     * @description 根据主键ID查询单个登录日志详情。 **参数说明：** - id: 登录日志的UUID主键 **返回值：** - 成功：返回登录日志完整信息（loginName, ipaddr, loginLocation, browser, os, status, msg, loginTime等） - 未找到：返回 null **使用场景：** 1. 查看登录详情（浏览器、操作系统、地理位置等） 2. 分析登录失败原因 3. 安全审计 **示例：** GET /api/system/login-info/550e8400-e29b-41d4-a716-446655440000
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
     * @description 获取登录日志表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成查询表单 2. 数据导出时的格式参考 3. API文档生成
     *
     * @tags system, loginInfo
     * @name GetApiSystemLoginInfoSchema
     * @summary 获取登录日志Schema
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
     * @description 根据主键ID查询单个菜单的详细信息。 **路径参数：** - id: 菜单的UUID **返回：** - 找到时返回完整的菜单对象 - 未找到时返回 null **示例：** GET /api/system/menu/550e8400-e29b-41d4-a716-446655440000
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
     * @description 获取菜单表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
     * @description 根据主键ID查询单个通知公告详情。 **参数说明：** - id: 通知公告的UUID主键 **返回值：** - 成功：返回通知完整信息（id, title, type, content, status等） - 未找到：返回 null **使用场景：** 1. 查看通知详情页 2. 编辑通知前获取当前数据 3. 验证通知是否存在 **示例：** GET /api/system/notice/550e8400-e29b-41d4-a716-446655440000
     *
     * @tags system, notice
     * @name GetApiSystemNoticeById
     * @summary 根据ID查询通知公告
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
     * @description 获取当前用户的未读通知数量
     *
     * @tags system, noticeRead
     * @name GetApiSystemNoticeReadUnreadCount
     * @summary 获取未读通知数量
     * @request GET:/api/system/notice-read/unread-count
     * @response `200` `GetApiSystemNoticeReadUnreadCountData` Response for status 200
     */
    getApiSystemNoticeReadUnreadCount: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemNoticeReadUnreadCountData, any>({
        path: `/api/system/notice-read/unread-count`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取通知公告表的JSON Schema定义，用于动态表单生成或数据验证。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束（长度、格式等） **使用场景：** 1. 前端动态生成通知编辑表单 2. 数据导入时的格式验证 3. API文档生成
     *
     * @tags system, notice
     * @name GetApiSystemNoticeSchema
     * @summary 获取通知公告Schema
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
     * @description 根据主键ID查询单个操作日志详情。 **参数说明：** - id: 操作日志的UUID主键 **返回值：** - 成功：返回操作日志完整信息（title, method, url, param, result, status, errorMsg, time等） - 未找到：返回 null **使用场景：** 1. 查看操作详情（请求参数、返回结果） 2. 分析操作失败原因 3. 安全审计和问题排查 **示例：** GET /api/system/operation-log/550e8400-e29b-41d4-a716-446655440000
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
     * @description 获取操作日志表的JSON Schema定义。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束 **使用场景：** 1. 前端动态生成查询表单 2. 数据导出时的格式参考 3. API文档生成
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
     * @description 根据权限ID查询单个权限详情。 **路径参数：** - id: 权限UUID，必填 **返回：** - 成功：返回权限对象，包含 id, code, name, type, module, parentId, status, orderNum 等字段 - 未找到：返回 null **示例：** GET /api/system/permission/550e8400-e29b-41d4-a716-446655440000
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
     * @description 获取权限表的JSON Schema定义，用于动态表单生成和数据验证。 **返回：** - JSON Schema格式的权限表结构定义 **示例：** GET /api/system/permission/schema
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
     * @description 获取完整的权限树结构，按排序号升序排列。 **返回：** - 返回所有权限的扁平列表，按 orderNum 升序排列 - 前端可根据 parentId 构建树形结构 **使用场景：** - 权限管理页面展示权限树 - 角色授权时选择权限 - 菜单配置时关联权限 **返回字段：** - id: 权限ID - code: 权限编码 - name: 权限名称 - type: 权限类型 - module: 所属模块 - parentId: 父级ID（null表示顶级） - status: 状态 - orderNum: 排序号 **示例：** GET /api/system/permission/tree
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
     * @description 根据主键ID查询单个岗位详情。 **参数说明：** - id: 岗位的UUID主键 **返回值：** - 成功：返回岗位完整信息（id, code, name, sort, status, remark等） - 未找到：返回 null **使用场景：** 1. 查看岗位详情 2. 编辑岗位前获取当前数据 3. 验证岗位是否存在 **示例：** GET /api/system/post/550e8400-e29b-41d4-a716-446655440000
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
     * @description 获取岗位表的JSON Schema定义，用于动态表单生成或数据验证。 **返回内容：** - 字段名称和类型 - 必填/可选标识 - 字段约束（长度、格式等） **使用场景：** 1. 前端动态生成表单 2. 数据导入时的格式验证 3. API文档生成
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
     * @description 根据主键ID查询单个角色的详细信息。 **路径参数：** - id: 角色的UUID **返回：** - 找到时返回完整的角色对象 - 未找到或已删除时返回 null **示例：** GET /api/system/role/550e8400-e29b-41d4-a716-446655440000
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
     * @description 根据角色ID和部门ID的复合主键查询关联记录。 **路径参数：** - roleId: 角色UUID，必填 - departmentId: 部门UUID，必填 **返回：** - 成功：返回关联对象 { roleId, departmentId } - 未找到：返回 null **示例：** GET /api/system/role-department/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
     * @description 获取角色部门关联表的JSON Schema定义。 **返回：** - JSON Schema格式的表结构定义 **示例：** GET /api/system/role-department/schema
     *
     * @tags system, roleDepartment
     * @name GetApiSystemRoleDepartmentSchema
     * @summary 获取角色部门关联Schema
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
     * @description 根据角色ID和菜单ID的复合主键查询关联记录。 **路径参数：** - roleId: 角色UUID，必填 - menuId: 菜单UUID，必填 **返回：** - 成功：返回关联对象 { roleId, menuId } - 未找到：返回 null **示例：** GET /api/system/role-menu/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
     * @description 获取指定角色的所有菜单ID列表。 **路径参数：** - roleId: 角色UUID，必填 **返回：** - 菜单ID数组，如 ["menu-id-1", "menu-id-2", "menu-id-3"] **使用场景：** - 角色菜单权限配置页面，获取当前角色已分配的菜单 - 用户登录后获取可访问的菜单列表 **示例：** GET /api/system/role-menu/role/550e8400-e29b-41d4-a716-446655440000 **返回示例：** ```json ["menu-id-1", "menu-id-2", "menu-id-3"] ```
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
     * @description 获取角色菜单关联表的JSON Schema定义。 **返回：** - JSON Schema格式的表结构定义 **示例：** GET /api/system/role-menu/schema
     *
     * @tags system, roleMenu
     * @name GetApiSystemRoleMenuSchema
     * @summary 获取角色菜单关联Schema
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
     * @description 获取角色表的JSON Schema定义。 **返回：** JSON Schema 对象 **使用场景：** - 前端动态生成表单 - API文档生成
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
     * @description 根据用户ID和岗位ID的复合主键查询关联记录。 **路径参数：** - userId: 用户UUID，必填 - postId: 岗位UUID，必填 **返回：** - 成功：返回关联对象 { userId, postId } - 未找到：返回 null **示例：** GET /api/system/user-post/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
     * @description 获取用户岗位关联表的JSON Schema定义。 **返回：** - JSON Schema格式的表结构定义 **示例：** GET /api/system/user-post/schema
     *
     * @tags system, userPost
     * @name GetApiSystemUserPostSchema
     * @summary 获取用户岗位关联Schema
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
     * @description 获取指定用户的所有岗位ID列表。 **路径参数：** - userId: 用户UUID，必填 **返回：** - 岗位ID数组，如 ["post-id-1", "post-id-2", "post-id-3"] **使用场景：** - 用户详情页面，显示用户所属岗位 - 用户编辑页面，获取当前用户已分配的岗位 - 权限判断，检查用户是否属于某岗位 **示例：** GET /api/system/user-post/user/550e8400-e29b-41d4-a716-446655440000 **返回示例：** ```json ["post-id-1", "post-id-2", "post-id-3"] ```
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
     * @description 获取当前用户的偏好设置
     *
     * @tags system, user, preferences
     * @name GetApiSystemUserPreferences
     * @summary 获取用户偏好设置
     * @request GET:/api/system/user/preferences
     * @response `200` `GetApiSystemUserPreferencesData` Response for status 200
     */
    getApiSystemUserPreferences: (params: RequestParams = {}) =>
      this.http.request<GetApiSystemUserPreferencesData, any>({
        path: `/api/system/user/preferences`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据用户ID和角色ID的复合主键查询关联记录。 **路径参数：** - userId: 用户UUID，必填 - roleId: 角色UUID，必填 **返回：** - 成功：返回关联对象 { userId, roleId } - 未找到：返回 null **示例：** GET /api/system/user-role/550e8400-e29b-41d4-a716-446655440001/550e8400-e29b-41d4-a716-446655440002
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
     * @description 获取用户角色关联表的JSON Schema定义。 **返回：** - JSON Schema格式的表结构定义 **示例：** GET /api/system/user-role/schema
     *
     * @tags system, userRole
     * @name GetApiSystemUserRoleSchema
     * @summary 获取用户角色关联Schema
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
     * @description 获取指定用户的所有角色ID列表。 **路径参数：** - userId: 用户UUID，必填 **返回：** - 角色ID数组，如 ["role-id-1", "role-id-2", "role-id-3"] **使用场景：** - 用户详情页面，显示用户所属角色 - 用户编辑页面，获取当前用户已分配的角色 - 权限判断，检查用户是否拥有某角色 - 用户登录后获取角色列表 **示例：** GET /api/system/user-role/user/550e8400-e29b-41d4-a716-446655440000 **返回示例：** ```json ["role-id-1", "role-id-2", "role-id-3"] ```
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
     * @description 创建单个系统配置记录。 **必填字段：** - name: 配置名称，如 "系统名称"、"邮件服务器" - key: 配置键，唯一标识，如 "sys.name"、"mail.host" - value: 配置值 **可选字段：** - isSystem: 是否系统内置，默认 false - remark: 备注说明 **配置键命名规范：** - 使用点号分隔层级：module.submodule.key - 系统配置：sys.* - 邮件配置：mail.* - 存储配置：storage.* **使用场景：** 1. 添加新的系统参数 2. 配置第三方服务连接信息 3. 自定义业务参数 **示例：** ```json { "data": { "name": "邮件服务器地址", "key": "mail.host", "value": "smtp.example.com", "isSystem": false, "remark": "SMTP服务器地址" } } ```
     *
     * @tags system, config
     * @name PostApiSystemConfig
     * @summary 创建系统配置
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
     * @description 批量创建多个系统配置记录。 **参数说明：** - data: 配置数组，每个元素包含 name、key、value 等字段 **使用场景：** 1. 系统初始化时批量创建默认配置 2. 导入配置模板 3. 批量添加某个模块的配置项 **示例：** ```json { "data": [ { "name": "系统名称", "key": "sys.name", "value": "AI管理系统", "isSystem": true }, { "name": "系统Logo", "key": "sys.logo", "value": "/logo.png", "isSystem": true }, { "name": "版权信息", "key": "sys.copyright", "value": "© 2024", "isSystem": true } ] } ```
     *
     * @tags system, config
     * @name PostApiSystemConfigBatch
     * @summary 批量创建系统配置
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
     * @description 分页查询系统配置列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - names: 按配置名称列表精确查询 - keys: 按配置键列表精确查询，如 ["sys.name", "sys.logo"] - isSystem: 是否系统内置配置，true=内置，false=自定义 - name: 按配置名称模糊搜索 - key: 按配置键模糊搜索，如 "sys" 匹配所有 sys.* 配置 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | key | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 获取所有系统内置配置：filter.isSystem = true 2. 搜索包含"邮件"的配置：filter.name = "邮件" 3. 获取所有 sys.* 开头的配置：filter.key = "sys" **示例：** ```json { "filter": { "isSystem": false, "key": "mail" }, "sort": { "field": "key", "order": "asc" }, "offset": 0, "limit": 20 } ```
     *
     * @tags system, config
     * @name PostApiSystemConfigQuery
     * @summary 分页查询系统配置
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
     * @description 创建单个字典项。 **必填字段：** - group: 字典分组（如 sys_user_status） - label: 显示标签 - value: 字典值 **可选字段：** - status: 状态，"0"=正常（默认），"1"=禁用 - isDefault: 是否默认值，默认false - sort: 排序号，默认0 - remark: 备注 **示例：** ```json { "data": { "group": "sys_user_status", "label": "正常", "value": "0", "isDefault": true, "sort": 1 } } ```
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
     * @description 批量创建多个字典项，适用于初始化场景。 **请求体：** - data: 字典对象数组 **示例：** ```json { "data": [ { "group": "sys_user_status", "label": "正常", "value": "0", "sort": 1 }, { "group": "sys_user_status", "label": "禁用", "value": "1", "sort": 2 } ] } ``` **返回：** 创建成功的字典对象数组
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
     * @description 创建单个字典组记录。 **必填字段：** - key: 字典组键，唯一标识，如 "sys_user_sex" - name: 字典组名称，如 "用户性别" **可选字段：** - status: 状态，"0"=正常（默认），"1"=禁用 - remark: 备注说明 **键命名规范：** - 使用下划线分隔：module_entity_field - 系统字典：sys_* - 业务字典：biz_* **使用场景：** 1. 添加新的字典分类 2. 系统初始化时创建默认字典组 **示例：** ```json { "data": { "key": "sys_user_sex", "name": "用户性别", "status": "0", "remark": "用户性别选项" } } ```
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
     * @description 批量创建多个字典组记录。 **参数说明：** - data: 字典组数组，每个元素包含 key、name 等字段 **使用场景：** 1. 系统初始化时批量创建默认字典组 2. 导入字典配置 **示例：** ```json { "data": [ { "key": "sys_user_sex", "name": "用户性别" }, { "key": "sys_normal_disable", "name": "状态" }, { "key": "sys_yes_no", "name": "是否" } ] } ```
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
     * @description 分页查询字典组列表，字典组用于管理一组相关的字典项。 **过滤参数 (filter)：** - keys: 按字典组键列表精确查询，如 ["sys_user_sex", "sys_normal_disable"] - names: 按字典组名称列表精确查询 - status: 按状态过滤，"0"=正常，"1"=禁用 - key: 按字典组键模糊搜索，如 "sys" 匹配所有系统字典 - name: 按字典组名称模糊搜索 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: key | name | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 获取所有正常状态的字典组：filter.status = "0" 2. 搜索系统相关字典：filter.key = "sys" 3. 按键名排序：sort = { field: "key", order: "asc" } **示例：** ```json { "filter": { "status": "0", "key": "sys" }, "sort": { "field": "key", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
     * @description 分页查询字典列表，自动排除已删除数据。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - groups: 按分组列表精确查询，如 ["sys_user_status", "sys_normal_disable"] - labels: 按标签列表精确查询 - status: 按状态过滤，"0"=正常，"1"=禁用 - isDefault: 是否默认值 - group: 按分组模糊搜索 - label: 按标签模糊搜索 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: group | label | sort | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例 - 查询某分组的所有字典项：** ```json { "filter": { "groups": ["sys_user_status"] }, "sort": { "field": "sort", "order": "asc" } } ```
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
     * @description 创建单个定时任务记录。 **必填字段：** - name: 任务名称，如 "清理临时文件" - group: 任务分组，如 "DEFAULT"、"SYSTEM" - invokeTarget: 调用目标（类名.方法名） - cronExpression: Cron表达式，如 "0 0 2 * * ?" 表示每天凌晨2点 **可选字段：** - misfirePolicy: 错过执行策略（0=默认，1=立即执行，2=执行一次，3=放弃执行） - concurrent: 是否允许并发执行，默认 false - status: 状态，"0"=正常（默认），"1"=暂停 - remark: 备注说明 **Cron表达式示例：** - "0 0 2 * * ?": 每天凌晨2点 - "0 0/30 * * * ?": 每30分钟 - "0 0 10,14,16 * * ?": 每天10点、14点、16点 **示例：** ```json { "data": { "name": "清理临时文件", "group": "SYSTEM", "invokeTarget": "cleanTask.execute", "cronExpression": "0 0 2 * * ?", "misfirePolicy": "1", "concurrent": false, "status": "0" } } ```
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
     * @description 批量创建多个定时任务记录。 **参数说明：** - data: 任务数组，每个元素包含 name、group、invokeTarget、cronExpression 等字段 **使用场景：** 1. 系统初始化时批量创建默认任务 2. 导入任务配置 3. 批量添加某类任务 **示例：** ```json { "data": [ { "name": "清理日志", "group": "SYSTEM", "invokeTarget": "logTask.clean", "cronExpression": "0 0 3 * * ?" }, { "name": "数据备份", "group": "SYSTEM", "invokeTarget": "backupTask.run", "cronExpression": "0 0 4 * * ?" } ] } ```
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
     * @description 创建单个任务执行日志记录（通常由任务调度器自动调用）。 **必填字段：** - jobName: 任务名称 - jobGroup: 任务分组 - invokeTarget: 调用目标 **可选字段：** - jobMessage: 执行消息 - status: 执行状态，"0"=成功，"1"=失败 - exceptionInfo: 异常信息（失败时记录） - startTime: 开始时间 - stopTime: 结束时间 **使用场景：** 1. 任务执行开始时创建日志 2. 任务执行完成后更新状态 3. 手动记录任务执行情况 **示例：** ```json { "data": { "jobName": "清理临时文件", "jobGroup": "SYSTEM", "invokeTarget": "cleanTask.execute", "status": "0", "jobMessage": "清理完成，删除100个文件", "startTime": "2024-01-01T02:00:00Z", "stopTime": "2024-01-01T02:00:30Z" } } ```
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
     * @description 批量创建多个任务执行日志记录。 **参数说明：** - data: 日志数组，每个元素包含 jobName、jobGroup、invokeTarget 等字段 **使用场景：** 1. 批量导入历史执行记录 2. 批量任务执行后统一记录 **示例：** ```json { "data": [ { "jobName": "任务A", "jobGroup": "DEFAULT", "invokeTarget": "taskA.run", "status": "0" }, { "jobName": "任务B", "jobGroup": "DEFAULT", "invokeTarget": "taskB.run", "status": "0" } ] } ```
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
     * @description 分页查询定时任务执行日志，用于监控任务执行情况。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - jobNames: 按任务名称列表精确查询 - jobGroups: 按任务分组列表精确查询 - status: 按状态过滤，"0"=成功，"1"=失败 - jobName: 按任务名称模糊搜索 - jobGroup: 按任务分组模糊搜索 - startTimeStart/startTimeEnd: 执行开始时间范围 - createdAtStart/createdAtEnd: 记录创建时间范围 **排序参数 (sort)：** - field: jobName | jobGroup | startTime | stopTime | createdAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 查看某任务的执行历史：filter.jobName = "清理日志" 2. 查看执行失败的任务：filter.status = "1" 3. 查看今日执行记录：设置 startTimeStart/startTimeEnd **示例：** ```json { "filter": { "status": "1", "jobGroup": "SYSTEM" }, "sort": { "field": "startTime", "order": "desc" }, "offset": 0, "limit": 50 } ```
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
     * @description 分页查询定时任务列表，用于管理系统定时任务。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - names: 按任务名称列表精确查询 - groups: 按任务分组列表精确查询，如 ["DEFAULT", "SYSTEM"] - status: 按状态过滤，"0"=正常，"1"=暂停 - concurrent: 是否允许并发，true/false - name: 按任务名称模糊搜索 - group: 按任务分组模糊搜索 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | group | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 获取所有正常运行的任务：filter.status = "0" 2. 获取某分组的任务：filter.group = "SYSTEM" 3. 搜索任务名称：filter.name = "清理" **示例：** ```json { "filter": { "status": "0", "group": "DEFAULT" }, "sort": { "field": "name", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
     * @description 创建单个登录日志记录（通常由系统自动调用）。 **必填字段：** - loginName: 登录账号 - ipaddr: 登录IP地址 - status: 登录状态，"0"=成功，"1"=失败 **可选字段：** - loginLocation: 登录地点（根据IP解析） - browser: 浏览器类型 - os: 操作系统 - msg: 提示消息（失败时记录原因） - loginTime: 登录时间 **使用场景：** 1. 用户登录成功后记录 2. 用户登录失败后记录（含失败原因） 3. 安全审计日志 **示例：** ```json { "data": { "loginName": "admin", "ipaddr": "192.168.1.100", "loginLocation": "内网IP", "browser": "Chrome 120", "os": "Windows 10", "status": "0", "msg": "登录成功", "loginTime": "2024-01-01T10:00:00Z" } } ```
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
     * @description 分页查询登录日志列表，用于审计和安全监控。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - loginNames: 按登录账号列表精确查询 - status: 按状态过滤，"0"=成功，"1"=失败 - loginName: 按登录账号模糊搜索 - ipaddr: 按IP地址模糊搜索，如 "192.168" 匹配内网IP - loginTimeStart/loginTimeEnd: 登录时间范围 - createdAtStart/createdAtEnd: 记录创建时间范围 **排序参数 (sort)：** - field: loginName | ipaddr | loginTime | createdAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 查看某用户的登录历史：filter.loginName = "admin" 2. 查看登录失败记录：filter.status = "1" 3. 查看某IP的登录记录：filter.ipaddr = "192.168.1" 4. 查看今日登录记录：设置 loginTimeStart/loginTimeEnd **示例：** ```json { "filter": { "status": "1", "loginName": "admin" }, "sort": { "field": "loginTime", "order": "desc" }, "offset": 0, "limit": 50 } ```
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
     * @description 创建单个菜单项。 **必填字段：** - name: 菜单名称 - type: 菜单类型，M=目录，C=菜单，F=按钮 **可选字段：** - parentId: 父级菜单ID，null表示顶级 - path: 路由路径（菜单类型需要） - component: 组件路径 - permission: 权限标识（按钮类型需要） - icon: 图标 - orderNum: 排序号，默认0 - visible: 是否可见，默认true - status: 状态，"0"=正常，"1"=禁用 **示例 - 创建目录：** ```json { "data": { "name": "系统管理", "type": "M", "icon": "setting", "orderNum": 1 } } ``` **示例 - 创建菜单：** ```json { "data": { "name": "用户管理", "type": "C", "parentId": "parent-uuid", "path": "/system/users", "component": "system/users/index" } } ```
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
     * @description 批量创建多个菜单项，适用于初始化场景。 **请求体：** - data: 菜单对象数组 **示例：** ```json { "data": [ { "name": "系统管理", "type": "M", "orderNum": 1 }, { "name": "用户管理", "type": "C", "parentId": "xxx", "path": "/system/users" } ] } ``` **返回：** 创建成功的菜单对象数组
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
     * @description 分页查询菜单列表，支持树形结构查询。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - names: 按名称列表精确查询 - types: 按类型列表查询，M=目录，C=菜单，F=按钮 - parentId: 按父级ID过滤，null表示查询顶级菜单 - type: 按单个类型过滤 - visible: 是否可见 - name: 按名称模糊搜索 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | orderNum | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例 - 查询顶级目录：** ```json { "filter": { "parentId": null, "type": "M" }, "sort": { "field": "orderNum", "order": "asc" } } ``` **示例 - 查询某目录下的菜单：** ```json { "filter": { "parentId": "parent-uuid", "types": ["C", "F"] } } ```
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
     * @description 创建单个通知公告记录。 **必填字段：** - title: 通知标题 - type: 通知类型，"1"=通知，"2"=公告 - content: 通知内容（支持富文本HTML） **可选字段：** - status: 状态，"0"=正常（默认），"1"=关闭 - remark: 备注说明 **审计字段（自动填充）：** - createdBy/updatedBy: 创建人/更新人姓名 - createdAt/updatedAt: 创建/更新时间 **使用场景：** 1. 发布系统通知 2. 发布公司公告 3. 发布维护通知 **示例：** ```json { "data": { "title": "系统维护通知", "type": "1", "content": "<p>系统将于今晚22:00-24:00进行维护升级</p>", "status": "0" } } ```
     *
     * @tags system, notice
     * @name PostApiSystemNotice
     * @summary 创建通知公告
     * @request POST:/api/system/notice
     * @response `200` `PostApiSystemNoticeData` Response for status 200
     */
    postApiSystemNotice: (params: RequestParams = {}) =>
      this.http.request<PostApiSystemNoticeData, any>({
        path: `/api/system/notice`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 批量创建多个通知公告记录。 **参数说明：** - data: 通知数组，每个元素包含 title、type、content 等字段 **使用场景：** 1. 批量导入历史通知 2. 系统初始化时创建默认通知 3. 批量发布多条公告 **示例：** ```json { "data": [ { "title": "欢迎使用", "type": "1", "content": "欢迎使用本系统" }, { "title": "使用须知", "type": "2", "content": "请遵守使用规范" } ] } ```
     *
     * @tags system, notice
     * @name PostApiSystemNoticeBatch
     * @summary 批量创建通知公告
     * @request POST:/api/system/notice/batch
     * @response `200` `PostApiSystemNoticeBatchData` Response for status 200
     */
    postApiSystemNoticeBatch: (params: RequestParams = {}) =>
      this.http.request<PostApiSystemNoticeBatchData, any>({
        path: `/api/system/notice/batch`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 将草稿状态的通知发布，发布后用户可见
     *
     * @tags system, notice
     * @name PostApiSystemNoticeByIdPublish
     * @summary 发布通知
     * @request POST:/api/system/notice/{id}/publish
     * @response `200` `PostApiSystemNoticeByIdPublishData` Response for status 200
     */
    postApiSystemNoticeByIdPublish: (
      { id, ...query }: PostApiSystemNoticeByIdPublishParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemNoticeByIdPublishData, any>({
        path: `/api/system/notice/${id}/publish`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 撤回已发布的通知，撤回后用户不可见
     *
     * @tags system, notice
     * @name PostApiSystemNoticeByIdWithdraw
     * @summary 撤回通知
     * @request POST:/api/system/notice/{id}/withdraw
     * @response `200` `PostApiSystemNoticeByIdWithdrawData` Response for status 200
     */
    postApiSystemNoticeByIdWithdraw: (
      { id, ...query }: PostApiSystemNoticeByIdWithdrawParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemNoticeByIdWithdrawData, any>({
        path: `/api/system/notice/${id}/withdraw`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取当前用户可见的通知列表，支持按已读状态过滤。 **过滤参数 (filter)：** - type: 按类型过滤，"1"=通知，"2"=公告 - isRead: 按已读状态过滤，true=已读，false=未读 **排序参数 (sort)：** - field: publishedAt | createdAt - order: asc | desc **返回数据：** - 包含 isRead 和 readAt 字段表示已读状态
     *
     * @tags system, notice
     * @name PostApiSystemNoticeMy
     * @summary 获取我的通知
     * @request POST:/api/system/notice/my
     * @response `200` `PostApiSystemNoticeMyData` Response for status 200
     */
    postApiSystemNoticeMy: (
      data: PostApiSystemNoticeMyPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemNoticeMyData, any>({
        path: `/api/system/notice/my`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询通知公告列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - titles: 按标题列表精确查询 - types: 按类型列表精确查询，如 ["1", "2"] - type: 按类型精确匹配，"1"=通知，"2"=公告 - status: 按状态过滤，"0"=正常，"1"=关闭 - title: 按标题模糊搜索 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: title | type | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 获取所有公告：filter.type = "2" 2. 搜索标题包含"系统"的通知：filter.title = "系统" 3. 获取最近一周的通知：设置 createdAtStart **示例：** ```json { "filter": { "type": "1", "status": "0" }, "sort": { "field": "createdAt", "order": "desc" }, "offset": 0, "limit": 10 } ```
     *
     * @tags system, notice
     * @name PostApiSystemNoticeQuery
     * @summary 分页查询通知公告
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
     * @description 将指定通知标记为当前用户已读
     *
     * @tags system, noticeRead
     * @name PostApiSystemNoticeReadMark
     * @summary 标记通知为已读
     * @request POST:/api/system/notice-read/mark
     * @response `200` `PostApiSystemNoticeReadMarkData` Response for status 200
     */
    postApiSystemNoticeReadMark: (
      data: PostApiSystemNoticeReadMarkPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemNoticeReadMarkData, any>({
        path: `/api/system/notice-read/mark`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 将多个通知标记为当前用户已读
     *
     * @tags system, noticeRead
     * @name PostApiSystemNoticeReadMarkMany
     * @summary 批量标记通知为已读
     * @request POST:/api/system/notice-read/mark-many
     * @response `200` `PostApiSystemNoticeReadMarkManyData` Response for status 200
     */
    postApiSystemNoticeReadMarkMany: (
      data: PostApiSystemNoticeReadMarkManyPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiSystemNoticeReadMarkManyData, any>({
        path: `/api/system/notice-read/mark-many`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建单个操作日志记录（通常由系统自动调用）。 **必填字段：** - title: 操作模块，如 "用户管理"、"角色管理" - name: 操作人员姓名 - method: 请求方法，如 "POST"、"PUT"、"DELETE" - url: 请求URL **可选字段：** - businessType: 业务类型（0=其它，1=新增，2=修改，3=删除） - param: 请求参数（JSON字符串） - result: 返回结果（JSON字符串） - status: 操作状态，"0"=成功，"1"=失败 - errorMsg: 错误消息 - time: 操作时间 - costTime: 耗时（毫秒） **使用场景：** 1. API请求拦截器自动记录 2. 关键业务操作手动记录 3. 安全审计日志 **示例：** ```json { "data": { "title": "用户管理", "name": "admin", "method": "POST", "url": "/api/system/user", "businessType": 1, "param": "{\"name\":\"张三\"}", "status": "0", "costTime": 150 } } ```
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
     * @description 分页查询操作日志列表，用于审计用户操作行为。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - titles: 按操作模块列表精确查询，如 ["用户管理", "角色管理"] - names: 按操作人员列表精确查询 - status: 按状态过滤，"0"=成功，"1"=失败 - title: 按操作模块模糊搜索，如 "用户" 匹配用户相关操作 - name: 按操作人员模糊搜索 - timeStart/timeEnd: 操作时间范围 **排序参数 (sort)：** - field: title | name | time - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 查看某用户的操作历史：filter.name = "admin" 2. 查看某模块的操作记录：filter.title = "用户管理" 3. 查看操作失败记录：filter.status = "1" 4. 查看今日操作记录：设置 timeStart/timeEnd **示例：** ```json { "filter": { "title": "用户", "status": "0" }, "sort": { "field": "time", "order": "desc" }, "offset": 0, "limit": 50 } ```
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
     * @description 创建单个权限记录。 **请求体参数 (data)：** - code: 权限编码，必填，如 "system:user:view" - name: 权限名称，必填，如 "查看用户" - type: 权限类型，必填，可选值：menu(菜单), button(按钮), api(接口) - module: 所属模块，必填，如 "system", "ai", "im" - parentId: 父级权限ID，可选，null表示顶级权限 - status: 状态，可选，默认true(启用) - orderNum: 排序号，可选，默认0 - remark: 备注，可选 **示例：** ```json { "data": { "code": "system:user:view", "name": "查看用户", "type": "menu", "module": "system", "parentId": null, "status": true, "orderNum": 1 } } ```
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
     * @description 分页查询权限列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询，如 ["id1", "id2"] - codes: 按权限编码列表查询，如 ["system:user:view", "system:user:edit"] - types: 按类型列表查询，如 ["menu", "button", "api"] - modules: 按模块列表查询，如 ["system", "ai", "im"] - parentId: 按父级ID查询，null表示查询顶级权限 - status: 按状态过滤，true=启用，false=禁用 - code: 按权限编码模糊搜索 - name: 按权限名称模糊搜索 **排序参数 (sort)：** - field: code | name | orderNum | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-1000，默认100 **示例：** ```json { "filter": { "modules": ["system"], "status": true }, "sort": { "field": "orderNum", "order": "asc" }, "offset": 0, "limit": 100 } ```
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
     * @description 创建单个岗位记录。 **必填字段：** - code: 岗位编码，唯一标识，如 "CEO"、"CTO"、"PM" - name: 岗位名称，如 "首席执行官"、"技术总监" **可选字段：** - sort: 排序号，数字越小越靠前，默认0 - status: 状态，"0"=正常（默认），"1"=禁用 - remark: 备注说明 **审计字段（自动填充）：** - createdBy/updatedBy: 创建人/更新人姓名 - createdAt/updatedAt: 创建/更新时间 **使用场景：** 1. 新增组织架构中的岗位 2. 初始化系统岗位数据 **示例：** ```json { "data": { "code": "PM", "name": "项目经理", "sort": 10, "status": "0", "remark": "负责项目管理" } } ```
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
     * @description 批量创建多个岗位记录，适用于初始化或批量导入场景。 **参数说明：** - data: 岗位数组，每个元素包含 code、name 等字段 **使用场景：** 1. 系统初始化时批量创建岗位 2. 从Excel导入岗位数据 3. 复制其他系统的岗位配置 **示例：** ```json { "data": [ { "code": "CEO", "name": "首席执行官", "sort": 1 }, { "code": "CTO", "name": "技术总监", "sort": 2 }, { "code": "CFO", "name": "财务总监", "sort": 3 } ] } ```
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
     * @description 分页查询岗位列表，支持多种过滤和排序方式。 **过滤参数 (filter)：** - ids: 按ID列表精确查询，如 ["id1", "id2"] - codes: 按岗位编码列表精确查询，如 ["CEO", "CTO", "PM"] - names: 按岗位名称列表精确查询 - status: 按状态过滤，"0"=正常，"1"=禁用 - code: 按岗位编码模糊搜索，如 "C" 匹配 CEO、CTO - name: 按岗位名称模糊搜索 **排序参数 (sort)：** - field: code | name | sort | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** 1. 获取所有正常状态的岗位：filter.status = "0" 2. 搜索包含"经理"的岗位：filter.name = "经理" 3. 按排序号升序排列：sort = { field: "sort", order: "asc" } **示例：** ```json { "filter": { "status": "0", "name": "经理" }, "sort": { "field": "sort", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
     * @description 创建单个角色。 **必填字段：** - name: 角色名称 - key: 角色标识（唯一，如 admin, user, editor） **可选字段：** - status: 状态，"0"=正常（默认），"1"=禁用 - sort: 排序号，默认0 - remark: 备注 **示例：** ```json { "data": { "name": "编辑员", "key": "editor", "status": "0", "sort": 10 } } ```
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
     * @description 批量创建多个角色，适用于初始化场景。 **请求体：** - data: 角色对象数组 **示例：** ```json { "data": [ { "name": "管理员", "key": "admin" }, { "name": "普通用户", "key": "user" } ] } ``` **返回：** 创建成功的角色对象数组
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
     * @description 创建单个角色与部门的关联关系。 **请求体参数 (data)：** - roleId: 角色UUID，必填 - departmentId: 部门UUID，必填 **使用场景：** - 为角色配置数据权限范围 - 角色可访问指定部门的数据 **示例：** ```json { "data": { "roleId": "550e8400-e29b-41d4-a716-446655440001", "departmentId": "550e8400-e29b-41d4-a716-446655440002" } } ```
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
     * @description 批量创建多个角色与部门的关联关系。 **请求体参数 (data)：** - 数组，每个元素包含： - roleId: 角色UUID，必填 - departmentId: 部门UUID，必填 **使用场景：** - 为角色一次性配置多个部门的数据权限 - 批量导入角色部门关联 **示例：** ```json { "data": [ { "roleId": "role-1", "departmentId": "dept-1" }, { "roleId": "role-1", "departmentId": "dept-2" }, { "roleId": "role-1", "departmentId": "dept-3" } ] } ```
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
     * @description 分页查询角色与部门的关联关系，用于数据权限控制。 **过滤参数 (filter)：** - roleIds: 按角色ID列表查询，如 ["role-id-1", "role-id-2"] - departmentIds: 按部门ID列表查询，如 ["dept-id-1", "dept-id-2"] - roleId: 按单个角色ID精确查询 - departmentId: 按单个部门ID精确查询 **排序参数 (sort)：** - field: roleId | departmentId - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** - 查询某角色关联的所有部门 - 查询某部门关联的所有角色 - 数据权限范围配置 **示例：** ```json { "filter": { "roleId": "550e8400-e29b-41d4-a716-446655440000" }, "sort": { "field": "departmentId", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
     * @description 创建单个角色与菜单的关联关系。 **请求体参数 (data)：** - roleId: 角色UUID，必填 - menuId: 菜单UUID，必填 **使用场景：** - 为角色分配单个菜单权限 - 动态添加菜单访问权限 **示例：** ```json { "data": { "roleId": "550e8400-e29b-41d4-a716-446655440001", "menuId": "550e8400-e29b-41d4-a716-446655440002" } } ```
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
     * @description 批量创建多个角色与菜单的关联关系。 **请求体参数 (data)：** - 数组，每个元素包含： - roleId: 角色UUID，必填 - menuId: 菜单UUID，必填 **使用场景：** - 为角色一次性分配多个菜单权限 - 批量导入角色菜单关联 **示例：** ```json { "data": [ { "roleId": "role-1", "menuId": "menu-1" }, { "roleId": "role-1", "menuId": "menu-2" }, { "roleId": "role-1", "menuId": "menu-3" } ] } ```
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
     * @description 分页查询角色与菜单的关联关系，用于菜单权限控制。 **过滤参数 (filter)：** - roleIds: 按角色ID列表查询，如 ["role-id-1", "role-id-2"] - menuIds: 按菜单ID列表查询，如 ["menu-id-1", "menu-id-2"] - roleId: 按单个角色ID精确查询 - menuId: 按单个菜单ID精确查询 **排序参数 (sort)：** - field: roleId | menuId - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** - 查询某角色关联的所有菜单 - 查询某菜单关联的所有角色 - 菜单权限配置 **示例：** ```json { "filter": { "roleId": "550e8400-e29b-41d4-a716-446655440000" }, "sort": { "field": "menuId", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
     * @description 分页查询角色列表，自动排除已删除数据。 **过滤参数 (filter)：** - ids: 按ID列表精确查询 - names: 按名称列表精确查询 - keys: 按角色标识列表精确查询，如 ["admin", "user"] - status: 按状态过滤，"0"=正常，"1"=禁用 - name: 按名称模糊搜索 - key: 按角色标识模糊搜索 - createdAtStart/createdAtEnd: 创建时间范围 **排序参数 (sort)：** - field: name | key | sort | createdAt | updatedAt - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **示例：** ```json { "filter": { "status": "0" }, "sort": { "field": "sort", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
     * @description 创建单个用户与岗位的关联关系。 **请求体参数 (data)：** - userId: 用户UUID，必填 - postId: 岗位UUID，必填 **使用场景：** - 为用户分配单个岗位 - 用户入职时配置岗位 **示例：** ```json { "data": { "userId": "550e8400-e29b-41d4-a716-446655440001", "postId": "550e8400-e29b-41d4-a716-446655440002" } } ```
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
     * @description 批量创建多个用户与岗位的关联关系。 **请求体参数 (data)：** - 数组，每个元素包含： - userId: 用户UUID，必填 - postId: 岗位UUID，必填 **使用场景：** - 为用户一次性分配多个岗位 - 批量导入用户岗位关联 **示例：** ```json { "data": [ { "userId": "user-1", "postId": "post-1" }, { "userId": "user-1", "postId": "post-2" }, { "userId": "user-2", "postId": "post-1" } ] } ```
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
     * @description 分页查询用户与岗位的关联关系。 **过滤参数 (filter)：** - userIds: 按用户ID列表查询，如 ["user-id-1", "user-id-2"] - postIds: 按岗位ID列表查询，如 ["post-id-1", "post-id-2"] - userId: 按单个用户ID精确查询 - postId: 按单个岗位ID精确查询 **排序参数 (sort)：** - field: userId | postId - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** - 查询某用户关联的所有岗位 - 查询某岗位关联的所有用户 - 用户岗位配置管理 **示例：** ```json { "filter": { "userId": "550e8400-e29b-41d4-a716-446655440000" }, "sort": { "field": "postId", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
     * @description 创建单个用户与角色的关联关系。 **请求体参数 (data)：** - userId: 用户UUID，必填 - roleId: 角色UUID，必填 **使用场景：** - 为用户分配单个角色 - 动态添加用户权限 **示例：** ```json { "data": { "userId": "550e8400-e29b-41d4-a716-446655440001", "roleId": "550e8400-e29b-41d4-a716-446655440002" } } ```
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
     * @description 批量创建多个用户与角色的关联关系。 **请求体参数 (data)：** - 数组，每个元素包含： - userId: 用户UUID，必填 - roleId: 角色UUID，必填 **使用场景：** - 为用户一次性分配多个角色 - 批量导入用户角色关联 **示例：** ```json { "data": [ { "userId": "user-1", "roleId": "role-1" }, { "userId": "user-1", "roleId": "role-2" }, { "userId": "user-2", "roleId": "role-1" } ] } ```
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
     * @description 分页查询用户与角色的关联关系，用于权限控制。 **过滤参数 (filter)：** - userIds: 按用户ID列表查询，如 ["user-id-1", "user-id-2"] - roleIds: 按角色ID列表查询，如 ["role-id-1", "role-id-2"] - userId: 按单个用户ID精确查询 - roleId: 按单个角色ID精确查询 **排序参数 (sort)：** - field: userId | roleId - order: asc | desc **分页参数：** - offset: 起始位置，默认0 - limit: 每页数量，1-100，默认20 **使用场景：** - 查询某用户关联的所有角色 - 查询某角色关联的所有用户 - 用户角色配置管理 **示例：** ```json { "filter": { "userId": "550e8400-e29b-41d4-a716-446655440000" }, "sort": { "field": "roleId", "order": "asc" }, "offset": 0, "limit": 20 } ```
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
     * @description 根据ID列表批量更新系统配置，所有指定的配置将应用相同的更新数据。 **参数说明：** - ids: 要更新的配置ID数组 - data: 更新的字段数据 **使用场景：** 1. 批量修改配置属性 2. 批量添加备注 3. 批量调整 isSystem 标识 **示例：** ```json { "ids": ["id1", "id2", "id3"], "data": { "isSystem": false, "remark": "已迁移为自定义配置" } } ```
     *
     * @tags system, config
     * @name PutApiSystemConfigBatch
     * @summary 批量更新系统配置
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
     * @description 根据ID更新单个系统配置信息。 **路径参数：** - id: 配置UUID **可更新字段：** - name: 配置名称 - key: 配置键（建议不要修改已使用的key） - value: 配置值 - isSystem: 是否系统内置 - remark: 备注 **使用场景：** 1. 修改配置值 2. 更新配置说明 3. 调整配置属性 **注意事项：** - 系统内置配置（isSystem=true）修改需谨慎 - 修改 key 可能影响依赖此配置的功能 **示例：** ```json // PUT /api/system/config/550e8400-e29b-41d4-a716-446655440000 { "data": { "value": "新的配置值", "remark": "更新于2024-01-01" } } ```
     *
     * @tags system, config
     * @name PutApiSystemConfigById
     * @summary 更新系统配置
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
     * @description 根据ID列表批量更新多个字典项。 **请求体：** - ids: 要更新的字典ID数组 - data: 更新数据对象 **使用场景：** - 批量启用/禁用字典项 **示例：** ```json { "ids": ["dict-id-1", "dict-id-2"], "data": { "status": "1" } } ``` **返回：** 更新成功的字典对象数组
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
     * @description 根据ID更新单个字典项的信息。 **路径参数：** - id: 字典项的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - group: 字典分组 - label: 显示标签 - value: 字典值 - status: 状态 - isDefault: 是否默认值 - sort: 排序号 - remark: 备注 **示例：** ```json PUT /api/system/dict/xxx-uuid { "data": { "label": "已启用", "sort": 1 } } ```
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
     * @description 根据Key列表批量更新字典组。 **参数说明：** - keys: 要更新的字典组键数组 - data: 更新的字段数据 **使用场景：** 1. 批量启用/禁用字典组 2. 批量添加备注 **示例：** ```json { "keys": ["sys_user_sex", "sys_normal_disable"], "data": { "status": "1", "remark": "已停用" } } ```
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
     * @description 根据Key更新单个字典组信息。 **路径参数：** - key: 字典组键 **可更新字段：** - name: 字典组名称 - status: 状态，"0"=正常，"1"=禁用 - remark: 备注 **注意事项：** - key 作为主键不可修改 - 禁用字典组会影响使用该字典的功能 **示例：** ```json // PUT /api/system/dict-group/sys_user_sex { "data": { "name": "性别", "status": "0" } } ```
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
     * @description 根据ID列表批量更新定时任务，所有指定的任务将应用相同的更新数据。 **参数说明：** - ids: 要更新的任务ID数组 - data: 更新的字段数据 **使用场景：** 1. 批量暂停任务：设置 status = "1" 2. 批量恢复任务：设置 status = "0" 3. 批量修改任务分组 **示例：** ```json { "ids": ["id1", "id2", "id3"], "data": { "status": "1", "remark": "维护期间暂停" } } ```
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
     * @description 根据ID更新单个定时任务信息。 **路径参数：** - id: 任务UUID **可更新字段：** - name: 任务名称 - group: 任务分组 - invokeTarget: 调用目标 - cronExpression: Cron表达式 - misfirePolicy: 错过执行策略 - concurrent: 是否允许并发 - status: 状态，"0"=正常，"1"=暂停 - remark: 备注 **使用场景：** 1. 修改任务执行时间（cronExpression） 2. 暂停/恢复任务（status） 3. 调整任务配置 **示例：** ```json // PUT /api/system/job/550e8400-e29b-41d4-a716-446655440000 { "data": { "cronExpression": "0 0 3 * * ?", "status": "0" } } ```
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
     * @description 根据ID列表批量更新任务执行日志。 **参数说明：** - ids: 要更新的日志ID数组 - data: 更新的字段数据 **使用场景：** 1. 批量标记日志状态 2. 批量添加备注 **示例：** ```json { "ids": ["id1", "id2", "id3"], "data": { "status": "1" } } ```
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
     * @description 根据ID更新单个任务执行日志信息。 **路径参数：** - id: 日志UUID **可更新字段：** - jobMessage: 执行消息 - status: 执行状态 - exceptionInfo: 异常信息 - stopTime: 结束时间 **使用场景：** 1. 任务执行完成后更新状态和结束时间 2. 记录任务执行异常信息 **示例：** ```json // PUT /api/system/job-log/550e8400-e29b-41d4-a716-446655440000 { "data": { "status": "1", "exceptionInfo": "连接超时", "stopTime": "2024-01-01T02:01:00Z" } } ```
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
     * @description 根据ID列表批量更新多个菜单。 **请求体：** - ids: 要更新的菜单ID数组 - data: 更新数据对象 **使用场景：** - 批量显示/隐藏菜单 - 批量启用/禁用菜单 **示例：** ```json { "ids": ["menu-id-1", "menu-id-2"], "data": { "visible": false } } ``` **返回：** 更新成功的菜单对象数组
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
     * @description 根据ID更新单个菜单的信息。 **路径参数：** - id: 菜单的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - name: 菜单名称 - type: 菜单类型 - parentId: 父级菜单ID - path: 路由路径 - component: 组件路径 - permission: 权限标识 - icon: 图标 - orderNum: 排序号 - visible: 是否可见 - status: 状态 **示例：** ```json PUT /api/system/menu/xxx-uuid { "data": { "visible": false, "orderNum": 10 } } ```
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
     * @description 根据ID列表批量更新通知公告，所有指定的通知将应用相同的更新数据。 **参数说明：** - ids: 要更新的通知ID数组 - data: 更新的字段数据 **使用场景：** 1. 批量关闭过期通知：设置 status = "1" 2. 批量修改通知类型 3. 批量添加备注 **示例：** ```json { "ids": ["id1", "id2", "id3"], "data": { "status": "1", "remark": "已过期" } } ```
     *
     * @tags system, notice
     * @name PutApiSystemNoticeBatch
     * @summary 批量更新通知公告
     * @request PUT:/api/system/notice/batch
     * @response `200` `PutApiSystemNoticeBatchData` Response for status 200
     */
    putApiSystemNoticeBatch: (params: RequestParams = {}) =>
      this.http.request<PutApiSystemNoticeBatchData, any>({
        path: `/api/system/notice/batch`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新单个通知公告信息。 **路径参数：** - id: 通知公告UUID **可更新字段：** - title: 通知标题 - type: 通知类型，"1"=通知，"2"=公告 - content: 通知内容 - status: 状态，"0"=正常，"1"=关闭 - remark: 备注 **使用场景：** 1. 修改通知内容 2. 关闭过期通知 3. 更改通知类型 **示例：** ```json // PUT /api/system/notice/550e8400-e29b-41d4-a716-446655440000 { "data": { "title": "系统维护通知（已完成）", "status": "1" } } ```
     *
     * @tags system, notice
     * @name PutApiSystemNoticeById
     * @summary 更新通知公告
     * @request PUT:/api/system/notice/{id}
     * @response `200` `PutApiSystemNoticeByIdData` Response for status 200
     */
    putApiSystemNoticeById: (
      { id, ...query }: PutApiSystemNoticeByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemNoticeByIdData, any>({
        path: `/api/system/notice/${id}`,
        method: "PUT",
        format: "json",
        ...params,
      }),

    /**
     * @description 根据ID更新权限信息。 **路径参数：** - id: 权限UUID，必填 **请求体参数 (data)：** - code: 权限编码，可选 - name: 权限名称，可选 - type: 权限类型，可选 - module: 所属模块，可选 - parentId: 父级权限ID，可选 - status: 状态，可选 - orderNum: 排序号，可选 - remark: 备注，可选 **示例：** PUT /api/system/permission/550e8400-e29b-41d4-a716-446655440000 ```json { "data": { "name": "用户管理", "status": false, "orderNum": 10 } } ```
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
     * @description 根据ID列表批量更新岗位，所有指定的岗位将应用相同的更新数据。 **参数说明：** - ids: 要更新的岗位ID数组 - data: 更新的字段数据 **使用场景：** 1. 批量启用/禁用岗位：设置 status 2. 批量调整排序：设置 sort 3. 批量添加备注 **示例：** ```json { "ids": ["id1", "id2", "id3"], "data": { "status": "1", "remark": "已停用" } } ```
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
     * @description 根据ID更新单个岗位信息。 **路径参数：** - id: 岗位UUID **可更新字段：** - code: 岗位编码 - name: 岗位名称 - sort: 排序号 - status: 状态，"0"=正常，"1"=禁用 - remark: 备注 **使用场景：** 1. 修改岗位名称或编码 2. 调整岗位排序 3. 启用/禁用岗位 **示例：** ```json // PUT /api/system/post/550e8400-e29b-41d4-a716-446655440000 { "data": { "name": "高级项目经理", "sort": 5, "status": "0" } } ```
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
     * @description 根据ID列表批量更新多个角色。 **请求体：** - ids: 要更新的角色ID数组 - data: 更新数据对象 **注意事项：** - 如果列表中包含管理员角色，会抛出错误 **示例：** ```json { "ids": ["role-id-1", "role-id-2"], "data": { "status": "1" } } ``` **返回：** 更新成功的角色对象数组
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
     * @description 根据ID更新单个角色的信息。 **路径参数：** - id: 角色的UUID **请求体 (data)：** 要更新的字段，所有字段均为可选 - name: 角色名称 - key: 角色标识 - status: 状态，"0"=正常，"1"=禁用 - sort: 排序号 - remark: 备注 **注意事项：** - 管理员角色（key=admin）不允许修改 **示例：** ```json PUT /api/system/role/xxx-uuid { "data": { "status": "1", "remark": "已禁用" } } ```
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
     * @description 设置指定角色的菜单列表，采用全量替换方式。 **路径参数：** - roleId: 角色UUID，必填 **请求体参数：** - menuIds: 菜单ID数组，必填，可为空数组（清空所有菜单权限） **操作逻辑：** 1. 删除该角色的所有现有菜单关联 2. 插入新的菜单关联列表 **使用场景：** - 角色菜单权限配置页面，保存角色的菜单权限 - 批量更新角色的菜单访问权限 **示例：** PUT /api/system/role-menu/role/550e8400-e29b-41d4-a716-446655440000 ```json { "menuIds": ["menu-id-1", "menu-id-2", "menu-id-3"] } ``` **清空菜单权限：** ```json { "menuIds": [] } ```
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
     * @description 更新当前用户的偏好设置
     *
     * @tags system, user, preferences
     * @name PutApiSystemUserPreferences
     * @summary 更新用户偏好设置
     * @request PUT:/api/system/user/preferences
     * @response `200` `PutApiSystemUserPreferencesData` Response for status 200
     */
    putApiSystemUserPreferences: (
      data: PutApiSystemUserPreferencesPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiSystemUserPreferencesData, any>({
        path: `/api/system/user/preferences`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 设置指定用户的角色列表，采用全量替换方式。 **路径参数：** - userId: 用户UUID，必填 **请求体参数：** - roleIds: 角色ID数组，必填，可为空数组（清空所有角色） **操作逻辑：** 1. 删除该用户的所有现有角色关联 2. 插入新的角色关联列表 **使用场景：** - 用户编辑页面，保存用户的角色配置 - 批量更新用户的角色权限 **示例：** PUT /api/system/user-role/user/550e8400-e29b-41d4-a716-446655440000 ```json { "roleIds": ["role-id-1", "role-id-2", "role-id-3"] } ``` **清空角色：** ```json { "roleIds": [] } ```
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
     * @description 取消收藏知识库节点。 **路径参数：** - nodeId: 节点UUID **返回：** - success: 是否成功（true表示已取消，false表示未找到收藏记录） **示例：** DELETE /api/knowledge/favorites/550e8400-e29b-41d4-a716-446655440000
     *
     * @tags knowledge, favorite
     * @name DeleteApiKnowledgeFavoritesByNodeId
     * @summary 取消收藏
     * @request DELETE:/api/knowledge/favorites/{nodeId}
     * @response `200` `DeleteApiKnowledgeFavoritesByNodeIdData` Response for status 200
     */
    deleteApiKnowledgeFavoritesByNodeId: (
      { nodeId, ...query }: DeleteApiKnowledgeFavoritesByNodeIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiKnowledgeFavoritesByNodeIdData, any>({
        path: `/api/knowledge/favorites/${nodeId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 软删除节点（文件夹会递归删除所有子节点）。 **路径参数：** - id: 节点UUID **权限检查：** - 需要对该节点有 delete 权限 **行为：** - 软删除：设置 deletedAt 时间戳，不物理删除 - 文件夹：递归删除所有后代节点（使用物化路径批量更新） **返回：** - success: 是否成功 - deletedCount: 删除的节点数量（包括子节点） **示例：** DELETE /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000
     *
     * @tags knowledge, node, mutation
     * @name DeleteApiKnowledgeNodesById
     * @summary 删除节点
     * @request DELETE:/api/knowledge/nodes/{id}
     * @response `200` `DeleteApiKnowledgeNodesByIdData` Response for status 200
     */
    deleteApiKnowledgeNodesById: (
      { id, ...query }: DeleteApiKnowledgeNodesByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<DeleteApiKnowledgeNodesByIdData, any>({
        path: `/api/knowledge/nodes/${id}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * @description 移除节点的权限条目。 **路径参数：** - id: 节点UUID - subjectType: "user" | "role" | "dept" - subjectId: 主体ID **查询参数：** - permission: 可选，指定移除的权限类型；不指定则移除该主体的所有权限 **权限检查：** - 需要是节点创建者或有 manage 权限 **返回：** - success: 是否成功 **示例：** DELETE /api/knowledge/nodes/node-uuid/permissions/user/user-uuid?permission=write
     *
     * @tags knowledge, permission
     * @name DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectId
     * @summary 移除权限
     * @request DELETE:/api/knowledge/nodes/{id}/permissions/{subjectType}/{subjectId}
     * @response `200` `DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectIdData` Response for status 200
     */
    deleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectId: (
      {
        id,
        subjectType,
        subjectId,
        ...query
      }: DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<
        DeleteApiKnowledgeNodesByIdPermissionsBySubjectTypeBySubjectIdData,
        any
      >({
        path: `/api/knowledge/nodes/${id}/permissions/${subjectType}/${subjectId}`,
        method: "DELETE",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description 根据主键ID查询单个节点详情。 **路径参数：** - id: 节点UUID **返回：** - 节点完整信息，包含 id, name, type, path, size, mimeType 等 - 如果节点不存在或无权限，返回 null **权限检查：** - 需要对该节点有 read 权限 **示例：** GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000
     *
     * @tags knowledge, node, query
     * @name GetApiKnowledgeNodesById
     * @summary 根据ID查询节点
     * @request GET:/api/knowledge/nodes/{id}
     * @response `200` `GetApiKnowledgeNodesByIdData` Response for status 200
     */
    getApiKnowledgeNodesById: (
      { id, ...query }: GetApiKnowledgeNodesByIdParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiKnowledgeNodesByIdData, any>({
        path: `/api/knowledge/nodes/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取指定父节点下的所有子节点。 **路径参数：** - id: 父节点ID，使用 "root" 表示根目录 **查询参数：** - type: 可选，筛选类型 "folder" | "file" **返回：** - data: 子节点数组，按类型和名称排序（文件夹在前） **使用场景：** - 文件管理器目录浏览 - 获取文件夹内容 **示例：** GET /api/knowledge/nodes/root/children?type=folder
     *
     * @tags knowledge, node, query
     * @name GetApiKnowledgeNodesByIdChildren
     * @summary 获取子节点
     * @request GET:/api/knowledge/nodes/{id}/children
     * @response `200` `GetApiKnowledgeNodesByIdChildrenData` Response for status 200
     */
    getApiKnowledgeNodesByIdChildren: (
      { id, ...query }: GetApiKnowledgeNodesByIdChildrenParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiKnowledgeNodesByIdChildrenData, any>({
        path: `/api/knowledge/nodes/${id}/children`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取文件原始内容（不验证文件类型）。 **路径参数：** - id: 文件节点UUID **权限检查：** - 需要对该节点有 read 权限 **返回：** - content: 文件内容（字符串） - mimeType: MIME类型 **使用场景：** - 获取任意文件的原始内容 - 文件预览 **示例：** GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/content
     *
     * @tags knowledge, content
     * @name GetApiKnowledgeNodesByIdContent
     * @summary 获取原始内容
     * @request GET:/api/knowledge/nodes/{id}/content
     * @response `200` `GetApiKnowledgeNodesByIdContentData` Response for status 200
     */
    getApiKnowledgeNodesByIdContent: (
      { id, ...query }: GetApiKnowledgeNodesByIdContentParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiKnowledgeNodesByIdContentData, any>({
        path: `/api/knowledge/nodes/${id}/content`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取文件预签名下载URL（1小时有效）。 **路径参数：** - id: 文件节点UUID **权限检查：** - 需要对该节点有 read 权限 **返回：** - url: 预签名下载URL - expiresAt: URL过期时间（ISO 8601） **副作用：** - 自动增加文件下载次数计数 **示例：** GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/download-url
     *
     * @tags knowledge, content
     * @name GetApiKnowledgeNodesByIdDownloadUrl
     * @summary 获取下载URL
     * @request GET:/api/knowledge/nodes/{id}/download-url
     * @response `200` `GetApiKnowledgeNodesByIdDownloadUrlData` Response for status 200
     */
    getApiKnowledgeNodesByIdDownloadUrl: (
      { id, ...query }: GetApiKnowledgeNodesByIdDownloadUrlParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiKnowledgeNodesByIdDownloadUrlData, any>({
        path: `/api/knowledge/nodes/${id}/download-url`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取用户对节点的有效权限（考虑继承和角色）。 **路径参数：** - id: 节点UUID **查询参数：** - userId: 可选，目标用户ID；不指定则查询当前用户 **返回：** - data: 有效权限数组 - permission: "read" | "write" | "delete" | "manage" - effect: "allow" | "deny" - source: "direct" | "inherited" | "role" | "dept"（权限来源） - sourceId: 来源ID（如角色ID） **特殊情况：** - 节点创建者自动拥有所有权限 **示例：** GET /api/knowledge/nodes/node-uuid/effective-permissions?userId=user-uuid
     *
     * @tags knowledge, permission
     * @name GetApiKnowledgeNodesByIdEffectivePermissions
     * @summary 获取有效权限
     * @request GET:/api/knowledge/nodes/{id}/effective-permissions
     * @response `200` `GetApiKnowledgeNodesByIdEffectivePermissionsData` Response for status 200
     */
    getApiKnowledgeNodesByIdEffectivePermissions: (
      { id, ...query }: GetApiKnowledgeNodesByIdEffectivePermissionsParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiKnowledgeNodesByIdEffectivePermissionsData, any>({
        path: `/api/knowledge/nodes/${id}/effective-permissions`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取节点的完整路径（面包屑导航）。 **路径参数：** - id: 节点UUID **返回：** - data: 路径节点数组（从根到当前节点） - id: 节点ID - name: 节点名称 - type: 节点类型 **使用场景：** - 面包屑导航 - 显示文件完整路径 **示例响应：** ```json { "data": [ { "id": "root-folder", "name": "文档", "type": "folder" }, { "id": "sub-folder", "name": "项目", "type": "folder" }, { "id": "current-file", "name": "readme.md", "type": "file" } ] } ```
     *
     * @tags knowledge, operations
     * @name GetApiKnowledgeNodesByIdPath
     * @summary 获取节点路径
     * @request GET:/api/knowledge/nodes/{id}/path
     * @response `200` `GetApiKnowledgeNodesByIdPathData` Response for status 200
     */
    getApiKnowledgeNodesByIdPath: (
      { id, ...query }: GetApiKnowledgeNodesByIdPathParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiKnowledgeNodesByIdPathData, any>({
        path: `/api/knowledge/nodes/${id}/path`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取节点的权限列表（所有被授权的主体）。 **路径参数：** - id: 节点UUID **权限检查：** - 需要对该节点有 read 权限 **返回：** - permissions: 权限数组 - subjectType: "user" | "role" | "dept" - subjectId: 主体ID - resourceId: 节点ID - permission: "read" | "write" | "delete" | "manage" - effect: "allow" | "deny" **示例：** GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/permissions
     *
     * @tags knowledge, permission
     * @name GetApiKnowledgeNodesByIdPermissions
     * @summary 获取节点权限
     * @request GET:/api/knowledge/nodes/{id}/permissions
     * @response `200` `GetApiKnowledgeNodesByIdPermissionsData` Response for status 200
     */
    getApiKnowledgeNodesByIdPermissions: (
      { id, ...query }: GetApiKnowledgeNodesByIdPermissionsParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiKnowledgeNodesByIdPermissionsData, any>({
        path: `/api/knowledge/nodes/${id}/permissions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取文本文件内容（用于在线编辑）。 **路径参数：** - id: 文件节点UUID **权限检查：** - 需要对该节点有 read 权限 **限制：** - 仅支持文本类型文件（.txt, .md, .json, .js, .ts 等） **返回：** - id: 节点ID - name: 文件名 - content: 文件内容（UTF-8字符串） - mimeType: MIME类型 - extension: 扩展名 - parentId: 父节点ID **使用场景：** - 在线文本编辑器 - Markdown 预览 **示例：** GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/text
     *
     * @tags knowledge, content
     * @name GetApiKnowledgeNodesByIdText
     * @summary 获取文本内容
     * @request GET:/api/knowledge/nodes/{id}/text
     * @response `200` `GetApiKnowledgeNodesByIdTextData` Response for status 200
     */
    getApiKnowledgeNodesByIdText: (
      { id, ...query }: GetApiKnowledgeNodesByIdTextParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiKnowledgeNodesByIdTextData, any>({
        path: `/api/knowledge/nodes/${id}/text`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取文件的所有历史版本列表。 **路径参数：** - id: 文件节点UUID **权限检查：** - 需要对该节点有 read 权限 **限制：** - 仅支持文件类型节点 **返回：** - data: 版本数组，按创建时间倒序 **示例：** GET /api/knowledge/nodes/550e8400-e29b-41d4-a716-446655440000/versions
     *
     * @tags knowledge, version
     * @name GetApiKnowledgeNodesByIdVersions
     * @summary 获取版本列表
     * @request GET:/api/knowledge/nodes/{id}/versions
     * @response `200` `GetApiKnowledgeNodesByIdVersionsData` Response for status 200
     */
    getApiKnowledgeNodesByIdVersions: (
      { id, ...query }: GetApiKnowledgeNodesByIdVersionsParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiKnowledgeNodesByIdVersionsData, any>({
        path: `/api/knowledge/nodes/${id}/versions`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取知识库节点表的 JSON Schema 定义。 **返回：** - JSON Schema 对象，描述节点数据结构 **使用场景：** - 前端表单动态生成 - API 文档生成 - 数据验证
     *
     * @tags knowledge, node, schema
     * @name GetApiKnowledgeNodesSchema
     * @summary 获取节点Schema
     * @request GET:/api/knowledge/nodes/schema
     * @response `200` `GetApiKnowledgeNodesSchemaData` Response for status 200
     */
    getApiKnowledgeNodesSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiKnowledgeNodesSchemaData, any>({
        path: `/api/knowledge/nodes/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取历史版本的预签名下载URL（1小时有效）。 **路径参数：** - id: 版本记录UUID **权限检查：** - 需要对关联的文件节点有 read 权限 **返回：** - url: 预签名下载URL - expiresAt: URL过期时间（ISO 8601） **文件名格式：** - 自动添加版本号后缀，如 "document_v2.pdf" **示例：** GET /api/knowledge/versions/version-uuid/download-url
     *
     * @tags knowledge, version
     * @name GetApiKnowledgeVersionsByIdDownloadUrl
     * @summary 下载历史版本
     * @request GET:/api/knowledge/versions/{id}/download-url
     * @response `200` `GetApiKnowledgeVersionsByIdDownloadUrlData` Response for status 200
     */
    getApiKnowledgeVersionsByIdDownloadUrl: (
      { id, ...query }: GetApiKnowledgeVersionsByIdDownloadUrlParams,
      params: RequestParams = {},
    ) =>
      this.http.request<GetApiKnowledgeVersionsByIdDownloadUrlData, any>({
        path: `/api/knowledge/versions/${id}/download-url`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 获取文件版本表的 JSON Schema 定义。 **返回：** - JSON Schema 对象，描述版本数据结构 **使用场景：** - 前端表单动态生成 - API 文档生成
     *
     * @tags knowledge, version
     * @name GetApiKnowledgeVersionsSchema
     * @summary 获取版本Schema
     * @request GET:/api/knowledge/versions/schema
     * @response `200` `GetApiKnowledgeVersionsSchemaData` Response for status 200
     */
    getApiKnowledgeVersionsSchema: (params: RequestParams = {}) =>
      this.http.request<GetApiKnowledgeVersionsSchemaData, any>({
        path: `/api/knowledge/versions/schema`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * @description 收藏知识库节点（文件或文件夹）。 **请求体参数：** - nodeId: 节点UUID，必填 **行为：** - 如果已收藏，返回现有收藏记录（幂等操作） - 自动获取节点类型（folder/file） **返回：** - 收藏记录完整信息 **示例：** ```json { "nodeId": "550e8400-e29b-41d4-a716-446655440000" } ```
     *
     * @tags knowledge, favorite
     * @name PostApiKnowledgeFavorites
     * @summary 添加收藏
     * @request POST:/api/knowledge/favorites
     * @response `200` `PostApiKnowledgeFavoritesData` Response for status 200
     */
    postApiKnowledgeFavorites: (
      data: PostApiKnowledgeFavoritesPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFavoritesData, any>({
        path: `/api/knowledge/favorites`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量检查节点是否已收藏。 **请求体参数：** - nodeIds: 节点ID数组，必填 **返回：** - favorites: 收藏状态映射 { nodeId: boolean } **使用场景：** - 文件列表显示收藏状态 - 批量操作前检查 **示例：** ```json { "nodeIds": ["uuid1", "uuid2", "uuid3"] } ``` **响应：** ```json { "favorites": { "uuid1": true, "uuid2": false, "uuid3": true } } ```
     *
     * @tags knowledge, favorite
     * @name PostApiKnowledgeFavoritesCheck
     * @summary 检查收藏状态
     * @request POST:/api/knowledge/favorites/check
     * @response `200` `PostApiKnowledgeFavoritesCheckData` Response for status 200
     */
    postApiKnowledgeFavoritesCheck: (
      data: PostApiKnowledgeFavoritesCheckPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFavoritesCheckData, any>({
        path: `/api/knowledge/favorites/check`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取当前用户的收藏列表（带节点详情）。 **请求体参数：** - type: 节点类型筛选，可选 "folder" | "file" - limit: 每页数量，默认50，最大100 - offset: 偏移量，默认0 **返回：** - data: 收藏项数组，包含节点详情 - favoriteId: 收藏记录ID - nodeId: 节点ID - type: 节点类型 - name: 名称 - parentId: 父节点ID - icon, color, extension, mimeType, size - createdAt: 节点创建时间 - favoritedAt: 收藏时间 - total: 总数 **示例：** ```json { "type": "file", "limit": 20, "offset": 0 } ```
     *
     * @tags knowledge, favorite
     * @name PostApiKnowledgeFavoritesList
     * @summary 获取收藏列表
     * @request POST:/api/knowledge/favorites/list
     * @response `200` `PostApiKnowledgeFavoritesListData` Response for status 200
     */
    postApiKnowledgeFavoritesList: (
      data: PostApiKnowledgeFavoritesListPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeFavoritesListData, any>({
        path: `/api/knowledge/favorites/list`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 创建文件夹或文件节点。 **请求体参数：** - type: 节点类型，必填，"folder" | "file" - parentId: 父节点ID，可选，null表示根目录 - name: 名称，必填，1-255字符 - description: 描述，可选 - 文件夹特有：icon, color - 文件特有：extension, mimeType, size, storageKey, bucket, etag, versionId **权限检查：** - 如果指定 parentId，需要对父节点有 write 权限 **返回：** - 创建的节点完整信息 **示例（创建文件夹）：** ```json { "type": "folder", "parentId": null, "name": "我的文档", "icon": "folder", "color": "#4A90E2" } ```
     *
     * @tags knowledge, node, mutation
     * @name PostApiKnowledgeNodes
     * @summary 创建节点
     * @request POST:/api/knowledge/nodes
     * @response `200` `PostApiKnowledgeNodesData` Response for status 200
     */
    postApiKnowledgeNodes: (
      data: PostApiKnowledgeNodesPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeNodesData, any>({
        path: `/api/knowledge/nodes`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 复制节点到目标文件夹（自动处理重名）。 **路径参数：** - id: 要复制的节点UUID **请求体参数：** - targetParentId: 目标父节点ID，null表示复制到根目录 **权限检查：** - 需要对源节点有 read 权限 - 需要对目标文件夹有 write 权限 **行为：** - 如果目标位置存在同名文件，自动重命名（如 "file (1).txt"） - 复制文件的存储引用，不复制实际文件内容 **返回：** - 复制后的新节点完整信息 **示例：** ```json { "targetParentId": "target-folder-uuid" } ```
     *
     * @tags knowledge, operations
     * @name PostApiKnowledgeNodesByIdCopy
     * @summary 复制节点
     * @request POST:/api/knowledge/nodes/{id}/copy
     * @response `200` `PostApiKnowledgeNodesByIdCopyData` Response for status 200
     */
    postApiKnowledgeNodesByIdCopy: (
      { id, ...query }: PostApiKnowledgeNodesByIdCopyParams,
      data: PostApiKnowledgeNodesByIdCopyPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeNodesByIdCopyData, any>({
        path: `/api/knowledge/nodes/${id}/copy`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 移动节点到目标文件夹。 **路径参数：** - id: 要移动的节点UUID **请求体参数：** - targetParentId: 目标父节点ID，null表示移动到根目录 **权限检查：** - 需要对源节点有 write 权限 - 需要对目标文件夹有 write 权限 **限制：** - 不能移动到自身 - 文件夹不能移动到自己的后代节点 **返回：** - 移动后的节点完整信息 **示例：** ```json { "targetParentId": "target-folder-uuid" } ```
     *
     * @tags knowledge, operations
     * @name PostApiKnowledgeNodesByIdMove
     * @summary 移动节点
     * @request POST:/api/knowledge/nodes/{id}/move
     * @response `200` `PostApiKnowledgeNodesByIdMoveData` Response for status 200
     */
    postApiKnowledgeNodesByIdMove: (
      { id, ...query }: PostApiKnowledgeNodesByIdMoveParams,
      data: PostApiKnowledgeNodesByIdMovePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeNodesByIdMoveData, any>({
        path: `/api/knowledge/nodes/${id}/move`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 为节点添加单个权限条目。 **路径参数：** - id: 节点UUID **请求体参数：** - subjectType: "user" | "role" | "dept" - subjectId: 主体ID - permission: "read" | "write" | "delete" | "manage" - effect: "allow" | "deny"，默认 "allow" **权限检查：** - 需要是节点创建者或有 manage 权限 **返回：** - success: 是否成功 **示例：** ```json { "subjectType": "user", "subjectId": "user-uuid", "permission": "write", "effect": "allow" } ```
     *
     * @tags knowledge, permission
     * @name PostApiKnowledgeNodesByIdPermissions
     * @summary 添加权限
     * @request POST:/api/knowledge/nodes/{id}/permissions
     * @response `200` `PostApiKnowledgeNodesByIdPermissionsData` Response for status 200
     */
    postApiKnowledgeNodesByIdPermissions: (
      { id, ...query }: PostApiKnowledgeNodesByIdPermissionsParams,
      data: PostApiKnowledgeNodesByIdPermissionsPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeNodesByIdPermissionsData, any>({
        path: `/api/knowledge/nodes/${id}/permissions`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 快速共享节点给多个用户（简化的权限设置）。 **路径参数：** - id: 节点UUID **请求体参数：** - userIds: 用户ID数组 - level: 共享级别 - "read": 只读（read权限） - "edit": 可编辑（read + write权限） - "full": 完全控制（read + write + delete + manage权限） **权限检查：** - 需要是节点创建者或有 manage 权限 **返回：** - success: 是否成功 - sharedCount: 实际共享的用户数（排除自己） **示例：** ```json { "userIds": ["user1-uuid", "user2-uuid"], "level": "edit" } ```
     *
     * @tags knowledge, permission
     * @name PostApiKnowledgeNodesByIdQuickShare
     * @summary 快捷共享
     * @request POST:/api/knowledge/nodes/{id}/quick-share
     * @response `200` `PostApiKnowledgeNodesByIdQuickShareData` Response for status 200
     */
    postApiKnowledgeNodesByIdQuickShare: (
      { id, ...query }: PostApiKnowledgeNodesByIdQuickShareParams,
      data: PostApiKnowledgeNodesByIdQuickSharePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeNodesByIdQuickShareData, any>({
        path: `/api/knowledge/nodes/${id}/quick-share`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 取消用户对节点的所有权限（批量撤销）。 **路径参数：** - id: 节点UUID **请求体参数：** - userIds: 用户ID数组 **权限检查：** - 需要是节点创建者或有 manage 权限 **返回：** - success: 是否成功 - revokedCount: 撤销的用户数 **示例：** ```json { "userIds": ["user1-uuid", "user2-uuid"] } ```
     *
     * @tags knowledge, permission
     * @name PostApiKnowledgeNodesByIdRevokeShare
     * @summary 取消共享
     * @request POST:/api/knowledge/nodes/{id}/revoke-share
     * @response `200` `PostApiKnowledgeNodesByIdRevokeShareData` Response for status 200
     */
    postApiKnowledgeNodesByIdRevokeShare: (
      { id, ...query }: PostApiKnowledgeNodesByIdRevokeShareParams,
      data: PostApiKnowledgeNodesByIdRevokeSharePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeNodesByIdRevokeShareData, any>({
        path: `/api/knowledge/nodes/${id}/revoke-share`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 检查指定父节点下是否存在同名节点（批量检查）。 **请求体参数：** - parentId: 父节点ID，可选，null表示根目录 - names: 要检查的名称数组，必填 - type: 节点类型筛选，可选 "folder" | "file" **返回：** - exists: 已存在的节点数组 - name: 文件名 - nodeId: 节点ID - type: 类型 - size: 大小 - updatedAt: 更新时间 **使用场景：** - 上传前检查文件是否存在 - 批量操作前的冲突检测 **示例：** ```json { "parentId": "folder-uuid", "names": ["file1.txt", "file2.txt", "folder1"], "type": "file" } ```
     *
     * @tags knowledge, operations
     * @name PostApiKnowledgeNodesCheckExists
     * @summary 检查节点是否存在
     * @request POST:/api/knowledge/nodes/check-exists
     * @response `200` `PostApiKnowledgeNodesCheckExistsData` Response for status 200
     */
    postApiKnowledgeNodesCheckExists: (
      data: PostApiKnowledgeNodesCheckExistsPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeNodesCheckExistsData, any>({
        path: `/api/knowledge/nodes/check-exists`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量软删除多个节点。 **请求体参数：** - ids: 节点ID数组 **权限检查：** - 逐个检查 delete 权限，无权限的节点会被跳过 **行为：** - 软删除：设置 deletedAt 时间戳 - 文件夹：递归删除所有后代节点 **返回：** - deletedCount: 实际删除的节点数量 **示例：** ```json { "ids": ["uuid1", "uuid2", "uuid3"] } ```
     *
     * @tags knowledge, node, mutation
     * @name PostApiKnowledgeNodesDeleteBatch
     * @summary 批量删除节点
     * @request POST:/api/knowledge/nodes/delete-batch
     * @response `200` `PostApiKnowledgeNodesDeleteBatchData` Response for status 200
     */
    postApiKnowledgeNodesDeleteBatch: (
      data: PostApiKnowledgeNodesDeleteBatchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeNodesDeleteBatchData, any>({
        path: `/api/knowledge/nodes/delete-batch`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询知识库节点列表，自动筛选当前用户的节点。 **请求体参数：** - filter: 过滤条件，可选 - ids: 节点ID数组（IN查询） - types: 类型数组 ["folder", "file"] - parentId: 父节点ID，null表示根目录 - type: 单个类型 "folder" | "file" - name: 名称模糊匹配 - extension: 扩展名模糊匹配 - createdAtStart/createdAtEnd: 创建时间范围 - isPublic: 是否公开 - sort: 排序，可选 - field: "name" | "type" | "size" | "orderNum" | "createdAt" | "updatedAt" - order: "asc" | "desc" - offset: 偏移量，默认0 - limit: 每页数量，默认20，最大100 **返回：** - data: 节点数组 - total: 总数 **示例：** ```json { "filter": { "parentId": null, "type": "folder" }, "sort": { "field": "name", "order": "asc" }, "limit": 20, "offset": 0 } ```
     *
     * @tags knowledge, node, query
     * @name PostApiKnowledgeNodesQuery
     * @summary 分页查询节点
     * @request POST:/api/knowledge/nodes/query
     * @response `200` `PostApiKnowledgeNodesQueryData` Response for status 200
     */
    postApiKnowledgeNodesQuery: (
      data: PostApiKnowledgeNodesQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeNodesQueryData, any>({
        path: `/api/knowledge/nodes/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 全文搜索知识库节点（按名称模糊匹配）。 **请求体参数：** - keyword: 搜索关键词，必填，1-100字符 - type: 节点类型筛选，可选 "folder" | "file" - limit: 返回数量限制，默认20，最大50 **返回：** - data: 匹配的节点数组 **使用场景：** - 文件搜索 - 快速定位文件 **示例：** ```json { "keyword": "readme", "type": "file", "limit": 10 } ```
     *
     * @tags knowledge, operations
     * @name PostApiKnowledgeNodesSearch
     * @summary 搜索节点
     * @request POST:/api/knowledge/nodes/search
     * @response `200` `PostApiKnowledgeNodesSearchData` Response for status 200
     */
    postApiKnowledgeNodesSearch: (
      data: PostApiKnowledgeNodesSearchPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeNodesSearchData, any>({
        path: `/api/knowledge/nodes/search`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取当前用户共享给他人的节点列表。 **请求体参数：** - type: 节点类型筛选，可选 "folder" | "file" - limit: 每页数量，默认50，最大100 - offset: 偏移量，默认0 **返回：** - data: 共享项数组 - node: 节点完整信息 - sharedTo: 共享对象数组 - subjectType: "user" | "role" | "dept" - subjectId: 对象ID - permission: 权限级别 - total: 总数 **使用场景：** - "我的共享"页面 - 管理已共享的文件 **示例：** ```json { "type": "file", "limit": 20 } ```
     *
     * @tags knowledge, share
     * @name PostApiKnowledgeShareMyShared
     * @summary 获取我共享的资源
     * @request POST:/api/knowledge/share/my-shared
     * @response `200` `PostApiKnowledgeShareMySharedData` Response for status 200
     */
    postApiKnowledgeShareMyShared: (
      data: PostApiKnowledgeShareMySharedPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeShareMySharedData, any>({
        path: `/api/knowledge/share/my-shared`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取他人共享给当前用户的节点，支持文件夹层级浏览。 **请求体参数：** - folderId: 文件夹ID，可选，用于浏览共享文件夹内容 - type: 节点类型筛选，可选 "folder" | "file" - limit: 每页数量，默认50，最大100 - offset: 偏移量，默认0 **返回：** - data: 共享项数组 - node: 节点完整信息 - permissions: 权限数组 ["read", "write", ...] - permissionSource: "direct" | "inherited"（权限来源） - sharedBy: 共享者信息 { userId, userName } - total: 总数 **权限继承：** - 进入共享文件夹后，子节点继承父节点权限 - 直接权限优先于继承权限 **使用场景：** - "收到的共享"页面 - 浏览他人共享的文件夹 **示例：** ```json { "folderId": "shared-folder-uuid", "type": "file", "limit": 20 } ```
     *
     * @tags knowledge, share
     * @name PostApiKnowledgeShareSharedWithMe
     * @summary 获取共享给我的资源
     * @request POST:/api/knowledge/share/shared-with-me
     * @response `200` `PostApiKnowledgeShareSharedWithMeData` Response for status 200
     */
    postApiKnowledgeShareSharedWithMe: (
      data: PostApiKnowledgeShareSharedWithMePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeShareSharedWithMeData, any>({
        path: `/api/knowledge/share/shared-with-me`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 确认文件上传完成并创建节点记录。 **请求体参数：** - parentId: 父文件夹ID，可选 - name: 文件名，必填，1-255字符 - storageKey: 存储路径，必填（从 getUrl 返回） - mimeType: MIME类型，必填 - size: 文件大小（字节），必填 - description: 描述，可选 **权限检查：** - 如果指定 parentId，需要对父节点有 write 权限 **返回：** - 创建的文件节点完整信息 **使用场景：** - 大文件上传完成后调用 - 配合 getUrl 使用 **示例：** ```json { "parentId": "folder-uuid", "name": "document.pdf", "storageKey": "knowledge/user-id/xxx/document.pdf", "mimeType": "application/pdf", "size": 1048576 } ```
     *
     * @tags knowledge, upload
     * @name PostApiKnowledgeUploadConfirm
     * @summary 确认上传
     * @request POST:/api/knowledge/upload/confirm
     * @response `200` `PostApiKnowledgeUploadConfirmData` Response for status 200
     */
    postApiKnowledgeUploadConfirm: (
      data: PostApiKnowledgeUploadConfirmPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeUploadConfirmData, any>({
        path: `/api/knowledge/upload/confirm`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 直接上传小文件（Base64编码），自动检测同名冲突。 **请求体参数：** - parentId: 父文件夹ID，可选，null表示根目录 - name: 文件名，必填，1-255字符 - content: 文件内容，必填，Base64编码 - mimeType: MIME类型，可选，默认 application/octet-stream - description: 描述，可选 **返回：** - success: 是否成功 - node: 创建的节点（成功时） - conflict: 冲突信息（存在同名文件时） - nodeId: 已存在节点ID - name: 文件名 - size: 文件大小 - updatedAt: 更新时间 **使用场景：** - 小文件快速上传（<5MB） - 文本文件创建 **示例：** ```json { "parentId": null, "name": "readme.md", "content": "IyBIZWxsbyBXb3JsZA==", "mimeType": "text/markdown" } ```
     *
     * @tags knowledge, upload
     * @name PostApiKnowledgeUploadDirect
     * @summary 直接上传
     * @request POST:/api/knowledge/upload/direct
     * @response `200` `PostApiKnowledgeUploadDirectData` Response for status 200
     */
    postApiKnowledgeUploadDirect: (
      data: PostApiKnowledgeUploadDirectPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeUploadDirectData, any>({
        path: `/api/knowledge/upload/direct`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 上传文件并处理同名冲突，支持覆盖、新版本、副本三种模式。 **请求体参数：** - parentId: 父文件夹ID，可选 - name: 文件名，必填，1-255字符 - content: 文件内容，必填，Base64编码 - mimeType: MIME类型，可选 - description: 描述，可选 - conflictMode: 冲突处理模式，必填 - "overwrite": 覆盖现有文件 - "newVersion": 保存为新版本（保留历史） - "copy": 创建副本（自动重命名） - existingNodeId: 现有节点ID（overwrite/newVersion模式必填） **权限检查：** - overwrite/newVersion: 需要对现有节点有 write 权限 - copy: 需要对父节点有 write 权限 **返回：** - 创建/更新的节点完整信息 **示例（覆盖）：** ```json { "name": "report.xlsx", "content": "...", "mimeType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "conflictMode": "overwrite", "existingNodeId": "existing-file-uuid" } ```
     *
     * @tags knowledge, upload
     * @name PostApiKnowledgeUploadForce
     * @summary 强制上传
     * @request POST:/api/knowledge/upload/force
     * @response `200` `PostApiKnowledgeUploadForceData` Response for status 200
     */
    postApiKnowledgeUploadForce: (
      data: PostApiKnowledgeUploadForcePayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeUploadForceData, any>({
        path: `/api/knowledge/upload/force`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 获取预签名上传URL，用于大文件分片上传。 **请求体参数：** - parentId: 父文件夹ID，可选，null表示根目录 - filename: 文件名，必填，1-255字符 - mimeType: MIME类型，必填 **返回：** - uploadUrl: 预签名上传URL（直接PUT到此URL） - storageKey: 存储路径，用于后续确认上传 - expiresAt: URL过期时间（ISO 8601） **使用场景：** - 大文件上传（>5MB） - 前端直传S3/MinIO **示例：** ```json { "parentId": "folder-uuid", "filename": "large-file.zip", "mimeType": "application/zip" } ```
     *
     * @tags knowledge, upload
     * @name PostApiKnowledgeUploadUrl
     * @summary 获取上传URL
     * @request POST:/api/knowledge/upload/url
     * @response `200` `PostApiKnowledgeUploadUrlData` Response for status 200
     */
    postApiKnowledgeUploadUrl: (
      data: PostApiKnowledgeUploadUrlPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeUploadUrlData, any>({
        path: `/api/knowledge/upload/url`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 将历史版本恢复为当前版本。 **路径参数：** - id: 版本记录UUID **权限检查：** - 需要对关联的文件节点有 write 权限 **行为：** 1. 将当前文件保存为新版本（保留历史） 2. 将历史版本的存储信息更新到主节点 3. 增加版本计数 **返回：** - 更新后的文件节点完整信息 **示例：** POST /api/knowledge/versions/version-uuid/restore
     *
     * @tags knowledge, version
     * @name PostApiKnowledgeVersionsByIdRestore
     * @summary 恢复历史版本
     * @request POST:/api/knowledge/versions/{id}/restore
     * @response `200` `PostApiKnowledgeVersionsByIdRestoreData` Response for status 200
     */
    postApiKnowledgeVersionsByIdRestore: (
      { id, ...query }: PostApiKnowledgeVersionsByIdRestoreParams,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeVersionsByIdRestoreData, any>({
        path: `/api/knowledge/versions/${id}/restore`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * @description 分页查询文件版本列表。 **请求体参数：** - filter: 过滤条件，可选 - nodeIds: 节点ID数组（IN查询） - nodeId: 单个节点ID - versionNumber: 版本号模糊匹配 - createdAtStart/createdAtEnd: 创建时间范围 - sort: 排序，可选 - field: "versionNumber" | "size" | "createdAt" - order: "asc" | "desc" - offset: 偏移量，默认0 - limit: 每页数量，默认20，最大100 **返回：** - data: 版本数组 - total: 总数 **示例：** ```json { "filter": { "nodeId": "file-uuid" }, "sort": { "field": "createdAt", "order": "desc" }, "limit": 10 } ```
     *
     * @tags knowledge, version
     * @name PostApiKnowledgeVersionsQuery
     * @summary 分页查询版本
     * @request POST:/api/knowledge/versions/query
     * @response `200` `PostApiKnowledgeVersionsQueryData` Response for status 200
     */
    postApiKnowledgeVersionsQuery: (
      data: PostApiKnowledgeVersionsQueryPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PostApiKnowledgeVersionsQueryData, any>({
        path: `/api/knowledge/versions/query`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 更新节点信息（重命名、修改描述等）。 **路径参数：** - id: 节点UUID **请求体参数（均可选）：** - name: 新名称，1-255字符 - description: 描述 - icon: 图标（文件夹） - color: 颜色（文件夹） - orderNum: 排序号 - isPublic: 是否公开 - tags: 标签数组 **权限检查：** - 需要对该节点有 write 权限 **返回：** - 更新后的节点完整信息 **示例：** ```json { "name": "新文件名.md", "description": "更新的描述", "tags": ["重要", "工作"] } ```
     *
     * @tags knowledge, node, mutation
     * @name PutApiKnowledgeNodesById
     * @summary 更新节点
     * @request PUT:/api/knowledge/nodes/{id}
     * @response `200` `PutApiKnowledgeNodesByIdData` Response for status 200
     */
    putApiKnowledgeNodesById: (
      { id, ...query }: PutApiKnowledgeNodesByIdParams,
      data: PutApiKnowledgeNodesByIdPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiKnowledgeNodesByIdData, any>({
        path: `/api/knowledge/nodes/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 设置节点的权限（替换现有所有权限）。 **路径参数：** - id: 节点UUID **请求体参数：** - permissions: 权限数组 - subjectType: "user" | "role" | "dept" - subjectId: 主体ID - permission: "read" | "write" | "delete" | "manage" - effect: "allow" | "deny"，默认 "allow" **权限检查：** - 需要是节点创建者或有 manage 权限 **返回：** - success: 是否成功 **示例：** ```json { "permissions": [ { "subjectType": "user", "subjectId": "user-uuid", "permission": "read" }, { "subjectType": "role", "subjectId": "role-uuid", "permission": "write" } ] } ```
     *
     * @tags knowledge, permission
     * @name PutApiKnowledgeNodesByIdPermissions
     * @summary 设置节点权限
     * @request PUT:/api/knowledge/nodes/{id}/permissions
     * @response `200` `PutApiKnowledgeNodesByIdPermissionsData` Response for status 200
     */
    putApiKnowledgeNodesByIdPermissions: (
      { id, ...query }: PutApiKnowledgeNodesByIdPermissionsParams,
      data: PutApiKnowledgeNodesByIdPermissionsPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiKnowledgeNodesByIdPermissionsData, any>({
        path: `/api/knowledge/nodes/${id}/permissions`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 保存文本文件内容（在线编辑保存）。 **路径参数：** - id: 文件节点UUID **请求体参数：** - content: 文件内容，必填，UTF-8字符串 **权限检查：** - 需要对该节点有 write 权限 **返回：** - 更新后的节点完整信息（包含新的 size） **使用场景：** - 在线文本编辑器保存 - Markdown 编辑保存 **示例：** ```json { "content": "# 标题\n\n这是更新后的内容" } ```
     *
     * @tags knowledge, content
     * @name PutApiKnowledgeNodesByIdText
     * @summary 保存文本内容
     * @request PUT:/api/knowledge/nodes/{id}/text
     * @response `200` `PutApiKnowledgeNodesByIdTextData` Response for status 200
     */
    putApiKnowledgeNodesByIdText: (
      { id, ...query }: PutApiKnowledgeNodesByIdTextParams,
      data: PutApiKnowledgeNodesByIdTextPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiKnowledgeNodesByIdTextData, any>({
        path: `/api/knowledge/nodes/${id}/text`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description 批量更新节点排序号。 **请求体参数：** - items: 排序项数组 - id: 节点UUID - orderNum: 新排序号（整数） **权限检查：** - 逐个检查 write 权限，无权限的节点会被跳过 **返回：** - success: 是否成功 - updatedCount: 实际更新的节点数量 **使用场景：** - 拖拽排序 - 自定义文件顺序 **示例：** ```json { "items": [ { "id": "uuid1", "orderNum": 1 }, { "id": "uuid2", "orderNum": 2 }, { "id": "uuid3", "orderNum": 3 } ] } ```
     *
     * @tags knowledge, operations
     * @name PutApiKnowledgeNodesOrder
     * @summary 更新节点排序
     * @request PUT:/api/knowledge/nodes/order
     * @response `200` `PutApiKnowledgeNodesOrderData` Response for status 200
     */
    putApiKnowledgeNodesOrder: (
      data: PutApiKnowledgeNodesOrderPayload,
      params: RequestParams = {},
    ) =>
      this.http.request<PutApiKnowledgeNodesOrderData, any>({
        path: `/api/knowledge/nodes/order`,
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
  public = {
    /**
     * @description 上传头像到公开存储，返回可直接访问的永久URL（无需签名）。 **请求体参数：** - category: 头像分类，必填，可选值： - "agent-avatar": AI Agent头像 - "user-avatar": 用户头像 - "group-avatar": 群组头像 - filename: 文件名，必填，1-255字符 - content: 图片内容，必填，Base64编码 - mimeType: MIME类型，必填，支持：image/jpeg, image/png, image/gif, image/webp, image/svg+xml **限制：** - 最大文件大小：2MB - 仅支持图片格式 **返回：** - success: 是否成功 - url: 公开访问URL（永久有效） - key: 存储路径 **示例：** ```json { "category": "user-avatar", "filename": "avatar.png", "content": "iVBORw0KGgoAAAANSUhEUgAA...", "mimeType": "image/png" } ```
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
  files = {
    /**
     * @description 获取已上传AI聊天附件的新预签名URL（7天有效）。 **请求体参数：** - storageKey: 存储路径，必填，上传时返回的storageKey **返回：** - url: 新的预签名下载URL - expiresAt: URL过期时间（ISO 8601格式） **使用场景：** - 原URL过期后重新获取访问链接 - 历史对话中的附件重新加载 **示例：** ```json { "storageKey": "ai-chat/user-id/1234567890-abc123-image.png" } ```
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
     * @description 上传文件到AI聊天存储，返回可访问的预签名URL（7天有效）。 **请求体参数：** - filename: 文件名，必填，1-255字符 - content: 文件内容，必填，Base64编码 - mimeType: MIME类型，必填，如 "image/png", "application/pdf" **返回：** - url: 预签名下载URL（7天有效） - storageKey: 存储路径，用于后续获取URL - mimeType: 文件MIME类型 - size: 文件大小（字节） **使用场景：** - AI对话中上传图片、文档等附件 - 支持多模态AI模型的文件输入 **示例：** ```json { "filename": "screenshot.png", "content": "iVBORw0KGgoAAAANSUhEUgAA...", "mimeType": "image/png" } ```
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
  };
  dev = {
    /**
     * @description 获取 Turborepo monorepo 项目的根目录路径。 **返回：** - root: 项目根目录绝对路径 - name: 项目名称（目录名） **使用场景：** - 开发模式下浏览项目代码结构 - 获取项目基础信息 **示例响应：** ```json { "root": "/home/user/ai-drive-system", "name": "ai-drive-system" } ```
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
     * @description 读取指定目录下的文件和子目录列表。 **请求体参数：** - relativePath: 相对于项目根目录的路径，可选，默认为根目录 "" **返回：** - items: 文件/目录列表，包含 name, path, type, size, extension - currentPath: 当前目录相对路径 **过滤规则：** - 自动忽略：node_modules, .git, .svelte-kit, dist, build 等 - 仅显示代码相关文件：.ts, .js, .svelte, .json, .md 等 **使用场景：** - 开发模式下浏览项目目录结构 - 代码文件导航 **示例：** ```json { "relativePath": "packages/actions/src" } ```
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
     * @description 读取指定代码文件的内容。 **请求体参数：** - relativePath: 相对于项目根目录的文件路径，必填 **返回：** - content: 文件内容（UTF-8） - path: 文件相对路径 - name: 文件名 - extension: 文件扩展名 - size: 文件大小（字节） - language: 编程语言（用于语法高亮） **限制：** - 最大文件大小：1MB - 路径必须在项目根目录内（安全检查） **使用场景：** - 开发模式下查看代码文件内容 - 代码审查和分析 **示例：** ```json { "relativePath": "packages/actions/src/core/define.ts" } ```
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
