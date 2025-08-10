import { ref } from "vue";
import { useApi } from "./useApi";

// Define types
interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

// Composable for managing user notifications
export const useNotifications = () => {
  // State using Nuxt's built-in state management
  const notifications = useState<Notification[]>("notifications", () => []);
  const unreadCount = useState<number>("notifications_unread_count", () => 0);
  const isLoading = useState<boolean>("notifications_loading", () => false);
  const error = useState<string | null>("notifications_error", () => null);

  // Get API methods
  const api = useApi();

  // Fetch user notifications
  const fetchNotifications = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const response = await api.get<any>("/api/notifications");

      // Handle different response structures
      let notificationsList: Notification[] = [];

      if (response && Array.isArray(response)) {
        notificationsList = response as Notification[];
      } else if (
        response &&
        typeof response === "object" &&
        "data" in response
      ) {
        notificationsList = (response as any).data as Notification[];
      }

      notifications.value = notificationsList;

      // Count unread notifications
      updateUnreadCount();
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      error.value = err.data?.message || "Failed to fetch notifications";
    } finally {
      isLoading.value = false;
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await api.post(`/api/notifications/${notificationId}/read`);

      // Update the notification in the list
      const notification = notifications.value.find(
        (n) => n.id === notificationId
      );
      if (notification) {
        notification.isRead = true;
        updateUnreadCount();
      }
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
      error.value = err.data?.message || "Failed to mark notification as read";
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.post("/api/notifications/read-all");

      // Update all notifications in the list
      notifications.value.forEach((notification) => {
        notification.isRead = true;
      });

      unreadCount.value = 0;
    } catch (err: any) {
      console.error("Error marking all notifications as read:", err);
      error.value =
        err.data?.message || "Failed to mark all notifications as read";
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId: string) => {
    try {
      await api.delete(`/api/notifications/${notificationId}`);

      // Remove the notification from the list
      notifications.value = notifications.value.filter(
        (n) => n.id !== notificationId
      );
      updateUnreadCount();
    } catch (err: any) {
      console.error("Error deleting notification:", err);
      error.value = err.data?.message || "Failed to delete notification";
    }
  };

  // Update the unread count
  const updateUnreadCount = () => {
    unreadCount.value = notifications.value.filter((n) => !n.isRead).length;
  };

  // Show a local notification
  const showLocalNotification = (type: string, message: string, data?: any) => {
    const newNotification: Notification = {
      id: `local-${Date.now()}`,
      type,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
      data,
    };

    notifications.value.unshift(newNotification);
    updateUnreadCount();
  };

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,

    // Methods
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    showLocalNotification,
  };
};
