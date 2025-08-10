import { defineStore } from "pinia";
import { useNotifications as useNotificationsComposable } from "~/composables/useNotifications";
import { computed } from "vue";

export interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export const useNotificationsStore = defineStore("notifications", () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    showLocalNotification,
  } = useNotificationsComposable();

  // Additional getters to maintain compatibility with previous API
  const unreadNotifications = computed(() => {
    return notifications.value.filter((n) => !n.isRead);
  });

  const readNotifications = computed(() => {
    return notifications.value.filter((n) => n.isRead);
  });

  // Add backward compatibility methods
  const addNotification = (notification: Notification) => {
    notifications.value.unshift(notification);
  };

  const clearNotifications = () => {
    notifications.value = [];
  };

  return {
    // State
    notifications,
    isLoading,
    error,

    // Getters
    unreadCount,
    unreadNotifications,
    readNotifications,

    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    clearNotifications,
    showLocalNotification,
  };
});
