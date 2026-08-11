import { useState, useEffect, useCallback } from "react";
import {
  getConversations,
  getMessages,
  sendMessage as sendMsgApi,
  markAsRead,
  type ConversationItem,
  type ChatMessage,
} from "../services/conversationService";
import type { ClassifiedApiError } from "../utils/apiErrors";

export interface UseConversationsResult {
  conversations: ConversationItem[];
  activeConvId: string | null;
  setActiveConvId: (id: string | null) => void;
  messages: ChatMessage[];
  loading: boolean;
  messagesLoading: boolean;
  error: ClassifiedApiError | null;
  sendMessage: (content: string) => Promise<void>;
  refetchConversations: () => Promise<void>;
}

export function useConversations(): UseConversationsResult {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const [error, setError] = useState<ClassifiedApiError | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await getConversations();
      setConversations(data);
      if (data.length > 0 && !activeConvId) {
        setActiveConvId(data[0].id);
      }
    } catch (err: unknown) {
      setError(err as ClassifiedApiError);
    } finally {
      setLoading(false);
    }
  }, [activeConvId]);

  const fetchMessages = useCallback(async (convId: string) => {
    setMessagesLoading(true);
    try {
      const msgs = await getMessages(convId);
      setMessages(msgs);
      await markAsRead(convId);

      // Decrement unread count locally
      setConversations((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (err: unknown) {
      console.error("Error loading messages:", err);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
    }
  }, [activeConvId, fetchMessages]);

  const handleSendMessage = async (content: string) => {
    if (!activeConvId || !content.trim()) return;

    try {
      const newMsg = await sendMsgApi(activeConvId, content);
      setMessages((prev) => [...prev, newMsg]);

      // Update last message in conversation list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, lastMessage: content, lastTime: new Date().toISOString() }
            : c
        )
      );
    } catch (err: unknown) {
      console.error("Error sending message:", err);
      throw err;
    }
  };

  return {
    conversations,
    activeConvId,
    setActiveConvId,
    messages,
    loading,
    messagesLoading,
    error,
    sendMessage: handleSendMessage,
    refetchConversations: fetchConversations,
  };
}
