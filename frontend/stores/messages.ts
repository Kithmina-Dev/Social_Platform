import { defineStore } from "pinia";
import { useMessages as useMessagesComposable } from "~/composables/useMessages";

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
  displayName?: string;
}

export interface Conversation {
  userId: string;
  username: string;
  avatar?: string;
  displayName?: string;
  lastMessage?: Message;
  unreadCount: number;
}

export const useMessagesStore = defineStore("messages", () => {
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    isLoadingConversations,
    error,
    totalUnreadCount,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markConversationAsRead,
    startConversation,
    deleteMessage,
  } = useMessagesComposable();

  return {
    // State
    conversations,
    currentConversation,
    messages,
    isLoading,
    isLoadingConversations,
    error,

    // Computed
    totalUnreadCount,

    // Methods
    fetchConversations,
    fetchMessages,
    sendMessage,
    markConversationAsRead,
    startConversation,
    deleteMessage,
  };
});
