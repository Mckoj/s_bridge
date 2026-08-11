import api from "./api";
import { classifyApiError } from "../utils/apiErrors";

export interface PartnerProfile {
  userId: string;
  name: string;
  role: string;
  programme?: string;
  position?: string;
  avatar: string;
  avatarUrl?: string | null;
}

export interface ConversationItem {
  id: string;
  partner: PartnerProfile;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  content: string;
  isMe: boolean;
  isRead: boolean;
  createdAt: string;
}

/**
 * Fetch all active conversations for current user
 */
export async function getConversations(): Promise<ConversationItem[]> {
  try {
    const res = await api.get("/api/conversations");
    return res.data?.conversations || [];
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/**
 * Start or retrieve existing conversation with recipient user ID
 */
export async function startConversation(recipientUserId: string): Promise<ConversationItem> {
  try {
    const res = await api.post("/api/conversations", { recipientUserId });
    return res.data?.conversation;
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/**
 * Get messages for a specific conversation ID
 */
export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  try {
    const res = await api.get(`/api/conversations/${conversationId}/messages`);
    return res.data?.messages || [];
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(conversationId: string, content: string): Promise<ChatMessage> {
  try {
    const res = await api.post(`/api/conversations/${conversationId}/messages`, { content });
    return res.data?.message;
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}

/**
 * Mark messages in a conversation as read
 */
export async function markAsRead(conversationId: string): Promise<void> {
  try {
    await api.patch(`/api/conversations/${conversationId}/read`);
  } catch (err: unknown) {
    throw classifyApiError(err);
  }
}
