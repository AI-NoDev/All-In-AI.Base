// AI 模块实体翻译
export const ai = {
  // AI提供商表
  provider: {
    _meta: {
      name: 'ai_provider',
      displayName: 'AI提供商',
      verboseName: '提供商',
      verboseNamePlural: '提供商列表',
    },
    fields: {
      name: '提供商名称',
      baseUrl: 'API地址',
      token: 'API密钥',
      remark: '备注',
      status: '状态',
    },
  },

  // AI模型表
  model: {
    _meta: {
      name: 'ai_model',
      displayName: 'AI模型',
      verboseName: '模型',
      verboseNamePlural: '模型列表',
    },
    fields: {
      providerId: '提供商ID',
      name: '模型名称',
      modelId: '模型标识',
      remark: '备注',
      status: '状态',
      supportTools: '支持工具',
      maxTokens: '最大Token',
      inputCapabilities: '输入能力',
      outputCapabilities: '输出能力',
    },
  },

  // Agent表
  agent: {
    _meta: {
      name: 'ai_agent',
      displayName: 'AI Agent',
      verboseName: 'Agent',
      verboseNamePlural: 'Agent列表',
    },
    fields: {
      name: 'Agent名称',
      description: '描述',
      avatar: '头像',
      color: '主题颜色',
      providerId: '提供商ID',
      modelId: '模型ID',
      systemPrompt: '系统提示词',
      toolIds: '工具',
      nativeTools: '原生工具',
      temperature: '温度参数',
      supportLoop: '支持循环',
      maxLoops: '最大循环次数',
      contextStrategy: '上下文压缩策略',
      remark: '备注',
      status: '状态',
    },
  },

  // 工具表
  tool: {
    _meta: {
      name: 'ai_tool',
      displayName: 'AI工具',
      verboseName: '工具',
      verboseNamePlural: '工具列表',
    },
    fields: {
      groupId: '分组ID',
      name: '工具名称',
      description: '描述',
      inputSchema: '输入参数',
      outputSchema: '输出参数',
      isAsync: '异步执行',
      implementation: '实现代码',
      remark: '备注',
      status: '状态',
    },
  },

  // 工具分组表
  toolGroup: {
    _meta: {
      name: 'ai_tool_group',
      displayName: '工具分组',
      verboseName: '工具分组',
      verboseNamePlural: '工具分组列表',
    },
    fields: {
      name: '分组名称',
      description: '描述',
      icon: '图标',
      tools: '工具列表',
      orderNum: '排序',
      remark: '备注',
      status: '状态',
    },
  },


  // Agent会话表
  agentSession: {
    _meta: {
      name: 'ai_agent_session',
      displayName: 'Agent会话',
      verboseName: '会话',
      verboseNamePlural: '会话列表',
    },
    fields: {
      agentId: 'Agent ID',
      userId: '用户ID',
      title: '会话标题',
      summary: '摘要',
      messageCount: '消息数量',
      tokenUsage: 'Token用量',
      lastMessageAt: '最后消息时间',
      isArchived: '是否归档',
      isPinned: '是否置顶',
      extra: '扩展数据',
      status: '状态',
    },
  },

  // Agent消息表
  agentMessage: {
    _meta: {
      name: 'ai_agent_message',
      displayName: 'Agent消息',
      verboseName: '消息',
      verboseNamePlural: '消息列表',
    },
    fields: {
      sessionId: '会话ID',
      msgSeq: '消息序号',
      role: '角色',
      content: '内容',
      contentType: '内容类型',
      toolCalls: '工具调用',
      toolResults: '工具结果',
      tokenCount: 'Token数量',
      modelId: '模型ID',
      latencyMs: '延迟(毫秒)',
      finishReason: '结束原因',
      extra: '扩展数据',
    },
  },
};
