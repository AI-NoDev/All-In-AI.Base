/**
 * AI Chat Store
 * 管理 AI 聊天状态：会话、消息、模型/智能体选择
 * 会话和消息持久化到数据库
 * 
 * 重构说明：
 * - Session 不再绑定 Agent，可以随时切换模型或智能体
 * - Agent/Model 选择放到每条消息上
 * - 可以不选择智能体，直接使用模型对话
 */

import { authStore } from './auth.svelte';
import { 
  PostApiAiAgentSessionQueryFieldEnum, 
  PostApiAiAgentSessionQueryOrderEnum 
} from '@qiyu-allinai/api';

// 消息内容部分类型
export interface TextContentPart {
  type: 'text';
  text: string;
  reasoning?: string;
}

export interface FileContentPart {
  type: 'file';
  mediaType: string;
  url: string;
}

export type MessageContentPart = TextContentPart | FileContentPart;

// content 可以是单个对象或数组
export type MessageContent = MessageContentPart | MessageContentPart[] | string;

// Token usage type (matches AI SDK LanguageModelUsage)
export interface TokenUsage {
  totalTokens?: number;
  inputTokens?: number;
  outputTokens?: number;
  inputTokenDetails?: {
    noCacheTokens?: number;
    cacheReadTokens?: number;
    cacheWriteTokens?: number;
  };
  outputTokenDetails?: {
    textTokens?: number;
    reasoningTokens?: number;
  };
}

export interface AISessionMessage {
  id: string;
  sessionId: string;
  msgSeq: number;
  role: 'user' | 'assistant' | 'system';
  content: MessageContent;
  contentType: string;
  tokenUsage?: TokenUsage;
  latencyMs?: number;
  createdAt: string;
}

