import { authStore } from './auth.svelte';
import { wsStore } from './websocket.svelte';
import { 
  PostApiImConversationQueryFieldEnum, 
  PostApiImConversationQueryOrderEnum,
  PostApiImMessageQueryFieldEnum,
  PostApiImMessageQueryOrderEnum
} from '@/lib/api/Api';

// ============ Types ============
interface Conversation {
  id: string;
  type: string;
  name: string | null;
  avatar: string | null;
  ownerId: string | null;
  lastMessageId: string | null;
  lastMessageAt: string | null;
  memberCount: number;
  isTop: boolean;
  isMuted: boolean;
  status: string | null;
}

interface ConversationWithUnread extends Conversation {
  unreadCount: number;
  lastMessageContent: string | null;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  msgType: string;
  msgSeq: number;
  content: MessageContent;
  replyToId: string | null;
  atUserIds: string[];
  isRecalled: boolean;
  createdAt: string;
}

interface MessageContent {
  text?: string;
  fileId?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  downloadUrl?: string;
  [key: string]: unknown;
}

interface User {
  id: string;
  name: string | null;
  loginName: string;
  avatar: string | null;
}

interface GroupMember {
  conversationId: string;
  userId: string;
}

interface ConversationRead {
  conversationId: string;
  userId: string;
  unreadCount: number;
}

interface ImState {
  conversations: ConversationWithUnread[];
  selectedConversationId: string | null;
  messages: Message[];
  users: Map<string, User>;
  hiddenConversationIds: Set<string>;
  isLoading: boolean;
  isLoadingMessages: boolean;
  isLoadingMoreMessages: boolean;
  hasMoreMessages: boolean;
  totalUnreadCount: number;
}

