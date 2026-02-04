// IM (即时通讯) 模块实体翻译
export const im = {
  // 会话表
  conversation: {
    _meta: {
      name: 'im_conversation',
      displayName: '会话',
      verboseName: '会话',
      verboseNamePlural: '会话列表',
    },
    fields: {
      type: '会话类型',
      name: '会话名称',
      avatar: '头像',
      ownerId: '所有者ID',
      lastMessageId: '最后消息ID',
      lastMessageAt: '最后消息时间',
      memberCount: '成员数量',
      maxMembers: '最大成员数',
      isTop: '是否置顶',
      isMuted: '是否免打扰',
      announcement: '群公告',
      extra: '扩展数据',
      status: '状态',
    },
  },

  // 消息表
  message: {
    _meta: {
      name: 'im_message',
      displayName: '消息',
      verboseName: '消息',
      verboseNamePlural: '消息列表',
    },
    fields: {
      conversationId: '会话ID',
      msgSeq: '消息序号',
      senderId: '发送者ID',
      msgType: '消息类型',
      content: '消息内容',
      replyToId: '回复消息ID',
      forwardFromId: '转发来源ID',
      atUserIds: '@用户ID列表',
      isRecalled: '是否撤回',
      recalledAt: '撤回时间',
      recalledById: '撤回者ID',
      extra: '扩展数据',
    },
  },

  // 群成员表
  groupMember: {
    _meta: {
      name: 'im_group_member',
      displayName: '群成员',
      verboseName: '群成员',
      verboseNamePlural: '群成员列表',
    },
    fields: {
      conversationId: '会话ID',
      userId: '用户ID',
      nickname: '群内昵称',
      role: '角色',
      invitedById: '邀请人ID',
      joinedAt: '加入时间',
      isMuted: '是否禁言',
      mutedUntil: '禁言截止时间',
      extra: '扩展数据',
    },
  },

  // 会话已读状态表
  conversationRead: {
    _meta: {
      name: 'im_conversation_read',
      displayName: '已读状态',
      verboseName: '已读状态',
      verboseNamePlural: '已读状态列表',
    },
    fields: {
      conversationId: '会话ID',
      userId: '用户ID',
      lastReadSeq: '最后已读序号',
      lastReadAt: '最后已读时间',
      unreadCount: '未读数量',
    },
  },

  // 临时文件表
  tempFile: {
    _meta: {
      name: 'im_temp_file',
      displayName: '临时文件',
      verboseName: '临时文件',
      verboseNamePlural: '临时文件列表',
    },
    fields: {
      conversationId: '会话ID',
      messageId: '消息ID',
      name: '文件名称',
      originalName: '原始文件名',
      extension: '扩展名',
      mimeType: 'MIME类型',
      size: '文件大小',
      storageKey: '存储键',
      bucket: '存储桶',
      region: '区域',
      etag: 'ETag',
      expiresAt: '过期时间',
      metadata: '元数据',
      status: '状态',
    },
  },

  // 会话隐藏表
  conversationHidden: {
    _meta: {
      name: 'im_conversation_hidden',
      displayName: '隐藏会话',
      verboseName: '隐藏会话',
      verboseNamePlural: '隐藏会话列表',
    },
    fields: {
      conversationId: '会话ID',
      userId: '用户ID',
      isHidden: '是否隐藏',
      hiddenAt: '隐藏时间',
    },
  },
};
