import { ref, computed } from "vue";
import { useApi } from "./useApi";

// Define types
interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

interface User {
  id: string;
  username: string;
  avatar?: string;
  displayName?: string;
}

interface Conversation {
  userId: string;
  username: string;
  avatar?: string;
  displayName?: string;
  lastMessage?: Message;
  unreadCount: number;
}

// Composable for managing user messages and conversations
export const useMessages = () => {
  // State
  const conversations = useState<Conversation[]>("conversations", () => []);
  const currentConversation = useState<string | null>(
    "current_conversation",
    () => null
  );
  const messages = useState<Message[]>("messages", () => []);
  const isLoading = useState<boolean>("messages_loading", () => false);
  const isLoadingConversations = useState<boolean>(
    "conversations_loading",
    () => false
  );
  const error = useState<string | null>("messages_error", () => null);

  // Get API methods
  const api = useApi();

  // Computed
  const totalUnreadCount = computed(() => {
    return conversations.value.reduce(
      (total, conversation) => total + conversation.unreadCount,
      0
    );
  });

  // Fetch user conversations
  const fetchConversations = async () => {
    try {
      isLoadingConversations.value = true;
      error.value = null;

      const response = await api.get<any>("/api/messages/conversations");

      let conversationsList: Conversation[] = [];

      if (response && Array.isArray(response)) {
        conversationsList = response as Conversation[];
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response
      ) {
        conversationsList = (response as any).data as Conversation[];
      }

      conversations.value = conversationsList;
    } catch (err: any) {
      console.error("Error fetching conversations:", err);
      error.value = err.data?.message || "Failed to fetch conversations";
    } finally {
      isLoadingConversations.value = false;
    }
  };

  // Fetch messages for a specific conversation
  const fetchMessages = async (userId: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await api.get<any>(`/api/messages/${userId}`);

      let messagesList: Message[] = [];

      if (response && Array.isArray(response)) {
        messagesList = response as Message[];
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response
      ) {
        messagesList = (response as any).data as Message[];
      }

      messages.value = messagesList;
      currentConversation.value = userId;

      // Mark messages as read when fetched
      markConversationAsRead(userId);
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      error.value = err.data?.message || "Failed to fetch messages";
    } finally {
      isLoading.value = false;
    }
  };

  // Send a new message
  const sendMessage = async (receiverId: string, content: string) => {
    try {
      const response = await api.post<Message>("/api/messages", {
        receiverId,
        content,
      });

      // Add to current messages list if this is the active conversation
      if (currentConversation.value === receiverId) {
        messages.value.push(response as Message);
      }

      // Update conversations list
      await fetchConversations();

      return response;
    } catch (err: any) {
      console.error("Error sending message:", err);
      error.value = err.data?.message || "Failed to send message";
      throw err;
    }
  };

  // Mark a conversation as read
  const markConversationAsRead = async (userId: string) => {
    try {
      await api.post(`/api/messages/${userId}/read`);

      // Update the unread count in the conversations list
      const conversation = conversations.value.find((c) => c.userId === userId);
      if (conversation) {
        conversation.unreadCount = 0;
      }
    } catch (err: any) {
      console.error("Error marking conversation as read:", err);
      // Non-critical error, don't update the error state
    }
  };

  // Start a new conversation
  const startConversation = async (
    username: string,
    initialMessage: string
  ) => {
    try {
      const response = await api.post<any>("/api/messages/conversation", {
        username,
        initialMessage,
      });

      // Update conversations list
      await fetchConversations();

      // If the response contains the user ID, set as current conversation
      if (response && response.userId) {
        currentConversation.value = response.userId;
        await fetchMessages(response.userId);
      }

      return response;
    } catch (err: any) {
      console.error("Error starting conversation:", err);
      error.value = err.data?.message || "Failed to start conversation";
      throw err;
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: string) => {
    try {
      await api.delete(`/api/messages/${messageId}`);

      // Remove the message from the list
      messages.value = messages.value.filter((m) => m.id !== messageId);
    } catch (err: any) {
      console.error("Error deleting message:", err);
      error.value = err.data?.message || "Failed to delete message";
    }
  };

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
};
