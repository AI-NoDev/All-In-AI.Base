// IM (Instant Messaging) module entity translations
export const im = {
  // Conversation table
  conversation: {
    _meta: {
      name: 'im_conversation',
      displayName: 'Conversation',
      verboseName: 'Conversation',
      verboseNamePlural: 'Conversations',
    },
    fields: {
      type: 'Conversation Type',
      name: 'Conversation Name',
      avatar: 'Avatar',
      ownerId: 'Owner ID',
      lastMessageId: 'Last Message ID',
      lastMessageAt: 'Last Message Time',
      memberCount: 'Member Count',
      maxMembers: 'Max Members',
      isTop: 'Pinned',
      isMuted: 'Muted',
      announcement: 'Announcement',
      extra: 'Extra Data',
      status: 'Status',
    },
  },

  // Message table
  message: {
    _meta: {
      name: 'im_message',
      displayName: 'Message',
      verboseName: 'Message',
      verboseNamePlural: 'Messages',
    },
    fields: {
      conversationId: 'Conversation ID',
      msgSeq: 'Message Sequence',
      senderId: 'Sender ID',
      msgType: 'Message Type',
      content: 'Content',
      replyToId: 'Reply To Message ID',
      forwardFromId: 'Forward From Message ID',
      atUserIds: 'Mentioned User IDs',
      isRecalled: 'Is Recalled',
      recalledAt: 'Recalled At',
      recalledById: 'Recalled By',
      extra: 'Extra Data',
    },
  },

  // Group member table
  groupMember: {
    _meta: {
      name: 'im_group_member',
      displayName: 'Group Member',
      verboseName: 'Group Member',
      verboseNamePlural: 'Group Members',
    },
    fields: {
      conversationId: 'Conversation ID',
      userId: 'User ID',
      nickname: 'Nickname in Group',
      role: 'Role',
      invitedById: 'Invited By',
      joinedAt: 'Joined At',
      isMuted: 'Is Muted',
      mutedUntil: 'Muted Until',
      extra: 'Extra Data',
    },
  },

  // Conversation read status table
  conversationRead: {
    _meta: {
      name: 'im_conversation_read',
      displayName: 'Read Status',
      verboseName: 'Read Status',
      verboseNamePlural: 'Read Statuses',
    },
    fields: {
      conversationId: 'Conversation ID',
      userId: 'User ID',
      lastReadSeq: 'Last Read Sequence',
      lastReadAt: 'Last Read At',
      unreadCount: 'Unread Count',
    },
  },

  // Temporary file table
  tempFile: {
    _meta: {
      name: 'im_temp_file',
      displayName: 'Temporary File',
      verboseName: 'Temporary File',
      verboseNamePlural: 'Temporary Files',
    },
    fields: {
      conversationId: 'Conversation ID',
      messageId: 'Message ID',
      name: 'File Name',
      originalName: 'Original Name',
      extension: 'Extension',
      mimeType: 'MIME Type',
      size: 'File Size',
      storageKey: 'Storage Key',
      bucket: 'Bucket',
      region: 'Region',
      etag: 'ETag',
      expiresAt: 'Expires At',
      metadata: 'Metadata',
      status: 'Status',
    },
  },

  // Conversation hidden table
  conversationHidden: {
    _meta: {
      name: 'im_conversation_hidden',
      displayName: 'Hidden Conversation',
      verboseName: 'Hidden Conversation',
      verboseNamePlural: 'Hidden Conversations',
    },
    fields: {
      conversationId: 'Conversation ID',
      userId: 'User ID',
      isHidden: 'Is Hidden',
      hiddenAt: 'Hidden At',
    },
  },
};