// ============ Store ============
function createImStore() {
  let state = $state<ImState>({
    conversations: [],
    selectedConversationId: null,
    messages: [],
    users: new Map(),
    hiddenConversationIds: new Set(),
    isLoading: false,
    isLoadingMessages: false,
    isLoadingMoreMessages: false,
    hasMoreMessages: true,
    totalUnreadCount: 0,
  });

  const api = authStore.createApi(true);
  let unsubscribers: (() => void)[] = [];
  let newMessageListeners: ((msg: Message) => void)[] = [];
  const PAGE_SIZE = 20;

  // ============ Helpers ============
  function formatMessagePreview(msg: Message): string {
    if (msg.isRecalled) return '[消息已撤回]';
    
    switch (msg.msgType) {
      case '01': return msg.content?.text || '';
      case '02': return '[链接]';
      case '03': return '[图片]';
      case '04': return '[视频]';
      case '05': return '[语音]';
      case '06': return '[文件]';
      case '07': return '[系统消息]';
      case '08': return '[消息已撤回]';
      default: return '[未知消息]';
    }
  }

  // ============ Computed ============
  const selectedConversation = $derived(
    state.conversations.find(c => c.id === state.selectedConversationId) ?? null
  );

  const visibleConversations = $derived(
    state.conversations.filter(c => !state.hiddenConversationIds.has(c.id))
  );

  // ============ Actions ============
  async function loadConversations() {
    state.isLoading = true;
    try {
      const currentUserId = authStore.user?.id;
      if (!currentUserId) return;

      // Get hidden conversation IDs
      try {
        const hiddenRes = await api.im.getApiImConversationHiddenList();
        const hiddenIds = hiddenRes.data as string[] | undefined;
        state.hiddenConversationIds = new Set(hiddenIds || []);
      } catch {
        state.hiddenConversationIds = new Set();
      }

      // Get user's group memberships
      const memberRes = await api.im.postApiImGroupMemberQuery({
        filter: { userId: currentUserId },
        limit: 100,
        offset: 0,
      });

      const memberData = memberRes.data?.data as GroupMember[] | undefined;
      if (!memberData?.length) {
        state.conversations = [];
        return;
      }

      const conversationIds = memberData.map((m: GroupMember) => m.conversationId);

      // Get conversation details
      const convRes = await api.im.postApiImConversationQuery({
        filter: { ids: conversationIds },
        sort: { field: PostApiImConversationQueryFieldEnum.LastMessageAt, order: PostApiImConversationQueryOrderEnum.Desc },
        limit: 100,
        offset: 0,
      });

      // Get unread counts
      const readRes = await api.im.postApiImConversationReadQuery({
        filter: { userId: currentUserId, conversationIds },
        limit: 100,
        offset: 0,
      });

      const readData = readRes.data?.data as ConversationRead[] | undefined;
      const readMap = new Map(readData?.map((r: ConversationRead) => [r.conversationId, r.unreadCount]) || []);

      const convData = convRes.data?.data as Conversation[] | undefined;
      
      // Get last message IDs that exist
      const lastMessageIds = (convData || [])
        .map(c => c.lastMessageId)
        .filter((id): id is string => id !== null);
      
      // Fetch last messages if any
      let lastMessagesMap = new Map<string, Message>();
      if (lastMessageIds.length > 0) {
        try {
          const msgRes = await api.im.postApiImMessageQuery({
            filter: { ids: lastMessageIds },
            limit: 100,
            offset: 0,
          });
          const msgData = msgRes.data?.data as Message[] | undefined;
          lastMessagesMap = new Map((msgData || []).map(m => [m.id, m]));
        } catch {
          // Ignore error, just won't have last message content
        }
      }
      
      state.conversations = (convData || []).map((conv: Conversation) => {
        const lastMsg = conv.lastMessageId ? lastMessagesMap.get(conv.lastMessageId) : null;
        return {
          ...conv,
          unreadCount: readMap.get(conv.id) || 0,
          lastMessageContent: lastMsg ? formatMessagePreview(lastMsg) : null,
        };
      });

      // Calculate total unread (excluding hidden)
      updateTotalUnread();
    } catch (e) {
      console.error('Failed to load conversations:', e);
    } finally {
      state.isLoading = false;
    }
  }

  async function loadMessages(conversationId: string, reset: boolean = true) {
    if (reset) {
      state.isLoadingMessages = true;
      state.messages = [];
      state.hasMoreMessages = true;
    }
    
    try {
      const res = await api.im.postApiImMessageQuery({
        filter: { conversationId },
        sort: { field: PostApiImMessageQueryFieldEnum.MsgSeq, order: PostApiImMessageQueryOrderEnum.Desc },
        limit: PAGE_SIZE,
        offset: 0,
      });
      const msgData = res.data?.data as Message[] | undefined;
      const total = res.data?.total ?? 0;
      
      // Reverse to show oldest first
      state.messages = (msgData || []).reverse();
      state.hasMoreMessages = (msgData?.length || 0) < total;

      // Load sender info
      const senderIds = [...new Set(state.messages.map(m => m.senderId))];
      await loadUsers(senderIds);

      // Mark as read
      if (state.messages.length > 0) {
        const lastSeq = Math.max(...state.messages.map(m => m.msgSeq));
        wsStore.sendRead(conversationId, lastSeq);
        
        // Update local unread count
        const conv = state.conversations.find(c => c.id === conversationId);
        if (conv && conv.unreadCount > 0) {
          state.conversations = state.conversations.map(c =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          );
          updateTotalUnread();
        }
      }
    } catch (e) {
      console.error('Failed to load messages:', e);
    } finally {
      state.isLoadingMessages = false;
    }
  }

  async function loadMoreMessages() {
    if (state.isLoadingMoreMessages || !state.hasMoreMessages || !state.selectedConversationId) return;
    
    state.isLoadingMoreMessages = true;
    try {
      const res = await api.im.postApiImMessageQuery({
        filter: { conversationId: state.selectedConversationId },
        sort: { field: PostApiImMessageQueryFieldEnum.MsgSeq, order: PostApiImMessageQueryOrderEnum.Desc },
        limit: PAGE_SIZE,
        offset: state.messages.length,
      });
      const msgData = res.data?.data as Message[] | undefined;
      const total = res.data?.total ?? 0;
      
      if (msgData && msgData.length > 0) {
        // Prepend older messages (reversed to show oldest first)
        state.messages = [...msgData.reverse(), ...state.messages];
        state.hasMoreMessages = state.messages.length < total;
        
        // Load sender info for new messages
        const senderIds = [...new Set(msgData.map(m => m.senderId))];
        await loadUsers(senderIds);
      } else {
        state.hasMoreMessages = false;
      }
    } catch (e) {
      console.error('Failed to load more messages:', e);
    } finally {
      state.isLoadingMoreMessages = false;
    }
  }

  async function loadUsers(userIds: string[]) {
    const unknownIds = userIds.filter(id => !state.users.has(id));
    if (unknownIds.length === 0) return;

    try {
      const res = await api.system.postApiSystemUserQuery({
        filter: { ids: unknownIds } as Parameters<typeof api.system.postApiSystemUserQuery>[0]['filter'],
        limit: 100,
        offset: 0,
      });
      
      interface UserData {
        id: string;
        name: string | null;
        loginName: string;
        avatar: string | null;
      }
      
      const userData = res.data?.data as UserData[] | undefined;
      const newUsers = new Map(state.users);
      for (const u of userData || []) {
        newUsers.set(u.id, {
          id: u.id,
          name: u.name,
          loginName: u.loginName,
          avatar: u.avatar,
        });
      }
      state.users = newUsers;
    } catch (e) {
      console.error('Failed to load users:', e);
    }
  }

  function selectConversation(conversationId: string | null) {
    state.selectedConversationId = conversationId;
    state.hasMoreMessages = true;
    if (conversationId) {
      loadMessages(conversationId);
    } else {
      state.messages = [];
    }
  }

  function onNewMessage(listener: (msg: Message) => void): () => void {
    newMessageListeners.push(listener);
    return () => {
      newMessageListeners = newMessageListeners.filter(l => l !== listener);
    };
  }

  async function hideConversation(conversationId: string) {
    try {
      await api.im.postApiImConversationHiddenHide({ conversationId });
      state.hiddenConversationIds = new Set([...state.hiddenConversationIds, conversationId]);
      
      // If currently selected, deselect
      if (state.selectedConversationId === conversationId) {
        state.selectedConversationId = null;
        state.messages = [];
      }
      
      updateTotalUnread();
    } catch (e) {
      console.error('Failed to hide conversation:', e);
    }
  }

  async function dissolveGroup(conversationId: string) {
    try {
      await api.im.postApiImConversationByIdDissolve({ id: conversationId });
      // WS will handle the update
    } catch (e) {
      console.error('Failed to dissolve group:', e);
      throw e;
    }
  }

  async function recallMessage(messageId: string) {
    try {
      await api.im.putApiImMessageByIdRecall({ id: messageId });
      // WS will handle the update
    } catch (e) {
      console.error('Failed to recall message:', e);
      throw e;
    }
  }

  function updateTotalUnread() {
    state.totalUnreadCount = state.conversations
      .filter(c => !state.hiddenConversationIds.has(c.id))
      .reduce((sum, c) => sum + c.unreadCount, 0);
  }

  function addMessage(msg: Message) {
    state.messages = [...state.messages, msg];
  }

  function updateMessageRecalled(messageId: string) {
    state.messages = state.messages.map(m =>
      m.id === messageId ? { ...m, isRecalled: true } : m
    );
  }

  // ============ WebSocket Handlers ============
  function setupWsListeners() {
    // New message
    unsubscribers.push(wsStore.onMessage((data) => {
      const { message: newMsg } = data;
      
      // Unhide conversation if hidden
      if (state.hiddenConversationIds.has(newMsg.conversationId)) {
        state.hiddenConversationIds = new Set(
          [...state.hiddenConversationIds].filter(id => id !== newMsg.conversationId)
        );
      }
      
      // Update conversation's last message content
      const msgPreview = formatMessagePreview(newMsg);
      
      // If current conversation, add message
      if (state.selectedConversationId === newMsg.conversationId) {
        addMessage(newMsg);
        wsStore.sendRead(newMsg.conversationId, newMsg.msgSeq);
        // Update last message content but not unread count
        state.conversations = state.conversations.map(c =>
          c.id === newMsg.conversationId
            ? { ...c, lastMessageAt: newMsg.createdAt, lastMessageContent: msgPreview, lastMessageId: newMsg.id }
            : c
        );
        // Notify listeners about new message
        newMessageListeners.forEach(listener => listener(newMsg));
      } else {
        // Update unread count and last message content
        state.conversations = state.conversations.map(c =>
          c.id === newMsg.conversationId
            ? { ...c, unreadCount: c.unreadCount + 1, lastMessageAt: newMsg.createdAt, lastMessageContent: msgPreview, lastMessageId: newMsg.id }
            : c
        );
        updateTotalUnread();
      }

      // Load sender info if needed
      if (!state.users.has(newMsg.senderId)) {
        loadUsers([newMsg.senderId]);
      }
    }));

    // Read receipt
    unsubscribers.push(wsStore.onRead((data) => {
      console.log('Read receipt:', data);
    }));

    // Group created
    unsubscribers.push(wsStore.onGroupCreated((data) => {
      const newConv: ConversationWithUnread = {
        id: data.conversation.id,
        type: data.conversation.type,
        name: data.conversation.name,
        avatar: data.conversation.avatar,
        ownerId: data.conversation.ownerId,
        lastMessageId: null,
        lastMessageAt: data.conversation.createdAt,
        memberCount: data.conversation.memberCount,
        isTop: false,
        isMuted: false,
        status: '0',
        unreadCount: 0,
        lastMessageContent: null,
      };
      
      const exists = state.conversations.some(c => c.id === newConv.id);
      if (!exists) {
        state.conversations = [newConv, ...state.conversations];
      }
    }));

    // Group dissolved
    unsubscribers.push(wsStore.onGroupDissolved((data) => {
      state.conversations = state.conversations.map(c =>
        c.id === data.conversationId ? { ...c, status: '1' } : c
      );
    }));

    // Message recalled
    unsubscribers.push(wsStore.onMessageRecalled((data) => {
      if (state.selectedConversationId === data.conversationId) {
        updateMessageRecalled(data.messageId);
      }
      
      // Update last message content if the recalled message was the last one
      state.conversations = state.conversations.map(c => {
        if (c.id === data.conversationId && c.lastMessageId === data.messageId) {
          return { ...c, lastMessageContent: '[消息已撤回]' };
        }
        return c;
      });
    }));
  }

  function cleanup() {
    unsubscribers.forEach(unsub => unsub());
    unsubscribers = [];
  }

  function init() {
    wsStore.connect();
    setupWsListeners();
    loadConversations();
  }

  return {
    get state() { return state; },
    get conversations() { return state.conversations; },
    get visibleConversations() { return visibleConversations; },
    get selectedConversation() { return selectedConversation; },
    get selectedConversationId() { return state.selectedConversationId; },
    get messages() { return state.messages; },
    get users() { return state.users; },
    get isLoading() { return state.isLoading; },
    get isLoadingMessages() { return state.isLoadingMessages; },
    get isLoadingMoreMessages() { return state.isLoadingMoreMessages; },
    get hasMoreMessages() { return state.hasMoreMessages; },
    get totalUnreadCount() { return state.totalUnreadCount; },
    
    init,
    cleanup,
    loadConversations,
    loadMessages,
    loadMoreMessages,
    loadUsers,
    selectConversation,
    hideConversation,
    dissolveGroup,
    recallMessage,
    addMessage,
    updateTotalUnread,
    onNewMessage,
  };
}

export const imStore = createImStore();
