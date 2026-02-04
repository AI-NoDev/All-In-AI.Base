// Simple event emitter for cross-module communication

// ============ Event Types ============

interface GroupCreatedEvent {
  conversation: {
    id: string;
    type: string;
    name: string | null;
    avatar: string | null;
    ownerId: string | null;
    memberCount: number;
    createdAt: string;
  };
  memberIds: string[];
  createdBy: {
    id: string;
    name: string | null;
    loginName: string;
  };
}

interface GroupDissolvedEvent {
  conversationId: string;
  memberIds: string[];
  dissolvedBy: {
    id: string;
    name: string | null;
    loginName: string;
  };
}

interface MessageRecalledEvent {
  messageId: string;
  conversationId: string;
  msgSeq: number;
  memberIds: string[];
  recalledBy: {
    id: string;
    name: string | null;
    loginName: string;
  };
}

interface NewMessageEvent {
  message: {
    id: string;
    conversationId: string;
    senderId: string;
    msgType: string;
    msgSeq: number;
    content: unknown;
    createdAt: string;
  };
  memberIds: string[];
  sender: {
    id: string;
    name: string | null;
    loginName: string;
  };
}

type EventMap = {
  'group_created': GroupCreatedEvent;
  'group_dissolved': GroupDissolvedEvent;
  'message_recalled': MessageRecalledEvent;
  'new_message': NewMessageEvent;
};

type EventHandler<T> = (data: T) => void;

class ActionEvents {
  private handlers: Map<string, Set<EventHandler<unknown>>> = new Map();

  on<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler as EventHandler<unknown>);
    
    // Return unsubscribe function
    return () => {
      this.handlers.get(event)?.delete(handler as EventHandler<unknown>);
    };
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      for (const handler of eventHandlers) {
        try {
          handler(data);
        } catch (e) {
          console.error(`Error in event handler for ${event}:`, e);
        }
      }
    }
  }

  off<K extends keyof EventMap>(event: K, handler?: EventHandler<EventMap[K]>): void {
    if (handler) {
      this.handlers.get(event)?.delete(handler as EventHandler<unknown>);
    } else {
      this.handlers.delete(event);
    }
  }
}

export const actionEvents = new ActionEvents();
export type { GroupCreatedEvent, GroupDissolvedEvent, MessageRecalledEvent, NewMessageEvent, EventMap };
