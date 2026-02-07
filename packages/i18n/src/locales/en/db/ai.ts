// AI module entity translations
export const ai = {
  provider: {
    _meta: {
      name: 'ai_provider',
      displayName: 'AI Provider',
      verboseName: 'Provider',
      verboseNamePlural: 'Providers',
    },
    fields: {
      name: 'Provider Name',
      baseUrl: 'API URL',
      token: 'API Key',
      remark: 'Remark',
      status: 'Status',
    },
  },

  model: {
    _meta: {
      name: 'ai_model',
      displayName: 'AI Model',
      verboseName: 'Model',
      verboseNamePlural: 'Models',
    },
    fields: {
      providerId: 'Provider ID',
      name: 'Model Name',
      modelId: 'Model ID',
      remark: 'Remark',
      status: 'Status',
      supportTools: 'Support Tools',
      maxTokens: 'Max Tokens',
      inputCapabilities: 'Input Capabilities',
      outputCapabilities: 'Output Capabilities',
    },
  },

  agent: {
    _meta: {
      name: 'ai_agent',
      displayName: 'AI Agent',
      verboseName: 'Agent',
      verboseNamePlural: 'Agents',
    },
    fields: {
      name: 'Agent Name',
      description: 'Description',
      avatar: 'Avatar',
      color: 'Theme Color',
      providerId: 'Provider ID',
      modelId: 'Model ID',
      systemPrompt: 'System Prompt',
      toolIds: 'Tools',
      nativeTools: 'Native Tools',
      temperature: 'Temperature',
      supportLoop: 'Support Loop',
      maxLoops: 'Max Loops',
      contextStrategy: 'Context Strategy',
      inputSchema: 'Input Schema',
      structuredOutput: 'Structured Output',
      outputSchema: 'Output Schema',
      remark: 'Remark',
      status: 'Status',
    },
  },

  tool: {
    _meta: {
      name: 'ai_tool',
      displayName: 'AI Tool',
      verboseName: 'Tool',
      verboseNamePlural: 'Tools',
    },
    fields: {
      groupId: 'Group ID',
      name: 'Tool Name',
      description: 'Description',
      inputSchema: 'Input Schema',
      outputSchema: 'Output Schema',
      isAsync: 'Async Execution',
      implementation: 'Implementation',
      remark: 'Remark',
      status: 'Status',
    },
  },

  toolGroup: {
    _meta: {
      name: 'ai_tool_group',
      displayName: 'Tool Group',
      verboseName: 'Tool Group',
      verboseNamePlural: 'Tool Groups',
    },
    fields: {
      name: 'Group Name',
      description: 'Description',
      icon: 'Icon',
      tools: 'Tools',
      orderNum: 'Sort Order',
      remark: 'Remark',
      status: 'Status',
    },
  },

  agentSession: {
    _meta: {
      name: 'ai_agent_session',
      displayName: 'Agent Session',
      verboseName: 'Session',
      verboseNamePlural: 'Sessions',
    },
    fields: {
      agentId: 'Agent ID',
      userId: 'User ID',
      title: 'Session Title',
      summary: 'Summary',
      messageCount: 'Message Count',
      tokenUsage: 'Token Usage',
      lastMessageAt: 'Last Message Time',
      isArchived: 'Is Archived',
      isPinned: 'Is Pinned',
      extra: 'Extra Data',
      status: 'Status',
    },
  },

  agentMessage: {
    _meta: {
      name: 'ai_agent_message',
      displayName: 'Agent Message',
      verboseName: 'Message',
      verboseNamePlural: 'Messages',
    },
    fields: {
      sessionId: 'Session ID',
      msgSeq: 'Message Sequence',
      role: 'Role',
      content: 'Content',
      contentType: 'Content Type',
      toolCalls: 'Tool Calls',
      toolResults: 'Tool Results',
      tokenCount: 'Token Count',
      modelId: 'Model ID',
      latencyMs: 'Latency (ms)',
      finishReason: 'Finish Reason',
      extra: 'Extra Data',
    },
  },

  schema: {
    _meta: {
      name: 'ai_schema',
      displayName: 'Schema Definition',
      verboseName: 'Schema',
      verboseNamePlural: 'Schemas',
    },
    fields: {
      name: 'Schema Name',
      description: 'Description',
      schema: 'Schema Content',
      remark: 'Remark',
      status: 'Status',
    },
  },
};