export interface AISession {
  id: string;
  userId: string;
  agentId: string | null;
  providerId: string | null;
  modelId: string | null;
  title: string | null;
  summary: string | null;
  messageCount: number;
  lastMessageAt: string | null;
  isArchived: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AIProvider {
  id: string;
  name: string;
}

export interface AIModel {
  id: string;
  name: string;
  modelId: string;
  providerId: string;
  // 输入能力
  supportImageInput: boolean;
  supportAudioInput: boolean;
  supportVideoInput: boolean;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string | null;
  avatar: string | null;
  color: string | null;
  modelId: string;
  providerId: string;
  systemPrompt: string | null;
}

const PANEL_STATE_KEY = 'ai-chat-panel-state';
const SELECTION_KEY = 'ai-chat-selection';
const SESSION_KEY = 'ai-chat-current-session';

function createAIChatStore() {
  // 会话列表
  let sessions = $state<AISession[]>([]);
  // 当前会话 ID
  let currentSessionId = $state<string | null>(null);
  // 当前会话的消息（从数据库加载）
  let currentMessages = $state<AISessionMessage[]>([]);
  // 可用提供商列表
  let providers = $state<AIProvider[]>([]);
  // 可用模型列表
  let models = $state<AIModel[]>([]);
  // 可用智能体列表
  let agents = $state<AIAgent[]>([]);
  // 选中的提供商 ID
  let selectedProviderId = $state<string | null>(null);
  // 选中的模型 ID
  let selectedModelId = $state<string | null>(null);
  // 选中的智能体 ID（可为空）
  let selectedAgentId = $state<string | null>(null);
  // 面板是否展开
  let isPanelOpen = $state(false);
  // 面板宽度百分比
  let panelSize = $state(25);
  // 是否正在加载
  let isLoading = $state(false);
  // 是否正在发送消息
  let isSending = $state(false);
  // 是否正在加载消息
  let isLoadingMessages = $state(false);

  // 当前会话
  const currentSession = $derived(
    sessions.find(s => s.id === currentSessionId) || null
  );

  // 当前选中的提供商
  const selectedProvider = $derived(
    providers.find(p => p.id === selectedProviderId) || null
  );

  // 根据选中的提供商过滤模型
  const filteredModels = $derived(
    selectedProviderId ? models.filter(m => m.providerId === selectedProviderId) : models
  );

  // 当前选中的模型
  const selectedModel = $derived(
    models.find(m => m.id === selectedModelId) || null
  );

  // 当前选中的智能体（可为空）
  const selectedAgent = $derived(
    selectedAgentId ? agents.find(a => a.id === selectedAgentId) || null : null
  );

  // 检查智能体模型是否匹配当前选中模型
  const isAgentModelMismatch = $derived(
    selectedAgent && selectedModelId && selectedAgent.modelId !== selectedModelId
  );

  // 是否可以发送消息（需要选择模型或智能体）
  const canSendMessage = $derived(
    selectedModelId !== null || selectedAgentId !== null
  );

  // 占位符 UUID（旧 API 兼容用）
  const PLACEHOLDER_AGENT_ID = '00000000-0000-0000-0000-000000000000';

  function loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    // 加载面板状态
    const panelState = localStorage.getItem(PANEL_STATE_KEY);
    if (panelState) {
      try {
        const parsed = JSON.parse(panelState);
        isPanelOpen = parsed.isPanelOpen ?? false;
        panelSize = parsed.panelSize ?? 25;
      } catch {
        // 解析失败，使用默认值
      }
    }

    // 加载选择状态
    const selection = localStorage.getItem(SELECTION_KEY);
    if (selection) {
      try {
        const parsed = JSON.parse(selection);
        selectedProviderId = parsed.selectedProviderId || null;
        selectedModelId = parsed.selectedModelId || null;
        // 过滤掉占位符 UUID
        const agentId = parsed.selectedAgentId || null;
        selectedAgentId = agentId === PLACEHOLDER_AGENT_ID ? null : agentId;
      } catch {
        // 解析失败，使用默认值
      }
    }

    // 加载当前会话 ID
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      currentSessionId = sessionId;
    }
  }

  function saveSessionToStorage(): void {
    if (typeof window === 'undefined') return;
    if (currentSessionId) {
      localStorage.setItem(SESSION_KEY, currentSessionId);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  function saveSelectionToStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SELECTION_KEY, JSON.stringify({
      selectedProviderId,
      selectedModelId,
      selectedAgentId,
    }));
  }

  function savePanelState(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PANEL_STATE_KEY, JSON.stringify({
      isPanelOpen,
      panelSize,
    }));
  }

  async function loadModelsAndAgents(): Promise<void> {
    isLoading = true;
    try {
      const api = authStore.createApi(true);
      
      // 加载提供商列表
      const providersRes = await api.ai.postApiAiProviderQuery({
        filter: { status: '0' },
        limit: 100,
        offset: 0,
      });
      if (providersRes.data?.data) {
        providers = providersRes.data.data.map((p: { id: string; name: string }) => ({
          id: p.id,
          name: p.name,
        }));
      }

      // 加载模型列表
      const modelsRes = await api.ai.postApiAiModelQuery({
        filter: { status: '0' },
        limit: 100,
        offset: 0,
      });
      if (modelsRes.data?.data) {
        models = modelsRes.data.data.map((m: { 
          id: string; 
          name: string; 
          modelId: string; 
          providerId: string;
          supportImageInput?: boolean;
          supportAudioInput?: boolean;
          supportVideoInput?: boolean;
        }) => ({
          id: m.id,
          name: m.name,
          modelId: m.modelId,
          providerId: m.providerId,
          supportImageInput: m.supportImageInput ?? false,
          supportAudioInput: m.supportAudioInput ?? false,
          supportVideoInput: m.supportVideoInput ?? false,
        }));
      }

      // 加载智能体列表
      const agentsRes = await api.ai.postApiAiAgentQuery({
        filter: { status: '0' },
        limit: 100,
        offset: 0,
      });
      if (agentsRes.data?.data) {
        agents = agentsRes.data.data.map((a: { id: string; name: string; description: string | null; avatar: string | null; color: string | null; modelId: string; providerId: string; systemPrompt: string | null }) => ({
          id: a.id,
          name: a.name,
          description: a.description,
          avatar: a.avatar,
          color: a.color,
          modelId: a.modelId,
          providerId: a.providerId,
          systemPrompt: a.systemPrompt,
        }));
      }

      // 如果没有选中提供商，默认选中第一个
      if (!selectedProviderId && providers.length > 0) {
        selectedProviderId = providers[0].id;
      }
      // 如果没有选中模型，默认选中当前提供商的第一个模型
      if (!selectedModelId && selectedProviderId) {
        const providerModels = models.filter(m => m.providerId === selectedProviderId);
        if (providerModels.length > 0) {
          selectedModelId = providerModels[0].id;
        }
      }
    } catch (e) {
      console.error('Failed to load models and agents:', e);
    } finally {
      isLoading = false;
    }
  }

  async function loadSessions(): Promise<void> {
    if (!authStore.user?.id) return;
    
    try {
      const api = authStore.createApi(true);
      // 暂时使用旧的 agentSession API，等新 API 生成后更新
      const res = await api.ai.postApiAiAgentSessionQuery({
        filter: { 
          userId: authStore.user.id,
          isArchived: false,
        },
        sort: { 
          field: PostApiAiAgentSessionQueryFieldEnum.CreatedAt, 
          order: PostApiAiAgentSessionQueryOrderEnum.Desc 
        },
        limit: 50,
        offset: 0,
      });
      
      if (res.data?.data) {
        // 映射旧的 agentSession 到新的 AISession 格式
        sessions = res.data.data.map((s: Record<string, unknown>) => ({
          id: s.id as string,
          userId: s.userId as string,
          agentId: (s.agentId as string | null) || null,
          providerId: (s.providerId as string | null) || null,
          modelId: (s.modelId as string | null) || null,
          title: s.title as string | null,
          summary: s.summary as string | null,
          messageCount: s.messageCount as number,
          lastMessageAt: s.lastMessageAt as string | null,
          isArchived: s.isArchived as boolean,
          isPinned: s.isPinned as boolean,
          createdAt: s.createdAt as string,
          updatedAt: s.updatedAt as string,
        }));
      }
    } catch (e) {
      console.error('Failed to load sessions:', e);
    }
  }

  async function loadSessionMessages(sessionId: string): Promise<void> {
    isLoadingMessages = true;
    try {
      const api = authStore.createApi(true);
      // 暂时使用旧的 agentMessage API
      const res = await api.ai.getApiAiAgentMessageHistoryBySessionId({
        sessionId,
        limit: 100,
      });
      
      if (res.data) {
        currentMessages = (res.data as AISessionMessage[]).map(m => ({
          ...m,
          content: typeof m.content === 'string' ? m.content : m.content,
        }));
      }
    } catch (e) {
      console.error('Failed to load session messages:', e);
      currentMessages = [];
    } finally {
      isLoadingMessages = false;
    }
  }

  async function createSession(): Promise<string> {
    const api = authStore.createApi(true);
    // 创建会话时包含当前选中的模型/智能体
    const res = await api.ai.postApiAiAgentSession({
      data: {
        agentId: selectedAgentId || PLACEHOLDER_AGENT_ID, // 占位符（旧API兼容）
        providerId: selectedProviderId || undefined,
        modelId: selectedModelId || undefined,
        userId: authStore.user?.id || '',
        title: '新对话',
        createdBy: authStore.user?.name || '',
        updatedBy: authStore.user?.name || '',
      },
    });
    
    if (res.data) {
      const newSession: AISession = {
        id: res.data.id as string,
        userId: res.data.userId as string,
        agentId: selectedAgentId,
        providerId: selectedProviderId,
        modelId: selectedModelId,
        title: res.data.title as string | null,
        summary: res.data.summary as string | null,
        messageCount: res.data.messageCount as number,
        lastMessageAt: res.data.lastMessageAt as string | null,
        isArchived: res.data.isArchived as boolean,
        isPinned: res.data.isPinned as boolean,
        createdAt: res.data.createdAt as string,
        updatedAt: res.data.updatedAt as string,
      };
      sessions = [newSession, ...sessions];
      currentSessionId = newSession.id;
      currentMessages = [];
      saveSessionToStorage();
      return newSession.id;
    }
    
    throw new Error('创建会话失败');
  }

  async function selectSession(sessionId: string): Promise<void> {
    currentSessionId = sessionId;
    saveSessionToStorage();
    // 加载会话消息
    await loadSessionMessages(sessionId);
    
    // 从会话恢复模型/智能体选择
    restoreSelectionFromSession(sessionId);
  }

  // 从会话恢复模型/智能体选择（不加载消息）
  function restoreSelectionFromSession(sessionId: string): void {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      // 检查 agentId 是否有效（不是占位符且对应的 agent 存在）
      const isValidAgentId = session.agentId && 
        session.agentId !== PLACEHOLDER_AGENT_ID &&
        agents.some(a => a.id === session.agentId);
      
      if (isValidAgentId) {
        // 会话有有效的智能体，恢复智能体及其模型
        selectedAgentId = session.agentId;
        const agent = agents.find(a => a.id === session.agentId);
        if (agent) {
          selectedModelId = agent.modelId;
          selectedProviderId = agent.providerId;
        } else if (session.modelId) {
          // 智能体不存在，使用会话保存的模型
          selectedModelId = session.modelId;
          selectedProviderId = session.providerId;
        }
      } else if (session.modelId) {
        // 会话只有模型（或 agentId 无效），恢复模型
        selectedModelId = session.modelId;
        selectedProviderId = session.providerId;
        selectedAgentId = null;
      } else {
        // 会话没有有效的模型/智能体信息，清空 agentId
        selectedAgentId = null;
      }
    }
    saveSelectionToStorage();
  }

  async function deleteSession(sessionId: string): Promise<void> {
    try {
      const api = authStore.createApi(true);
      // 暂时使用旧的 agentSession API
      await api.ai.deleteApiAiAgentSessionById({ id: sessionId });
      
      sessions = sessions.filter(s => s.id !== sessionId);
      if (currentSessionId === sessionId) {
        currentSessionId = sessions.length > 0 ? sessions[0].id : null;
        saveSessionToStorage();
        if (currentSessionId) {
          await loadSessionMessages(currentSessionId);
        } else {
          currentMessages = [];
        }
      }
    } catch (e) {
      console.error('Failed to delete session:', e);
    }
  }

  async function clearSessions(): Promise<void> {
    // 逐个删除所有会话
    for (const session of sessions) {
      try {
        const api = authStore.createApi(true);
        // 暂时使用旧的 agentSession API
        await api.ai.deleteApiAiAgentSessionById({ id: session.id });
      } catch (e) {
        console.error('Failed to delete session:', session.id, e);
      }
    }
    sessions = [];
    currentSessionId = null;
    currentMessages = [];
    saveSessionToStorage();
  }

  async function saveMessage(message: { 
    role: 'user' | 'assistant'; 
    content: string; 
    reasoning?: string;
    attachments?: Array<{ type: 'file'; mediaType: string; url: string }>;
    tokenUsage?: TokenUsage;
  }): Promise<AISessionMessage | null> {
    if (!currentSessionId) return null;
    
    try {
      const api = authStore.createApi(true);
      
      // 构建 content 数组
      const contentParts: MessageContentPart[] = [];
      
      // 添加附件
      if (message.attachments && message.attachments.length > 0) {
        for (const attachment of message.attachments) {
          contentParts.push({
            type: 'file',
            mediaType: attachment.mediaType,
            url: attachment.url,
          });
        }
      }
      
      // 添加文本内容
      if (message.content) {
        const textPart: TextContentPart = {
          type: 'text',
          text: message.content,
        };
        if (message.reasoning) {
          textPart.reasoning = message.reasoning;
        }
        contentParts.push(textPart);
      }
      
      // 如果只有一个文本部分且没有附件，使用单个对象格式（向后兼容）
      const contentValue: MessageContent = contentParts.length === 1 && contentParts[0].type === 'text'
        ? contentParts[0]
        : contentParts;
      
      const messageData = {
        sessionId: currentSessionId,
        role: message.role,
        content: contentValue,
        contentType: contentParts.some(p => p.type === 'file') ? '04' : '01', // 04=混合, 01=文本
        tokenUsage: message.tokenUsage,
      };
      const res = await api.ai.postApiAiAgentMessage({
        data: messageData as typeof messageData & { msgSeq: number },
      });
      
      if (res.data) {
        const newMessage: AISessionMessage = {
          id: res.data.id as string,
          sessionId: res.data.sessionId as string,
          msgSeq: res.data.msgSeq as number,
          role: res.data.role as 'user' | 'assistant' | 'system',
          content: res.data.content as MessageContent,
          contentType: res.data.contentType as string,
          tokenUsage: res.data.tokenUsage as TokenUsage | undefined,
          createdAt: res.data.createdAt as string,
        };
        currentMessages = [...currentMessages, newMessage];
        
        // 更新会话列表中的消息数和最后消息时间
        sessions = sessions.map(s => 
          s.id === currentSessionId 
            ? { ...s, messageCount: s.messageCount + 1, lastMessageAt: newMessage.createdAt }
            : s
        );
        
        return newMessage;
      }
    } catch (e) {
      console.error('Failed to save message:', e);
    }
    return null;
  }

  async function updateSessionTitle(title: string): Promise<void> {
    if (!currentSessionId) return;
    
    try {
      const api = authStore.createApi(true);
      // 暂时使用旧的 agentSession API
      await api.ai.putApiAiAgentSessionById({ id: currentSessionId }, {
        data: {
          title,
          updatedBy: authStore.user?.name || '',
        },
      });
      
      sessions = sessions.map(s => 
        s.id === currentSessionId ? { ...s, title } : s
      );
    } catch (e) {
      console.error('Failed to update session title:', e);
    }
  }

  // 检查当前会话的模型/智能体是否与选中的匹配
  function isSessionModelMismatch(): boolean {
    if (!currentSession) return false;
    // 如果会话没有消息，不算不匹配
    if (currentSession.messageCount === 0) return false;
    
    if (selectedAgentId) {
      return currentSession.agentId !== selectedAgentId;
    }
    return currentSession.modelId !== selectedModelId;
  }

  // 切换模型/智能体时，如果当前会话有消息且模型不匹配，创建新会话
  async function ensureSessionForCurrentSelection(): Promise<void> {
    if (isSessionModelMismatch()) {
      await createSession();
    } else if (currentSession && currentSession.messageCount === 0) {
      // 如果当前会话没有消息，更新会话的模型/智能体
      try {
        const api = authStore.createApi(true);
        await api.ai.putApiAiAgentSessionById({ id: currentSession.id }, {
          data: {
            updatedBy: authStore.user?.name || '',
          },
        });
        // 更新本地会话数据
        sessions = sessions.map(s => 
          s.id === currentSession.id 
            ? { ...s, agentId: selectedAgentId, providerId: selectedProviderId, modelId: selectedModelId }
            : s
        );
      } catch (e) {
        console.error('Failed to update session:', e);
      }
    }
  }

  function setSelectedModel(modelId: string | null): void {
    selectedModelId = modelId;
    // 切换模型时，清空智能体选择
    selectedAgentId = null;
    saveSelectionToStorage();
  }

  function setSelectedProvider(providerId: string | null): void {
    selectedProviderId = providerId;
    // 切换提供商时，清空模型和智能体选择
    selectedModelId = null;
    selectedAgentId = null;
    // 自动选择该提供商的第一个模型
    if (providerId) {
      const providerModels = models.filter(m => m.providerId === providerId);
      if (providerModels.length > 0) {
        selectedModelId = providerModels[0].id;
      }
    }
    saveSelectionToStorage();
  }

  function setSelectedAgent(agentId: string | null): void {
    selectedAgentId = agentId;
    // 选择智能体时，自动设置对应的模型和提供商
    if (agentId) {
      const agent = agents.find(a => a.id === agentId);
      if (agent) {
        selectedModelId = agent.modelId;
        selectedProviderId = agent.providerId;
      }
    }
    saveSelectionToStorage();
  }

  function clearAgentSelection(): void {
    selectedAgentId = null;
    saveSelectionToStorage();
  }

  function useAgentDefaultModel(): void {
    if (selectedAgent) {
      setSelectedModel(selectedAgent.modelId);
    }
  }

  function togglePanel(): void {
    isPanelOpen = !isPanelOpen;
    savePanelState();
  }

  function setPanelOpen(open: boolean): void {
    isPanelOpen = open;
    savePanelState();
  }

  function setPanelSize(size: number): void {
    panelSize = size;
    savePanelState();
  }

  async function init(): Promise<void> {
    loadFromStorage();
    await loadModelsAndAgents();
    await loadSessions();
    
    // 如果有保存的会话 ID，验证并加载消息
    if (currentSessionId) {
      const sessionExists = sessions.some(s => s.id === currentSessionId);
      if (sessionExists) {
        await loadSessionMessages(currentSessionId);
        // 从会话恢复模型/智能体选择
        restoreSelectionFromSession(currentSessionId);
      } else {
        // 会话不存在，清除保存的 ID，选择最新的会话
        currentSessionId = sessions.length > 0 ? sessions[0].id : null;
        saveSessionToStorage();
        if (currentSessionId) {
          await loadSessionMessages(currentSessionId);
          restoreSelectionFromSession(currentSessionId);
        }
      }
    } else if (sessions.length > 0) {
      // 没有保存的会话 ID，默认选择最新的会话
      currentSessionId = sessions[0].id;
      saveSessionToStorage();
      await loadSessionMessages(currentSessionId);
      restoreSelectionFromSession(currentSessionId);
    }
  }

  return {
    // State getters
    get sessions() { return sessions; },
    get currentSessionId() { return currentSessionId; },
    get currentSession() { return currentSession; },
    get currentMessages() { return currentMessages; },
    get providers() { return providers; },
    get models() { return models; },
    get filteredModels() { return filteredModels; },
    get agents() { return agents; },
    get selectedProviderId() { return selectedProviderId; },
    get selectedModelId() { return selectedModelId; },
    get selectedAgentId() { return selectedAgentId; },
    get selectedProvider() { return selectedProvider; },
    get selectedModel() { return selectedModel; },
    get selectedAgent() { return selectedAgent; },
    get isAgentModelMismatch() { return isAgentModelMismatch; },
    get canSendMessage() { return canSendMessage; },
    get isPanelOpen() { return isPanelOpen; },
    get panelSize() { return panelSize; },
    get isLoading() { return isLoading; },
    get isSending() { return isSending; },
    get isLoadingMessages() { return isLoadingMessages; },
    set isSending(value: boolean) { isSending = value; },
    // Actions
    init,
    loadSessions,
    loadSessionMessages,
    createSession,
    selectSession,
    deleteSession,
    clearSessions,
    saveMessage,
    updateSessionTitle,
    setSelectedProvider,
    setSelectedModel,
    setSelectedAgent,
    clearAgentSelection,
    useAgentDefaultModel,
    togglePanel,
    setPanelOpen,
    setPanelSize,
    isSessionModelMismatch,
    ensureSessionForCurrentSelection,
  };
}

export const aiChatStore = createAIChatStore();
